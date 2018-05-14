import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import '../node_modules/reset-css/reset.css';
import './index.css';

import secret from './secret';
import Image from './builders/image';
import Page from './builders/page';

import Template from './templates/template';

class CodexMysterium extends React.Component {
	constructor() {
		super();

		this.state = {
			sections: [
				'alchemy',
				'flowers',
				'insects',
				'architecture'
			],
			pages: []
		};

		this.makeWords = this.makeWords.bind( this );
		this.loadImages = this.loadImages.bind( this );
		this.loadImagesFromFlickr = this.loadImagesFromFlickr.bind( this );
		this.makePages = this.makePages.bind( this );
	}

	makePages() {
		let pages = [];
		let words = this.state.words;

		for ( let s in this.state.sections ) {
			let images = this.state.images[ this.state.sections[ s ] ];
			pages.push( new Page( this.state.sections[ s ], images.pop(), 'folio', words.pop() ) );
			for ( let p in images ) {
				let page = new Page( this.state.sections[ s ], images.pop(), null );

				if ( page.layout === 'landscape1' ) {
					page.words = words.slice( 0, 110 );
				}
				if ( page.layout === 'landscape2' ) {
					page.words = words.slice( 0, 130 );
				}
				if ( page.layout === 'portrait1' ) {
					page.words = words.slice( 0, 170 );
				}
				if ( page.layout === 'portrait2' ) {
					page.words = words.slice( 0, 330 );
				}
				if ( page.layout === 'portrait3' ) {
					page.words = words.slice( 0, 130 );
				}
				if ( page.layout === 'portrait4' ) {
					page.words = words.slice( 0, 130 );
				}

				words = words.splice( 0, page.words.length );

				pages.push( page )
			}
		}

		this.setState( {
			pages
		} );
	}

	loadImagesFromFlickr( section = null, page = 1 ) {
		let sections = this.state.sections;
		if ( section ) {
			sections = [ section ];
		}
		let images = {};
		let searchUrls = [];

		for ( let s in sections ) {
			const searchOptions = Object.entries( {
				api_key: secret.api_key,
				method: 'flickr.photos.search',
				text: sections[ s ],
				tags: 'bookcentury1700,bookcentury1600,bookcentury',
				tag_mode: 'any',
				license: '7,9,10',
				format: 'json',
				nojsoncallback: 1,
				extras: 'url_o,url_m',
				per_page: 5,
				page: page,
				sort: 'relevance',
			} ).map( o => o.join( '=' ) ).join( '&' );

			searchUrls.push( `https://api.flickr.com/services/rest/?${ searchOptions }` );
		}

		axios.all( searchUrls.map( u => axios.get( u ) ) ).then( axios.spread( ( ...z ) => z.map( ( r, i ) => {
			images[ sections[ i ] ] = r.data.photos.photo.map( p => new Image( p ) );
		} ) ) ).then( () => {
			this.setState( {
				images
			}, () => {

				localStorage.setItem( 'CodexMysteriumLoadedImages', JSON.stringify( this.state.images ) );
				this.makePages();
			} );
		} );
	}

	loadImages() {
		let loadedImages = localStorage.getItem( 'CodexMysteriumLoadedImages' );
		if ( loadedImages ) {
			this.setState( {
				images: JSON.parse( loadedImages )
			}, this.makePages );
		} else {
			this.loadImagesFromFlickr();
		}
	}

	makeWords() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let words = Array( 1000 ).fill().map( () => {
			let word = [];
			let len = Math.floor( Math.random() * 5 ) + 3;
			while ( len-- ) {
				word.push( chars[ Math.floor( Math.random() * chars.length ) ] );
			}
			return word.join( '' );
		} );
		this.setState( {
				words
			},
			this.loadImages );
	}

	componentWillMount() {
		this.makeWords();
	}

	render() {
		let pages = this.state.pages.map( ( p, pp ) => {
			return {
				key: pp,
				id: `page-${ pp + 1 }`,
				layout: p.layout,
				image: p.image,
				color: p.color,
				words: p.words
			}
		} );

		return (
			<React.Fragment>
        {/* <pre>
          <code>{ JSON.stringify( this.state, null, '\t' ) }</code>
        </pre> */}
        { pages.map( p => (
          <Template { ...p } />
        ) ) }
      </React.Fragment>
		);
	}
}

ReactDOM.render( <CodexMysterium />, document.getElementById( 'root' ) );