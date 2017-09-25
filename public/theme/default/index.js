import React, {Component} from 'react';

import Home from './home';
import Post from './post.js';
import Posts from './posts.js';
import FourOhFour from './four-oh-four.js';
import Wrapper from './wrapper';
import Contact from './contact.js';
import Profile from './profile.js';
import Button from './components/ui/button.js';
import CloseButton from './components/ui/buttons/close-button.js';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';
import Heading from './components/heading.js';
import Input from './components/input.js';


const PRIMARY_COLOR = 'rgb(76, 211, 173)';

if (typeof window  != 'undefined') {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-104311552-1', 'auto');
    ga('send', 'pageview');
}

class Index extends Component {

    constructor (props) {
        super(props);

        const {
            model
        } = this.props;

        this.state = {
            loaded: false,
            loading: true,
            toggle: null,
            loadingQueue: 0,
            loadedQueue: 0,
            allowTransition: false
        };

        this.toggle = this.toggle.bind(this);


    }

    componentDidMount () {
        const {
            model,
            type
        } = this.props;

        if (typeof window  != 'undefined') {
            const anchors = document.getElementsByTagName('a');
            const self = this;            
            for (let key in anchors) {
                if (anchors[key].addEventListener) {
                    anchors[key].addEventListener('click', function(event) {
                        console.log( 'anchor', this );
                        if (!this.getAttribute('target')) {
                            event.preventDefault();

                            const videos = document.getElementsByTagName('video');

                            if (videos.length > 0) {
                                for( let i = 0; i < videos.length; i++ ) {
                                    videos[i].pause();
                                }
                            }

                            const href = this.getAttribute("href");

                            self.setState({loaded: false});

                            if (this.safetyLoad) {
                                clearTimeout(this.safetyLoad);
                            }

                            setTimeout(() => {
                                 window.location = href;
                            },550);
                        }
                    });
                }
            }
        }

        window.addEventListener("pageshow", function(evt){
                if(evt.persisted){
                setTimeout(function(){
                    window.location.reload();
                },10);
            }
        }, false);

        this.safetyLoad = setTimeout(() => {
            this.load();
        },5000);

        this.onKeyDown = this.onKeyDown.bind(this);
        document.body.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown (event) {
        switch (event.keyCode) {
            case 27:
            ga('send', 'event', `toggled`, this.state.toggle, `Off by ESC from ${window.location.href}`);
                this.toggle(null);
                break;
        }
    }

    toggle (_toggle) {
        const {
            toggle
        } = this.state;

        switch (_toggle) {
            case 'profile':
                if (toggle == _toggle) {
                    this.setState({toggle: null});
                    ga('send', 'event', `toggled`, 'profile', `Off by close button from ${window.location.href}`);
                } else {
                    this.setState({toggle: _toggle});
                    ga('send', 'event', `toggled`, 'profile', `From ${window.location.href}`);
                }
            break;
            case 'contact':
                if (toggle == _toggle) {
                    this.setState({toggle: null});
                    ga('send', 'event', `toggled`, 'profile', `Off by close button from ${window.location.href}`);
                } else {
                    this.setState({toggle: _toggle});
                    ga('send', 'event', `toggled`, 'profile', `From ${window.location.href}`);
                }
            break;
            default:
                this.setState({toggle: _toggle});
        }
    }

    getContent () {
        const {
            model,
            type,
            children
        } = this.props;

        switch (type) {
            case 'home':
                return (<Home
                    model = {model}
                    children = {children}
                />);
            case 'post':
                return (<Post
                    model = {model}
                />);

            case 'posts':
                return (<Posts
                    model = {model}
                    children = {children}
                />);
            case 'four-oh-four':
                return (
                    <FourOhFour
                        model = {model}
                        children = {children}
                />);

            default:
                return null;
        }
    }

    load (delay = 1000) {

        clearTimeout(this.safetyLoad);

        setTimeout(() => {
            this.setState({
                loaded: true,
                loading: false
            });
        }, delay);
        setTimeout(() => {
            this.setState({
                allowTransition: true
            });
        }, delay * 2);
    }

    render () {
        const {
            model,
            type,
            children
        } = this.props;
        const {
            displayHeader,
            displayPrivateWarning,
            loaded,
            loading,
            toggle,
            allowTransition
        } = this.state;

        const content = this.getContent();

        return (

            <div
                style = {{
                    marginTop: loaded ? 0 : -50,
                    transition: '.4s ease margin-top',
                    height: '100%'
                }}
            >

                {
                    loading ? <img
                        alt = 'Loding gif image, four circles animating'
                        src = '/assets/loading.gif'
                        style = {{
                            zIndex: 300,
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transition: '.4s all',
                            transform: 'translate(-50%,-50%)'
                        }}
                    /> : ''
                }

                <div
                    style = {{
                        opacity: loaded ? 1 : 0,
                        transition: '.4s ease all',
                        position: 'relative',
                        height: '100%'
                    }}
                >
                    <div
                        id = {type != 'home' && type != 'four-oh-four' ? `content-parent-container${toggle ? '-toggled' : ''}` : 'content-parent-container'}
                        style = {{
                            height: '100%',
                            transition: '.4s ease all',
                        }}
                    >
                        {
                            content ? (
                                React.cloneElement(content, {
                                    header: this.refs.header,
                                    toggle: this.toggle,
                                    toggled: this.state.toggle,
                                    allowTransition: this.state.allowTransition,
                                    addLoadingQueue: (params = {}) => {
                                        if (params.index) {
                                            this.setState({
                                                loadingQueue: this.state.loadingQueue + params.index,
                                            });
                                        } else {
                                            this.setState({
                                                loadingQueue: this.state.loadingQueue + 1,
                                            });
                                        }
                                    },
                                    addLoadedQueue: (element) => {
                                        const {
                                            loadedElements = {}
                                        } = this.state;

                                        if (element == null) {
                                            this.load();
                                        } else {
                                            if (!loadedElements[element]) {
                                                loadedElements[element] = true;
                                                this.setState({
                                                    loadedElements,
                                                    loadedQueue: this.state.loadedQueue + 1
                                                });
                                            }
                                            if (this.state.loadedQueue == this.state.loadingQueue) {
                                                this.load();
                                            }

                                        }
                                    }
                                })
                           ) : ''
                        }
                    </div>
                </div>
                <div
                    className = 'desktop-only'
                    style = {{
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        position: 'fixed',
                        display: 'inline-block',
                        background: 'white',
                        opacity: this.state.toggle != null ? this.state.toggleWrapperHover ? 0 : 0.75 : 0,
                        zIndex: this.state.toggle != null ? 6 : -1,
                        transition: '.4s all',
                        cursor: 'pointer'
                    }}
                    onMouseOver = {() => {
                        this.setState({
                            toggleWrapperHover: true
                        })
                    }}
                    onMouseLeave = {() => {
                        this.setState({
                            toggleWrapperHover: false
                        })
                    }}
                    onClick = {() => {
                        ga('send', 'event', `toggled`, this.state.toggle, `Off by clicking content from ${window.location.href}`);
                        this.toggle(null);
                    }}
                />


                {
                    type != 'home' && type != 'four-oh-four' ? <div
                        id = {`contact-container${toggle == 'profile' ? '-toggled' : ''}`}
                        style = {{
                            background : 'white',
                            height: '100%',
                            position: 'fixed',
                            top: 0,
                            transition: allowTransition ? '0.5s all' : '',
                            zIndex: 35,
                            opacity: loaded ? 1 : 0,
                        }}
                    >
                        <Profile
                            toggle = {this.toggle}
                            title = 'Hello!'
                        />
                    </div> : ''
                }
                {
                    type != 'home' && type != 'four-oh-four' ? <div
                        id = {`contact-container${toggle == 'contact' ? '-toggled' : ''}`}
                        style = {{
                            background : 'white',
                            height: '100%',
                            position: 'fixed',
                            top: 0,
                            transition: allowTransition ? '0.5s all' : '',
                            zIndex: 35,
                            opacity: loaded ? 1 : 0,
                            display: type != 'home' && type != 'four-oh-four' ? 'initial' : 'none'
                        }}
                    >
                        <Contact
                            toggle = {this.toggle}
                        />
                    </div> : ''
                }
            </div>
       );
    }
}

export default Index;
