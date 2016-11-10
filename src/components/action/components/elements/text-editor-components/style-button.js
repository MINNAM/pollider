import React from 'react';

class StyleButton extends React.Component {

    constructor() {

        super();

    }

    onToggle ( event ) {

        event.preventDefault();
        this.props.onToggle( this.props.style );

    };

    render () {

        let className = 'text-editor-control-button';

        if ( this.props.active ) {

            className += ' text-editor-control-active-button';

        }

        return (
            <span
                className   = { className }
                onMouseDown = { this.onToggle.bind( this ) }
            >
                { this.props.label }
            </span>
        );

    }

}

StyleButton.propTypes = {

    label    : React.PropTypes.string.isRequired,
    style    : React.PropTypes.string.isRequired,
    onToggle : React.PropTypes.func.isRequired,

};

export { React, StyleButton };
