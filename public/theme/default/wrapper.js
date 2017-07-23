import React, {Component} from 'react';

class Wrapper extends React.Component {

    componentDidMount () {
        const {
            onResize
        } = this.props;

        if (onResize) {
            onResize(window.getComputedStyle(this.refs[ 'inner-content' ] ).marginRight);
            window.addEventListener('resize', () => {
                this.props.onResize( window.getComputedStyle( this.refs[ 'inner-content' ] ).marginRight );
            });
        }
    }

    render () {
        const {
            children,
            style,
            innerStyle
        } = this.props;
        return (
            <div
                className = 'content'
                style = { style }
            >
                <div
                    className = 'inner-content'
                    style = {innerStyle}
                    ref = 'inner-content'
                >
                    {children}
                </div>
            </div>
        );
    }

}

export default Wrapper;
