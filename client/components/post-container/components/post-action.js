import { React, Action, DebounceField, TextField, DatePicker, TimePicker } from '../../action/components/action.js';

import PostContainer  from './post-container.js';
import MenuItem       from 'material-ui/MenuItem';
import SelectField    from 'material-ui/SelectField';
import ToggleIcon from '../../ui/components/toggle-icon.js';
import Seperator      from '../../ui/components/seperator.js';

/*
* PostAction is a class that is responsible for populating requested dialog.
* Input creation/validation is done here.
*/
class PostAction extends Action {

    constructor ( props ) {

        super( props );

        this.state = {
            ...this.state,
            displayPostInfo : true
        }

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
            },

            'post-container' : ( data, key ) => {

                const postContainers = [];
                const postSelector   = [];

                let postIndex = 0;
                let selectedPostType;

                for( let key in data.postTypes ) {

                    const element = data.postTypes[ key ];

                    if ( postIndex++ == 0 ) {

                        selectedPostType = data.post_type_id ? data.post_type_id : element.id;

                    }

                    postContainers[ element.id ] =  <PostContainer
                            key                    = { key }
                            hyperlink              = { element.hyperlink }
                            name                   = { element.name }
                            model                  = { element.post_container }
                            allowMultiple          = { false }
                            width                  = {{ container : 7, info : 5 }}
                            postDataTypes          = {{}}
                            selected               = { data.selected }
                            postTypes              = { data.postTypes }
                            postType               = { element }
                            onExternalActionUpdate = { this.props.actions.update }
                            onExternalActionChange = {

                                ( values ) => {

                                    this.setState({

                                        error : false,
                                        values : values,
                                        //selectedPostType : null

                                    });

                                }
                            }
                            displayPostInfo = { this.state.displayPostInfo }
                            onUpdate        = {

                                ( date, message, status ) => {

                                    this.triggerStatusBar( date, message, status );

                                }

                            }
                        />



                    postSelector.push( <MenuItem key = { key } value = { element.id } primaryText = { element.name } /> );

                };

                return (

                    <div
                        key = { key }
                        style = {{
                            height : 500,
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style = {{
                                height : 47,
                                padding : '0',
                                borderBottom : '1px solid rgb(240, 240, 240)'
                            }}
                        >
                            <SelectField
                                style          = {{  width: '200' }}
                                labelStyle     = {{ fontSize : '1.8vh' }}
                                underlineStyle = {{ borderBottom: 'none' }}
                                value          = { this.state.selectedPostType ? this.state.selectedPostType : selectedPostType }
                                onChange       = { ( event, target, value ) => {

                                    this.setState({ selectedPostType : value });

                                }}

                            >
                                { postSelector }
                            </SelectField>
                            <ToggleIcon
                                value = { this.state.displayPostInfo }
                                style = {{

                                    float       : 'right',
                                    fontWeight  : 'semi-bold',
                                    marginTop   : 6,
                                    marginRight : 5

                                }}
                                onChange = {
                                    () => {

                                        this.setState({
                                            displayPostInfo : !this.state.displayPostInfo
                                        });
                                    }
                                }
                                label = { 'Info' }
                                on  = { 'info' }
                                off = { 'info_outline' }
                            />                            
                        </div>
                        {postContainers[ this.state.selectedPostType ? this.state.selectedPostType : selectedPostType  ]}
                    </div>

                );

            }

        };

    }

}

export default PostAction;
