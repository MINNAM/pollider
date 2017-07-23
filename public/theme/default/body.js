import React from 'react';
import Wrapper from './wrapper';
import Thumbnail from './thumbnail.js';
import Directory from './directory.js';
import Heading from './components/heading.js';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';
import PostHeader from './post-header.js';

class Body extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = { scrollY : 0 };

        if ( typeof window != 'undefined' ) {

            this.state = { scrollY : window.scrollY, navTop  : 0 };

            window.addEventListener( 'scroll', () => {

                this.setState({

                    scrollY : window.scrollY

                });

            });

        }

    }

    offsetRight ( element ) {

        if ( document )
            return (document.body.offsetWidth - ( element.offsetWidth) ) / 2;

    }

    render () {

        const { model, children, displayPostInfo, displayHeader } = this.props;

        let scrollTopStyle = {  opacity : 0, marginTop : 12.5, color : 'rgb(156, 156, 156)' };

        if ( this.state.scrollY > 10 ) {

            scrollTopStyle = {  opacity : 1, marginTop: 0 , color : 'rgb(156, 156, 156)' };

        }

        let navFixed = false;
        let navRight = '';
        let navTop;

        if ( this.refs.nav ) {

            navFixed = this.state.scrollY > this.refs.nav.parentNode.parentNode.parentNode.offsetTop;

            navRight = navFixed ? this.offsetRight( this.refs.nav.parentNode ) : '';

            navTop = (screen.availHeight / 4) + 10;


        }

        return (
            <div
                id = 'post-body'
                style = {{
                    // transform: this.state.toggleProfile ? 'translate(-10%,0)' : 'translate(0,0)',
                    // transition: '0.5s all'
                }}
            >
                <Wrapper
                    onResize = {( scrollRight ) => {
                        this.setState({ scrollRight });
                    }}
                />
                    <Wrapper
                        innerStyle = {{
                            paddingBottom : 45,
                            position : 'relative'
                        }}
                    >
                        <div ref = 'container'  >

                            <div
                                id    = 'post-nav'
                                ref   = 'nav'
                                style = {{
                                    position : navFixed ? 'fixed' : 'absolute',
                                    marginRight : 0,
                                    top : navTop,
                                    zIndex    : 20,
                                    right : navRight
                                }}
                            >
                                <div
                                    style = {{

                                    }}
                                >
                                    <FontAwesomeButton
                                        className   = 'fa-user-o'
                                        size        = { 22 }
                                        iconStyle   = {{
                                            color : 'rgb(156, 156, 156)'
                                        }}
                                        hoverStyle  = {{ color : 'rgb(60,60,60)' }}
                                        parentStyle = {{
                                            marginBottom : 40,
                                            position     : 'relative',
                                            float : 'right'
                                        }}
                                        onClick = {() => {

                                            this.setState({
                                                toggleProfile: !this.state.toggleProfile
                                            })

                                        }}
                                    />
                                    <FontAwesomeButton
                                        className   = 'fa-envelope-o'
                                        size        = { 24 }
                                        iconStyle   = {{
                                            color     : 'rgb(156, 156, 156)',
                                            fontSize : 19
                                        }}
                                        hoverStyle  = {{ color : 'rgb(60,60,60)' }}
                                        parentStyle = {{
                                            marginBottom : 40,
                                            position     : 'relative',
                                            float : 'right'
                                        }}
                                        onClick = {() => {

                                            this.props.toggleContact();

                                        }}
                                    />
                                    <FontAwesomeButton
                                        className   = 'fa-angle-up'
                                        size        = { 24 }
                                        iconStyle   = {{
                                            color     : 'rgb(156, 156, 156)',
                                            fontSize : 24,
                                            opacity      : this.state.scrollY > 0 ? 1 : 0
                                        }}
                                        hoverStyle  = {{ color : 'rgb(60,60,60)' }}
                                        parentStyle = {{
                                            marginBottom : 40,
                                            position     : 'relative',
                                            float : 'right'
                                        }}
                                        onClick = { () => {

                                            let startingY = window.scrollY;

                                            let start     = 0;
                                            let duration  = 1000;
                                            let easing    = function (t) { return (--t)*t*t+1 }

                                          // Bootstrap our animation - it will get called right before next frame shall be rendered.
                                            window.requestAnimationFrame(function step(timestamp) {
                                                if ( !start ) {
                                                    start = timestamp;
                                                }

                                                let time = timestamp - start
                                                let percent = Math.min( time / duration, 1);

                                                percent = easing( percent );

                                                window.scrollTo( 0, startingY - (startingY * percent) )


                                                if ( time < duration ) {

                                                    window.requestAnimationFrame( step );

                                                }

                                            });

                                        }}
                                    />

                                </div>

                            </div>

                            <PostHeader
                                model = { model }
                                display = { displayPostInfo }
                            >
                                <div style = {{ marginBottom : 35 }} >
                                    <span
                                        style = {{
                                            display      : 'inline-block'
                                        }}
                                    >
                                        <Directory
                                            model = { model.hyperlinks }
                                            onMouseEnter = { () => {

                                                this.props.hintFold();
                                            }}
                                        />
                                    </span>
                                </div>
                            </PostHeader>

                        </div>
                    </Wrapper>
                <Wrapper>
                    <div ref = 'children-container'>
                        { children }
                    </div>
                </Wrapper>
                <Wrapper
                    innerStyle = {{
                        position : 'relative',
                        marginTop : 35
                    }}
                >
                    <span
                        style = {{
                            float        : 'right'
                        }}
                    >
                        <Directory
                            model = { model.hyperlinks }
                            onMouseEnter = { () => {

                                this.props.hintFold();
                            }}
                        />
                    </span>
                </Wrapper>
                <div
                    style = {{
                        width : '100%',
                        height : 50,
                        position : 'relative',
                        marginTop : 7.5
                    }}
                >
                    <Wrapper
                        innerStyle = {{
                            position : 'relative'
                        }}
                    >
                        <span
                            style = {{
                                color         : 'rgb(120,120,120)',
                                display       : 'inline-block',
                                fontSize      : 12,
                                height        : 50,
                                letterSpacing : 2,
                                lineHeight    : '50px'
                            }}
                        >
                            {`${ model.first_name } ${ model.last_name} ©2017`}

                        </span>
                        <FontAwesomeButton
                            className   = 'fa-vimeo'
                            size        = { 25 }
                            iconStyle   = {{ color: 'rgb(180,180,180)' }}
                            hoverStyle  = {{ color : 'rgb(120,120,120)' }}
                            parentStyle = {{
                                marginTop : 10,
                                float     : 'right',
                                position  : 'relative'
                            }}
                            url         = { 'https://vimeo.com/jabuem' }
                        />
                        <FontAwesomeButton
                            className   = 'fa-github'
                            size        = { 25 }
                            iconStyle   = {{ color : 'rgb(180,180,180)' }}
                            hoverStyle  = {{ color : 'rgb(120,120,120)' }}
                            parentStyle = {{
                                marginTop   : 10,
                                marginRight : 20,
                                float       : 'right',
                                position    : 'relative'
                            }}
                            url =  { 'https://github.com/MINNAM' }
                        />
                    </Wrapper>
                </div>
            </div>
        )

    }

}

export default Body;
