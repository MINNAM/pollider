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
            window.onload = () => {
                setTimeout(() => {
                    this.setState({
                        loaded: true,
                        loading: false
                    });
                }, 1000);
                setTimeout(() => {
                    this.setState({
                        allowTransition: true
                    });
                }, 2000);
            };
            const anchors = document.getElementsByTagName('a');
            const self = this;

            for (let key in anchors) {
                if (anchors[key].addEventListener) {
                    anchors[key].addEventListener('click', function(event) {
                        event.preventDefault();

                        const href = this.getAttribute("href");

                        self.setState({loaded: false});

                        setTimeout(function(){
                             window.location = href;
                        },400);

                    });
                }
            }

        }

        this.onKeyDown = this.onKeyDown.bind(this);
        document.body.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown (event) {
        switch (event.keyCode) {
            case 27:
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
                } else {
                    this.setState({toggle: _toggle});
                }
            break;
            case 'contact':
                if (toggle == _toggle) {
                    this.setState({toggle: null});
                } else {
                    this.setState({toggle: _toggle});
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
                return (<FourOhFour model = {model}/>);

            default:
                return null;
        }
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
                    loading ? <svg
                        width  = {60}
                        height  = {35}
                        className = {'loading-element'}
                        style = {{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)'
                        }}
                    >
                        <circle
                            cx = {7.5}
                            r  = {3}
                            fill = {'rgb(76, 211, 173)'}
                        />
                        <circle
                            cx = {22.5}
                            r  = {3}
                            fill = {'rgb(76, 211, 173)'}
                        />
                        <circle
                            cx = {37.5}
                            r  = {3}
                            fill = {'rgb(76, 211, 173)'}
                        />
                        <circle
                            cx = {52.5}
                            r  = {3}
                            fill = {'rgb(76, 211, 173)'}
                        />
                    </svg> : ''
                }

                <div
                    style = {{
                        opacity: loaded ? 1 : 0,
                        transition: '.4s ease all',
                        position: 'relative',
                        height: '100%'
                    }}
                >
                    <header id = 'main-header'>
                    </header>
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
                                    allowTransition: this.state.allowTransition
                                })
                           ) : ''
                        }
                    </div>
                </div>

                {
                    this.props.type != 'home' ? <div
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
