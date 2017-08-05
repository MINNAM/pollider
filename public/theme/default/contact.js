import React from 'react';
import CloseButton from './components/ui/buttons/close-button.js';
import Input from './components/input.js';
import $ from 'jquery';
import {SITE} from '../../../client/global.js';

const NOT_NULL = 0;
const EMAIL    = 1;

const INPUT_FIELDS = [
    {
        label    : 'First Name',
        id       : 'first_name',
        type     : 'input',
        required : 1
    },
    {
        label    : 'Last Name',
        id       : 'last_name',
        type     : 'input',
        required : 1
    },
    {
        label    : 'Email',
        id       : 'email',
        type     : 'input',
        required : 1,
        check    : [ EMAIL ]
    },
    {
        label    : 'Message',
        id       : 'message',
        type     : 'input-multiline',
        required : 1
    },
]

class Contact extends React.Component {


    constructor (props) {
        super(props);

        const state = { sending: false, sent : false, data : [] };

        INPUT_FIELDS.map(( element, key  ) => {

            state.data[ key ] = { ...element, key, value : null};

        });

        this.state = state;

    }

    componentDidMount () {

        document.body.addEventListener('keydown', (event) => {

            if (event.keyCode == 13 && this.props.toggled ) {

                this.submit();

            }

        });

    }

    submit () {
        const _data =  [...this.state.data];

        _data.map(( element ) => {

            if ( element.required ) {

                if ( element.value == null ) {

                    element.error = true;

                } else {

                    element.error = false;

                }

            }

            if ( element.check ) {

                for ( let i = 0; i < element.check.length; i++ ) {

                    if ( element.error ) {

                        break;

                    } else {

                        const check = element.check[ i ];

                        switch ( check ) {

                            case EMAIL : {

                                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( element.value )) {

                                    element.error = false;

                                } else {

                                    element.error = true;
                                }


                                break;

                            }

                        }

                    }

                }

            }

        })

        this.setState({

            data : _data
        });

        let errors = 0;

        this.state.data.map(( element ) => {

            if ( element.error ) {

                errors++;

            }

        })

        if ( errors == 0 ) {

            this.setState({
                sending : true
            });

            $.ajax({

                url         : '/contact',
                type        : "POST",
                data        : JSON.stringify( this.state.data ),
                contentType : "application/json; charset=utf-8",
                dataType    : "json",
                success     : ( response ) => {

                    this.setState({
                        sending : false,
                        sent : true
                    });

                }

            });

        }
    }

    render () {
        const {
            display,
            toggle,
            toggled,
            style
        } = this.props;
        const {
            data
        } = this.state;

        return (

            <div
                style = {{
                    height: '100%',
                    background: 'white',
                    ...style
                }}
            >

                <div
                    className = 'toggle-close-button'
                >
                    <CloseButton
                        color = 'rgba(244,67,54,0.5)'
                        style = {{
                            position: 'relative',
                            left: 0,
                            top: 0,
                        }}
                        hoverStyle  = {{stroke : 'rgba(244,67,54,1)'}}
                        size    = { 17 }
                        onClick = {() => {
                            toggle(null);

                            const _data =  [...this.state.data];

                            _data.map((element) => {
                                element.error = false;
                            })

                            this.setState({data: _data});
                        }}
                    />
                </div>
                <div
                    className = 'toggle-content'
                >
                    <h1
                        ref = 'title'
                        style = {{
                            fontFamily: 'hind',
                            letterSpacing: '1.2px',
                            fontSize: 44,
                            color: 'rgb(40,40,40)',
                            marginBottom: 50,
                            marginTop: 5,
                            display: 'inline-block'
                        }}
                    >
                        Say Hello!
                    </h1>
                    <div>
                        {
                            this.state.data.map( ( element, key ) => {

                                switch( element.type ) {

                                    case 'input' : {
                                        return (
                                            <Input
                                                key   = { key }
                                                label = { element.label }
                                                value = { element.value }
                                                error = { element.error }
                                                disabled = { this.state.sent }
                                                required = { element.required }
                                                onChange = {( value ) => {
                                                    const _data = [ ...data ];

                                                    _data[ key ].value = value;
                                                    _data[ key ].error = false;

                                                    this.setState({ _data : data });

                                                }}
                                            />
                                        );
                                        break;
                                    }

                                    case 'input-multiline' : {
                                        return (

                                                <Input
                                                    key   = { key }
                                                    label = { element.label }
                                                    value = { element.value }
                                                    disabled = { this.state.sent || this.state.sending }
                                                    multiline = { true }
                                                    error = { element.error }
                                                    required = { element.required }
                                                    onChange = {( value ) => {
                                                        const _data = [ ...data ];

                                                        _data[ key ].value = value;
                                                        _data[ key ].error = false;

                                                        this.setState({ _data : data });

                                                    }}
                                                    max     = { 500 }
                                                />

                                        );
                                        break;
                                    }

                                }

                            })

                        }

                        <button
                            disabled = { this.state.sent }
                            style = {{
                                background : `rgba(76, 211, 173,${this.state.submitMouseEnter ? 1 : 0.9  })`,
                                border : 'none',
                                color : 'white',
                                float : 'right',
                                fontWeight : 500,
                                height : 40,
                                letterSpacing : '1px',
                                lineHeight : '40px',
                                outline : 'none',
                                width : '100%',
                                marginTop: 20,
                                transition : '.25s all'
                            }}

                            onMouseEnter = { () => {
                                this.setState({
                                    submitMouseEnter : true
                                })
                            }}

                            onMouseLeave = { () => {
                                this.setState({
                                    submitMouseEnter : false
                                })
                            }}
                            onClick = {() => {
                                if (!this.state.sending) {
                                    this.submit();
                                }
                            }}
                        >
                            { this.state.sending ?

                                <svg
                                    width  = {60}
                                    height  = {35}
                                    className = {'loading-element'}
                                    style = {{
                                        marginTop: 8
                                    }}
                                >
                                    <circle
                                        cx = {7.5}
                                        r  = {3}
                                        fill = {'white'}

                                    />
                                    <circle
                                        cx = {22.5}
                                        r  = {3}
                                        fill = {'white'}
                                    />
                                    <circle
                                        cx = {37.5}
                                        r  = {3}
                                        fill = {'white'}
                                    />
                                    <circle
                                        cx = {52.5}
                                        r  = {3}
                                        fill = {'white'}
                                    />
                                </svg> :
                                this.state.sent ? 'Message Sent!' : 'Send'

                            }
                        </button>
                    </div>
                </div>
            </div>

        )
    }



}

export default Contact;
