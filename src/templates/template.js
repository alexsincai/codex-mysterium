import React from 'react';

const Template = ( {
	id,
	layout,
	image,
	color,
	words
} ) => {

	if ( layout === 'folio' ) {
		return (
			<article id={ id }>
        <style>{`
          @page {
            background-color: black;
            background-image: url(${ image });
          }
          article#${ id } {
            background-color: black;
            background-image: url(${ image });
          }
          article#${ id } > div {
            height: 2in;
            width: 100%;
            position: absolute;
            bottom:0;
          }
          article#${ id } h1 {
            font-size: 100pt;
            color: white;
          }
            article#${ id } img {
              width: 100%;
              margin: auto;
              display: block;
            }
        `}</style>
        <div>
          <h1>{ words[ 0 ] }</h1>
        </div>
      </article>
		)
	}

	if ( layout === 'landscape2' ) {
		return (
			<article id={ id }>
        <style>{`

        @page {
          background: ${ color };
        }
        article#${ id } {
          background: ${ color };
        }
        article#${ id } > div {
          height: 3in;
          overflow: hidden;
        }
        article#${ id } img {
          max-height: 3in;
          max-width: 100%;
          margin: auto;
          display: block;
          text-align: center;
          position: absolute;
          bottom: 0;
      }
      `}</style>
        <div>
          <p>
            <span class="first">{ words[ 0 ][ 0 ]}</span>{ words[ 0 ].slice( 1 ) }
            { words.slice( 1, 110 ).join( ' ' ) }
          </p>
        </div>
        <img src={ image } />
      </article>
		)
	}

	return null

}

export default Template;