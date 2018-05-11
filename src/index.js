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