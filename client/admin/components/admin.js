import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

/* Material UI */
import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SelectField from 'material-ui/SelectField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

/* Pollider */
import {
    SITE,
    THEME
} from '../../global.js';
import {User} from '../../login/';
import AdminDialog from './admin-dialog.js';

import {
    PostContainer,
    PostContainerModel as Model,
    PostTypes as postTypes,
    structurePostTypes
} from '../../post-container/';


import Project from '../../project-editor/models/project.js';
import ProjectEditor from '../../project-editor/components/project-editor.js';
import StatusBarContainer from '../../status-bar/components/status-bar-container.js';

import {
    MaterialButton,
    ToggleIcon,
    Seperator
} from '../../ui-components/';

// global.navigator = {userAgent: 'all'}; // fix client/server checksum error for material-ui

let navigator;

if (!navigator) {
    navigator = {};
    navigator.userAgent = 'all';
}

const muiTheme = {
    palette: {
        primary1Color: THEME.primaryColor,
        primary2Color: THEME.primaryColor,
        primary3Color: THEME.primaryColor,
        accent1Color: THEME.primaryColor,
        accent2Color: THEME.primaryColor,
        accent3Color: THEME.primaryColor,
    },
    userAgent:  navigator.userAgent
};

class Admin extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            view: 'post-container',
            height: 500,
            postTypes: null,
            statusBarQueue: [],
            currentPost: null,
            currentProject: null,
            displayPostInfo: true,
            user: new User(),
            actionDialogOpen: false,
            actionCallback: null,
            actionModel: [],
            updatePreview: false,
        };

        this.state.user.getDetail();
    }

    componentDidMount () {
        if (typeof(window) !== 'undefined') {
            setTimeout(() => {
                this.setState({height: window.innerHeight});

                window.onresize = () => {
                    this.setState({height: window.innerHeight});
                };

            }, 200);
        }

        postTypes.init(() => {
            this.setState({postTypes});

            let index = 0;

            postTypes.map((element) => {
                if (index++ == 0) {
                    this.setState({selectedPostType: element.id});
                }
            });

        }, (type, date, message, model, status) => {
            this.triggerStatusBar(type, date, message, model, status);
        });
    }

    setView (view, currentPost) {
        if (currentPost) {
            let projectField;
            let postContainer;
            let i = 0;

            for (let key in postTypes.get()) {
                if (postTypes.get()[key].id == this.state.selectedPostType) {
                    let metas = postTypes.get()[key].meta;
                    postContainer = postTypes.get()[key].post_container;

                    for (let key2 in metas) {
                        if (metas[key2].data_type == 'project') {
                            projectField = key2;
                        }
                    }

                    break;
                }

                i++;
            }

            this.setState({
                view,
                currentPost,
                previousProject: new Project({model: currentPost, projectField: projectField, parentModel: postContainer}),
                currentProject: new Project({model: currentPost, projectField: projectField, parentModel: postContainer}),
                currentPostContainer: postContainer,
           });
       } else {
            this.setState({
                view,
                currentPost,
                currentProject: null,
                previousProject: null
            });
       }

    }

    triggerStatusBar (type, date, message, model, status) {
        const {
            statusBarQueue
        } = this.state;

        this.popStatusBarQueue();

        statusBarQueue.push({type, date, message, model, status});

        this.setState({statusBarQueue});

        clearTimeout(this.clearstatusBar);

        this.clearstatusBar = setTimeout(() => {

            this.popStatusBarQueue();

        }, 3000);
    }

    popStatusBarQueue () {
        const {
            statusBarQueue
        } = this.state;

        statusBarQueue.shift();

        this.setState({statusBarQueue});
    }

    disableStatusBar () {
        this.setState({statusBarQueue: []});
    }

    handleActionMenuOpen (event) {
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

        const {
            postTypes,
            displayPostInfo,
            view,
            height,
            user,
            selectedPostType,
            currentProject,
            currentPost,
            previousProject,
            statusBarQueue,
            actionMenuOpen,
            actionMenuAnchorEl
        } = this.state;

        const posts = structurePostTypes(postTypes,displayPostInfo,this.setView.bind(this), this.state.view);

        return (
            <MuiThemeProvider muiTheme = {getMuiTheme(muiTheme)}>
                <div
                    style = {{
                        height,
                        overflow: 'hidden'
                    }}
                >
                    <div
                        className = 'menu-container'
                        style = {{
                            height: view != 'post-container' ? 50 : 100,
                            marginTop: view != 'post-container' ? -50 : '',
                        }}
                    >
                        <div
                            className = 'row primary-menu'
                            style = {{
                                height: 50,
                                marginTop: view != 'post-container' ? -50: '',
                            }}
                        >
                            <img
                               id = 'logo'
                               src = {'/assets/logo.svg'}
                               style = {{
                                   height: '80%',
                                   marginTop: view != 'post-container' ? 100: '',
                                   userSelect: 'none',
                               }}
                            />
                            <MaterialButton
                                style = {{
                                    float : 'right',
                                    fontWeight: 'semi-bold',
                                    borderRadius: 100,
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 1px 1px 3px 1px'

                                }}
                                iconStyle = {{
                                    color: 'rgb(123, 123, 123)'
                                }}
                                onClick = {this.handleActionMenuOpen.bind(this)}
                                icon = {'person'}
                            />
                        </div>
                        <Popover
                            open = {actionMenuOpen}
                            anchorEl = {actionMenuAnchorEl}
                            anchorOrigin = {{
                                horizontal: 'right',
                                vertical: 'top'
                            }}
                            targetOrigin = {{
                                horizontal: 'right',
                                vertical: 'top'
                            }}
                            onRequestClose = {this.handleActionMenuClose.bind(this)}
                        >
                            <Menu
                                onChange = {(event, value) => {
                                    switch (value) {
                                        case 'logout':
                                            user.logout(() => {
                                                window.location.href = '/login';
                                            });
                                            break;
                                    }
                                }}
                                style = {{
                                    float: 'right'
                                }}
                                menuItemStyle = {{
                                    fontSize: 14
                                }}
                            >
                                <MenuItem
                                    value = {'preference'}
                                    primaryText = "Preference"
                                />
                                <Divider />
                                <MenuItem
                                    value = {'logout'}
                                    primaryText = "Logout"
                                />
                            </Menu>
                        </Popover>
                        <div
                            className = 'row secondary-menu'
                        >
                            <div
                                className = 'secondary-menu-items'
                                style = {{
                                    display: view == 'post-container' ? '' : 'none',
                                    borderBottom: "1px solid rgb(230,230,230)"
                                }}>
                                <div
                                    style = {{
                                        width: '18.75%',
                                        height: 56,
                                        position: 'relative',
                                        float: 'left'
                                    }}
                                >
                                    {
                                        postTypes ? <SelectField
                                            disabled = {view != 'post-container'}
                                            style = {{
                                                width: '100%'
                                            }}
                                            labelStyle = {{
                                                fontSize: 20,
                                                color: THEME.primaryColor
                                            }}
                                            underlineStyle = {{
                                                borderBottom: 'none'
                                            }}
                                            value = {selectedPostType}
                                            onChange = {(event, target, value) => {
                                                this.setState({selectedPostType: value});
                                            }}
                                        >
                                            {posts.selector}
                                        </SelectField> : <CircularProgress
                                            style = {{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                transform: 'translate(-50%,-50%)'
                                            }}
                                        />
                                    }

                                </div>
                                <ToggleIcon
                                    value = {displayPostInfo}
                                    style = {{
                                        float: 'right',
                                        fontWeight: 'semi-bold',
                                        marginTop: 6,
                                    }}
                                    iconStyle = {{
                                        color: 'rgb(123, 123, 123)'
                                    }}
                                    onChange = {() => {
                                        this.setState({
                                            displayPostInfo: !displayPostInfo
                                        });
                                    }}
                                    label = {'Info'}
                                    on = {'info'}
                                    off = {'info_outline'}
                                />
                                <MaterialButton
                                    style = {{
                                        float : 'right',
                                        fontWeight: 'semi-bold',
                                        marginTop: 6,
                                        marginRight: 18,
                                        borderRadius: 100,
                                    }}
                                    iconStyle = {{
                                        color: 'rgb(123, 123, 123)'
                                    }}
                                    onClick = {() => {}}
                                    icon = {'assessment'}
                                />
                            </div>
                            <div
                                className = 'secondary-menu-items'
                                style = {{
                                    paddingTop: 4,
                                    marginTop: view == 'post-container' || view == 'project-editor' ? '0px': '-100%',
                                    borderBottom: "1px solid rgb(230,230,230)",
                                }}
                            >
                                <MaterialButton
                                    style = {{
                                        float: 'right',
                                        fontWeight: 'semi-bold',
                                        marginTop: 3,
                                        marginRight: 5
                                    }}
                                    onClick = {() => {
                                        currentProject.save(() => {
                                            this.setState({
                                                currentProject
                                            })
                                        });
                                    }}
                                    label = {'Save'}
                                    icon = {'save'}
                                />
                                <Seperator
                                    style = {{
                                        marginTop: 11
                                   }}
                                />
                                <MaterialButton
                                    style = {{
                                        float: 'right',
                                        fontWeight: 'semi-bold',
                                        marginTop: 3,
                                        marginRight: 5
                                    }}
                                    onClick = {() => {
                                        window.open(currentPost._hyperlink, "_blank");
                                    }}
                                    label = {'Go to Site'}
                                    icon = {'web'}
                                />
                                <Seperator
                                    style = {{
                                        marginTop: 11
                                   }}
                                />
                                <MaterialButton
                                    style = {{
                                        float: 'right',
                                        fontWeight: 'semi-bold',
                                        marginTop: 3,
                                    }}
                                    onClick = {(event) => {
                                        // const previousProject = {...this.state.previousProject};
                                        // const currentProject = {...this.state.currentProject};

                                        // previousProject.model = null;
                                        // previousProject.parentModel = null;
                                        // currentProject.model = null;
                                        // currentProject.parentModel = null;

                                        // if (JSON.stringify(previousProject) != JSON.stringify(currentProject)) {
                                        //
                                        //     this.handleMenuActionChange(event, 0);
                                        //
                                        //} else {
                                        //
                                        //     this.setView('post-container');
                                        //
                                        //}

                                        this.setView('post-container');
                                    }}
                                    label = {'Back to Posts'}
                                    icon = {'keyboard_backspace'}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className = {"empty-div"}
                        style = {{
                            display: 'inline-block',
                            height: view != 'post-container' ? 46: 100,
                            width: '100%',
                            marginTop: view != 'post-container' ? '': ''
                        }}
                    />
                    <div className = "row app-container">
                        <div
                            className = "col-sm-12 components"
                            style = {{
                                marginTop: view == 'post-container' ? '': '-100%',
                                display: view == 'post-container' ? '': 'none',
                                height: height - 50,
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                style = {{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative'
                                }}
                            >
                                {
                                    posts.container[selectedPostType] ?
                                    posts.container[selectedPostType] :
                                    <CircularProgress
                                       style = {{
                                           position: 'absolute',
                                           left: '50%',
                                           top: '50%',
                                           transform: 'translate(-50%,-50%)'
                                       }}
                                   />
                                }
                            </div>
                        </div>
                        <div
                            className = "col-sm-12 components"
                            style = {{
                                height: '100%',
                                display: view == 'project-editor' ? 'inline': 'none'
                            }}
                        >
                            <div style = {{width: '100%', height:  '100%'}}>
                                {
                                   currentProject ? <ProjectEditor
                                        model = {currentProject}
                                        user = {user}
                                        updateCurrentProject = {(currentProject) => {
                                            this.setState({
                                                currentProject
                                            });
                                        }}
                                        post = {currentPost}
                                        postContainer = {postTypes}
                                        currentPostContainer = {this.state.currentPostContainer}
                                        display = {this.setView.bind(this)}
                                        postTypes = {postTypes}
                                    /> : ''
                                }
                            </div>
                        </div>
                    </div>
                    {
                        statusBarQueue.length > 0 ? <StatusBarContainer
                            queue = {statusBarQueue}
                            pop = {this.popStatusBarQueue.bind(this)}
                        /> : ''

                    }

                </div>
            </MuiThemeProvider>
       );
   }

}

export default Admin;
