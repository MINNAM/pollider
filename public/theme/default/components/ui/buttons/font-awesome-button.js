import React from 'react';
import ButtonBase from './button-base.js';

class FontAwesomeButton extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {
            mouseOver : false
        }

    }

    render () {

        const {
            size,
            parentStyle,
            iconStyle,
            hoverStyle,
            className,
            onClick

        } = this.props;

        const _parentStyle = {
            ...parentStyle,
            width : size,
            height : size,

        }

        let primaryIconStyle = {
            fontSize : size,
            ...iconStyle,
            width : '100%',
            textAlign : 'center',
            transition : '.25s all',
            position: 'absolute',
            top: 0,
            left: 0
        };

        if ( this.state.mouseOver ) {

            primaryIconStyle = { ...primaryIconStyle, ...hoverStyle };

        }


        const primary = <i className = {`${ 'fa ' + className }` } style = { primaryIconStyle } />;

        return (
            this.props.url ? <a href = { this.props.url} target = '_blank'>
                <ButtonBase
                    onMouseOver = { () => {

                        this.setState({
                            mouseOver : true,
                        })
                    }}

                    onMouseLeave = { () => {

                        this.setState({
                            mouseOver : false,
                        })

                    }}
                    onClick = {() => {
                        if ( onClick ) {
                            onClick();
                        }
                    }}
                    parentStyle = { _parentStyle }
                    size  = { size }
                    primary   = { primary }
                />
            </a> : <ButtonBase
                onMouseOver = { () => {

                    this.setState({
                        mouseOver : true,
                    })
                }}

                onMouseLeave = { () => {

                    this.setState({
                        mouseOver : false,
                    })

                }}
                onClick = {() => {
                    if ( onClick ) {
                        onClick();
                    }
                }}
                parentStyle = { _parentStyle }
                size  = { size }
                primary   = { primary }
            />

        )

    }

}

export default FontAwesomeButton;
