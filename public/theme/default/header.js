import React from 'react';

import Wrapper           from './wrapper';
import CloseButton       from './components/ui/buttons/close-button.js';
import Fold              from './components/ui/fold';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';

const ScrollDownButton = ( props ) => {

    const { onMouseEnter, onMouseLeave, onClick, hover } = props;

    return (
        <div
            style = {{
                animationDuration       : '4s',
                animationIterationCount : 'infinite',
                animationName           : 'example2',
                bottom                  : 50,
                display                 : 'inline-block',
                height                  : 50,
                left                    : '50%',
                position                : 'absolute',
                transform               : 'translate(-50%, 0)',
                width                   : 50,
                zIndex                  : 5,
                cursor                  : 'pointer',
                animationPlayState      : hover ? 'paused' : ''
            }}
            onMouseEnter = { () => { onMouseEnter() } }
            onMouseLeave = { () => { onMouseLeave() } }
            onClick = { onClick }
        >
            <svg
                style = {{
                    height   : 50,
                    left     : 0,
                    position : 'absolute',
                    top      : 0,
                    width    : 50,
                }}
            >
                <polyline
                    points = "12.5,17.5 25,34 37.5,17.5"
                    style  = {{
                        fill        : 'none',
                        stroke      : 'rgb(76, 211, 173)',
                        strokeWidth : 4,
                    }}
                />
            </svg>
            <svg
                style = {{
                    animationDuration       : '4s',
                    animationIterationCount : 'infinite',
                    animationName           : 'example',
                    background              : 'rgba(0,0,0,0)',
                    height                  : 30,
                    left                    : 0,
                    position                : 'absolute',
                    top                     : 0,
                    width                   : 50,
                    animationPlayState      : hover ? 'paused' : ''
                }}
            >
                <polyline
                    points = "12.5,17.5 25,34 37.5,17.5"
                    style = {{ fill : 'none', strokeWidth : 4, stroke : 'white' }}
                />
            </svg>
        </div>
    );

}

class Header extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {
            toggleContactOver : false
        }

    }

    render () {

        const { model, display, type, toggleHeader, toggleContact } = this.props;

        return (
            <div
                id = 'profile'
                ref = 'profile'
                style = {{
                    display    : display ? '' : 'none',
                    background : 'rgb(0, 14, 29)',
                }}
            >
                <Wrapper
                    style = {{
                        background    : 'rgb(0, 14, 29)',
                        paddingBottom : 59,
                        paddingTop    : 60,
                    }}
                >
                    <div>
                        <CloseButton
                            style       = {{ display : type ? '' : 'none' }}
                            hoverStyle  = {{ stroke : 'rgb(220,220,220)' }}
                            onClick     = { toggleHeader }
                        />
                        <p
                            style = {{
                                color         : 'rgb(76, 211, 173)',
                                fontFamily    : 'hind',
                                fontSize      : 16,
                                fontWeight    : 500,
                                letterSpacing : '2.7px',
                                lineHeight    : '35px',
                                marginBottom  : 0,
                                padding       : '0 0 0 0',
                            }}
                        >
                            Plan. Design. Develop.
                        </p>

                        <h1 style = {{ fontFamily : 'hind', letterSpacing : 1.2, fontSize : 54, marginBottom : 40, color : 'white', fontWeight : 300, marginTop : 20 }}>Hello!</h1>
                        <p
                            style = {{
                                color         : 'white',
                                fontFamily    : 'Hind',
                                fontSize      : 18,
                                fontWeight    : 300,
                                letterSpacing : '1.2px',
                                lineHeight    : '35px',
                                marginBottom  : 100,
                                marginTop     : 25,
                                padding       : '0 0 0 0',
                            }}
                        >
                            My name is <span style = {{ fontWeight: 500, fontSize : 25, paddingLeft: 10, paddingRight: 10 }}>{`${model.first_name} ${model.last_name}`}.</span> I am a web developer resides in Vancouver, Canada.
                            I love the world of coding where a grain of ideas can turn in to a rolling stone, something big! <br /><br />
                            If you are interested in collaborating, please {`contact me `}
                            <span
                                onClick = { toggleContact }
                                onMouseEnter = { () => {
                                    this.setState({ toggleContactOver : true });
                                }}
                                onMouseLeave = { () => {
                                    this.setState({ toggleContactOver : false });
                                }}
                                style = {{
                                    borderBottom: '2px solid rgb(76, 211, 173)',
                                    cursor : 'pointer',
                                    color : this.state.toggleContactOver ? 'rgb(220,220,220)' : 'white'
                                }}>
                                    here
                                </span>
                        </p>
                        <ScrollDownButton
                            onMouseEnter = { () => {
                                this.setState({ scrollDownOver : true });
                            }}
                            onMouseLeave = { () => {
                                this.setState({ scrollDownOver : false });
                            }}
                            hover   = { this.state.scrollDownOver }
                            onClick = {() => {

                                let startingY = window.scrollY;
                                let diff      = this.refs.profile.clientHeight - startingY
                                let start     = 0;
                                let duration  = 750;
                                let easing    = function (t) { return (--t)*t*t+1 }

                              // Bootstrap our animation - it will get called right before next frame shall be rendered.
                                window.requestAnimationFrame(function step(timestamp) {
                                    if ( !start ) {
                                        start = timestamp;
                                    }

                                    let time = timestamp - start
                                    let percent = Math.min( time / duration, 1);

                                    percent = easing( percent );

                                    window.scrollTo( 0, startingY + diff * percent)


                                    if ( time < duration ) {

                                        window.requestAnimationFrame( step );

                                    }

                                });

                            }}
                        />
                        <FontAwesomeButton
                            className   = 'fa-vimeo'
                            size        = { 25 }
                            iconStyle   = {{ color: 'white' }}
                            hoverStyle  = {{ color : 'rgb(220,220,220)' }}
                            parentStyle = {{
                                position : 'absolute',
                                top      : 15,
                                right    : 15,
                                width    : 'initial'
                            }}
                            url         = { 'https://vimeo.com/jabuem' }
                        />
                        <FontAwesomeButton
                            className   = 'fa-github'
                            size        = { 25 }
                            iconStyle   = {{ color: 'white' }}
                            hoverStyle  = {{ color : 'rgb(220,220,220)' }}
                            parentStyle = {{
                                position : 'absolute',
                                top      : 15,
                                right    : 65,
                                width    : 'initial'
                            }}
                            url =  { 'https://github.com/MINNAM' }
                        />
                    </div>
                </Wrapper>
            </div>
        )
    }

}

export default Header;
