import React from 'react';
import Body      from './body.js';
import Thumbnail from './thumbnail.js';
import Contact from './contact.js';
import Profile from './profile.js';
import Footer from './footer.js';
import Wrapper from './wrapper.js';

import {createProjectView} from '../index.js';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

const ScrollDownButton = (props) => {
    const {
        onMouseEnter,
        onMouseLeave,
        onClick,
        hover
    } = props;

    return (
        <div
            className = 'scroll-down-button'
            style = {{
                animationDuration: '4s',
                animationIterationCount: 'infinite',
                animationName: 'example2',
                bottom: 12.5,
                height: 50,
                left: '50%',
                transform: 'translate(-50%,0)',
                position: 'absolute',
                width: 50,
                zIndex: 5,
                cursor: 'pointer',
                animationPlayState: hover ? 'paused' : ''
            }}
            onMouseEnter = {() => {onMouseEnter();}}
            onMouseLeave = {() => {onMouseLeave();}}
            onClick = {onClick}
        >
            <svg
                style = {{
                    height: 50,
                    left: 0,
                    position: 'absolute',
                    top:0,
                    width: 50,
                }}
            >
                <polyline
                    points = "12.5,17.5 25,34 37.5,17.5"
                    style  = {{
                        fill: 'none',
                        stroke: 'rgb(76, 211, 173)',
                        strokeWidth: 2,
                    }}
                />
            </svg>
            <svg
                style = {{
                    animationDuration: '4s',
                    animationIterationCount: 'infinite',
                    animationName: 'example',
                    background: 'rgba(0,0,0,0)',
                    height: 30,
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: 50,
                    animationPlayState:hover ? 'paused' : '',
                }}
            >
                <polyline
                    points = "12.5,17.5 25,34 37.5,17.5"
                    style = {{
                        fill: 'none',
                        strokeWidth: 2,
                        stroke: 'rgb(30,30,30)'
                    }}
                />
            </svg>
        </div>
    );

};

class Home extends React.Component {

    state = {
        scrollDownOver: false
    }

    render () {
        const {
            model,
            children,
            toggle,
            toggled,
            allowTransition,
            getMarginRight
        } = this.props;

        return (
            <div
                style = {{
                    height: '100%'
                }}
            >
                <div
                    id = 'home'
                    style = {{
                        maxWidth: 'none',
                        height: '100%'
                    }}
                >
                    <div
                        id = 'profile-home'
                        ref = 'profile'
                        style = {{
                            float: 'right',
                            height: '100%'
                        }}
                    >
                        <Wrapper
                            style = {{
                                position: 'relative'
                            }}
                            innerStyle = {{
                                paddingLeft: 0,
                            }}
                        >
                            <Profile
                                toggle = {toggle}
                                allowClose = {false}
                            />
                            <ScrollDownButton
                                onMouseEnter = {() => {
                                    this.setState({ scrollDownOver : true });
                                }}
                                onMouseLeave = {() => {
                                    this.setState({ scrollDownOver : false });
                                }}
                                hover   = { this.state.scrollDownOver }
                                onClick = {() => {

                                    let startingY = window.scrollY;
                                    let diff = this.refs.profile.clientHeight - startingY
                                    let start = 0;
                                    let duration = 750;
                                    let easing = function (t) { return (--t)*t*t+1 }

                                  // Bootstrap our animation - it will get called right before next frame shall be rendered.
                                    window.requestAnimationFrame(function step(timestamp) {
                                        if (!start) {
                                            start = timestamp;
                                        }

                                        let time = timestamp - start
                                        let percent = Math.min(time / duration, 1);

                                        percent = easing(percent);

                                        window.scrollTo(0, startingY + diff * percent);

                                        if (time < duration) {
                                            window.requestAnimationFrame(step);
                                        }
                                    });

                                }}
                            />
                        </Wrapper>
                    </div>
                    <div
                        id = {`contact-home${toggled == 'contact' ? '-toggled' : ''}`}
                    >
                        <Wrapper
                            style = {{
                                position: 'relative'
                            }}
                        >
                            <Contact
                                toggle = {toggle}
                                toggled = {toggled == 'contact'}
                                style = {{
                                    width: '100%'
                                }}
                            />
                        </Wrapper>
                    </div>
                    <Body
                        className = {'home-body'}
                        model = {model}
                        displayNav = {false}
                        toggle = {toggle}
                        toggled = {toggled}
                        allowTransition = {allowTransition}
                        getMarginRight = {0}
                        innerContentStyle = {{
                            margin : '0',
                            padding: 0,
                        }}
                    >
                        <div
                            id = 'post-content'
                            style = {{
                                paddingRight: 0,
                            }}
                        >
                            {createProjectView(model)}
                            {
                                children ? children.map( ( element, key ) => {
                                    return (
                                        <Thumbnail
                                            key = {key}
                                            type = {element.data ? (element.data['Type'] ? element.data['Type'].content : 1 ) : 1}
                                            index = {key}
                                            model = {element}
                                            parentModel = {model}
                                            name = {element.name}
                                            hyperlink = {element.hyperlink}
                                            description = {element.data ? (element.data[ 'Description' ] ? element.data[ 'Description' ].content : '') : ''}
                                        />
                                    );
                                }) : ''
                            }
                        </div>
                    </Body>
                    <Footer
                        model = {model}
                        innerContentStyle = {{
                            margin : '0',
                            padding: 0,
                            zIndex: 100
                        }}
                    />
                </div>

            </div>
        );

    }

}

export default Home;
