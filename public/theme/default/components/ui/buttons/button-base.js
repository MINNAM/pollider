import React from 'react';

class ButtonBase extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {
            mouseOver : false,
            className : this.props.className
        }

    }

    render () {

        const {
            mouseOver,
            _className,
        } = this.state;

        const {
            primary,
            secondary,
            onClick,
            onMouseOver,
            onMouseLeave,
            size,
            className
        } = this.props;

        const parentStyle = { width : '100%', textAlign : 'center', display : 'inline-block', ...this.props.parentStyle, cursor : 'pointer' };

        return (

            <span
                className = {className}
                style = { parentStyle }
                onClick = { () => {

                    if ( this.props.onClick ) {
                        this.props.onClick();
                    }

                }}
                onMouseEnter = { () => {

                    if ( onMouseOver ) {
                        onMouseOver();
                    }

                    this.setState({
                        mouseOver : true,
                    })
                }}

                onMouseLeave = { () => {

                    if ( onMouseLeave ) {
                        onMouseLeave();
                    }

                    this.setState({
                        mouseOver : false,
                    })
                }}
            >
                <div
                    style = {{
                        width : size,
                        height : size,
                        position: 'absolute',
                        display : 'inline-block',
                        top : 0,
                        left : 0,
                    }}
                >
                    { primary }
                </div>


            </span>

        )

    }


}

export default ButtonBase;
