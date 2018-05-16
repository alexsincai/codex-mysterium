export default class Page {
	constructor( subject, image, words, layoutName = null ) {
		this.subject = subject;
		this.image = image.src;
		this.thumb = image.thumb;
		this.layout = layoutName || image;
		this.words = [].concat( words );
	}

	set layout( im ) {
		if ( im.constructor === String ) {
			this._layout = im;
			return;
		}

		if ( ( im.width / 2 ) > im.height ) {
			this._layout = 'landscape1';
		} else if ( im.width > im.height ) {
			this._layout = 'landscape2';
		} else {
			let opts = [ 'portrait1', 'portrait2', 'portrait3', 'portrait4' ];
			this._layout = opts[ Math.floor( Math.random() * opts.length ) ];
		}
	}

	get layout() {
		return this._layout;
	}
}