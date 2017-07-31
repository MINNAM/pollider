import React from 'react';
import TextField from 'material-ui/TextField';

/* Pollider */
import {THEME} from '../../global.js';

const STYLES = {
    errors: [
        {
            color: THEME.primaryColor
        },
        {
            color: 'rgb(244, 67, 54)'
        }
    ]
};

class _TextField extends React.Component {

    constructor ( props ) {
        super( props );
    }

    render () {
        const {
            model,
            defaultValue,
            hintText,
            onChange,
            type = 'text',
            label,
            errorText,
            autoFocus
        } = this.props;

        return (
            <TextField
                autoComplete = 'new-password'
                autoFocus = {autoFocus}
                type = {type}
                style = {{
                    width: '100%',
                }}
                floatingLabelStyle = {{
                    color: 'rgb(60,60,60)',
                    fontSize: 20,
                    fontWeight: 400
                }}
                floatingLabelText = {label}
                floatingLabelFixed = {true}
                defaultValue = {defaultValue}
                hintText = {hintText}
                errorText = {errorText}
                type = {type}
                onChange = {(event,target,value) => {
                    onChange( event,target,value);
                }}
                underlineFocusStyle = {STYLES.errors[ 0 ]}
                autoComplete={"off"}
            />
        );

    }

}

export default _TextField;
