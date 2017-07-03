import React from 'react';
import CloseButton from './components/ui/buttons/close-button.js';
import Input from './components/input.js';

const NOT_NULL = 0;
const EMAIL    = 1;

const INPUT_FIELDS = [
    {
        label    : 'First Name',
        id       : 'first-name',
        type     : 'input',
        required : 1
    },
    {
        label    : 'Last Name',
        id       : 'last-name',
        type     : 'input',
        required : 1
    },
    {
        label    : 'Company',
        id       : 'company',
        type     : 'input',
        required : 0
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


    constructor ( props ) {

        super( props );

        const state = { sending: false, sent : false, data : [] };

        INPUT_FIELDS.map(( element, key  ) => {

            state.data[ key ] = { ...element, key, value : null};

        });

        this.state = state;

    }

    send ( done ) {

        this.setState({
            sending : true
        });

        setTimeout( () => {

            this.setState({
                sending : false,
                sent : true
            });

        }, 5000 );


    }

    render () {
        const { display, toggle } = this.props;
        const { data } = this.state;

        return (

            <div
                style = {{
                    background : 'rgba(0,0,0,0.2)',
                    display    : display ? 'inline-block' : 'none',
                    height     : '100%',
                    left       : 0,
                    position   : 'fixed',
                    top        : 0,
                    width      : '100%',
                    zIndex     : 31,
                }}

                onClick = {(  event )=>{
                    toggle();
                }}
            >
                <div
                    style = {{
                        boxShadow     : '1px 1px 1px 1px rgba(0,0,0,0.1)',
                        left          : '50%',
                        position      : 'absolute',
                        top           : '50%',
                        transform     : 'translate(-50%,-50%)',
                        width         : 500 ,
                    }}
                    onClick = {(  event )=>{

                        event.stopPropagation();

                    }}
                >
                    <CloseButton
                        color   = 'rgb(220,220,220)'
                        hoverStyle  = {{ stroke : 'rgb(160,160,160)' }}
                        size    = { 17 }
                        onClick = { toggle }
                    />
                    <div
                        style = {{
                            background : 'white',
                            padding    : '50px 15px 50px 15px',
                        }}
                    >
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
                                position : 'absolute',
                                bottom : 0,
                                left : 0,
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

                                        error++;

                                    }

                                })

                                if ( errors == 0 ) {

                                    this.send( () => {

                                        toggle();

                                    });

                                }

                            }}
                        >
                            { this.state.sending ?

                                <svg
                                    width  = {60}
                                    height  = {35}
                                    className = {'loading-element'}
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
