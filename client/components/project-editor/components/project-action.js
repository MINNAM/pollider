import { React, Action, TextEditor, CodeEditor } from '../../action/components/action.js';
import CONFIG from '../../../models/m-config.js';
import PostContainer from '../../post-container/components/post-container.js';
import SelectField   from 'material-ui/SelectField';
import TextField   from 'material-ui/TextField';
import MenuItem      from 'material-ui/MenuItem';
import TouchRipple from '../../../../node_modules/material-ui/internal/TouchRipple';
import Slider from 'material-ui/Slider';

import ToggleIcon from '../../ui/components/toggle-icon.js';
import Seperator      from '../../ui/components/seperator.js';
import MaterialButton        from '../../ui/components/material-button.js';

/*
* PostAction is a class that is responsible for populating requested dialog.
* Input creation/validation is done here.
*/
class ProjectAction extends Action {

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
                                color : CONFIG.theme.primaryColor
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

                                    console.log( this.state.values );

                                }
                            }

                            onUpdate = { this.props.actions.update }

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
                                color : CONFIG.theme.primaryColor
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

                                    console.log( this.state.values );

                                }
                            }

                            onUpdate = { this.props.actions.update }

                        />
                    </div>
                )
            },

            'text-editor' : ( data, key ) => {

                return (
                    <div
                        style = {{
                            height : '100%'
                        }}
                    >
                        <TextEditor
                            key = { key }
                            default  = { data.default }
                            onChange = {

                                ( values ) => {

                                    this.setState({

                                        error : false,
                                        values : values

                                    });

                                }
                            }

                            onUpdate = { this.props.actions.update }

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
                        <TextEditor
                            key = { key }
                            default  = { data.default }
                            disableStyle = { true }
                            disableHTML = { true }
                            onChange = {

                                ( values ) => {

                                    this.setState({

                                        error : false,
                                        values : values

                                    });

                                }
                            }

                            onUpdate = { this.props.actions.update }

                        />
                    </div>
                );

            },

            'row-selector' : (data, key ) => {

                const style = {
                    padding   : '5%',
                    textAlign : 'center',
                    cursor    : 'pointer'
                }

                return (

                    <div
                        key       = { key }
                        className = 'col-sm-12'
                        style     = {{ height: '100%', padding: 0 }}
                    >
                        <div className = 'row'>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 0 } ); } }>
                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="100%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                </svg>
                            </span>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 1 } ); } }>

                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="49%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'2%'}
                                        y = {'-50%'}
                                        width="49%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                </svg>

                            </span>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 2 } ); } }>
                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="32%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />

                                    <rect
                                        x = {'-14.7%'}
                                        y = {'-50%'}
                                        width="32%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />

                                    <rect
                                        x = {'20%'}
                                        y = {'-50%'}
                                        width="32%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />


                                </svg>
                            </span>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 3 } ); } }>
                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'-23%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'3%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'29%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />

                                </svg>
                            </span>
                        </div>

                        <div className = 'row'>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 4 } ); } }>

                            <svg
                                style = {{
                                    width : '100%',
                                    height : 30
                                }}
                                viewBox = "-1 -1 2 2"
                            >
                                <rect
                                    x = {'-50%'}
                                    y = {'-50%'}
                                    width="24%"
                                    height="1"
                                    style = {{
                                        fill : 'rgb(180,180,180)'
                                    }}
                                />
                                <rect
                                    x = {'-23%'}
                                    y = {'-50%'}
                                    width="74%"
                                    height="1"
                                    style = {{
                                        fill : 'rgb(180,180,180)'
                                    }}
                                />
                            </svg>

                            </span>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 5 } ); } }>
                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="74%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'26%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                </svg>
                            </span>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 6 } ); } }>
                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="50%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'2%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'29%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                </svg>
                            </span>
                            <span style = {style} className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 7 } ); } }>
                                <svg
                                    style = {{
                                        width : '100%',
                                        height : 30
                                    }}
                                    viewBox = "-1 -1 2 2"
                                >
                                    <rect
                                        x = {'-50%'}
                                        y = {'-50%'}
                                        width="24%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'-23%'}
                                        y = {'-50%'}
                                        width="23%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />
                                    <rect
                                        x = {'3%'}
                                        y = {'-50%'}
                                        width="49%"
                                        height="1"
                                        style = {{
                                            fill : 'rgb(180,180,180)'
                                        }}
                                    />

                                </svg>
                            </span>
                        </div>
                    </div>

                );
            },

            'element-selector' : ( data, key ) => {

                const style = {
                    padding: '5%',
                    textAlign: 'center',
                    cursor : 'pointer'
                }


                return (

                    <div
                        key       = { key }
                        className = 'col-sm-12'
                        style     = {{ height: '100%', padding: 10 }}
                    >
                        <div className = 'row'>
                            <div style = {style} className = 'col-sm-4' onTouchTap = { function () { this.onExecute({ type : 'text' }); }.bind( this ) }>
                                <MaterialButton
                                    style = {{

                                    }}
                                    icon  = { 'subject' }
                                    label = { 'TEXT' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-4' onTouchTap = { function () { this.onExecute({ type : 'image' }); }.bind( this ) }>
                                <MaterialButton
                                    style = {{

                                    }}
                                    icon  = { 'image' }
                                    label = { 'IMAGE' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-4' onTouchTap = { function () { this.onExecute({ type : 'embed' }); }.bind( this ) }>
                                <MaterialButton
                                    style = {{

                                    }}
                                    icon  = { 'video_library' }
                                    label = { 'embed' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-4' onTouchTap = { function () { this.onExecute({ type : 'audio' }); }.bind( this ) }>
                                <MaterialButton
                                    style = {{

                                    }}
                                    icon  = { 'audiotrack' }
                                    label = { 'AUDIO' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-4' onTouchTap = { function () { this.onExecute({ type : 'video' }); }.bind( this ) }>
                                <MaterialButton
                                    style = {{

                                    }}
                                    icon  = { 'video_library' }
                                    label = { 'VIDEO' }
                                />
                            </div>
                            <div style = {style} className = 'col-sm-4' onTouchTap = { function () { this.onExecute({ type : 'code' }); }.bind( this ) }>
                                <MaterialButton
                                    style = {{

                                    }}
                                    icon  = { 'code' }
                                    label = { 'CODE' }
                                />
                            </div>
                        </div>
                    </div>

                );

            },

            'slider' : ( data, key ) => {

                return (

                    <Slider
                        defaultValue = { data.default }
                        max = { 1 }
                        onChange  = { ( event, value ) => {



                            this.setState({

                                error : false,
                                values : value

                            });



                            this.props.actions.update( value );

                        }}
                    />

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


                    postContainers[ element.id ] = <PostContainer
                            key                    = { key }
                            hyperlink              = { element.hyperlink }
                            name                   = { element.name }
                            model                  = { element.post_container }
                            allowMultiple          = { false }
                            width                  = {{ container : 7, info : 5 }}
                            selected               = { data.selected }
                            postDataTypes          = {{}}
                            postTypes              = { data.postTypes }
                            postType               = { element }
                            onExternalActionUpdate = { this.props.actions.update }
                            onExternalActionChange = {

                                ( values ) => {

                                    this.setState({

                                        error : false,
                                        values : values

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

                }

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
                                padding : '0 10px',
                                borderBottom : '1px solid rgb(240, 240, 240)'
                            }}
                        >
                            <SelectField
                                style          = {{  width: 200 }}
                                labelStyle     = {{ fontSize : '1.8vh' }}
                                underlineStyle = {{ borderBottom: 'none' }}
                                value          = { this.state.selectedPostType ? this.state.selectedPostType : selectedPostType }
                                onChange       = {( event, target, value ) => {

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

export default ProjectAction;
