import Page from './page';

export default class Chapter {
	constructor( subject, images = [], pages = Math.floor( Math.random() * 8 ) ) {
		this.subject = subject;
		this.images = images;
		this.pages = pages;
	}

	set pages( count ) {
		const images = this.images.sort( () => Math.random() > 0.5 );
		let pages = [ new Page( images[ 0 ], 'folio' ) ];

		pages = pages.concat( Array( count ).fill().map( ( _, i, a ) => {
			let layout;
			const image = images[ i + 1 ];

			if ( image ) {
				if ( ( image.width / 2 ) > image.height ) {
					layout = 'landscape1';
				} else if ( image.width > image.height ) {
					layout = 'landscape2';
				} else if ( image.width < image.height ) {
					const choices = [ 'portrait1', 'portrait2', 'portrait3', 'portrait4' ];
					layout = choices[ Math.floor( Math.random() * choices.length ) ];
				} else {
					layout = 'portrait1';
				}
			} else {
				layout = 'portrait1';
			}

			return new Page( image, layout );
		} ) );

		this._pages = pages;
	}

	get pages() {
		return this._pages;
	}
}