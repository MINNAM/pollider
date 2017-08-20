import React, {Component} from 'react';
/* Material UI */
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';

/* Pollider */
import {
    formatDate,
    scroll,
    THEME,
    formatHyperlink
} from '../../global.js';
import RowContainer from './row-container.js';
import ProjectDialog from './project-dialog.js';
import {ProjectView} from '../../project-view/';
import {PostIcon} from '../../post-container/';

import {
    MaterialButton,
    Seperator
} from '../../ui-components/';


import PostHeader from '../../../public/theme/default/post-header.js';

class ProjectEditor extends React.Component {

    constructor (props) {
        super(props);
        const {
            model
        } = this.props;

        this.state = {
            model,
            selected: null,
            displayFullPreview: false
        };
    }

    componentWillReceiveProps (nextProps) {
        this.setState({model: nextProps.model});
    }

    componentDidMount() {
        const {
            model
        } = this.state;

        if (model.rows.length < 1) {
            this.addRow(0);

            model.rows[0].cols[0].setElement({
                type: 'text',
                open: true
            });

            this.setState({ model });

        }
    }

    addRow (colIndex, currentRow, position ) {
        const {
            model
        } = this.state;

        model.addRow({
            colIndex,
            selected: currentRow,
            position
        });

        this.setState({ model });
    }

    openDialog (data) {

        const dialogModel = {
            actions: data.actions,
            fields: data.fields,
            style: data.style,
            options: data.options
        };

        this.setState({
            isDialogOpen: true,
            dialogModel
        });
    }

    closeDialog () {

        this.setState({
            isDialogOpen: false
        });
    }

    handleDialogModel (data, model = {}) {
        const prevModel = {...model};
        const {
            post,
            currentPostContainer
        } = this.props;

        switch (data.type) {

            case 'Name':
                this.openDialog({
                    fields: [
                        {
                            title: 'Rename',
                            subtitle: {
                                pre: 'Enter ',
                                middle: post.name,
                                post: "'s new name"
                            },
                            field: 'name',
                            dataType: 'debounce-text',
                            model: post,
                            parentModel: currentPostContainer
                        }
                   ],
                    actions: {
                        execute: (data) => {
                            post.name = data.name.value;
                            post.hyperlink = formatHyperlink(data.name.value);
                            currentPostContainer.updatePost(post);
                        }
                    },
                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        },
                    }
                });
            break;

