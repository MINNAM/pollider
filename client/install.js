/* Pollider */
// import main from '../../../m-configure.js';
import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import CONFIG     from './models/m-config.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

import _Install from './models/install.js';


let navigator;

if ( !navigator ) {
    navigator = {};

    navigator.userAgent = 'all';

}

const muiTheme = getMuiTheme({

    palette: {

        primary1Color : CONFIG.theme.primaryColor,
        accent1Color  : CONFIG.theme.primaryColor,

    },
    FlatButton : {
        backgroundColor : 'red'
    },
    toolBar : {
        backgroundColor : 'white'
    },
    userAgent: navigator.userAgent


});

const StepperMenuItem = ( props ) => {

    return (

        <span
            style = {{

                lineHeight : '50px',
                marginLeft : 7.5,
                float      : 'left',
                color      : props.selected ? 'rgb(48,48,48)' : 'rgb(220,220,220)'

            }}
            onClick = { () => {

                props.onClick( props.index );

            }}
        >
            { props.label }
        </span>
    );

};

class StepperMenu extends React.Component {

    render () {

        return (

            <div
                style = {{
                    display : 'inline-block',
                    float : 'right',
                    height : '100%'
                }}
            >

                {

                    this.props.items.map( ( element, key ) => {


                        return (
                            <span key = { key }>
                                <StepperMenuItem
                                    index = { key }
                                    label = { element  }
                                    selected = {key == this.props.index  }
                                />
                                {
                                    key % 1 == 0 && key != this.props.items.length - 1 ? <i
                                        className="material-icons"
                                        style = {{

                                            lineHeight: '50px',
                                            marginLeft: 7.5,
                                            fontSize: 13,
                                            float: 'left',
                                            color : 'rgb(220,220,220)'

                                        }}
                                    >
                                        remove
                                    </i> : ''
                                }
                            </span>
                        );

                    })

                }

            </div>

        );

    }

}

const StepperContent = ( props ) => {

    return (

        <div
            style = {{
                display : props.selected ? 'block' : 'none'
            }}
        >
            { props.children  }
        </div>

    );

};

const StepperContentContainer = ( props ) => {

    const style = Object.assign( {}, props.style );

    return (

        <div
            style = { style }
        >
            {
                props.children.map( ( element, key ) => {

                    return React.cloneElement( element, {

                        selected : key == props.selected

                    });

                })

            }
        </div>

    );

};

class _TextField extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {

        const model = this.props.model;

        return (
            <TextField
                style = {{
                    width: '100%'
                }}
                floatingLabelText = { model.label }
                floatingLabelFixed = { true }
                value = { model.value }
                errorText = { model.error }
                type = { model.type == 'password' ? 'password' : 'text' }
                onChange = { ( event, newValue ) => {

                    this.props.onChange( this.props.index, newValue );


                }}
            />
        );

    }

}

const Form = ( props ) => {

    return (

        <div>
        {
            props.model.map( ( element, key ) => {

                return (

                    <_TextField
                        model = { element }
                        key = { key }
                        index = { key }
                        onChange = { props.onChange }
                    />

                );

            })
        }
        </div>
    );

};

class Install extends React.Component {

