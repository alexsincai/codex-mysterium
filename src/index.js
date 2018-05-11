import React from 'react';
import ReactDOM from 'react-dom';

import '../node_modules/reset-css/reset.css';
import './index.css';

import secret from './secret';

class CodexMysterium extends React.Component {
	constructor() {
		super();

		this.state = {
			sections: [
				'alchemy',
				'flowers',
				'insects',
				'architecture'
			]
		}

		this.loadImages = this.loadImages.bind( this );
	}

	loadImages() {
		let loadedImages = localStorage.getItem( 'loadedImages' );
		if ( loadedImages ) {
			this.setState( {
				images: JSON.parse( loadedImages )
			} );
		} else {

		}
	}

	render() {
		return (
			<React.Fragment>
        <span style={{ fontFamily: 'Voynich123'}}>ok</span>
        <span style={{ fontFamily: 'RunaSansMedium'}}>ok</span>
      </React.Fragment>
		)
	}
}

ReactDOM.render( <CodexMysterium />, document.getElementById( 'root' ) );