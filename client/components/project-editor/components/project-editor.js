import React                from 'react';

/* Material UI */
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton                                                from 'material-ui/FlatButton';
import Popover          from 'material-ui/Popover';
import Menu             from 'material-ui/Menu';
import MenuItem         from 'material-ui/MenuItem';
import Divider          from 'material-ui/Divider';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/* Pollider */
import CONFIG from '../../../models/m-config.js';

import { formatDate } from '../../post-container/models/utility.js';

import RowContainer     from './row-container.js';
import ProjectAction    from './project-action.js';
import {ProjectPreview}   from './project-preview.js';
import PostIcon         from '../../post-container/components/post-icon.js';
import Seperator        from '../../ui/components/seperator.js';
import MaterialButton        from '../../ui/components/material-button.js';

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
            preview          : this.props.model,
            displayFullPreview : false

        };

    }

    componentDidMount() {

        const { model } = this.state;

        if ( model.rows.length < 1 ) {

            // this.addRow( 0 );
            //
            // model.rows[ 0 ].cols[ 0 ].setElement( 'text' );
            //
            // model.rows[ 0 ].cols[ 0 ].displayElement( true );
            //
            // this.setState({ model })

            // this.state.model.rows[ 0 ].cols[ 0 ].element.displayByType( 'text' );

        }

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
            actions          : data.actions,
            actionModel      : data.actionModel,
            actionStyle      : data.actionStyle

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
                            title : 'Delete',
                            subtitle : {
                                pre : 'Are you sure to delete?',
                            },
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

            case 'resize-element' :

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            title    : data.title,
                            dataType : 'slider',
                            default  : data.default
                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            model.setPadding( _data );

                            console.log( _data, model );

                            this.setState({

                                preview : this.props.model

                            });

                        },

                        update : ( _data ) => {

                            model.setPadding( _data );

                            console.log( model );

                            this.setState({

                                preview : this.props.model

                            });

                        },

                        cancel : () => {

                            model.padding = prevModel.padding;

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

                        }

                    }

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

            case 'embed' :

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            dataType : 'embed',
                            default  : _model.content,
                            content : _model.content
                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            if ( _data ) {

                                model.content    = _data.content;
                                model.contentRaw = _data.contentRaw;

                            }

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
                        },

                    }

                });

            break;

            case 'code-editor' :

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            dataType : 'code-editor',
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

            case 'post-container' :

                this.handleActionDialogOpen({

                    actionModel : [

                        {
                            dataType : 'post-container',
                            postTypes : this.props.postTypes.postTypes,
                            selected  : model.contentRaw ? model.contentRaw.id : null,
                            post_type_id : model.contentRaw ? model.contentRaw.post_type_id : null

                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            model.content    = _data;
                            model.contentRaw = {
                                post_type_id : _data.post_type_id,
                                id           : _data.id,
                                type         : _data.hide.dataType
                            };


                        },

                        update :  ( _data ) => {

                            model.content    = _data;
                            model.contentRaw = {
                                post_type_id : _data.post_type_id,
                                id : _data.id,
                                type : _data.hide.dataType
                            };


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

                            width  : '95%'

                        },

                    }

                });

            break;

            case 'delete-element' :

                this.handleActionDialogOpen({

                    actionModel : [

                        {
                            title : 'Delete',
                            subtitle : {
                                pre : 'Are you sure to delete?',
                            },
                            dataType : 'delete-element',
                            postTypes : this.props.uploads

                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            model.element = null;

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

                        }

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

    handleMenuActionChange ( event, value ) {

        switch ( value ) {

            /* New Folder */
            case 0:

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

            break;

            case 1:


            break;

        }

        this.setState({

            actionMenuOpen : false

        });

    }

    handleActionMenuOpen ( event ) {

        event.preventDefault();

        this.setState({

            actionMenuOpen     : true,
            actionMenuAnchorEl : event.currentTarget

        });

    }

    handleActionMenuClose () {

        this.setState({

            actionMenuOpen : false

        });

    }

    render () {


        return (

            <div className = 'row' style = {{ height: '100%' }}>
                <div id = "project-editor" className = {"col-sm-" + (this.state.displayFullPreview ? 1 : 6)} style = {{ display : this.state.displayFullPreview ? 'none' : ''  }} >
                    <div
                        style = {{
                            width : '100%',
                            height : 56,
                            background : 'white',
                            borderBottom: '1px solid rgb(220,220,220)',
                            paddingRight : 10,
                            paddingLeft: 10
                        }}
                    >
                        <PostIcon
                            model = { this.props.post }
                            style = {{
                                width : 35,
                                height : 35,
                                marginTop : 10.5
                            }}
                        />
                        <span
                            style = {{
                                display : 'inline-block',
                                marginTop : 10.5,
                                marginLeft : 7.5
                            }}
                        >

                            <span className = { 'file-name' } style = {{ paddingLeft : 5 }}>{ this.props.post.name }</span>
                            <span className = { 'file-date' } style = {{ paddingLeft : 5 }}>{ formatDate( this.props.post.created_date ) }</span>
                        </span>

                        <MaterialButton
                            style = {{
                                marginTop : 11,
                                float     : 'right'
                            }}

                            onClick = { this.handleActionMenuOpen.bind( this ) }
                            icon  = { 'more_vert' }

                        />

                        <Popover
                          open           = { this.state.actionMenuOpen }
                          anchorEl       = { this.state.actionMenuAnchorEl }
                          anchorOrigin   = {{ horizontal: 'right', vertical: 'bottom' }}
                          targetOrigin   = {{ horizontal: 'right', vertical: 'top' }}
                          onRequestClose = { this.handleActionMenuClose.bind( this ) }
                        >
                            <Menu
                                onChange = { this.handleMenuActionChange.bind( this )}
                                style = {{
                                    float : 'right'
                                }}
                                menuItemStyle = {{
                                    fontSize : 14
                                }}
                            >
                                <MenuItem value = { 0 }  primaryText="New Row" />

                                <Divider/>
                                <MenuItem value = { 1 } primaryText="Reset" />

                            </Menu>
                        </Popover>
                        {
                            // <Seperator
                            //     style = {{
                            //         marginTop : 19
                            //     }}
                            // />
                        }
                    </div>

                    <div style = {{ height : 'calc(100% - 56px)' }}>

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


                </div>

                <div
                    className = {"col-sm-" + (this.state.displayFullPreview ? 12 : 6) }
                    style = {{
                        height: 'calc(100% - 47px)',
                        padding : '56px 2.5% 56px 2.5%',
                        background: 'rgb(60,60,60)',
                        overflow: 'scroll',
                    }}
                >
                    <ProjectPreview
                        model = { this.state.model }
                        style = {{
                            padding : 10,
                            minHeight : 750
                        }}
                    />
                </div>
                <ProjectAction
                    model             = { this.props.post }
                    selected          = { null }
                    open              = { this.state.actionDialogOpen }
                    onRequestClose    = { this.handleActionDialogClose.bind( this ) }
                    actions           = { this.state.actions }
                    actionModel       = { this.state.actionModel }
                    actionDescription = { this.state.actionDescription }
                    actionDialogStyle = { this.state.actionStyle }
                />

            </div>

        );

    }

}

export default ProjectEditor;
