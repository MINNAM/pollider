import React from 'react';

class Container extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            scrollTop    : 0,
            scrollHeight : 0, // Inner height of div including not visiable content
            offsetHeight : 0, // Visible Height

        };

    }

    shouldComponentUpdate () {

        this.setState({

            scrollHeight : this.child.scrollHeight,

        });

        return true;

    }

    componentDidMount () {

        setTimeout( () => {

            this.setState({

                scrollTop    : this.child.scrollTop,
                scrollHeight : this.child.scrollHeight,
                offsetHeight : this.child.offsetHeight


            });

        }, 1 );

    }

    render () {

        let barPos = ( this.state.scrollTop / ( this.state.scrollHeight - this.state.offsetHeight) ) * ( ( ( this.state.scrollHeight - this.state.offsetHeight) ) / this.state.scrollHeight) * 100 + '%';
        let barHeight = ( 100 * ( (this.state.scrollHeight - ( this.state.scrollHeight - this.state.offsetHeight) ) / this.state.scrollHeight) ) + '%';

        return (
            <div
                style = { this.props.style }
            >
                <div
                    ref      =  { ( a ) => this.child = a }
                    style    = { Object.assign( this.props.contentStyle, { height: '100%', overflowY: 'scroll' } ) }
                    onScroll = {
                        () => {

                            this.setState({

                                scrollTop    : this.child.scrollTop,
                                scrollHeight : this.child.scrollHeight,


                            });

                        }
                    }
                >
                    { this.props.children }
                </div>
                <div style = { Object.assign( this.props.scrollBarContainerStyle, { position: 'absolute', width: '1%', top: 0, right: 0, height: '100%' } ) }>
                    <div
                        style = {{
                            position: 'absolute',
                            display     : 'inline-block',
                            background : 'rgb(200,200,200)',
                            top : barPos,
                            height : barHeight,
                            width  : '100%'
                        }}
                    >
                    </div>
                </div>
            </div>

        );

    }

}

export default Container;
