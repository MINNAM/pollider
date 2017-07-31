import React from 'react';
/* Material UI */
import PostContainer from './post-container.js';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
/* Pollider */
import {DialogHelper} from '../../dialog/';
import {
    DebounceField,
    TextEditor,
    DatePicker,
    ToggleIcon,
    Seperator,
    TextField
} from '../../ui-components/';
import {THEME} from '../../global.js';

/**
* PostAction derived from 'Action' and is responsible for populating requested dialog
* Input creation/validation is done here.
*/
class PostDialog extends DialogHelper {

    constructor (props) {

        super(props);

        this.state = {
            ...this.state,
            displayPostInfo: true
        }

        this.components = {
            'debounce-text': (data, key) => {
                const {
                    selected
                } = this.props;
                const {
                    values,
                } = this.state;

                return (
                    <div key = {key}>
                        {this.setTitle(data)}
                        <DebounceField
                            autofocus = {true}
                            parentModel = { data.parentModel }
                            model    = {data.model}
                            selected = {data.selected ? data.selected : null}
                            error = {values[data.field] ? values[data.field].error : null }
                            setError = {this.setError.bind(this)}
                            hintText = {`Type ${data.field}`}
                            onChange = {(value, exists) => {
                                const {
                                    values,
                                    error,
                                } = this.state;

                                values[data.field] = {value};

                                if (exists) {
                                    values[data.field].error = 'Post already exists'

                                } else {
                                    if (value == '') {
                                        values[data.field].error = 'Post name cannot be empty'
                                    } else {
                                        delete values[data.field].error;
                                        values[data.field].error = null;
                                    }
                                }

                                for (let key in values) {
                                    if (values[key].error) {
                                        error[key] = values[key].error;
                                    } else {
                                        delete error[key];
                                    }
                                }

                                this.setState({
                                    values,
                                    error
                                });
                            }}
                        />
                    </div>
               );
            },
            'text': (data, key) => {
                return (
                    <div key = {key}>
                        {this.setTitle(data)}
                        <TextField
                            defaultValue = {data.default}
                            hintText = {`Type ${data.field}`}
                            onChange = {(event, target, value) => {
                                this.onTextChange(event, target, value, data);
                            }}
                            setError = {this.setError.bind(this)}
                            style = {{
                                width: '100%'
                            }}
                        />
                    </div>
               );
            },
            'date': (data, key) => {

                const defaultDate = new Date(data.default);
                const defaultTime = `${defaultDate.getHours()}:${defaultDate.getMinutes()}:${defaultDate.getSeconds() < 10 ? 0 : ''}${defaultDate.getSeconds()}`;


                return (
                    <div key = {key}>
                        {this.setTitle(data)}
                        <DatePicker
                            defaultDate = {defaultDate}
                            autoOk = {true}
                            hintText = {`Type ${data.field}`}
                            field = {data.field}
                            values = {this.state.values}
                            setError = {this.setError.bind(this)}
                            setValues = {(values) => {

                                this.setState({
                                    values: {
                                        ...this.state.values,
                                        ...values
                                    }
                                });

                                console.log( this.state.values );
                            }}
                        />
                        <TextField
                            defaultValue = {defaultTime}
                            label = {'Time (hh:mm:ss)'}
                            onChange = {(event, target, value) => {
                                this.onTextChange(event, target, value, {
                                    field: 'time'
                                });
                            }}
                            errorText = {(this.state.error[data.field] ? this.state.error[data.field] : '')}
                            style = {{
                                width: '100%'
                            }}
                        />
                    </div>
               );
            },
            'post-container': (data, key) => {
                const {
                    model
                } = this.props;
                const {
                    displayPostInfo
                } = this.state;
                const postContainers = [];
                const postSelector = [];

                let postIndex = 0;
                let selectedPostType;

                for (let key in data.postTypes) {
                    const element = data.postTypes[ key ];

                    if (postIndex++ == 0) {
                        selectedPostType = data.post_type_id ? data.post_type_id : element.id;
                    }
                    postContainers[ element.id ] = <PostContainer
                        key = {key}
                        hyperlink = {element.hyperlink}
                        name = {element.name}
                        model = {element.post_container}
                        allowMultiple = {false}
                        postDataTypes = {data.postDataTypes}
                        width = {{
                            container: 7,
                            info: 5
                        }}
                        selected = {data.selected}
                        postTypes = {data.postTypes}
                        postType = {element}
                        onExternalActionUpdate = {model.actions.update}
                        onExternalActionChange = {(values) => {
                            this.setState({
                                error: false,
                                values: [{
                                    value : values
                                }]
                            });
                        }}
                        displayPostInfo = {this.state.displayPostInfo}
                        onUpdate        = {(date, message, status) => {
                            this.triggerStatusBar(date, message, status);

                        }}
                    />

                    postSelector.push(<MenuItem
                        key = {key}
                        value = {element.id}
                        primaryText = {element.name}
                    />);
                }

                return (
                    <div
                        key = {key}
                        style = {{
                            height: 500,
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style = {{
                                borderBottom: '1px solid rgb(240, 240, 240)',
                                height: 47,
                                padding: 0,
                           }}
                        >
                            <SelectField
                                style = {{
                                    width: 200
                                }}
                                labelStyle = {{
                                    color: THEME.primaryColor,
                                    fontSize: '1.8vh',
                                }}
                                underlineStyle = {{
                                    borderBottom: 'none'
                                }}
                                value = { this.state.selectedPostType ? this.state.selectedPostType: selectedPostType }
                                onChange = {(event, target, value) => {
                                    this.setState({selectedPostType: value});
                                }}
                            >
                                {postSelector}
                            </SelectField>
                            <ToggleIcon
                                value = {displayPostInfo}
                                style = {{
                                    float : 'right',
                                    fontWeight: 'semi-bold',
                                    marginRight: 5,
                                    marginTop: 6,
                               }}
                                onChange = {() => {

                                    this.setState({
                                        displayPostInfo: !displayPostInfo
                                    });
                                }}
                                label = {'Info'}
                                on  = {'info'}
                                off = {'info_outline'}
                            />
                        </div>
                        {postContainers[this.state.selectedPostType ? this.state.selectedPostType : selectedPostType]}
                    </div>
               );
           }
       };
    }
}

export default PostDialog;
