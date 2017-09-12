import React from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

import Wrapper from './wrapper';
import Thumbnail from './thumbnail.js';
import Directory from './directory.js';
import Heading from './components/heading.js';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';
import MaterialButton from './components/ui/buttons/material-button.js';
import PostHeader from './post-header.js';
import Footer from './footer.js';
import ScrollDownButton from './components/ui/buttons/scroll-down-button.js';
import Logo from './logo.js';

import COLORS from './styles/colors.js';

import {PostQuery} from '../../../client/post-container/';

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
                allowTransition: this.props.allowTransition,
                videoStatus: true
            };

            window.addEventListener('scroll', () => {
                this.setState({
                    scrollY: window.scrollY,
                    navAbsoluteTop: this.refs['post-header'].getBoundingClientRect().height + 100
                });

                if (this.state.banner) {
                    this.setState({
                        bannerHeight: this.refs.video.parentNode.offsetHeight
                    })
                }

                this.setVideoStatus();

            });

            window.addEventListener('resize', () => {

                if (this.state.banner) {
                    this.setState({
                        bannerHeight: this.refs.video.parentNode.offsetHeight
                    })
                }


            });
        }
    }

    componentDidMount () {
        const {
            model,
            loadFinish,
            addLoadingQueue,
            addLoadedQueue,
        } = this.props;

        let banner = model.data ? model.data['Banner'] : null;
        let backupBanner = model.data ? model.data['Backup Banner'] : null;
        let bannerType = model.data ? model.data[ 'Banner Type'] : null;

        this.setVideoStatus();

        if (backupBanner) {

            if (backupBanner.content) {
                if (addLoadingQueue) {
                    addLoadingQueue();
                }
                backupBanner = JSON.parse(backupBanner.content);

                axios.get(PostQuery.getPostById,{
                    params: {
                        id: backupBanner.id,
                        post_type_id: backupBanner.post_type_id
                    }
                }).then((response) => {
                    this.setState({
                        backupBanner: '/' + response.data._hyperlink,
                    });

                    const downloadingImage = new Image();
                    downloadingImage.onload = () => {
                        if (addLoadedQueue) {
                            addLoadedQueue();
                        }
                    };

                    downloadingImage.src = '/' + response.data._hyperlink;


                }).catch((error) => {
                    console.log(error);
                });

            } else {
                if (addLoadedQueue) {
                    addLoadedQueue(null);
                }
            }

        } else {
            if (addLoadedQueue) {
                addLoadedQueue(null);
            }
        }

        if (banner) {
            if (banner.content && banner.content.id) {
                if (addLoadingQueue) {
                    addLoadingQueue({type: 'banner'});
                }
                banner = JSON.parse(banner.content);

                axios.get(PostQuery.getPostById,{
                    params: {
                        id: banner.id,
                        post_type_id: banner.post_type_id
                    }
                }).then((response) => {
                    this.setState({
                        banner: '/' + response.data._hyperlink,
                        postBanner: this.refs['post-banner'],
                    });
                    this.setState({
                        bannerHeight: this.refs.video.parentNode.offsetHeight
                    })
                    this.refs.video.load();

                    const self = this;
                    if (self.refs.video.canPlayType('video/mp4') == '') {
                        self.setState({
                            displayBannerError: true
                        })
                    }
                    this.refs.video.addEventListener('loadeddata', function(event) {
                        if (addLoadedQueue) {
                            addLoadedQueue();
                        }
                    }, false);

                }).catch((error) => {
                    console.log(error);
                });

            } else {
                if (addLoadedQueue) {
                    addLoadedQueue(null);
                }
            }

        } else {
            if (addLoadedQueue) {
                addLoadedQueue(null);
            }
        }

        this.setState({
            navAbsoluteTop: this.refs['post-header'].getBoundingClientRect().height + 100,
            bannerType: bannerType ? bannerType.content : null
        });

    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            allowTransition: nextProps.allowTransition,
            toggled: nextProps.toggled,
        });
    }

    setVideoStatus () {

        if (this.refs.video) {

            if (window.scrollY < this.refs.video.parentNode.offsetHeight) {

                if (this.state.videoStatus == false) {
                    this.setState({videoStatus: true });
                    this.refs.video.play();
                }

            } else {

                if (this.state.videoStatus == true) {
                    this.setState({videoStatus: false });
                    this.refs.video.pause();
                }
            }
        }
    }

    offsetRight (element) {
        return (document.body.offsetWidth - (this.refs.nav.parentNode.offsetWidth) ) / 2;
    }

    offsetRightAbsolute () {
        if (this.refs.nav) {
            return (window.getComputedStyle(this.refs.nav.parentNode.parentNode, null)['margin-left'].replace('px', ''));
        } else {
            return 0;
        }

    }

    render () {
        const {
            className,
            model,
            children,
            displayPostInfo,
            displayHeader,
            displayNav,
            displayScrollButton,
            style,
            innerContentStyle,
            displayFooter
        } = this.props;
        const {
            scrollY,
            allowTransition,
            toggled,
            navOpacity,
            navAbsoluteTop,
            bannerHeight
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
            navRight = this.offsetRight(nav.parentNode) + (toggled ? nav.parentNode.offsetWidth/2 : 0)
            navTop = (screen.availHeight / 2);
        }

        return (
            <div
                id = 'post-body'
                className = {className}
                style = {style}
            >
                <div
                    id = 'mobile-nav'
                    style = {{
                        height: 45,
                        width : '100%',
                        borderBottom: '1px solid rgb(238,238,238)',
                        background: 'white',
                        zIndex: 200,
                        cursor: 'pointer'
                    }}
                >
                    <Logo
                        size = {30}
                        url = {'/'}
                        style = {{
                            float: 'left',
                            marginTop: 5,
                            marginLeft: 15
                        }}
                    />
                    <FontAwesomeButton
                        className   = 'fa-user-o'
                        size        = { 19.5 }
                        iconStyle   = {{
                            color: 'rgb(160, 160, 160)',
                        }}
                        hoverStyle  = {{ color: 'rgb(170,170,170)' }}
                        parentStyle = {{
                            marginTop: 11,
                            marginLeft: 15,
                            position: 'relative',
                            float: 'left'
                        }}
                        onClick = {() => {
                            this.props.toggle('profile');
                        }}
                    />
                    {
                        this.state.banner? <a href = {this.state.banner}><span
                            style = {{
                                display: 'inline-block',
                                height: 45,
                                lineHeight: '45px',
                                float: 'right',
                                width: '30%',
                                borderLeft: '1px solid rgb(220,220,220)',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '.8px',
                                fontSize: '10px',
                                color: this.state.watchDemoButtonOver ? '#F9B7B1' : 'rgb(60,60,60)',
                                background: 'white',
                                transition: '.2s all'
                            }}
                            onMouseOver = {() => {
                                this.setState({
                                    watchDemoButtonOver: true
                                })
                            }}
                            onMouseLeave = {() => {
                                this.setState({
                                    watchDemoButtonOver: false
                                })
                            }}
                        >
                            {'Watch Demo'}
                        </span></a> : ''
                    }
                </div>
                {
                    this.state.banner ? <div
                        ref = {'post-banner-wrapper'}
                        style = {{
                            display: 'flex',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <div
                            id = 'post-banner'
                            ref = {'post-banner'}
                            style = {{
                                width: '100%',
                                overflow: 'hidden',
                                position: 'relative',
                                borderBottom: '1px solid rgb(220,220,220)',
                            }}
                            onMouseOver = {() => {
                                this.setState({bannerHover: true});
                            }}
                            onMouseLeave = {() => {
                                this.setState({bannerHover: false});
                            }}
                        >
                            <img
                                style = {{
                                    zIndex: 0,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                                ref = 'backup-banner'
                                src = {this.state.backupBanner}
                            />

                            <span
                                style = {{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    fontSize: 23,
                                    zIndex: -1,
                                    fontWeight: 300,
                                    color: 'rgb(160,160,160)',
                                    zIndex: 1,
                                    display: this.state.displayBannerError ? 'inline' : 'none'
                                }}
                            >
                                Sorry, this video format is not supported at your browser.
                            </span>
                            <img
                                alt = 'Loding gif image, four circles animating'
                                src = '/assets/loading.gif'
                                style = {{
                                    display: !this.state.displayBannerError ? 'inline' : 'none',
                                    zIndex: -1,
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transition: '.4s all',
                                    transform: 'translate(-50%,-50%)'
                                }}
                            />
                            <video
                                preload = {true}
                                ref = 'video'
                                loop
                                autoPlay
                                style = {{
                                    width: '100%',
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    transition: '.4s all',
                                    zIndex: 2
                                }}
                                onClick = {(event) => {
                                    event.stopPropagation();
                                    ga('send', 'event', `play`, 'Banner Video', `From ${window.location.href}`);
                                    if (this.refs.video.requestFullscreen) {
                                        this.refs.video.requestFullscreen();
                                    } else if (this.refs.video.mozRequestFullScreen) {
                                        this.refs.video.mozRequestFullScreen();
                                    } else if (this.refs.video.webkitRequestFullscreen) {
                                        this.refs.video.webkitRequestFullscreen();
                                    }
                                }}
                            >
                                <source src = {this.state.banner} type="video/mp4"/>
                            </video>
                        </div>
                    </div>: ''
                }
                <Wrapper
                    onResize = {(scrollRight) => {
                        this.setState({ scrollRight });
                    }}
                />
                <div ref = 'post-header'>
                    <Wrapper
                        innerStyle = {{
                            paddingBottom: 45,
                            position: 'relative',
                            ...innerContentStyle
                        }}
                    >
                        <div
                            id = 'scroll-down-wrapper'
                            style = {{
                                height: 25,
                            }}
                        >
                            <ScrollDownButton
                                primaryColor = { this.state.bannerType ? 'white' : 'rgb(30,30,30)'}
                                style = {{
                                    left: '50%',
                                    top: 0,
                                    transform: 'translate(-50%,-100%)',
                                    display: this.state.banner ? 'inline-block' : 'none'
                                }}
                                onMouseEnter = {() => {
                                    this.setState({ scrollDownOver : true });
                                }}
                                onMouseLeave = {() => {
                                    this.setState({ scrollDownOver : false });
                                }}
                                hover = { this.state.scrollDownOver }
                                target = {() => {
                                    return this.refs['post-banner'];
                                }}
                            />
                        </div>
                        <div ref = 'container'>
                            {
                                displayNav ?
                                <div
                                    id = 'post-nav'
                                    ref = 'nav'
                                    style = {{
                                        position: scrollY < bannerHeight ? 'absolute' : 'fixed',
                                        marginRight: 0,
                                        top: navAbsoluteTop,
                                        zIndex: 20,
                                        right: scrollY < bannerHeight ? navRight - this.offsetRightAbsolute() : navRight,
                                        transform: 'translateY(-50%)',
                                        transition: toggled != null ? '.4s all' : 'none'
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
                            >
                                {
                                    displayHeader !== false ?
                                        <PostHeader
                                            model = { model }
                                            display = { displayPostInfo }
                                        >
                                            <div style = {{
                                                    marginBottom: 35
                                                }} >
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
                                    : ''
                                }
                            </div>

                        </div>
                    </Wrapper>
                </div>

                <Wrapper
                    innerStyle = {{
                        ...innerContentStyle
                    }}
                >
                    <div ref = 'children-container'>
                        {children}
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
