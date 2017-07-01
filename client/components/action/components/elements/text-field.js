import React      from 'react';
import _TextField from 'material-ui/TextField';

class TextField extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {

        return (

            <_TextField
                style        = {{ width : '100%' }}
                hintText     = { this.props.hintText }
                onChange     = { this.props.onChange }
                defaultValue = { this.props.default }
                autoFocus
            />

        );

    }

}

export default TextField;
