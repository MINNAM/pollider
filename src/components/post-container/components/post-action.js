import { React, Action, DebounceField, TextField, DatePicker, TimePicker } from '../../action/components/action.js';


/*
* PostAction is a class that is responsible for populating requested dialog.
* Input creation/validation is done here.
*/
class PostAction extends Action {

    constructor ( props ) {

        super( props );

        this.render  = super.render;
        this.display = super.display;

        this.components = {

            'debounce-text' : ( data, key ) => {
                return (
                    <div key = { key }>
                        { this.setTitle( data ) }
                        <DebounceField
                            model       = { data.model }
                            parentModel = { data.parentModel }
                            selected    = { data.option == 'PARENT_NULL' ? null : this.props.selected }
                            setError    = { this.setError.bind( this ) }
                            hintText    = { "Type " + data.field }
                            onChange    = { ( event, target, value ) => { this.onTextChange( event, target, value, data ); } }
                        />
                    </div>

                );
            },



            'text' : ( data, key ) => {

                console.log (data );

                return (
                    <div key = { key }>
                        { this.setTitle( data ) }
                        <TextField
                            style    = {{ width : '100%' }}
                            hintText = { "Type " + data.field }
                            onChange = { ( event, target, value ) => { this.onTextChange( event, target, value, data ); } }
                            setError = { this.setError.bind( this ) }
                            default  = { data.default }
                        />
                    </div>

                );

            },

            'date' : ( data, key ) => {

                return (

                    <div key = { key }>
                        { this.setTitle( data ) }
                        <DatePicker
                            autoOk   = { true }
                            hintText = { "Type " + data.field }
                            field    = { data.field }
                            values   = { this.state.values }
                            setError  = { this.setError.bind( this ) }
                            setValues = {

                                ( values ) => {

                                    this.setState({ values });

                                }

                            }
                         />
                    </div>
                );
            }
        };

    }

}

export default PostAction;
