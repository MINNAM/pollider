import $                    from 'jquery';
import React                from 'react';

/* Material UI */
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

/* Pollider */
import CONFIG from '../../../models/m-config.js';

import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RowContainer     from './row-container.js';
import ProjectAction    from './project-action.js';
import ProjectPreview   from './project-preview.js';

class ProjectEditor extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            model            : this.props.model,
            rowSelectorOpen  : false,
            selected         : null,
            actionDialogOpen : false,
            actionCallback   : null,
            actionModel      : [],
            preview          : this.props.model

        };

    }

    addRow ( colIndex, currentRow, position  ) {

        const model = this.state.model;

        model.addRow({

            colIndex : colIndex,
            selected : currentRow,
            position : position

        });

        this.setState({ model });

    }

    handleRowSelectorOpen () {

        this.setState({

            rowSelectorOpen : true,

        });

    }

    handleRowSelectorClose () {

        this.setState({

            rowSelectorOpen : false,
            selected        : null

        });

    }

    handleActionDialogOpen ( data ) {

        this.setState({

            actionDialogOpen : true,
            actions : data.actions,
            actionModel : data.actionModel,
            actionStyle : data.actionStyle

        });

    }

    handleActionDialogClose () {

        this.setState({

            actionDialogOpen : false

        });

    }

    handleActionChange ( event, data, _model ) {

        const prevModel = Object.assign( {}, _model );
        const model = _model;

        switch ( data.type ) {

            /* Delete Row */
            case 0:

                this.handleActionDialogOpen({

                    actionModel : [

                        {
                            title    : 'Delete Row?',
                            dataType : null
                        }

                    ],

                    actions : {

                        execute : () => {

                            model.deleteRow( data.model );

                        }

                    },

                    actionStyle : {
                        dialogStyle   : {

                            width : '50%',
                            height : 'calc( 100% - 50px)',
                            top : 50

                        },

                    }

                });

            break;

            /* Up Row */
            case 1:

                model.upRow( data.model );
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview : this.props.model

                });

            break;

            /* Down Row */
            case 2:

                model.downRow( data.model );
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview : this.props.model

                });

            break;

            /* Duplicate */
            case 3:

                model.duplicate( data.model );
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview : this.props.model

                });

            break;

            /* Top Row */
            case 4:

                model.topRow( data.model );
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview : this.props.model

                });

            break;

            /* Bottom Row */
            case 5:

                model.bottomRow( data.model );
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview : this.props.model

                });

            break;


            /* Create Row Above */
            case 6:

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            title    : 'Create Row',
                            dataType : 'row-selector'
                        }

                    ],

                    actions : {

                        execute : ( _data ) => {

                            this.addRow( _data.colIndex, data.model, 0 );

                        }
                    },

                    actionStyle : {

                        dialogStyle   : {

                            width : '50%',
                            height : 'calc( 100% - 50px)',
                            top : 50

                        }

                    }

                });

            break;

            /* Create Row Below */
            case 7:

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            title    : 'Create Row',
                            dataType : 'row-selector'
                        }

                    ],

                    actions : {

                        execute : ( _data ) => {

                            this.addRow( _data.colIndex, data.model, 0 );

                        }

                    },

                    actionStyle : {

                        dialogStyle   : {

                            width : '50%',
                            height : 'calc( 100% - 50px)',
                            top : 50

                        }

                    }

                });

            break;

            case 'set-padding' :

                model.setPadding( data.value );

                this.setState({

                    preview : this.props.model

                });

            break;

            case 'text-editor' :

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            dataType : 'text-editor',
                            default  : _model.contentRaw,
                            content : _model.content
                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                        },

                        update : ( _data ) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                            this.setState({

                                preview : this.props.model

                            });

                        },

                        cancel : () => {

                            model.content    = prevModel.content;
                            model.contentRaw = prevModel.contentRaw;

                            this.setState({

                                preview : this.props.model

                            });

                        }

                    },

                    actionStyle : {

                        dialogStyle   : {

                            width : '50%',
                            height : 'calc( 100% - 50px)',
                            top : 50

                        },
                        contentStyle : {
                            width : '80%',
                            height : '80%'
                        },

                    }

                });

            break;

            case 'uploads' :

                this.handleActionDialogOpen({

                    actionModel : [

                        {
                            dataType : 'uploads',
                            postTypes : this.props.uploads

                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            let path = _data.hide.path + _data.hide.filename + '.' + _data.extension;

                            model.content    = _data;


                        },

                        update :  ( _data ) => {

                            let path = _data.hide.path + _data.hide.filename + '.' + _data.extension;

                            model.content    = _data;

                            this.setState({

                                preview : this.props.model

                            });

                        },

                        cancel :  ( _data ) => {

                            model.content    = prevModel.content;

                            this.setState({

                                preview : this.props.model

                            });

                        },

                    },

                    actionStyle : {

                        dialogStyle   : {

                            width  : '50%',
                            height : 'calc( 100% - 50px)',
                            top    : 50

                        },
                        contentStyle : {

                            width  : '95%',
                            height : '80%'

                        },

                    }

                });

            break;


        }

        this.setState({

            actionMenuOpen : false

        });

    }


    setSelected ( row, position ) {

        this.setState({

            selected : row,
            position : position

        });

    }

    render () {

        return (

            <div className = 'row'>
                <div id = "project-editor" className = "col-sm-6" >
                    <Toolbar style  = {{ background : 'white', borderBottom: '1px solid rgb(220,220,220)', paddingRight : 10, paddingLeft: 40 }}>
                        <ToolbarGroup firstChild={true}>
                            <ToolbarTitle style = {{ color: 'rgb(60,60,60)'}}text = { this.props.post.name } />
                        </ToolbarGroup>

                    </Toolbar>
                    <div style = {{ padding: '2.5%' }}>

                        <RowContainer
                            top          = { true }
                            model        = { this.state.model }
                            display      = { this.props.display }
                            rowClassName = { 'parent-row' }
                            uploads      = { this.props.uploads }
                            handleActionChange =  { this.handleActionChange.bind( this ) }
                            handleActionDialogOpen = { this.handleActionDialogOpen.bind( this ) }
                        />
                    </div>

                    <div style = {{ padding: 0, width: '100%', textAlign: 'center' }} >
                        <span
                            style = {{
                                margin: "0 auto",
                                border: '1px solid rgb(60,60,60)',
                                background: 'rgb(60,60,60)',
                                color: 'white',
                                padding: '5 15 5 15',
                                borderRadius : '2.5px'
                            }}
                            onTouchTap = {

                                () => {

                                    this.handleActionDialogOpen({

                                        actionModel : [
                                            {
                                                title    : 'Create Row',
                                                dataType : 'row-selector'
                                            }

                                        ],

                                        actions : {

                                            execute : ( _data ) => {

                                            this.addRow( _data.colIndex );

                                            }
                                        },

                                        actionStyle : {

                                            dialogStyle   : {

                                                width : '50%',
                                                height : 'calc( 100% - 50px)',
                                                top : 50

                                            },
                                        }

                                    });

                                }

                            }
                        >
                            Add Row
                        </span>
                    </div>
                </div>

                <div className = "col-sm-6" style = {{ height: '100%', padding : '2.5% 2.5% 0% 2.5%', background: 'rgb(60,60,60)', overflow: 'scroll' }}>
                    <ProjectPreview model = { this.state.preview } />

                </div>
                <ProjectAction
                    model          = { this.props.post }
                    selected       = { null }
                    open           = { this.state.actionDialogOpen }
                    onRequestClose = { this.handleActionDialogClose.bind( this ) }
                    actions         = { this.state.actions }
                    actionModel    = { this.state.actionModel }
                    actionDescription = { this.state.actionDescription }
                    actionDialogStyle = { this.state.actionStyle }

                />

            </div>

        );

    }

}

export default ProjectEditor;
