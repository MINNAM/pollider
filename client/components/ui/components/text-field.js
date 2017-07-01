import React from 'react';
import TextField from 'material-ui/TextField';

class _TextField extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {

        const model = this.props.model;

        console.log( this.props.underlineFocusStyle );

        return (
            <TextField
                style = {{ width: '100%' }}
                floatingLabelText = { model.label }
                floatingLabelFixed = { true }
                value = { model.value }
                errorText = { model.error }
                type = { model.type == 'password' ? 'password' : 'text' }
                onChange = { ( event, newValue ) => {

                    this.props.onChange( this.props.index, newValue );

                }}
                underlineFocusStyle = { this.props.underlineFocusStyle }
                autoComplete={"off"}
            />
        );

    }

}

export default _TextField;
