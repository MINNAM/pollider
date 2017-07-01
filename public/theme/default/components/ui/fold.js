import React from 'react';

class Fold extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            topMouseOver : false

        }

    }

    render () {
        const {
            parentStyle,
            topStyle,
            bottomStyle,
            onClick,
            children,
            direction,
            foldMouseOver
        } = this.props;

        const { topMouseOver } = this.state;

        const size = foldMouseOver ? this.props.size : this.props.size * 0.95;

        let boxShadow = '-1px -1px 1px 1px rgba(220,220,220,0.5)';

        if ( direction == 'right' ) {

            boxShadow = '1px 1px 1px 1px rgba(220,220,220,0.5)';

        }

        const _parentStyle = {
            position : 'absolute',
            bottom : 0,
            right : 0,
            width : size,
            height : size,
            display : 'inline-block',
            zIndex : 5,
            background : '',
            overflow:'hidden',
            boxShadow,
            transition : '0.25s ease all',
            ...parentStyle

        };

        const _topStyle = {
            width : size,
            height: size * 2,
            background : 'white',
            display : 'inline-block',
            marginLeft : size * -.5,
            marginTop : size * -.5,
            position : 'absolute',
            left : 0,
            zIndex : 5,
            boxShadow : '1px 1px 0px 1px rgba(220,220,220,0.3)',
            transition : '0.25s ease all',
            ...topStyle
        };

        const _bottomStyle = {
            width : size,
            height: size,
            background : 'white',
            display : 'inline-block',
            transform : 'rotate(45deg)',
            position : 'absolute',
            left : 0,
            transition : '0.25s ease all',
            ...bottomStyle
        }

        return (
            <div
                style = { _parentStyle }
            >
                <div
                    style = {{
                        transform : 'rotate(45deg)',
                        display   : 'inline-block',
                        width     : size,
                        height    : size,
                        transition : '0.25s ease all',
                    }}
                    onMouseEnter = { () => {
                        this.props.onMouseOver();
                    }}
                    onMouseLeave = { () => {
                        this.props.onMouseLeave();
                    }}
                    onClick = { () => {
                        onClick();
                    }}
                >
                    <div style = { _topStyle } />
                    <div style = { _bottomStyle } />
                </div>
                { children }
            </div>
        )

    }


}

export default Fold;
