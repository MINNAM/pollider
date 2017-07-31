import React from 'react';
import ButtonBase from './button-base.js';
import CloseButton from './close-button.js';

class FontAwesomeButton extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {
            mouseOver : false
        }

    }

    componentWillReceiveProps (nextProps) {

        if (this.props.toggled != nextProps.toggled) {
            this.setState({ mouseOver: false });
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
                        });
                    }}

                    onMouseLeave = { () => {
                        this.setState({
                            mouseOver : false,
                        });

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
            </a> : <span
                style = {{
                    position: 'relative',
                    ..._parentStyle
                }}
            >
                <CloseButton
                    color   = 'rgba(244,67,54,0.5)'
                    style = {{
                        position: 'absolute',
                        left: 2,
                        top: 0,
                        opacity: this.props.toggled ? 1 : 0,
                        transition: '.175s all',
                        zIndex: this.props.toggled ? 1 : -1
                    }}
                    hoverStyle  = {{stroke : 'rgba(244,67,54,0.7)'}}
                    size    = { 17 }
                    onClick = {() => {
                        if (onClick) {
                            onClick();
                        }
                    }}
                />
                <span
                    style = {{
                        opacity: !this.props.toggled ? 1 : 0,
                        transition: '.175s all'
                    }}
                >
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
                        size  = { size }
                        primary   = { primary }
                    />
                </span>
            </span>

        )

    }

}

export default FontAwesomeButton;
