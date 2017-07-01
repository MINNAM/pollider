import React             from 'react';

import HomePage          from './home-page';
import Post              from './post.js';
import PostContainer     from './post-container.js';
import Header           from './header.js';
import Wrapper           from './wrapper';
import Contact           from './contact.js';
import Profile            from './profile.js';

import Button            from './components/ui/button.js';
import CloseButton       from './components/ui/buttons/close-button.js';
import Fold              from './components/ui/fold';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';
import Heading           from './components/heading.js';
import Input             from './components/input.js';



const displayRobot = ( model ) => {

    const parentStatus = model.parentStatus;
    const status       = model.status;

    if ( parentStatus == 'hidden' || parentStatus == 'private' ) {

        return <meta name="ROBOTS" content="NOINDEX, FOLLOW" />;

    } else if ( status == 'private' || status == 'hidden' ) {

        return <meta name="ROBOTS" content="NOINDEX, FOLLOW" />

    }

    return '';

}


class Index extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            displayContact : false,
            displayHeader : this.props.displayHeader,
            displayPrivateWarning : this.props.model.status == 'private',
            loaded         : false,
            loading        : 50
        }

        this.toggleContact = this.toggleContact.bind( this );
        this.toggleHeader = this.toggleHeader.bind( this );
        this.toggleProfile = this.toggleProfile.bind( this );

    }

    componentDidMount () {

        if ( typeof window  != 'undefined' ) {

            window.onload = () => {

                this.setState({ loaded : true });

            }

        }

        if ( this.props.model.status != 'public' ) {

            setTimeout( () => {

                this.setState({ displayPrivateWarning : false })

            }, 5000 )

        }


    }

    toggleHeader () {


        const { displayHeader } = this.state;

        this.setState({ displayHeader : !displayHeader });

    }

    toggleContact () {

        const { displayContact } = this.state;

        this.setState({ displayContact : !displayContact });

    }

    toggleProfile () {

        const { displayProfile } = this.state;

        this.setState({ displayProfile : !displayProfile });

    }

    getContent () {

        const { model, type, children } = this.props;

        const { displayHeader } = this.state;

        switch ( type ) {

            case 'home' : {

                return <HomePage
                    displayHeader = { true }
                    model = { model }
                    children = { children }
                    foldMouseOver = { this.state.foldMouseOver }
                    hintFold      = { () => {
                        this.setState({ foldMouseOver : true });

                        setTimeout( () => {

                            this.setState({ foldMouseOver : true });

                        }, 1000 )
                    }}
                />

            }

            case 'post' : {

                return <Post
                    model = { model }
                    foldMouseOver = { this.state.foldMouseOver }
                    displayHeader  = { displayHeader }
                    hintFold      = { () => {

                        setTimeout( () => {

                            this.setState({ foldMouseOver : true });

                        }, 250 )

                        setTimeout( () => {

                            this.setState({ foldMouseOver : false });

                        }, 500 )

                    }}
                />

            }

            case 'post-container' : {

                return <PostContainer
                    model = { model }
                    displayHeader       = { displayHeader }
                    children = { children }
                    foldMouseOver = { this.state.foldMouseOver }
                    hintFold      = { () => {
                        this.setState({ foldMouseOver : true });

                        setTimeout( () => {

                            this.setState({ foldMouseOver : false });

                        }, 1000 )
                    }}
                />

            }

            default : {

                return null;

            }

        }

    }

    render () {

        const { model, type, children }          = this.props;
        const { displayHeader, displayContact, displayProfile } = this.state;

        const content = this.getContent();

        return (

            <div
                style = {{
                    marginTop  : this.state.loaded ? 0 : -50,
                    transition : '.4s ease all'
                }}
            >
                <div
                    id    = 'loading'
                    style = {{
                        background : `-webkit-linear-gradient(left, rgba(76, 211, 173,1) 0%, rgba(76, 211, 173,0) 100%)`,
                        top        : this.state.loaded ? -2 : 0,
                        width      : `${this.state.loading % 100}%`,
                    }}
                />
                <div
                    style = {{
                        opacity    : this.state.loaded ? 1 : 0,
                        transition : '.4s ease all'
                    }}
                >
                    <Wrapper
                        style = {{
                            background : 'rgb(0, 14, 29)',
                            height     : this.state.displayPrivateWarning ? 40 : 0,
                            transition : '.25s all',
                            overflow : 'hidden'
                        }}
                        innerStyle  = {{
                            position : 'relative'
                        }}
                    >
                        <div
                            style = {{
                                height : 40,
                                lineHeight : '40px',
                                color : 'rgb(220,220,220)',
                                font : 'hind',
                                letterSpacing : 1,

                            }}
                        >
                            <i
                                className="fa fa-exclamation"
                                style = {{
                                    marginRight : 10
                                }}

                            />
                            This is a private post and will not be cached from search engines.
                        </div>
                    </Wrapper>
                    <div ref = { 'header' }>
                        <Header
                            model         = { model }
                            display       = { displayHeader }
                            toggleContact = { this.toggleContact.bind( this ) }
                            toggleHeader = { this.toggleHeader.bind( this ) }
                            type          = { type == 'home' ? 0 : 1 }
                        />
                    </div>
                    <header
                        id    = 'main-header'
                    >
                        <Fold
                            size        = { 58 }
                            direction   = { 'right' }
                            parentStyle = {{
                                cursor  : 'pointer',
                                display : displayHeader ? 'none' : '',
                                left    : 0,
                                top     : 0,
                            }}
                            topStyle = {{
                                background : 'rgb(0, 14, 29)'
                            }}
                            onClick  = { () => {
                                this.setState({ displayHeader : true })
                            }}
                            onMouseOver = { () => {
                                this.setState({ foldMouseOver : true });
                            }}
                            onMouseLeave = { () => {
                                this.setState({ foldMouseOver : false });
                            }}
                            foldMouseOver = { this.state.foldMouseOver }
                        />

                    </header>
                        {
                            content ? (
                                React.cloneElement( content, {
                                    header       : this.refs.header,
                                    toggleContact : this.toggleContact,
                                    toggleProfile : this.toggleProfile,
                                    toggleContact : this.toggleContact
                                })
                            ) : ''

                        }
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
                <Contact
                    display  = { displayContact }
                    toggle = { this.toggleContact.bind( this ) }
                />

                <Profile
                    display  = { displayProfile }
                    toggle = { this.toggleProfile.bind( this ) }
                    toggleContact = { this.toggleContact }
                />
            </div>

        )
    }



}

export default Index;
