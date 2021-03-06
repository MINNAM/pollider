import React from 'react';

import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';

import { DialogHelper } from '../../dialog/';
import {THEME} from '../../global.js';
import {PostContainer} from '../../post-container/';
import TouchRipple from '../../../node_modules/material-ui/internal/TouchRipple';
import RowSelectorItem from './row-selector.js';
import {
    TextEditor,
    DebounceField,
    ToggleIcon,
    Seperator,
    MaterialButton
} from '../../ui-components/';

/*
* PostAction is a class that is responsible for populating requested dialog.
* Input creation/validation is done here.
*/
class ProjectDialog extends DialogHelper {

    constructor ( props ) {

        super( props );

        this.render  = super.render;
        this.display = super.display;
        this.state   = {

            selectedPostType : 0,
            displayPostInfo : true

        };

        this.components = {

            'embed' : ( data, key ) => {

                { this.setTitle( data ); }

                return (
                    <div
                        style = {{
                            height : '100%'
                        }}
                    >
                        { this.setTitle( data ) }
                        <TextField
                            multiLine = { true }
                            rows = {5}
                            style = {{
                                width : '100%',
                            }}
                            underlineFocusStyle = {{
                                color : THEME.primaryColor
                            }}
                            key = { key }
                            value = {this.state.values ? this.state.values.content : data.default }
                            autoFocus = {true}
                            onChange = {

                                ( event ) => {

                                    this.setState({

                                        error : false,
                                        values : {
                                            content    : event.target.value,
                                            contentRaw : null
                                        }

                                    });

                                }
                            }
                            onUpdate = { this.props.model.actions.update }
                        />
                    </div>
                )
            },

            'code' : ( data, key ) => {


                return (
                    <div
                        style = {{
                            height : '100%'
                        }}
                    >
                        <TextField
                            multiLine = { true }
                            rows = {5}
                            style = {{
                                width : '100%',
                            }}
                            underlineFocusStyle = {{
                                color : THEME.primaryColor
                            }}
                            key = { key }
                            value = { this.state.values ? this.state.values.content : data.default }
                            onChange = {

                                ( event ) => {

                                    this.setState({

                                        error : false,
                                        values : {
                                            content    : event.target.value,
                                            contentRaw : null
                                        }

                                    });

                                }
                            }

                            onUpdate = { this.props.model.actions.update }

                        />
                    </div>
                )
            },

            'text-editor': (data, key) => {

                return (
                    <div
                        style = {{
                            height : '100%'
                        }}
                    >
                        <TextEditor
                            key = { key }
                            defaultValue  = { data.default }
                            onChange = {

                                ( values ) => {

                                    this.setState({

                                        error : false,
                                        values : values

                                    });

                                }
                            }

                            onUpdate = { this.props.model.actions.update }

                        />
                    </div>
                );

            },
            'debounce-text': (data, key) => {
                const {
                    selected
                } = this.props;
                const {
                    values = {},
                } = this.state;

                return (
                    <div key = {key}>
                        {this.setTitle(data)}
                        <DebounceField
                            autofocus = {true}
                            parentModel = { data.parentModel }
                            model    = {data.model}
                            error = {values[data.field] ? values[data.field].error : null }
                            setError = {this.setError.bind(this)}
                            hintText = {`Type ${data.field}`}
                            onChange = {(value, exists) => {
                                const {
                                    values = {},
                                    error = {},
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

            'code-editor' : ( data, key ) => {
                return (
                    <div
                        style = {{
                            height : '100%'
                        }}
                    >
                        { this.setTitle( data ) }
                        <TextEditor
                            key = { key }
                            defaultValue  = { data.default }
                            disableStyling = { true }
                            disableHTML = { true }
                            onChange = {
                                (values) => {

                                    this.setState({
                                        error: false,
                                        values: {
                                            ...values,
                                            content: values.content.replace(new RegExp('/script', 'g'), '&closetag;')
                                        }
                                    });
                                }
                            }

                            onUpdate = { this.props.model.actions.update }
                        />
                    </div>
                );

            },

            'row-selector' : (data, key ) => {

                const style = {
                    textAlign : 'center',
                    cursor    : 'pointer'
                }

                return (

                    <div
                        key       = { key }
                        className = 'col-sm-12'
                        style     = {{ height: '100%', padding: 0 }}
                    >
                        { this.setTitle( data ) }
                        <div className = 'row'>
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 0 });}}
                                style = {style}
                                src = '/assets/row-selector-1.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 1 });}}
                                style = {style}
                                src = '/assets/row-selector-2.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 2 });}}
                                style = {style}
                                src = '/assets/row-selector-3.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 3 });}}
                                style = {style}
                                src = '/assets/row-selector-4.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 4});}}
                                style = {style}
                                src = '/assets/row-selector-5.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 5 });}}
                                style = {style}
                                src = '/assets/row-selector-6.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 6});}}
                                style = {style}
                                src = '/assets/row-selector-7.svg'
                            />
                            <RowSelectorItem
                                onClick = {() => {this.onExecute({ colIndex: 7 });}}
                                style = {style}
                                src = '/assets/row-selector-8.svg'
                            />

                        </div>
                    </div>

                );
            },

            'element-selector' : (data, key) => {
                const style = {
                    padding: 0,
                    textAlign: 'center',
                    cursor : 'pointer'
                };

                return (

                    <div
                        key       = { key }
                        className = 'col-sm-12'
                        style     = {{ height: '100%', padding: 0 }}
                    >
                        { this.setTitle( data ) }
                        <div className = 'row'>
                            <div style = {style} className = 'col-sm-12' onTouchTap = {() => { this.onExecute({ type : 'text' }); }}>
                                <MaterialButton
                                    style = {{
                                        width: '100%'
                                    }}
                                    icon  = { 'subject' }
                                    label = { 'TEXT' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-12' onTouchTap = {() => { this.onExecute({ type : 'image' }); }}>
                                <MaterialButton
                                    style = {{
                                        width: '100%'
                                    }}
                                    icon  = { 'image' }
                                    label = { 'IMAGE' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-12' onTouchTap = {() => { this.onExecute({ type : 'video' }); }}>
                                <MaterialButton
                                    style = {{
                                        width: '100%'
                                    }}
                                    icon  = { 'videocam' }
                                    label = { 'VIDEO' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-12' onTouchTap = {() => { this.onExecute({ type : 'embed' }); }}>
                                <MaterialButton
                                    style = {{
                                        width: '100%'
                                    }}
                                    icon  = { 'video_library' }
                                    label = { 'embed' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-12' onTouchTap = {() => { this.onExecute({ type : 'code' }); }}>
                                <MaterialButton
                                    style = {{
                                        width: '100%'
                                    }}
                                    icon  = { 'code' }
                                    label = { 'CODE' }
                                />
                            </div>
                        </div>
                    </div>

                );

            },

            'set-padding' : (data,key) => {

                return (
                    <div>
                        {this.setTitle(data)}
                        <TextField
                            style = {{
                                width : '100%',
                            }}
                            floatingLabelText = 'Top'
                            underlineFocusStyle = {{
                                color : THEME.primaryColor
                            }}
                            value = {this.state.values ? this.state.values.top : data.default.top + '' }
                            autoFocus = {true}
                            onChange = {(event) => {
                                this.setState({
                                    error : false,
                                    values : {
                                        ...data.default,
                                        ...this.state.values,
                                        top: event.target.value,
                                    }
                                });
                                if (this.updating) {
                                    clearTimeout(this.updating);
                                    this.updating = null;
                                }
                                this.updating = setTimeout(() => {
                                    this.props.model.actions.update(this.state.values);
                                }, 100);
                            }}
                        />
                        <TextField
                            style = {{
                                width : '100%',
                            }}
                            floatingLabelText = 'Right'
                            underlineFocusStyle = {{
                                color : THEME.primaryColor
                            }}
                            value = {this.state.values ? this.state.values.right : data.default.right + '' }
                            onChange = {(event) => {
                                this.setState({
                                    error : false,
                                    values : {
                                        ...data.default,
                                        ...this.state.values,
                                        right: event.target.value,
                                    }
                                });
                                if (this.updating) {
                                    clearTimeout(this.updating);
                                    this.updating = null;
                                }
                                this.updating = setTimeout(() => {
                                    this.props.model.actions.update(this.state.values);
                                }, 100);
                            }}
                        />
                        <TextField
                            style = {{
                                width : '100%',
                            }}
                            floatingLabelText = 'Bottom'
                            underlineFocusStyle = {{
                                color : THEME.primaryColor
                            }}
                            value = {this.state.values ? this.state.values.bottom : data.default.bottom + '' }
                            onChange = {(event) => {
                                this.setState({
                                    error : false,
                                    values : {
                                        ...data.default,
                                        ...this.state.values,
                                        bottom: event.target.value,
                                    }
                                });
                                if (this.updating) {
                                    clearTimeout(this.updating);
                                    this.updating = null;
                                }
                                this.updating = setTimeout(() => {
                                    this.props.model.actions.update(this.state.values);
                                }, 100);
                            }}
                        />
                        <TextField
                            style = {{
                                width : '100%',
                            }}
                            floatingLabelText = 'Left'
                            underlineFocusStyle = {{
                                color : THEME.primaryColor
                            }}
                            value = {this.state.values ? this.state.values.left : data.default.left + '' }
                            onChange = {(event) => {
                                this.setState({
                                    error : false,
                                    values : {
                                        ...data.default,
                                        ...this.state.values,
                                        left: event.target.value,
                                    }
                                });
                                if (this.updating) {
                                    clearTimeout(this.updating);
                                    this.updating = null;
                                }
                                this.updating = setTimeout(() => {
                                    this.props.model.actions.update(this.state.values);
                                }, 100);
                            }}
                        />
                    </div>
                );
            },

            'slider' : ( data, key ) => {
                return (
                    <div>
                        { this.setTitle( data ) }
                        <div
                            style = {{
                                width: '100%',
                                padding: '27px 16px 0 16px',
                                position: 'relative'
                            }}
                        >
                            <div
                                style = {{
                                    width : 'calc(100% - 50px)',
                                    display: 'inline-block',
                                    height: 1,
                                    background: 'rgb(220,220,220)',
                                    position: 'absolute',
                                    left: 0,
                                    top: 59
                                }}
                            />
                            <div
                                style = {{
                                    width: 'calc(100% - 50px)',
                                    float: 'left'
                                }}
                            >
                                <Slider
                                    defaultValue = {data.default}
                                    max = { 1 }
                                    step = {0.01}
                                    onChange  = {(event, value) => {
                                        this.setState({
                                            error: false,
                                            values: value
                                        });
                                        this.props.model.actions.update(value);
                                    }}
                                />
                            </div>
                            <span
                                style = {{
                                    float: 'right',
                                    lineHeight: '64px',
                                    color: 'rgb(60,60,60)'
                                }}
                            >
                                {Math.round(this.state.values ? this.state.values * 100 : data.default * 100)}
                            </span>
                        </div>
                    </div>

                );

            },

            'post-container' : ( data, key ) => {

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
                        selectedPostType = data.post_type_id ? data.post_type_id: element.id;
                    }
                    postContainers[ element.id ] = <PostContainer
                        key = {key}
                        hyperlink = {element.hyperlink}
                        name = {element.name}
                        model = {element.post_container}
                        allowMultiple = {false}
                        allowEdit = {false}
                        width = {{
                            container: 7,
                            info: 5
                        }}
                        postDataTypes = {data.postDataTypes}
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

export default ProjectDialog;
