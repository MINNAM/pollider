import React, {Component, Proptypes} from 'react';
/* Material UI */
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
/* Pollider */
import {
    SITE,
    THEME
} from '../../global.js';
import User from '../models/user.js';
import LoginDialog from './login-dialog.js';

console.log( 'login', THEME );

let navigator;

if (!navigator) {
    navigator = {};
    navigator.userAgent = 'all';
}

const muiTheme = {
    palette: {
        primary1Color: THEME.primaryColor,
        accent1Color: THEME.primaryColor,
    },
    userAgent: navigator.userAgent
};

const STYLES = {
    container: {
        left: '50%',
        minHeight: 325,
        padding: '15px 15px 50px 15px',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
    },
};

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            stepperIndex: 0,
            model: new User(),
        };
    }

    componentDidMount () {

        const fields = [
            {
                dataType: 'logo',
            },
            {
                dataType: 'text',
                label: 'Username',
                field: 'username',
                validate: (value) => {
                    if (!value || value == '') {
                        return 'Username cannot be empty.';
                    }
                    return false;
                }
            },
            {
                dataType: 'password',
                label: 'Password',
                field: 'password',
                validate: (value) => {
                    if (!value || value == '') {
                        return 'Password cannot be empty';
                    }
                    return false;
                }
            }
        ];

        this.dialogType = {
            options: {
                submit: {
                    label: 'Login'
                },
                cancel: {
                    label: 'Cancel',
                    hidden: true
                }
            },
            fields: [
                ...fields,
                {
                    dataType: 'login',
                },
            ],
            actions: {
                execute: (data) => {
                    this.state.model.login(data, (approved) => {
                        if (approved) {
                            this.processLogin();
                        } else {
                            this.openDialog({
                                ...this.dialogType,
                                fields: [
                                    ...fields,
                                    {
                                        dataType: 'login',
                                        default: 'Username or Password does not match.'
                                    },
                                ]
                            });
                        }
                    });
                }
            },
            style: {
                content: {
                    width: 500,
                }
            }
        };

        this.openDialog(this.dialogType);
    }

    processLogin () {
        window.location.href = SITE.url + '/admin';
    }

    openDialog (data) {
        const dialogModel = {
            actions: data.actions,
            fields: data.fields,
            style: data.style,
            options: data.options
        };

        this.setState({
            isDialogOpen: true,
            dialogModel
        });
    }

    render () {
        return (
            <MuiThemeProvider muiTheme = {getMuiTheme(muiTheme)}>
                <div>
                <input name = "email" className = "hide"/>
                <input name = "password" className = "hide"/>
                <LoginDialog
                    model = {this.state.dialogModel}
                    isOpen = {this.state.isDialogOpen ? true : false}
                />
                </div>
            </MuiThemeProvider>
        );
    }

}

export default Login;
