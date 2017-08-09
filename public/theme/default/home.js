import React from 'react';
import Body      from './body.js';
import Thumbnail from './thumbnail.js';
import Contact from './contact.js';
import Profile from './profile.js';
import Footer from './footer.js';
import Wrapper from './wrapper.js';
import ScrollDownButton from './components/ui/buttons/scroll-down-button.js';

import {createProjectView} from '../index.js';


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
            getMarginRight,
            loadFinish,
            addLoadingQueue,
            addLoadedQueue
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
                                padding: 0,
                            }}
                        >
                            <Profile
                                toggle = {toggle}
                                allowClose = {false}
                                title = 'Hello!'
                            />
                            <ScrollDownButton
                                primaryColor = {'rgb(60,60,60)'}
                                secondaryColor = {'rgb(60,60,60)'}
                                onMouseEnter = {() => {
                                    this.setState({ scrollDownOver : true });
                                }}
                                onMouseLeave = {() => {
                                    this.setState({ scrollDownOver : false });
                                }}
                                hover   = { this.state.scrollDownOver }
                                style = {{
                                    left: '50%',
                                    transform: 'translate(-50%,0)',
                                    bottom: 12.5
                                }}
                                target = {() => {
                                    return this.refs.profile;
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
                        loadFinish = {loadFinish}
                        addLoadingQueue= {addLoadingQueue}
                        addLoadedQueue = {addLoadedQueue}
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
                                            addLoadingQueue= {addLoadingQueue}
                                            addLoadedQueue = {addLoadedQueue}
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
