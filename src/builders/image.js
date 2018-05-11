import colr from 'colr';

export default class Image {
	constructor( obj ) {
		this.width = Number( obj.width_o );
		this.height = Number( obj.height_o );
		this.src = obj.url_o;
		let h = Math.floor( Math.random() * 60 );
		let s = Math.floor( Math.random() * 20 ) + 20;
		let l = Math.random( Math.random() * 5 ) + 90;
		this.color = colr.fromHsl( h, s, l ).toHex();
	}
}