import React from 'react';
import * as getColors from 'get-image-colors';

export default class Tempalte extends React.Component {
	constructor( props ) {
		super( props );

		this.getColor = this.getColor.bind( this );

		this.state = {
			id: props.id,
			theme: props.theme,
			layout: props.layout,
			image: props.image,
			words: props.words,
		}
	}

	getColor() {
		if ( !this.state.image ) {
			this.setState( {
				back: null,
				text: null
			} );
			return;
		}
		getColors( this.state.image ).then( colors => {
			const back = colors.sort( ( a, b ) => a.luminance() > b.luminance() ).pop();
			const text = colors.sort( ( a, b ) => a.luminance() < b.luminance() ).pop();
			this.setState( {
				back: back.hex(),
				text: text.hex(),
				mustSet: back.luminance() > 0.75,
				mustInvert: back.luminance() < 0.5
			} );
		} )
	}

	componentWillUpdate( nextProps, nextState ) {
		if ( nextState.theme !== this.state.theme ) {
			nextState.theme = nextProps.theme;
		}
	}

	componentWillMount() {
		this.getColor();
	}

	render() {
		const {
			id,
			layout,
			theme,
			image,
			words,
			index
		} = this.props;

		let articleProps = {
			id: id,
			className: [].concat( theme, layout ).reduce( ( a, v ) => a.concat( v ), [] ).join( ' ' ),
			style: {
				backgroundColor: this.state.back,
			}
		};

		if ( this.state.mustInvert ) {
			articleProps.style.color = this.state.text;
		}
		if ( this.state.mustSet ) {
			articleProps[ 'data-invert' ] = 'true';
		}

		if ( layout === 'index' ) {
			return (
				<article { ...articleProps }>
          <div>
            <ul>
              { index.map( ( i, ii ) => (
                <li key={ ii }>
                  <a href={ i.link } data-text={ i.page }>{ i.text }</a>
                </li>
              ) ) }
            </ul>
          </div>
        </article>
			)
		}

		if ( layout === 'folio' ) {
			articleProps.style.backgroundImage = `url(${ image })`;
			articleProps.style.backgroundSize = 'cover';

			const hprops = {
				'data-text': words[ 0 ],
				style: {
					color: this.state.mustSet ? this.state.text : this.state.back,
					'--color': this.state.mustSet ? this.state.text : this.state.back,
					'--back': this.state.mustSet ? this.state.back : this.state.text,
				}
			}

			return (
				<article { ...articleProps }>
          <div>
            <h1 { ...hprops }>{ words[ 0 ] }</h1>
          </div>
        </article>
			)
		}

		if ( layout === 'landscape1' ) {
			return (
				<article { ...articleProps }>
          <div>
            <p className="first">{ words.slice( 0, 110 ).join( ' ' ) }</p>
            <img src={ image } alt=""/>
          </div>
        </article>
			)
		}

		if ( layout === 'landscape2' ) {
			return (
				<article { ...articleProps }>
          <div>
            <p className="first">{ words.slice( 0, 30 ).join( ' ' ) }</p>
            <img src={ image } alt="" />
            <p>{ words.slice( 30 ).join( ' ' )}</p>
          </div>
        </article>
			)
		}

		if ( layout === 'portrait1' ) {
			return (
				<article { ...articleProps }>
          <div>
            <img src={ image } alt="" />
            <p className="first">{ words.slice( 0, 70 ).join( ' ' ) }</p>
            <p>{ words.slice( 70 ).join( ' ' )}</p>
          </div>
        </article>
			)
		}

		if ( layout === 'portrait2' ) {
			return (
				<article { ...articleProps }>
          <div>
            <p className="first">{ words.slice( 0, 40 ).join( ' ' )}</p>
            <img src={ image } alt=""/>
            <p className="first">{ words.slice( 40 ).join( ' ' ) }</p>
          </div>
        </article>
			)
		}

		if ( layout === 'portrait3' ) {
			return (
				<article { ...articleProps }>
          <div>
            <p className="first">{ words.slice( 0, 50 ).join( ' ' )}</p>
            <img src={ image } alt=""/>
            <p className="first">{ words.slice( 50  ).join( ' ' ) }</p>
          </div>
        </article>
			)
		}

		if ( layout === 'portrait4' ) {
			return (
				<article { ...articleProps }>
          <div>
            <img src={ image } alt=""/>
            <p className="first">{ words.slice( 0, 70 ).join( ' ' )}</p>
            <p className="">{ words.slice( 70, 50 ).join( ' ' ) }</p>
            <p className="first">{ words.slice( 120  ).join( ' ' ) }</p>
          </div>
        </article>
			)
		}

		return null;
		// return (
		// 	<article id={ this.props.id } className={ cls } style={{
		//     backgroundColor: this.state.back,
		//     color: this.state.text
		//   }}>
		//     { ( this.props.layout === 'folio' ) && (
		//       h1
		//     ) }
		//     {/* <img src={ this.props.image } alt=""/> */}
		//     {/* <p>{ this.props.words.join( ' ' ) }</p> */}
		//   </article>
		// )
	}
}