import React from 'react';
import TextField from './text-field.js';

const Form = ( props ) => {

    return (

        <div>
        {
            props.model.map( ( element, key ) => {

                return (

                    <TextField
                        model = { element }
                        key = { key }
                        index = { key }
                        onChange = { props.onChange }
                        underlineFocusStyle =  { props.underlineFocusStyle }
                    />

                );

            })
        }
        </div>
    );

};

export default Form;
