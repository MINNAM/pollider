import { React, Action, TextEditor } from '../../action/components/action.js';

import PostContainer from '../../post-container/components/post-container.js';
import SelectField                                               from 'material-ui/SelectField';
import MenuItem                                                  from 'material-ui/MenuItem';


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

            'text-editor' : ( data, key ) => {

                return (
                    <div>
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

            'row-selector' : (data, key ) => {

                return (

                    <div
                        key       = { key }
                        className = 'col-sm-12'
                        style     = {{ height: '100%', padding: 10 }}
                    >
                        <div className = 'row'>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 0 } ); } }> 1 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 1 } ); } }> 1/2 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 2 } ); } }> 1/3 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 3 } ); } }> 1/4 </span>
                        </div>

                        <div className = 'row'>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 4 } ); } }> 1/4 3/4 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 5 } ); } }> 3/4 1/4 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 6 } ); } }> 1/2 1/4 1/4 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 7 } ); } }> 1/4 1/2 1/4 </span>
                        </div>

                        <div className = 'row'>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 8 } ); } }> 1/4 1/4 1/2 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 9 } ); } }> 1/3 2/3 </span>
                            <span className = 'col-sm-3' onTouchTap = { () => { this.onExecute({ colIndex : 10 } ); } }> 2/3 1/3 </span>
                        </div>
                    </div>

                );
            },

            'element-selector' : ( data, key ) => {

                return (

                    <div
                        key       = { key }
                        className = 'col-sm-12'
                        style     = {{ height: '100%', padding: 10 }}
                    >
                        <div className = 'row' onTouchTap = { function () { this.onExecute({ type : 'text' }); }.bind( this ) }>Text</div>
                        <div className = 'row' onTouchTap = { function () { this.onExecute({ type : 'image' }); }.bind( this ) }>Image</div>
                        <div className = 'row' onTouchTap = { function () { this.onExecute({ type : 'audio' }); }.bind( this ) }>Audio</div>
                        <div className = 'row' onTouchTap = { function () { this.onExecute({ type : 'video' }); }.bind( this ) }>Video</div>
                        <div className = 'row' onTouchTap = { function () { this.onExecute({ type : 'code' }); }.bind( this ) }>Code</div>
                    </div>

                );

            },

            'uploads' : ( data, key ) => {

                const postContainers = [];
                const postSelector   = [];
                let postIndex        = 0;

                data.postTypes.map( ( element ) => {

                    postContainers.push(

                        <PostContainer
                            key                    = { key }
                            name                   = { element.postType.name }
                            model                  = { element.model }
                            allowMultiple          = { false }
                            width                  = {{ container : 7, info : 5 }}
                            postDataTypes          = {{}}
                            postType               = { element.postType }
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

                    );

                    postSelector.push( <MenuItem key = { key } value = { postIndex++ } primaryText = { element.postType.name } /> );

                });

                return (

                    <div key = { key } >
                        <div>
                            <SelectField
                                style          = {{  width: 100 }}
                                labelStyle     = {{ fontSize : '1.8vh' }}
                                underlineStyle = {{ borderBottom: 'none' }}
                                value          = { this.state.selectedPostType }
                                onChange       = { ( event, target, value ) => {

                                    this.setState({ selectedPostType : value });

                                }}

                            >
                                { postSelector }
                            </SelectField>
                            <span
                                style = {{

                                    float       : 'right',
                                    fontWeight  : 'semi-bold',
                                    color       : 'rgb(100,100,100)',
                                    marginTop   : 12,
                                    marginRight : 5

                                }}
                                onTouchTap = { () => {

                                    this.setState({

                                        displayPostInfo : !this.state.displayPostInfo

                                    });

                                }}
                            >
                                Info
                            </span>
                        </div>
                        {postContainers[ this.state.selectedPostType ]}
                    </div>

                );

            }

        };

    }

}

export default ProjectAction;
