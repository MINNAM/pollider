import React from 'react';
import Wrapper from './wrapper';
import Thumbnail from './thumbnail.js';
import Directory from './directory.js';
import Heading from './components/heading.js';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';
import PostHeader from './post-header.js';
import Footer from './footer.js';

import COLORS from './styles/colors.js';

class Body extends React.Component {

    state = {
        scrollY: 0
    }

    constructor ( props ) {
        super( props );

        if (typeof window != 'undefined') {

            this.state = {
                scrollY: window.scrollY,
                navTop: 0,
                allowTransition: this.props.allowTransition
            };

            window.addEventListener('scroll', () => {
                this.setState({
                    scrollY: window.scrollY
                });
            });
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            allowTransition: nextProps.allowTransition,
            toggled: nextProps.toggled,
        });
    }

    offsetRight (element) {

        return (document.body.offsetWidth - (this.refs.nav.parentNode.offsetWidth) ) / 2;
    }

    render () {

        const {
            className,
            model,
            children,
            displayPostInfo,
            displayHeader,
            displayNav,
            style,
            innerContentStyle,
            displayFooter
        } = this.props;
        const {
            scrollY,
            allowTransition,
            toggled,
            navOpacity
        } = this.state;
        const {
            nav
        } = this.refs;

        const scrolled = scrollY > 10;
        const scrollTopStyle = {
            opacity: scrolled ? 1: 0,
            marginTop: scrolled ? 0: 12.5,
            color: 'rgb(156, 156, 156)'
        };

        let navFixed = false;
        let navRight = '';
        let navTop;

        if (nav) {
            navRight = this.offsetRight(nav.parentNode) + (toggled ? 175 : 0)
            navTop = (screen.availHeight / 4) - 30;
        }

        return (
            <div
                id = 'post-body'
                className = {className}
                style = {style}
            >
                <Wrapper
                    onResize = {(scrollRight) => {
                        this.setState({ scrollRight });
                    }}
                />
                <Wrapper
                    innerStyle = {{
                        paddingBottom: 45,
                        position: 'relative',
                        ...innerContentStyle
                    }}
                >
                    <div ref = 'container'>
                        {
                            displayNav ?
                            <div
                                id = 'post-nav'
                                ref = 'nav'
                                style = {{
                                    position: 'fixed',
                                    marginRight: 0,
                                    top: navTop,
                                    zIndex: 20,
                                    right: navRight,
                                    transition: allowTransition ? '.5s all' : '.5 right',
                                }}
                            >
                                <div>
                                    <FontAwesomeButton
                                        className   = 'fa-user-o'
                                        size        = { 22 }
                                        iconStyle   = {{
                                            color: 'rgb(170, 170, 170)',
                                        }}
                                        hoverStyle  = {{ color: 'rgb(60,60,60)' }}
                                        parentStyle = {{
                                            marginBottom: 40,
                                            position: 'relative',
                                            float: 'right'
                                        }}
                                        toggled = {toggled == 'profile'}
                                        onClick = {() => {
                                            this.props.toggle('profile');
                                        }}
                                    />
                                    <FontAwesomeButton
                                        className   = 'fa-envelope-o'
                                        size        = { 24 }
                                        iconStyle   = {{
                                            color: 'rgb(170, 170, 170)',
                                            fontSize: 19,
                                            marginLeft: 1
                                        }}
                                        hoverStyle  = {{ color: 'rgb(60,60,60)' }}
                                        parentStyle = {{
                                            marginBottom: 40,
                                            position: 'relative',
                                            float: 'right'
                                        }}
                                        toggled = {toggled == 'contact'}
                                        onClick = {() => {
                                            this.props.toggle('contact');
                                        }}
                                    />
                                    <FontAwesomeButton
                                        className   = 'fa-angle-up'
                                        size        = { 24 }
                                        iconStyle   = {{
                                            color: 'rgb(156, 156, 156)',
                                            fontSize: 24,
                                            opacity: this.state.scrollY > 0 ? 1: 0
                                        }}
                                        hoverStyle  = {{ color: 'rgb(60,60,60)' }}
                                        parentStyle = {{
                                            marginBottom: 40,
                                            position: 'relative',
                                            float: 'right'
                                        }}
                                        onClick = { () => {

                                            let startingY = window.scrollY;
                                            let start = 0;
                                            let duration = 1000;
                                            let easing = function (t) { return (--t)*t*t+1 }

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

                            </div> : ''

                        }

                        <div
                            style = {{
                                display: 'inline-block',
                                height: 31,
                                width: '100%'
                            }}
                        >
                        </div>
                        <PostHeader
                            model = { model }
                            display = { displayPostInfo }
                        >
                            <div style = {{ marginBottom: 35 }} >
                                <span
                                    style = {{
                                        display: 'inline-block'
                                    }}
                                >
                                    <Directory
                                        model = { model.hyperlinks }
                                    />
                                </span>
                            </div>
                        </PostHeader>

                    </div>
                </Wrapper>


                <Wrapper                    
                    innerStyle = {{
                        ...innerContentStyle
                    }}
                >
                    <div ref = 'children-container'>
                        { children }
                    </div>
                    {
                        displayFooter ? <Footer
                            model = {model}
                            innerContentStyle = {{
                                margin : '0',
                                padding: 0,
                            }}
                        /> : ''
                    }
                </Wrapper>
            </div>
        )

    }

}

export default Body;
