import React from 'react';
import Body from './body.js';
import Thumbnail from './thumbnail.js';
import Contact from './contact.js';
import Profile from './profile.js';
import Wrapper from './wrapper.js';
import Footer from './footer.js';
import Directory from './directory.js';

import {createProjectView} from '../index.js';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

class FourOhFour extends React.Component {

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
                        model = {model}
                        displayNav = {false}
                        displayHeader = {false}
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
                            style = {{
                                marginBottom: 35
                            }}
                        >
                            <Directory
                                model = {[{
                                    hyperlink : '',
                                    name : 'Go to Home'
                                }]}
                            />
                        </div>
                        <div
                            id = 'post-content'
                            style = {{
                                paddingRight: 0,
                            }}
                        >
                            <h1
                                style = {{
                                    fontFamily: 'hind',
                                    letterSpacing: '2px',
                                    width: '100%',
                                    fontSize: 44,
                                    color: 'rgb(40,40,40)',
                                    marginBottom: 50,
                                    marginTop: 5,
                                    display: 'inline-block',
                                    borderBottom: '2px solid rgb(220,220,220)',
                                    paddingBottom: 20,
                                }}
                            >
                                Ooooooooooops, Page Not Found!
                            </h1>
                            <h1
                                style = {{
                                    fontFamily: 'hind',
                                    letterSpacing: '2px',
                                    width: '100%',
                                    fontSize: 33,
                                    color: 'rgb(40,40,40)',
                                    marginBottom: 12,
                                    marginTop: 5,
                                    display: 'inline-block',
                                }}
                            >
                                Hello!
                            </h1>
                            <p
                                style = {{
                                    fontSize : 18,
                                    letterSpacing : '.85px',
                                    fontFamily : 'Hind',
                                    fontWeight : 300,
                                    lineHeight : '35px',
                                }}
                            >
                                <br/>
                                It seems like the page you are looking for does not exists or may not be available in public.
                                <br/>
                                If you wish to inquire about the post, please {`contact me `} <span
                                    style = {{borderBottom: '2px solid rgb(76, 211, 173)', cursor: 'pointer'}}
                                    onClick = {() => {
                                        toggle('contact');
                                    }}
                                >
                                    here
                                </span>
                                <br />
                            </p>
                        </div>
                    </Body>
                    <Footer
                        model = {model}
                        innerContentStyle = {{
                            margin : '0',
                            padding: 0,
                        }}
                    />
                </div>

            </div>
        );

    }

}

export default FourOhFour;
