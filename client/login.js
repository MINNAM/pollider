/* Pollider */
// import main from '../../../m-configure.js';
import React from 'react';


import FlatButton from 'material-ui/FlatButton';

import CONFIG     from './models/m-config.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

import { StepperContent, StepperContentContainer, StepperMenu, StepperMenuItem } from './components/ui/components/stepper.js';

import Form from './components/ui/components/form.js';

import User from './models/user.js';


let navigator;

if ( !navigator ) {

    navigator = {};

    navigator.userAgent = 'all';

}

const muiTheme = {

    palette: {

        primary1Color : CONFIG.theme.primaryColor,
        accent1Color  : CONFIG.theme.primaryColor,

    },

    userAgent: navigator.userAgent

};


class Login extends React.Component {

    constructor( props ) {


        super( props );

        this.state = {

            stepperIndex : 0,
            model : new User(),
            loginModel : [

                {
                    label : 'Email',
                    name  : 'email',
                    type  : 'email',
                    required : true,
                    validate : {

                        email : true

                    }
                },
                {
                    label : 'Password',
                    name  : 'password',
                    type : 'password',
                    required : true,
                }

            ],



        };

    }

    validateEmail ( email ) {

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test( email );

    }

    processModel ( modelName ) {

        const model = this.state[ modelName ];
        let error;

        model.map( ( element, key ) => {

            if ( element.required ) {

                if ( !element.value ) {

                    element.error = element.label + ' cannot be empty';
                    error = true;

                } else {

                    element.error = null;

                }

            }

            if ( element.validate ) {

                if ( element.validate.equal != undefined ) {

                    if ( model[ element.validate.equal ].value != element.value  ) {

                        element.error = element.label + ' is not equal to ' + model[ element.validate.equal ].label;
                        error = true;

                    } else {

                        element.error = null;

                    }

                }

                if ( element.validate.email ) {

                    if ( !this.validateEmail( element.value ) ) {

                        element.error = 'Email format is not correct';
                        error = true;

                    } else {

                        element.error = null;

                    }

                }

            }


        });

        const object = {};

        object[ name ] = model;


        this.setState( object );

        return error;

    }

    processLogin ( response ) {

        if ( response ) {

            window.location.href = CONFIG.siteUrl + 'admin';

        } else {

            this.setState({ loginError : 'Invalid Login Attempt' });

        }


    }

    render () {

        return (
            <div>
                <MuiThemeProvider muiTheme = { getMuiTheme( muiTheme ) }>
                    <div
                        style = {{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width : 500,
                            minHeight : 325,
                            transform: 'translate(-50%, -50%)',
                            padding: '15px 15px 50px 15px',

                        }}
                    >
                            <img
                                id = 'logo'
                                src = { CONFIG.backendUrl + '/images/logo.svg' }
                                style = {{
                                    height : 45,
                                    display: 'inline-block',
                                    float: 'left',
                                    marginBottom : 20
                                }}
                            />
                            <div
                                style = {{
                                    height : 45,
                                    width : '100%',
                                    marginBottom : 20,
                                    background: 'white',
                                }}
                            >

                                <div>


                                    <StepperMenu
                                        index = { this.state.stepperIndex }
                                        items = {[
                                            '',
                                        ]}
                                    />

                                </div>
                                <StepperContentContainer
                                    selected = { this.state.stepperIndex }
                                    children = {[
                                        <StepperContent>
                                            <Form
                                                onChange = { ( index, value) => {

                                                    const loginModel = this.state.loginModel.slice();

                                                    loginModel[ index ].value = value;
                                                    loginModel[ index ].error = null;

                                                    this.setState({ loginModel });

                                                }}
                                                model = { this.state.loginModel }
                                                underlineFocusStyle = {{
                                                    color : CONFIG.theme.primaryColor
                                                }}
                                            />

                                        </StepperContent>,

                                    ]}
                                />

                                <StepperContentContainer
                                    style = {{
                                        position : 'absolute',
                                        bottom : 10,
                                        width: '100%',
                                        height: 50,
                                        left : 0,
                                        padding : 15
                                    }}
                                    selected = { this.state.stepperIndex }
                                    children = {[

                                        <StepperContent>
                                            <div style = {{
                                                fontSize: 12,
                                                lineHeight: '37px',
                                                color: 'rgb(244, 67, 54)',
                                                float: 'left'
                                            }}>
                                                { this.state.loginError }
                                            </div>

                                            <FlatButton
                                                style = {{

                                                    float     : 'right',

                                                }}
                                                label = "Login"
                                                onTouchTap = { () => {

                                                    if ( !this.processModel( 'loginModel' ) ) {

                                                        this.state.model.login({

                                                            loginData : this.state.loginModel,

                                                        }, this.processLogin.bind( this ) );
                                                    }

                                                }}
                                            />
                                        </StepperContent>,

                                    ]}
                                />
                            </div>
                    </div>
                </MuiThemeProvider>
            </div>

        );

    }

}

export default Login;
