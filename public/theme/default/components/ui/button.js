import React from 'react';

class Button extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {
            mouseOver : false
        }

    }

    render () {

        const {
            mouseOver
        } = this.state;

        const {
            content,
            type,
            fontSize,
            className,
            color,
            hoverColor,
            count,
            onClick
        } = this.props;

        const parentStyle = { width : '100%', textAlign : 'center', display : 'inline-block', ...this.props.parentStyle, opacity : mouseOver ? 0.5 : 1 };
        const iconStyle = { ...this.props.iconStyle, width : '100%', textAlign : 'center', transition : '.5s all' };

        return (

            <span
                style = { parentStyle }
                onClick = { () => {
                    onClick();
                }}
                onMouseOver = { () => {

                    this.setState({
                        mouseOver : true
                    })

                }}

                onMouseLeave = { () => {

                    this.setState({
                        mouseOver : false
                    })

                }}
            >
                <i className = {`${ type == 'material' ? 'material-icons' : 'fa ' + className }`} style = { iconStyle }>{ content }</i>
                <span
                    style = {{
                        width : '100%',
                        height : 18,
                        lineHeight : '18px',
                        fontWeight : 700,
                        fontSize : 10,
                        color : 'rgb(60,60,60)',
                        display : 'inline-block',
                        textAlign: 'center'
                    }}
                >
                    { count }
                </span>
            </span>

        )

    }


}

export default Button;
