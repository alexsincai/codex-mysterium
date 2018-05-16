import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import '../node_modules/reset-css/reset.css';
import './index.css';

import secret from './secret';
import Page from './builders/page';
import Template from './templates/template';
import Editor from './templates/editor';

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
				'birds',
				'fish',
				'insects',
				'sea',
				'flowers',
				'plants',
				'fossils',
				'astronomy',
				'astrology',
				'chemistry',
				'magic',
				'alchemy',
				'demonology',
				'death',
				'music',
			],
			sections: {},
			sortedList: [],
			pageCounts: {},
			images: {},
			pages: [],
			maxSections: 3,
			maxPagesPerSection: 15,
			script: 'voynich',
			forceGreyScale: false,
			titlePage: true,
			titlePageText: '',
			indexPage: true,
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
		}

		if ( func === 'forceGreyScale' ) {
			let v = Boolean( e.target.checked );
			this.setState( {
				forceGreyScale: v
			} );
		}

		if ( func === 'maxSections' ) {
			let v = Number( e.target.value );
			this.setState( {
				maxSections: v
			}, this.makePages );
		}

		if ( func === 'setSection' ) {
			let i = Number( e.target.dataset.id );
			let v = e.target.value;
			let sortedList = this.state.sortedList;
			sortedList[ i ] = v;
			this.setState( {
				sortedList
			}, this.makePages );
		}

		if ( func === 'pageCounts' ) {
			let i = e.target.dataset.id;
			let v = Number( e.target.value );
			let pageCounts = this.state.pageCounts;
			pageCounts[ i ] = v;
			this.setState( {
				pageCounts
			}, this.makePages );
		}

		if ( func === 'indexPage' ) {
			this.setState( {
				indexPage: Boolean( e.target.checked )
			} );
		}

		if ( func === 'titlePage' ) {
			this.setState( {
				titlePage: Boolean( e.target.checked )
			} );
		}

		if ( func === 'randomize' ) {
			this.setState( {
				sortedList: this.state.sortedList.sort( () => Math.random() > 0.5 )
			}, this.makePages );
		}

		if ( func === 'selectImage' ) {
			const id = Number( e.target.dataset.id );
			const page = Number( e.target.dataset.page );
			const subject = e.target.dataset.subject;
			const image = this.state.images[ subject ][ id ];

			let s = this.state;
			let current = s.pages.filter( p => p.subject === subject )[ page ];
			current.image = image.src;
			current.thumb = image.thumb;

			this.setState( s );
		}
	}

	componentWillMount() {
		this.setState( {
			sortedList: this.state.subjects.sort( () => Math.random() > 0.5 ),
			titlePageText: this.makeWords( random( 1, 2 ) )
		}, this.makeWords );
	}

	makeWords( howMany = 0 ) {
		const chars = 'ABCDEFGHIJKLMNPRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'.split( '' );
		const count = howMany ? howMany : this.state.subjects.length * this.state.maxPagesPerSection;
		let words = Array( count ).fill().map( () => Array( 330 ).fill().map( () => {
			let word = [];
			let len = random( 3, 5 );
			while ( len-- ) {
				word.push( random( chars ) );
			}
			return word.join( '' );
		} ) );

		if ( howMany )
			return words.reduce( ( a, v ) => a.concat( v ), [] ).slice( 0, howMany );

		this.setState( {
			words
		}, this.loadImages );
	}

	loadImages() {
		let loadedImages = localStorage.getItem( 'CodexMysteriumLoadedImages' );
		if ( loadedImages ) {
			this.setState( {
				images: JSON.parse( loadedImages )
			}, this.makeSections );
		} else {
			this.loadImagesFromFlickr();
		}
	}

	loadImagesFromFlickr( subject = null, page = 1 ) {
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
				extras: 'url_o,url_sq',
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
					src: p.url_o,
					thumb: p.url_sq
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
		let images = this.state.images;
		let words = this.state.words;
		let sections = {};
		let pageCounts = {};

		this.state.subjects.forEach( ( _, i ) => {
			const b = this.state.subjects[ i ];
			const pics = images[ b ].sort( () => Math.random() > 0.5 );
			sections[ b ] = [ new Page( this.state.subjects[ i ], pics[ i ], words[ i ], 'folio' ) ];
			for ( let j = 1; j < images[ b ].length; j++ ) {
				sections[ b ].push( new Page( this.state.subjects[ i ], pics[ j ], words[ j ] ) );
			}
			pageCounts[ b ] = 5;
		} );

		this.setState( {
			sections,
			pageCounts
		}, this.makePages );
	}

	makePages( sections = null, counts = null ) {
		sections = sections || this.state.subjects.slice( 0, this.state.maxSections );
		counts = counts || this.state.pageCounts;
		let pages = sections.map( s => this.state.sections[ s ].slice( 0, counts[ s ] ) ).reduce( ( a, v ) => a.concat( v ), [] );
		this.setState( {
			pages
		} );
	}

	render() {

		const pages = this.state.pages.map( ( p, pp ) => {
			let theme = [ this.state.script ];

			if ( this.state.forceGreyScale ) {
				theme.push( 'grey' );
			}
			return {
				key: pp,
				id: `page-${ pp + 1 }`,
				layout: p.layout,
				theme: theme,
				image: p.image,
				words: p.words,
			};
		} );

		const index = pages.filter( p => p.layout === 'folio' ).map( p => {
			return {
				page: p.key + 1,
				link: `#${ p.id }`,
				text: p.words[ 0 ]
			};
		} );

		return (
			<React.Fragment>
        { this.state.titlePage && (
          <Template
            layout="title"
            theme={ [ this.state.script, ( this.state.forceGreyScale ? 'grey' : '' ) ] }
            words={ this.state.titlePageText }
          />
        ) }
        { pages.map( p => (
          <Template { ...p } />
        ) ) }
        { this.state.indexPage && (
          <Template
            layout="index"
            theme={ [ this.state.script, ( this.state.forceGreyScale ? 'grey' : '' ) ] }
            index={ index }
          />
        ) }
        <Editor
          script={ this.state.script}
          edit={ this.edit }
          greyscale={ this.state.forceGreyScale }
          subjects={ this.state.subjects }
          maxSections={ this.state.maxSections }
          sortedList={ this.state.sortedList }
          pageCounts={ this.state.pageCounts }
          indexPage={ this.state.indexPage }
          titlePage={ this.state.titlePage }
          images={ this.state.images }
          pages={ this.state.pages }
        />
      </React.Fragment>
		);
	}
}

ReactDOM.render( <CodexMysterium />, document.getElementById( 'root' ) );