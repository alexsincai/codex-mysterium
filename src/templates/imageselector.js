import React from 'react';

export default class ImageSelector extends React.Component {
	constructor( props ) {
		super( props );

		this.dialog = this.dialog.bind( this );

		this.state = {
			open: false,
			id: props.id,
			current: props.current,
			subject: props.subject,
			edit: props.edit,
			capitalize: props.capitalize,
			images: []
		}
	}

	componentWillUpdate( nextProps, nextState ) {
		nextState.images = nextProps.images;
		nextState.current = nextProps.current;
	}

	dialog() {
		this.setState( {
			open: !this.state.open
		} )
	}

	render() {
		return (
			<React.Fragment>
        <button onClick={ this.dialog }>
          Select picture for page { this.state.id + 1 } of { this.state.capitalize( this.state.subject ) }
        </button>
        <dialog open={ this.state.open }>
          <button onClick={ this.dialog }>&times;</button>
          <button data-func="loadMoreImages" data-subject={ this.state.subject } onClick={ this.state.edit }>Load different images</button>
            { this.state.images && this.state.images.map( ( i, ii ) => (
            <img
              key={ ii }
              data-id={ ii }
              data-page={ this.state.id }
              data-subject={ this.state.subject }
              data-func="selectImage"
              onClick={ this.state.edit }
              src={ i.thumb }
              className={ i.thumb === this.state.current ? 'active' : '' }
              alt=""
            />
          ) ) }
        </dialog>
      </React.Fragment>
		);
	}
}