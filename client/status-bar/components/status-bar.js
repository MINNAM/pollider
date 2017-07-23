import React from 'react';

class StatusBar extends React.Component {

    constructor ( props ) {
        super ( props );

        this.state = {
            status: 0,
            transform: 'translate(0, 100%)'
        };

    }

    componentDidMount () {
        this.transform = setTimeout(() => {
            this.setState({
                transform: 'translate(0, 0%)'
            });
            setTimeout(() => {
                this.setState({
                    transform: 'translate(0, -100%)'
                });
            }, 1900);
        }, 100);
    }

    componentWillUnmount () {
        clearTimeout(this.transform);
    }

    onClick () {

        let status =  this.state.status;

        this.setState({

            status : ( ++status % 4 )

        });

    }

    render () {
        const {
            transform
        } = this.state;

        return (
            <div
                style = {{
                    width: '100%',
                    height: 60,
                    display : 'inline-block',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div
                        style = {{
                            transform,
                            width: '100%',
                            height: 60,
                            display : 'inline-block',
                            background: 'rgba(20, 20, 20, 0.7)',
                            color : 'white',
                            transition: '0.5s all'
                        }}
                    >
                        <span style = {{ height: 60, lineHeight : '60px', display: 'inline-block', padding: '0 5% 0 5%'}}>{ this.props.text }</span>
                    </div>
            </div>
        );

    }

}

export default StatusBar;
