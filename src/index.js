import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import '../node_modules/reset-css/reset.css';
import './index.css';

import secret from './secret';
import Image from './builders/image';
// import Chapter from './builders/chapter';

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
			images: []
		}

		this.loadImages = this.loadImages.bind( this );
	}

	loadImages() {
		let loadedImages = localStorage.getItem( 'CodexMysteriumLoadedImages' );
		if ( loadedImages ) {
			this.setState( {
				images: JSON.parse( loadedImages )
			} );
			return;
		} else {
			let images = {};
			let searchUrls = [];

			for ( let i in this.state.sections ) {
				const searchOptions = Object.entries( {
					api_key: secret.api_key,
					method: 'flickr.photos.search',
					text: this.state.sections[ i ],
					tags: 'bookcentury1700,bookcentury1600,bookcentury',
					tag_mode: 'any',
					license: '7,9,10',
					format: 'json',
					nojsoncallback: 1,
					extras: 'url_o,url_m',
					per_page: 5,
					sort: 'relevance',
				} ).map( o => o.join( '=' ) ).join( '&' );

				searchUrls.push( `https://api.flickr.com/services/rest/?${ searchOptions }` );
			}
			axios.all( searchUrls.map( l => axios.get( l ) ) ).then( axios.spread( ( ...res ) => res.forEach( ( r, j ) => {
				images[ this.state.sections[ j ] ] = [];
				r.data.photos.photo.forEach( i => {
					images[ this.state.sections[ j ] ].push( new Image( i ) );
				} );
			} ) ) ).then( () => {

				// let subjects = this.state.section_names.sort( () => Math.random() > 0.5 );
				// const chapters = Array( Math.floor( Math.random() * 2 ) + 1 ).fill().map( ( _, i, a ) => {
				// return new Chapter( subjects[ i ], section_images[ subjects[ i ] ] );
				// } );

				localStorage.setItem( 'CodexMysteriumLoadedImages', JSON.stringify( images ) );
				this.setState( {
					images: images,
					// chapters: chapters
				} );
			} );
		}
	}

	componentWillMount() {
		this.loadImages();
	}

	render() {
		return (
			<React.Fragment>
        <pre>
          <code>{ JSON.stringify( this.state, null, '\t' ) }</code>
        </pre>
        <ul>
          <li>Load images</li>
          <li>Build chapters</li>
          <li>Display chapters</li>
          <li>Editor</li>
        </ul>
      </React.Fragment>
		)
	}
}

ReactDOM.render( <CodexMysterium />, document.getElementById( 'root' ) );