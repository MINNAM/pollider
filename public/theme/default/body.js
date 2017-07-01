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

const Calendar = ( props ) => {

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const { month, day, year } = props;


    return (
        <div>
            <span style = {{ fontSize : 12, display : 'block', textAlign : 'center', textTransform : 'uppercase'}}>{ months[ month ]}</span>
            <span style = {{ fontSize : 24, display : 'block', textAlign : 'center', marginTop : -5.5 }}>{ day }</span>
            <span style = {{ fontSize : 12, display : 'block', textAlign : 'center', marginTop : -1.5 }}>{ year }</span>
        </div>
    );

}


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

    componentDidMount () {

        this.setState({

            navTop : 0,
            initialNavTop : this.refs[ 'children-container' ].getBoundingClientRect().top - 2

        });



    }

    render () {

        const { model, children, displayPostInfo } = this.props;

        const date = model.modified_date ? new Date( model.modified_date ) : new Date( model.created_date );

        let scrollTopStyle = {  opacity : 0, marginTop : 12.5, color : 'rgb(156, 156, 156)' };

        if ( this.state.scrollY > 10 ) {

            scrollTopStyle = {  opacity : 1, marginTop: 0 , color : 'rgb(156, 156, 156)' };

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
                                position : typeof( window ) !== 'undefined' ? (!this.props.displayHeader ? 'fixed' : ( this.state.scrollY < (window.outerHeight + ((screen.availHeight - (screen.availHeight-window.outerHeight)) - window.innerHeight) ) /4  ? 'absolute' : 'fixed' )) : '',
                                marginRight : typeof( window ) !== 'undefined' ? (!this.props.displayHeader ? this.state.scrollRight : ( this.state.scrollY < (window.outerHeight + ((screen.availHeight - (screen.availHeight-window.outerHeight)) - window.innerHeight) ) / 4  ? 0 : this.state.scrollRight )) : '',
                                top : '50%',
                                transform : 'translate(0,-50%)',
                                zIndex    : 20
                            }}
                        >
                            <div
                                style = {{
                                    marginRight : 20
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
                                        float        : 'right'
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
                                        float        : 'right'
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
                                        float        : 'right'
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
                                            <span style = {{ marginRight : 3 }}>{`, Jan 28 2012`}</span>
                                            <LiterallyClock
                                                hour = { date.getHours() }
                                                minute = { date.getMinutes() }
                                                second = { date.getSeconds() }
                                                size = {17}
                                                colors = {{
                                                    second : 'rgb(76, 211, 173)'
                                                }}
                                                style = {{ marginTop : 4, float : 'right' }}
                                            />
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
