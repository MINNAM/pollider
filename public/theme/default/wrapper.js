import React from 'react';

class Wrapper extends React.Component {

    constructor ( props ) {

        super( props );



    }

    componentDidMount () {

        if ( this.props.onResize ) {

            this.props.onResize( window.getComputedStyle( this.refs[ 'inner-content' ] ).marginRight );

            window.addEventListener( 'resize', () => {

                this.props.onResize( window.getComputedStyle( this.refs[ 'inner-content' ] ).marginRight );

            });

        }

    }


    render () {

        const { children, style, innerStyle } = this.props;

        return (
            <div
                className = 'content'
                style     = { style }
            >
                <div
                    className = 'inner-content'
                    style     = { innerStyle }
                    ref       = 'inner-content'
                >
                    { children }
                </div>
            </div>
        )

    }

}

export default Wrapper;
