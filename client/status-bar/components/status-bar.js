import React from 'react';
const STYLES = {
    success: {
        background: 'rgba(60,60,60,1)'
    },
    warning: {
        background: 'rgba(255,167,38,1)'
    },
    error: {
        background: 'rgba(244,67,54,1)'
    }
};

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
            text,
            type
        } = this.props;
        const {
            transform
        } = this.state;

        let style = STYLES.success;
        switch (type) {
            case -1:
                style = STYLES.error;
            break;

            case 0:
                style = STYLES.warning;
            break;
        }

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
                            color : 'white',
                            transition: '0.5s all',
                            ...style
                        }}
                    >
                        <span
                            style = {{
                                height: 60,
                                lineHeight: '60px',
                                display: 'inline-block',
                                padding: '0 5% 0 5%',
                                fontSize: 15
                            }}
                        >
                            {text}
                        </span>
                    </div>
            </div>
        );

    }

}

export default StatusBar;