    constructor( props ) {


        super( props );

        this.state = {

            stepperIndex : 0,
            model : new _Install(),
            userModel : [

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
                    label : 'First Name',
                    name  : 'first_name',
                    required : true
                },
                {
                    label : 'Last Name',
                    name  : 'last_name',
                    required : true
                },
                {
                    label : 'Password',
                    name  : 'password',
                    type : 'password',
                    required : true,
                },
                {
                    label : 'Re-Password',
                    name  : 're_password',
                    type : 'password',
                    required : true,
                    validate : {

                        equal : 3

                    }
                },

            ],

            databaseModel : [

                {
                    label : 'Database Host',
                    name  : 'host',
                    required : true
                },
                {
                    label : 'Database Name',
                    name  : 'name',
                    required : true
                },
                {
                    label : 'Database User',
                    name  : 'user',
                    required : true
                },
                {
                    label : 'Database Password',
                    name  : 'password',
                    required : true,
                    type : 'password'
                },
                {
                    label : 'Table Prefix',
                    name  : 'table_prefix',
                },
            ]

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
                            minHeight : 500,
                            transform: 'translate(-50%, -50%)',
                            padding: '15px 15px 50px 15px',
                            background: 'white',
                            boxShadow : 'rgba(50, 50, 50, 0.1) 1px 1px 10px'

                        }}
                    >
                            <div>
                                <div
                                    style = {{
                                        height : 45,
                                        width : '100%',
                                        marginBottom : 15
                                    }}
                                >
                                    <img
                                        id = 'logo'
                                        src = { CONFIG.backendUrl + '/images/logo.svg' }
                                        style = {{
                                            height : '100%',
                                            display: 'inline-block',
                                            float: 'left'
                                        }}
                                    />

                                    <StepperMenu
                                        index = { this.state.stepperIndex }
                                        items = {[
                                            'Welcome',
                                            'Database',
                                            'User',
                                            'Install'
                                        ]}
                                    />

                                </div>
                                <StepperContentContainer
                                    selected = { this.state.stepperIndex }
                                    children = {[

                                        <StepperContent>
                                            <span
                                                style = {{
                                                    fontSize : 30,
                                                    width : '100%',
                                                    textAlign : 'center',
                                                    display : 'inline-block',
                                                    letterSpacing: 3,
                                                    fontWeight: 300,
                                                    padding: '70px 0 20px 0',
                                                    textTransform : 'uppercase'
                                                }}>Welcome to Pollider</span>
                                                <p
                                                    style = {{
                                                        letterSpacing : .5,
                                                        fontSize: 12,
                                                        marginTop : 30,
                                                        marginBottom : 30,
                                                        paddingRight : 30,
                                                        paddingLeft : 30
                                                    }}
                                                >
                                                    Before proceeding to install Pollider, make sure to install
                                                    MYSQL 5.7 and create a database and a root user of the name of you choice.
                                                </p>
                                                <span
                                                    style = {{
                                                        margin : '80px auto',
                                                        display: 'block',
                                                        width: 150,
                                                        textAlign: 'center',
                                                        fontSize : 15
                                                    }}
                                                    onTouchTap = { () => {
                                                        this.setState({
                                                            stepperIndex: 1
                                                        });
                                                    }}
                                                >
                                                        EXPLORE POLLIDER
                                                </span>

                                        </StepperContent>,
                                        <StepperContent>

                                                <Form
                                                    onChange = { ( index, value) => {

                                                        const databaseModel = this.state.databaseModel.slice();



                                                        databaseModel[ index ].value = value;
                                                        databaseModel[ index ].error = null;


                                                        this.setState({

                                                            databaseModel

                                                        });

                                                    }}
                                                    model = { this.state.databaseModel }
                                                    underlineFocusStyle = {{
                                                        color : CONFIG.theme.primaryColor
                                                    }}
                                                />
                                        </StepperContent>,
                                        <StepperContent>
                                            <Form
                                                onChange = { ( index, value) => {

                                                    const userModel = this.state.userModel.slice();



                                                    userModel[ index ].value = value;
                                                    userModel[ index ].error = null;


                                                    this.setState({

                                                        userModel

                                                    });

                                                }}
                                                model = { this.state.userModel }
                                            />

                                        </StepperContent>,
                                        <StepperContent>
                                            <span style = {{ width: '100%', display: 'inline-block', fontSize : 12, fontWeight: 600, height: 28, marginTop : 10 }}>Database</span>
                                            {
                                                this.state.databaseModel.map( ( element, key ) => {

                                                    if ( element.name != 'password' && element.name != 're_password' ) {

                                                        return (
                                                            <div
                                                                key = { key }
                                                                style = {{
                                                                    height: 34,
                                                                    lineHeight : '28px'
                                                                }}
                                                            >
                                                                <span style = {{ width: '35%', display: 'inline-block',  fontSize : 14, color: 'rgb(160, 160, 160)' }}>{ element.label }</span>
                                                                <span style = {{ width: '65%', display: 'inline-block', fontSize : 14 }}>{ element.value ? element.value : 'N/A'}</span>
                                                            </div>
                                                        );

                                                    }


                                                })

                                            }
                                            <span style = {{ width: '100%', display: 'inline-block', fontSize : 12, fontWeight: 600, height: 28, marginTop: 10 }}>User</span>
                                            {
                                                this.state.userModel.map( ( element, key ) => {

                                                    if ( element.name != 'password' && element.name != 're_password' ) {

                                                        return (
                                                            <div
                                                                key = { key }
                                                                style = {{
                                                                    height: 34,
                                                                    lineHeight : '28px'
                                                                }}
                                                            >
                                                                <span style = {{ width: '35%', display: 'inline-block',  fontSize : 14, color: 'rgb(160, 160, 160)' }}>{ element.label }</span>
                                                                <span style = {{ width: '65%', display: 'inline-block', fontSize : 14 }}>{ element.value ? element.value : 'N/A'}</span>
                                                            </div>
                                                        );

                                                    }


                                                })

                                            }

                                        </StepperContent>

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
                                        </StepperContent>,
                                        <StepperContent>
                                            <FlatButton
                                                style = {{
                                                    float : 'left'
                                                }}
                                                label = "Back"
                                                onTouchTap = { () => {
                                                    this.setState({
                                                        stepperIndex: 0
                                                    });
                                                }}
                                            />
                                            <FlatButton
                                                style = {{

                                                    float     : 'right'
                                                }}
                                                label = "Next"
                                                onTouchTap = { () => {

                                                    if ( !this.processModel( 'databaseModel' ) ) {

                                                        this.setState({
                                                            stepperIndex: 2
                                                        });

                                                    }

                                                }}
                                            />
                                        </StepperContent>,
                                        <StepperContent>
                                            <FlatButton
                                                style = {{

                                                    float     : 'left'
                                                }}
                                                label = "Back"
                                                onTouchTap = { () => {
                                                    this.setState({
                                                        stepperIndex: 1
                                                    });
                                                }}
                                            />
                                            <FlatButton
                                                style = {{

                                                    float     : 'right'
                                                }}
                                                label = "Next"
                                                onTouchTap = { () => {

                                                    if ( !this.processModel( 'userModel' ) ) {

                                                        this.setState({

                                                            stepperIndex: 3

                                                        });

                                                    }

                                                }}
                                            />
                                        </StepperContent>,
                                        <StepperContent>
                                            <FlatButton
                                                style = {{

                                                    float : 'left'
                                                }}
                                                label = "Back"
                                                onTouchTap = { () => {
                                                    this.setState({
                                                        stepperIndex: 2
                                                    });
                                                }}
                                            />
                                            <FlatButton
                                                style = {{
                                                    float : 'right'
                                                }}
                                                label = "Install"
                                                onTouchTap = { () => {

                                                    this.state.model.execute({
                                                        user : this.state.userModel,
                                                        database : this.state.databaseModel
                                                    });

                                                }}
                                            />
                                        </StepperContent>

                                    ]}
                                />
                            </div>
                    </div>
                </MuiThemeProvider>
            </div>

        );

    }

}

export default Install;
