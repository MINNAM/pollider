import React, {Component} from 'react';

class Logo extends Component {

    state = {}

    render () {
        const {
            size,
            style,
            url,
            onClick
        } = this.props;
        const {
            mouseOver
        } = this.state;

        return (
            <a
                href = {url ? url : ''}
            >
                <svg
                    viewBox="0 0 50 50"
                    width = {30}
                    style = {{
                        ...style,
                        opacity: mouseOver ? 0.75 : 1,
                        transition: '.4s all'
                    }}
                    onMouseOver = {() => {
                        this.setState({mouseOver: true});
                    }}
                    onMouseLeave = {() => {
                        this.setState({mouseOver: false});
                    }}
                    onClick = {() => {
                        if (onClick) {
                            onClick();
                        }
                    }}
                >
                    <path
                        style = {{
                            fill:'#F9B7B1'
                        }}

                        d="M44.8,20.3c-0.1,0.4-0.3,1.7-0.9,3.1c-1.9,4.6-6.6,7-9.9,9.9c-2.2,1.9-5.5,4.9-8.9,8.9c-3.5-4-6.7-6.9-8.9-8.9 c-5.7-4.9-8.3-5.9-9.9-9.9c-0.6-1.5-2.1-5.8,0-10C6.6,12.7,8,10,11.1,8.6c3.7-1.7,7.1-0.4,8,0c4.7,1.8,5.6,4.4,5.9,5.2 c0.1-0.2,0.2-0.6,0.5-1.1c0.1-0.2,0.7-1.2,2-2.3"
                    />
                    <path
                        style = {{
                            fill: 'rgba(0,0,0,0.1)',
                            transform: 'translate(-1px,1px)'
                        }}
                        d="M44.8,20.3c-0.4,0.4-1.6,1.2-3.5,1.9c-1.3,0.4-4.6,1.6-8,0c-3.1-1.4-4.5-4.1-4.9-4.9c-1.4-2.9-1.1-5.7-0.9-6.9"
                    />
                    <path
                        style = {{
                            fill:'rgb(240,240,240)'
                        }}
                        d="M44.8,20.3c-0.4,0.4-1.6,1.2-3.5,1.9c-1.3,0.4-4.6,1.6-8,0c-3.1-1.4-4.5-4.1-4.9-4.9c-1.4-2.9-1.1-5.7-0.9-6.9"
                    />
                </svg>
            </a>
        )
    }

}

export default Logo;
