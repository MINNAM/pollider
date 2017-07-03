import React from 'react';

import Wrapper           from './wrapper';
import Thumbnail         from './thumbnail.js';
import Directory         from './directory.js';
import Heading           from './components/heading.js';
import FontAwesomeButton from './components/ui/buttons/font-awesome-button.js';

import { ProjectPreview } from '../../../client/components/project-editor/components/project-preview';

import Post    from '../../../client/components/post-container/models/post';
import Project from '../../../client/components/project-editor/model/project';

import LiterallyClock from './components/literally-clock/components/literally-clock.js';


class Body extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = { scrollY : 0, navTop : 300 };

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

        const date = model.modified_date ? new Date( model.modified_date ) : new Date( model.created_date );

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
            >
                <Wrapper
                    onResize = { ( scrollRight ) => {

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

                                        this.props.toggleProfile();

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

                        <div
                            id = 'post-header'
                            style = {{
                                paddingBottom : displayPostInfo ? 5 : 0
                            }}
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
                            <div
                                style = {{
                                    display : displayPostInfo ? 'inline' : 'none'
                                }}
                            >

                                <Heading
                                    textColor = { 'rgb(120,120,120)' }
                                    fontSize = { 18 }
                                    content = {
                                        model.data ?
                                            (
                                                model.data[ 'Description' ] ?
                                                    <span>
                                                        <i
                                                            className="fa fa-lock"
                                                            style = {{
                                                                color:'rgb(100,100,100)',
                                                                marginRight : 10,
                                                                fontSize : 14,
                                                                display : model.status != 'public' ? 'inline' : 'none'
                                                            }}
                                                        />
                                                        { model.data[ 'Description' ].content }
                                                    </span>
                                                : ''
                                            )
                                        :
                                            <i className="fa fa-lock" style = {{color:'rgb(120,120,120)', marginRight : 10, fontSize : 14, display : model.status != 'public' ? 'inline' : 'none' }}/>
                                        }
                                />

                                <h1 style = {{
                                    fontFamily : 'hind',
                                    letterSpacing : 1.2,
                                    fontSize : 45,
                                    color : 'rgb(40,40,40)',
                                    marginTop : 14,
                                    marginBottom: 12
                                }}>{ model ? model.name : '' }</h1>
                                <Heading
                                    fontSize = { 13 }
                                    textColor = { 'rgb(60,60,60)' }
                                    bold      = { true }
                                    content = {
                                        <span>
                                            {'by '}
                                            <a>{`${model.first_name} ${model.last_name}`}</a>
                                            <span style = {{ marginRight : 3 }}>{`, Jan 28 2012 ${date.getHours() >= 12 ? 'PM' : 'AM' }` }</span>
                                        </span>
                                    }
                                />
                            </div>
                        </div>

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
            </div>
        )

    }

}

export default Body;
