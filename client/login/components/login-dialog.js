import React from 'react';
/* Pollider */
import {
    SITE,
    THEME
} from '../../global.js';
import {Dialog,DialogHelper} from '../../dialog/';
import {
    DebounceField,
    TextEditor,
    DatePicker,
    ToggleIcon,
    Seperator,
    TextField
} from '../../ui-components/';

const STYLES = {
    logo: {
        display: 'inline-block',
        float: 'left',
        height: 45,
        marginBottom: 20
    }
};

class LoginDialog extends DialogHelper {

    constructor (props) {
        super(props);

        this.state = {
            ...this.state,
            displayPostInfo: true
        }

        this.onRequestClose = null;

        this.components = {
            'text': (data, key) => {
                return (
                    <div key = {key}>
                        {this.setTitle(data)}
                        <TextField
                            defaultValue = {data.default}
                            label = {data.label}
                            onChange = {(event, target, value) => {
                                this.onTextChange(event, target, value, data);
                            }}
                            errorText = {(this.state.error[data.field] ? this.state.error[data.field] : '')}
                            style = {{
                                width: '100%'
                            }}
                        />
                    </div>
               );
            },
            'password': (data, key) => {

                return (
                    <div key = {key}>
                        {this.setTitle(data)}
                        <TextField
                            type = 'password'
                            defaultValue = {data.default}
                            label = {data.label}
                            onChange = {(event, target, value) => {
                                this.onTextChange(event, target, value, data);
                            }}
                            errorText = {(this.state.error[data.field] ? this.state.error[data.field] : '')}
                            style = {{
                                width: '100%'
                            }}
                        />
                    </div>
                );
            },
            'logo': (data, key) => {
                return (
                    <div key = {key}>
                        <img
                            id = 'logo'
                            src = {'/images/logo.svg'}
                            style = {{
                                display: 'inline-block',
                                float: 'left',
                                height: 45,
                                marginBottom: 20
                            }}
                        />
                    </div>
               );
            },
            'login': (data, key) => {
                return (
                    <div
                        key = {key}
                        style = {{
                            marginTop: 20,
                            fontSize: 12,
                            lineHeight: '12px',
                            color: 'rgb(244, 67, 54)'
                        }}
                    >
                        {data.default}
                    </div>
               );
            },
       };
    }
}

export default LoginDialog
