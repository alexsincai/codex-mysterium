import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// import * as Vibrant from 'node-vibrant';
// import colr from 'colr';

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
				'trees',
				'insects',
				'fish',
				'bird',
				'animals',
				'architecture',
				'chemistry',
				'astrology',
				'astronomy'
			],
			script: 'voynich',
			sectionCount: 11,
			maxPagesperSection: 15,
			pages: []
		};

		this.makeWords = this.makeWords.bind( this );
		this.loadImages = this.loadImages.bind( this );
		this.loadImagesFromFlickr = this.loadImagesFromFlickr.bind( this );
		this.makePages = this.makePages.bind( this );

		this.edit = {
			script: ( e ) => this.setState( {
				script: e.target.value
			} ),
			// sectionCount: ( e ) => this.setState( {
			// 	sectionCount: Number( e.target.value )
			// }, this.makePages ),
			sectionCount: ( e ) => {

			}
		}
	}

	makePages() {
		let pages = [];
		let words = this.state.words;

		for ( let s in this.state.sections ) {
			let images = this.state.images[ this.state.sections[ s ] ];
			pages.push( new Page( this.state.sections[ s ], images.pop(), 'folio', words.pop() ) );
			for ( let p in images ) {
				let page = new Page( this.state.sections[ s ], images.pop(), null, words.pop() );
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
				per_page: this.state.maxPagesperSection,
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
			} );
		} ).then( () => {
			localStorage.setItem( 'CodexMysteriumLoadedImages', JSON.stringify( this.state.images ) );
			this.makePages();
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
		const chars = 'ABCDEFGHIJKLMNPRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
		const count = this.state.sections.length * this.state.maxPagesperSection;
		let words = Array( count ).fill().map( () => {
			return Array( 330 ).fill().map( () => {
				let word = [];
				let len = Math.floor( Math.random() * 5 ) + 3;
				while ( len-- ) {
					word.push( chars[ Math.floor( Math.random() * chars.length ) ] );
				}
				return word.join( '' );
			} )
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
				theme: this.state.script,
				image: p.image,
				words: p.words,
			}
		} );

		const index = pages.filter( p => p.layout === 'folio' ).map( p => {
			return {
				page: p.key + 1,
				link: `#${ p.id }`,
				text: p.words[ 0 ]
			}
		} );

		return (
			<React.Fragment>
        { pages.map( p => (
          <Template { ...p } />
        ) ) }
        <Template layout="index" theme={ this.state.script } index={ index } />
        <aside>
          <label>
            <span>Script</span>
            <select value={ this.state.script } onChange={ this.edit.script }>
              <option value="voynich">Voynich</option>
              <option value="rune">Runes</option>
            </select>
          </label>
          <label>
            <span>Sections</span>
            <input type="range" min="1" max={ this.state.sections.length } defaultValue={ this.state.sectionCount } onChange={ this.edit.sectionCount }/>
          </label>
        </aside>
      </React.Fragment>
		);
	}
}

ReactDOM.render( <CodexMysterium />, document.getElementById( 'root' ) );