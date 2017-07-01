import React from 'react';
import ButtonBase from './button-base.js';



class CloseButton extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {
            mouseOver : false
        }

    }

    render () {

        const { style, hoverStyle, onClick, color, size } = this.props;

        let _size = 20 - ( size ? size : 18 );

        let iconStyle = {
            fill : 'none',
            strokeWidth : 4,
            stroke : color ? color : 'white',
            transition: 'all 0.25s'
        };

        if ( this.state.mouseOver ) {

            iconStyle = { ...iconStyle, ...hoverStyle };

        }


        const secondary = <svg>
            <polyline points={`${_size},${_size} ${20-_size},${20-_size}`} style={{ fill : 'none', strokeWidth : 4, stroke : 'rgb(76, 211, 173)'}} />
            <polyline points={`${20-_size},${_size} ${_size},${20-_size}`} style={{ fill : 'none', strokeWidth : 4, stroke : 'rgb(76, 211, 173)'}} />
        </svg>;

        const primary = <svg>
            <polyline points={`${_size},${_size} ${20-_size},${20-_size}`} style={iconStyle} />
            <polyline points={`${20-_size},${_size} ${_size},${20-_size}`} style={iconStyle} />
        </svg>;



        let _style = {
            width : 20,
            height : 20,
            position : 'absolute',
            display: 'inline-block',
            top : 15,
            left : 15,
            zIndex : 5,
            ...style
        }


        return (
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
                parentStyle =  { _style }
                size        = { 20 }
                primary     = { primary }
                secondary   = { secondary }
                onClick     = { onClick }
            />

        )

    }

}

export default CloseButton;
