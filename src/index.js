import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import '../node_modules/reset-css/reset.css';
import './index.css';

import secret from './secret';
import Page from './builders/page';
import Template from './templates/template';

const random = ( minIntOrArray, maxInt ) => {
	if ( minIntOrArray.constructor === Array ) {
		return minIntOrArray[ Math.floor( Math.random() * minIntOrArray.length ) ];
	}
	return Math.floor( Math.random() * ( maxInt - minIntOrArray ) ) + maxInt;
};

class CodexMysterium extends React.Component {
	constructor() {
		super();

		this.state = {
			subjects: [
				'alchemy',
				'flowers',
				'trees',
				'insects',
				'fish',
				'bird',
				'animals',
				'fossils',
				'chemistry',
				'astrology',
				'astronomy'
			],
			sections: [],
			images: [],
			pages: [],
			maxSections: 3,
			maxPagesPerSection: 15,
			script: 'voynich',
			display: {
				sectionCount: 0,
				list: []
			},
			forceGreyScale: false
		};

		this.edit = this.edit.bind( this );
		this.makeWords = this.makeWords.bind( this );
		this.loadImages = this.loadImages.bind( this );
		this.makeSections = this.makeSections.bind( this );
		this.loadImagesFromFlickr = this.loadImagesFromFlickr.bind( this );
		this.makePages = this.makePages.bind( this );
	}

	edit( e ) {
		const func = e.target.dataset.func;
		if ( func === 'script' ) {
			this.setState( {
				script: e.target.value
			} );
			return;
		}

		if ( func === 'maxSections' ) {
			let v = Number( e.target.value );
			let s = this.state;

			s.maxSections = v;
			s.display.list = this.state.subjects.slice( 0, v );
			this.setState( s, () => {
				this.makePages( this.state.display.list );
			} )
		}

		if ( func === 'forceGreyScale' ) {
			let v = Boolean( e.target.checked );
			this.setState( {
				forceGreyScale: v
			} )
		}
	}

	componentWillMount() {
		console.log( 'componentWillMount' );
		this.setState( {
			// maxSections: this.state.subjects.length,
			display: {
				sectionCount: this.state.subjects.length,
				// list:
			},
			sections: Array( this.state.subjects.length ).fill().map( () => [] )
		}, this.makeWords );
	}

	makeWords() {
		console.log( 'makeWords' );
		const chars = 'ABCDEFGHIJKLMNPRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'.split( '' );
		const count = this.state.subjects.length * this.state.maxPagesPerSection;
		let words = Array( count ).fill().map( () => Array( 330 ).fill().map( () => {
			let word = [];
			let len = random( 3, 5 );
			while ( len-- ) {
				word.push( random( chars ) );
			}
			return word.join( '' );
		} ) );
		this.setState( {
			words
		}, this.loadImages );
	}

	loadImages() {
		console.log( 'loadImages' );
		let loadedImages = localStorage.getItem( 'CodexMysteriumLoadedImages' );
		if ( loadedImages ) {
			this.setState( {
				images: JSON.parse( loadedImages )
			}, this.makeSections )
		} else {
			this.loadImagesFromFlickr();
		}
	}

	loadImagesFromFlickr( subject = null, page = 1 ) {
		console.log( 'loadImagesFromFlickr' );
		let subjects = subject ? [ subject ] : this.state.subjects;
		let images = {};
		let searchUrls = [];

		for ( let s in subjects ) {
			const searchOptions = Object.entries( {
				api_key: secret.api_key,
				method: 'flickr.photos.search',
				text: subjects[ s ],
				tags: 'bookcentury1700,bookcentury1600,bookcentury',
				tag_mode: 'any',
				license: '7,9,10',
				format: 'json',
				nojsoncallback: 1,
				extras: 'url_o,url_m',
				per_page: this.state.maxPagesPerSection,
				page: page,
				sort: 'relevance',
			} ).map( o => o.join( '=' ) ).join( '&' );

			searchUrls.push( `https://api.flickr.com/services/rest/?${ searchOptions }` );
		}

		axios.all( searchUrls.map( u => axios.get( u ) ) ).then( axios.spread( ( ...z ) => z.forEach( ( r, i ) => {
			images[ subjects[ i ] ] = r.data.photos.photo.map( p => {
				return {
					width: Number( p.width_o ),
					height: Number( p.height_o ),
					src: p.url_o
				};
			} );
		} ) ) ).then( () => {
			localStorage.setItem( 'CodexMysteriumLoadedImages', JSON.stringify( images ) );
			this.setState( {
				images
			}, this.makeSections );
		} );
	}

	makeSections() {
		console.log( 'makeSections' );
		let images = this.state.images;
		let words = this.state.words;
		let sections = {};
		Object.keys( this.state.subjects ).forEach( ( _, i ) => {
			const b = this.state.subjects[ i ];
			sections[ b ] = {
				count: images[ b ].length,
				pages: [ new Page( this.state.subjects[ i ], images[ b ][ i ], 'folio', words[ i ] ) ]
			};
			for ( let j = 1; j < images[ b ].length; j++ ) {
				sections[ b ].pages.push( new Page( this.state.subjects[ i ], images[ b ][ j ], null, words[ j ] ) )
			}
		} );

		this.setState( {
			sections
		}, this.makePages )
	}

	makePages( sortedList = null ) {
		console.log( 'makePages' );

		let pages = sortedList || this.state.subjects;
		pages = pages.map( s => this.state.sections[ s ].pages ).reduce( ( a, v ) => a.concat( v ), [] );

		this.setState( {
			pages
		} );
	}

	render() {
		const pages = this.state.pages.map( ( p, pp ) => {
			let theme = [ this.state.script ];
			if ( this.state.forceGreyScale ) {
				theme.push( 'grey' )
			}
			return {
				key: pp,
				id: `page-${ pp + 1 }`,
				layout: p.layout,
				theme: theme,
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
            <select value={ this.state.script } data-func="script" onChange={ this.edit }>
              <option value="voynich">Voynich</option>
              <option value="rune">Rune</option>
            </select>
          </label>
          <label>
            <span>Force greyscale?</span>
            <input type="checkbox" data-func="forceGreyScale" cheked={ this.state.forceGreyScale } onChange={ this.edit }/>
          </label>
          <label>
            <span>Sections</span>
            <input type="range" min="1" max={ this.state.subjects.length } data-func="maxSections" defaultValue={ this.state.maxSections } onChange={ this.edit }/>
          </label>
        </aside>
      </React.Fragment>
		);
	}
}

ReactDOM.render( <CodexMysterium />, document.getElementById( 'root' ) );