            /* New Row */
            case 'new-row':
                this.openDialog({
                    options: {
                        submit: {
                            label: 'Login',
                            hidden: true
                        },
                        cancel: {
                            label: 'Cancel',
                        },
                        executeOnEnter: false
                    },
                    fields: [
                        {
                            title: 'New Row',
                            subtitle: {
                                pre: 'Select number of columns'
                            },
                            dataType: 'row-selector'
                        }
                    ],
                    actions: {
                        execute: (_data) => {
                            this.addRow(_data.colIndex);
                            const projectEditorContent = document.getElementById('project-editor-content').childNodes[0];

                            scroll(projectEditorContent, projectEditorContent.scrollTop, projectEditorContent.getBoundingClientRect().height);
                        }
                    },
                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        },
                    }
                });
                break;

            /* Delete Row */
            case 'delete-row':
                this.openDialog({
                    fields: [
                        {
                            title: 'Delete',
                            subtitle: {
                                pre: 'Are you sure to delete?',
                            },
                            dataType: null
                        }
                    ],
                    actions: {
                        execute: () => {
                            model.deleteRow(data.model);
                        }
                    },
                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        },
                    }
                });
            break;

            /* Delete Row */
            case 'push-and-pull':
                this.openDialog({
                    fields: [
                        {
                            title: 'Push and Pull',
                            subtitle: {
                                pre: data.model.pushAndPull ? 'Disable push and pull?' : 'Able push and pull?',
                            },
                            dataType: null
                        }
                    ],
                    actions: {
                        execute: () => {
                            model.setPushAndPull(data.model);
                        }
                    },
                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        },
                    }
                });
            break;

            /* Up Row */
            case 'up-row':
                model.upRow(data.model);
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({
                    preview: this.props.model

                });
            break;

            /* Down Row */
            case 'down-row':
                model.downRow(data.model);
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({
                    preview: this.props.model
                });
            break;

            /* Duplicate */
            case 'duplicate-row':
                model.duplicate(data.model);
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview: this.props.model
                });

            break;

            /* Top Row */
            case 'row-to-top':

                model.topRow(data.model);
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({

                    preview: this.props.model

                });

            break;

            /* Bottom Row */
            case 'row-to-bottom':

                model.bottomRow(data.model);
                model.content    = data.content;
                model.contentRaw = data.contentRaw;

                this.setState({
                    preview: this.props.model

                });

            break;


            /* Add Row Above */
            case 'add-row-above':

                this.openDialog({

                    fields: [
                        {
                            title: 'Add Row Above',
                            subtitle: {
                                pre: 'Select number of columns',
                            },
                            dataType: 'row-selector'
                        }

                   ],

                    actions: {

                        execute: (_data) => {

                            this.addRow(_data.colIndex, data.model, 0);

                        }
                    },

                    style: {

                        dialog: {

                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50

                        }

                    }

                });

            break;

            /* Add Row Below */
            case 'add-row-below':
                this.openDialog({
                    fields: [
                        {
                            title: 'Add Row Below',
                            subtitle: {
                                pre: 'Select number of columns',
                            },
                            dataType: 'row-selector'
                        }
                    ],
                    actions: {
                        execute: (_data) => {
                            this.addRow(_data.colIndex, data.model, 1);
                        }
                    },
                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        }
                    }
                });

            break;

            case 'resize-image':

                this.openDialog({
                    fields: [
                        {
                            title: 'Resize Image',
                            dataType: 'slider',
                            default: data.default
                        }
                    ],
                    actions: {
                        execute: (_data) => {
                            model.setElementWidth(_data);
                            this.setState({
                                preview: this.props.model
                            });
                        },

                        update: (_data) => {
                            model.setElementWidth(_data);
                            this.setState({
                                preview: this.props.model
                            });
                        },

                        cancel: () => {
                            model.elementWidth = prevModel.elementWidth;
                            this.setState({
                                preview: this.props.model
                            });
                        }

                    },

                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        }
                    }

                });
            break;

            case 'set-padding':
                this.openDialog({
                    options: {
                        executeOnEnter: true
                    },
                    fields: [
                        {
                            title: 'Set Padding',
                            dataType: 'set-padding',
                            default: data.default,
                        }
                   ],
                    actions: {
                        execute: (_data) => {
                            model.setPadding(_data);
                            this.setState({
                                preview: this.props.model
                            });

                        },

                        update: (_data) => {
                            model.setPadding(_data);
                            this.setState({
                                preview: this.props.model
                            });
                        },

                        cancel: () => {
                            model.padding = prevModel.padding;
                            this.setState({
                                preview: this.props.model
                            });
                        }

                    },

                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        }
                    }

                });

            break;

            case 'text-editor':

                this.openDialog({
                    options: {
                        executeOnEnter: false
                    },
                    fields: [
                        {
                            dataType: 'text-editor',
                            default: model.contentRaw,
                            content: model.content
                        }
                   ],
                    actions: {

                        execute: (_data) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                        },

                        update: (_data) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                            this.setState({

                                preview: this.props.model

                            });

                        },

                        cancel: () => {

                            model.content = prevModel.content;
                            model.contentRaw = prevModel.contentRaw;

                            this.setState({

                                preview: this.props.model

                            });

                        }

                    },

                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50

                        },
                        content: {
                            width: '80%',
                            height: '80%'
                        },
                    }

                });

            break;

            case 'embed':

                this.openDialog({
                    options: {
                        executeOnEnter: false
                    },
                    fields: [
                        {
                            title: 'Embed',
                            dataType: 'embed',
                            default: model.content,
                            content: model.content
                        }

                   ],
                    actions: {

                        execute: (_data) => {

                            if (_data) {

                                model.content    = _data.content;
                                model.contentRaw = _data.contentRaw;

                            }

                        },

                        update: (_data) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                            this.setState({

                                preview: this.props.model

                            });

                        },

                        cancel: () => {

                            model.content    = prevModel.content;
                            model.contentRaw = prevModel.contentRaw;

                            this.setState({

                                preview: this.props.model

                            });

                        }

                    },

                    style: {

                        dialog: {

                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50

                        },
                        content: {
                            width: '80%',
                        },

                    }

                });

            break;

            case 'code-editor':

                this.openDialog({
                    options: {
                        executeOnEnter: false
                    },
                    fields: [
                        {
                            title: 'Code',
                            dataType: 'code-editor',
                            default: model.contentRaw,
                            content: model.content
                        }

                   ],
                    actions: {

                        execute: (_data) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                        },

                        update: (_data) => {

                            model.content    = _data.content;
                            model.contentRaw = _data.contentRaw;

                            this.setState({

                                preview: this.props.model

                            });

                        },

                        cancel: () => {

                            model.content    = prevModel.content;
                            model.contentRaw = prevModel.contentRaw;

                            this.setState({

                                preview: this.props.model

                            });

                        }

                    },

                    style: {

                        dialog: {

                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50

                        },
                        content: {
                            width: '80%',
                            height: '80%'
                        },

                    }

                });

            break;

            case 'post-container':
                this.openDialog({
                    fields: [
                        {
                            dataType: 'post-container',
                            postTypes: this.props.postTypes.postTypes,
                            selected: model.contentRaw ? model.contentRaw.id: null,
                            post_type_id: model.contentRaw ? model.contentRaw.post_type_id: null,
                            postDataTypes: this.props.postTypes.postDataTypes,
                        }
                   ],
                    actions: {

                        execute: (_data) => {
                            if(_data) {
                                model.content    = _data[0].value;
                                model.contentRaw = {
                                    post_type_id: _data[0].value.post_type_id,
                                    id    : _data[0].value.id,
                                    type  : _data[0].value.hide.dataType
                                };
                            }
                        },

                        update:  (_data) => {
                            model.content    = _data;
                            model.contentRaw = {
                                post_type_id: _data.post_type_id,
                                id: _data.id,
                                type: _data.hide.dataType
                            };


                            this.setState({

                                preview: this.props.model

                            });

                        },

                        cancel:  (_data) => {

                            model.content    = prevModel.content;

                            this.setState({

                                preview: this.props.model

                            });

                        },

                    },

                    style: {

                        dialog: {

                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50

                        },
                        content: {

                            width: '95%'

                        },

                    }

                });

            break;

            case 'delete-element':
                this.openDialog({

                    fields: [

                        {
                            title: 'Delete',
                            subtitle: {
                                pre: 'Are you sure to delete?',
                            },
                            dataType: 'delete-element',
                            postTypes: this.props.uploads

                        }

                   ],
                    actions: {

                        execute: (_data) => {

                            model.element = null;

                            this.setState({

                                preview: this.props.model

                            });

                        }

                    },

                    style: {

                        dialog: {

                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50

                        }

                    }

                });

            break;


        }

        this.setState({

            actionMenuOpen: false

        });

    }


    setSelected (row, position) {

        this.setState({

            selected: row,
            position: position

        });

    }



    handleActionMenuOpen (event) {
        this.setState({
            actionMenuOpen: true,
            actionMenuAnchorEl: event.currentTarget
        });
    }

    handleActionMenuClose () {
        this.setState({
            actionMenuOpen: false
        });
    }

    render () {

        return (

            <div className = 'row' style = {{ height: '100%' }}>
                <div id = "project-editor" className = {"col-sm-" + (this.state.displayFullPreview ? 1: 6)} style = {{ display: this.state.displayFullPreview ? 'none': ''  }} >
                    <div
                        style = {{
                            width: '100%',
                            height: 56,
                            background: 'white',
                            borderBottom: '1px solid rgb(220,220,220)',
                            paddingRight: 10,
                            paddingLeft: 10
                        }}
                    >                        
                        <span
                            style = {{
                                display: 'inline-block',
                            }}
                        >
                            <span
                                className = {'file-name'}
                                style = {{
                                    paddingLeft: 5,
                                    color: THEME.primaryColor,
                                    cursor: 'pointer',
                                    fontSize: 18,
                                    lineHeight: '56px'
                                }}
                                onClick = {() => {
                                    this.handleDialogModel({ type: 'Name'});
                                }}
                            >
                                {this.props.post.name}
                            </span>
                        </span>


                        <MaterialButton
                            style = {{
                                marginTop: 11,
                                float: 'right',
                                borderRadius: '50%'
                            }}

                            onClick = { this.handleActionMenuOpen.bind(this) }
                            icon = { 'more_horiz'}
                            iconStyle = {{
                                color: 'rgb(60,60,60)'
                            }}

                        />

                        <Seperator
                            style = {{
                                marginTop: 15
                            }}
                        />


                        <MaterialButton
                            style      = {{
                                float: 'right',
                                margin: '9.5px 9.5px 0 0',
                                float: 'right',
                                boxShadow: '1px 1px 3px 1px rgba(0,0,0,0.1)',
                            }}
                            hoverStyle = {{
                                color: 'white'
                            }}

                            onClick = {() => {
                                this.handleDialogModel({type: 'new-row'});
                            }}
                            label = { `New Row` }

                        />

                        <Popover
                          open           = { this.state.actionMenuOpen }
                          anchorEl       = { this.state.actionMenuAnchorEl }
                          anchorOrigin   = {{ horizontal: 'right', vertical: 'bottom' }}
                          targetOrigin   = {{ horizontal: 'right', vertical: 'top' }}
                          onRequestClose = { this.handleActionMenuClose.bind(this) }
                        >
                            <Menu
                                onChange = {(event, value) => {
                                    this.handleDialogModel(value);
                                }}
                                style = {{
                                    float: 'right'
                                }}
                                menuItemStyle = {{
                                    fontSize: 14
                                }}
                            >
                                <MenuItem value = {{ type: 'new-row' }}  primaryText="New Row" />

                                <Divider/>
                                <MenuItem value = {{ type: 1 }} primaryText="Reset" />

                            </Menu>
                        </Popover>
                        {
                            // <Seperator
                            //     style = {{
                            //         marginTop: 19
                            //     }}
                            // />
                        }
                    </div>

                    <div id = 'project-editor-content' style = {{ height: 'calc(100% - 56px)', paddingBottom: 56 }}>

                        <RowContainer
                            top = {true}
                            model = {this.state.model}
                            display = {this.props.display}
                            rowClassName = {'parent-row'}
                            uploads = {this.props.uploads}
                            handleDialogModel =  {this.handleDialogModel.bind(this)}
                            openDialog = {this.openDialog.bind(this)}
                        />
                    </div>


                </div>

                <div
                    id = 'pollider-public'
                    className = {"col-sm-" + (this.state.displayFullPreview ? 12: 6) }
                    style = {{
                        height: 'calc(100% - 47px)',
                        position: 'relative'
                    }}
                >
                    <div
                        style = {{
                            width: '100%',
                            height: 80,
                            paddingRight: 10,
                            paddingLeft: 10,
                            position: 'absolute',
                            top: 0
                        }}
                    >
                        <SelectField
                            floatingLabelText = "Status"
                            style = {{
                                display: 'inline',
                                fontWeight: 'bold',
                                float: 'right',
                                width: 223
                            }}
                            labelStyle = {{
                                color: THEME.primaryColor,
                                fontSize: 12,
                            }}
                            menuItemStyle = {{
                                fontSize: 12
                            }}
                            value = {this.props.post.status}
                            onChange = {(event, index, value) => {
                                // const post = {...this.props.post};

                                this.props.post.status = value;
                                this.props.currentPostContainer.updatePost(this.props.post);

                                // this.props.parentModel.updatePost(model);
                            }}
                        >
                            <MenuItem
                                primaryText = {'Public'}
                                value = {'public'}
                            />
                            <MenuItem
                                primaryText = {'Private'}
                                value = {'private'}
                            />
                            <MenuItem
                                primaryText = {'Hidden'}
                                value = {'hidden'}
                            />
                        </SelectField>
                    </div>
                    <div
                        style = {{
                            height: '100%',
                            overflow: 'scroll',
                            padding: '41px 5% 56px 5%',
                        }}
                    >
                        <Toggle
                            trackStyle = {{
                                backgroundColor: 'rgb(220,220,220)',
                            }}
                            thumbStyle = {{
                                backgroundColor: 'white'
                            }}

                            trackSwitchedStyle = {{
                                backgroundColor: 'rgb(220,220,220)'
                            }}
                            style = {{
                                width: 'initial'
                            }}
                            onToggle = {(event, toggled) => {
                                this.setState({
                                    displayEditorGuide: toggled
                                });
                            }}
                            label="Show Edit Guides"
                        />
                        <PostHeader
                            model = {{...this.state.model.model, ...this.props.user}}
                            display = { true }
                        />

                        <div
                            style = {{
                                marginTop: 20
                            }}
                        >
                            <ProjectView
                                editor = {true}
                                editorGuide = {this.state.displayEditorGuide}
                                model = {this.state.model}
                                handleDialogModel =  {this.handleDialogModel.bind(this)}
                                style = {{
                                    minHeight: 750
                                }}
                            />
                        </div>
                    </div>

                </div>
                {
                    this.state.isDialogOpen ? <ProjectDialog
                        model = {this.state.dialogModel}
                        isOpen = {this.state.isDialogOpen ? true: false}
                        onRequestClose = {this.closeDialog.bind(this)}
                        selected = {this.props.post}
                    /> : ''
                }


            </div>

       );

    }

}

export default ProjectEditor;
