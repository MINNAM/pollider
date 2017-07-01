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

        const { active,label } = this.props;
        const className = 'text-editor-control-button';

        return (
            <i
                className   = { 'material-icons ' + className }
                onMouseDown = { this.onToggle.bind( this ) }
                style       = {{
                    color     : active ? 'rgb(60,60,60)' : 'rgb(180,180,180)',
                    fontSize  : 22,
                    marginTop : 6,
                    cursor    : 'pointer'
                }}
            >
                { label }
            </i>
        );

    }

}

StyleButton.propTypes = {

    label    : React.PropTypes.string.isRequired,
    style    : React.PropTypes.string.isRequired,
    onToggle : React.PropTypes.func.isRequired,

};

export { React, StyleButton };
