import React from 'react';
import ButtonBase from './button-base.js';
import CloseButton from './close-button.js';

class MaterialButton extends React.Component {

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
            iconName,
            onClick

        } = this.props;

        const _parentStyle = {
            width : size,
            height : size,
            ...parentStyle,
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

        const primary = <i
            className="material-icons"
            style = {primaryIconStyle}
        >
            {iconName}
        </i>;

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
                    onClick = {(event) => {
                        if ( onClick ) {
                            onClick(event);
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
                    onClick = {(event) => {
                        if (onClick) {
                            onClick(event);
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
                        onClick = {(event) => {
                            if ( onClick ) {
                                onClick(event);
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

export default MaterialButton;
