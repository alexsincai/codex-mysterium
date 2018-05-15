export default class Image {
	constructor( obj ) {
		this.width = Number( obj.width_o );
		this.height = Number( obj.height_o );
		this.src = obj.url_o;
	}
}