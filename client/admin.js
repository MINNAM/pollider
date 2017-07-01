import $        from 'jquery';
import React    from 'react';
import ReactDOM from 'react-dom';

import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';


/* Material UI */
import SelectField                                               from 'material-ui/SelectField';
import MenuItem                                                  from 'material-ui/MenuItem';
import FlatButton                                                from 'material-ui/FlatButton';
import Checkbox                                                  from 'material-ui/Checkbox';
import { List, ListItem }                                        from 'material-ui/List';
import Info                                                      from 'material-ui/svg-icons/action/info';
import InfoOutline                                               from 'material-ui/svg-icons/action/info-outline';
import KeyboardBackspace                                         from 'material-ui/svg-icons/hardware/keyboard-backspace';

/* Pollider */
import CONFIG     from './models/m-config.js';
import User       from './models/user.js';

import AdminAction from './admin-action.js';

import PostTypes  from './components/post-container/models/post-types.js';
import * as Model from './components/post-container/models/post-container.js';
import Project    from './components/project-editor/model/project.js';

import PostContainer      from './components/post-container/components/post-container.js';
import ProjectEditor      from './components/project-editor/components/project-editor.js';
import StatusBarContainer from './components/status-bar/components/status-bar-container.js';

import ToggleIcon          from './components/ui/components/toggle-icon.js';
import MaterialButton      from './components/ui/components/material-button.js';
import Seperator           from './components/ui/components/seperator.js';

// global.navigator = { userAgent: 'all' }; // fix client/server checksum error for material-ui

injectTapEventPlugin();

let navigator;

if ( !navigator ) {
    navigator = {};

    navigator.userAgent = 'all';

}

const muiTheme = {

    palette : {

        primary1Color : CONFIG.theme.primaryColor,
        accent1Color  : CONFIG.theme.primaryColor,

    },

    userAgent :  navigator.userAgent

};

// const prepareStyles = muiTheme.prepareStyles;
//
//   muiTheme.prepareStyles = (style) => {
//     style = prepareStyles(style);
//
//     if (typeof style.display === 'object') {
//       style.display = style.display.join(';display:');
//     }
//
//     console.log( 'hello?' );
//
//     return style;
//   };
//
//
// console.log( muiTheme.prepareStyles() );


class Admin extends React.Component {

    constructor ( props ) {

        super( props );

        let height;


        // if (typeof window === 'undefined') {
        //     global.window = {}
        // } else {
        //
        //     height = $( window ).height();
        //
        // }

        this.state = {

            view             : 'post-container',
            height           : 500,
            postTypes        : null,
            statusBarQueue   : [],
            currentPost      : null,
            currentProject   : null,
            displayPostInfo  : true,
            user             : new User(),
            actionDialogOpen : false,
            actionCallback   : null,
            actionModel      : [],

        };

        // /* Required for responsive layout */

    }

    componentDidMount () {

        if ( typeof( window) !== 'undefined') {

            var timer = setTimeout( () => {

                this.setState({ height : $( window ).height() });


                $( window ).resize( () => {

                    this.setState({ height :  $(window).height() });

                });
            }, 200);
        }


        PostTypes.init( () => {

            this.setState({ PostTypes });

            let index = 0;

            this.state.PostTypes.map( ( element ) => {

                if ( index++ == 0 ) {
                    this.setState({ selectedPostType : element.id });
                }

            })

        },  ( date, message, status ) => {

            this.triggerStatusBar( date, message, status );

        });

    }

    structurePostTypes () {

        let postContainers   = [];
        let postSelector     = [];
        let postIndex        = 0;

        let uploadContainers = [];
        let uploadSelector   = [];
        let uploadIndex      = 0;

        if ( this.state.PostTypes ) {

            this.state.PostTypes.map( ( element, key ) => {

                postContainers[ element.id ] = <PostContainer

                        key             = { key }
                        index           = { key }
                        name            = { key }
                        postTypes       = { this.state.PostTypes }
                        model           = { element.post_container }
                        hyperlink       = { element.hyperlink }
                        postType        = { element }
                        width           = {{
                            container : 9,
                            info      : 3
                        }}
                        allowMultiple   = { true }
                        postDataTypes   = { PostTypes.postDataTypes }
                        displayPostInfo = { this.state.displayPostInfo }
                        setView         = { this.setView.bind( this ) }
                        onUpdate        = {

                            ( date, message, status ) => {

                                this.triggerStatusBar( date, message, status );

                            }

                        }
                    />;

                postSelector.push( <MenuItem key = { key } value = { element.id } primaryText = { element.name } /> );

                if ( element.uploadable == true ) {


                    uploadContainers.push({

                        model : element.post_container,
                        postType : element

                    });


                }

            });

        }

        return {

            posts : {

                container : postContainers,
                selector  : postSelector

            },

            uploads : uploadContainers

        };

    }

    setView ( view, currentPost ) {

        if ( currentPost) {

            let projectField;
            let postContainer;

            let i = 0;

            for ( let key in PostTypes.get() ) {

                if ( PostTypes.get()[ key ].id == this.state.selectedPostType ) {

                    let metas = PostTypes.get()[ key ].meta;

                    postContainer = PostTypes.get()[ key ].post_container;

                    for ( let key2 in metas ) {

                        if ( metas[ key2 ].data_type == 'project' ) {

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
                previousProject : new Project({ model : currentPost, projectField : projectField, parentModel : postContainer }),
                currentProject : new Project({ model : currentPost, projectField : projectField, parentModel : postContainer })

            });

        } else {

            this.setState({

                view,
                currentPost,
                currentProject : null,
                previousProject : null

            });

        }

    }

    triggerStatusBar ( date, message, status ) {

        let statusBarQueue = this.state.statusBarQueue;

        this.popStatusBarQueue();

        statusBarQueue.push({ date, message, status });

        this.setState({ statusBarQueue });

        clearTimeout( this.clearstatusBar );

        this.clearstatusBar = setTimeout( () => {

            this.popStatusBarQueue();

        }, 2000 );

    }

    popStatusBarQueue () {

        let statusBarQueue = this.state.statusBarQueue;

        statusBarQueue.shift();

        this.setState({ statusBarQueue });

    }

    disableStatusBar () {

        this.setState({ statusBarQueue : [] });

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

    handleMenuActionChange ( event, value ) {

        switch ( value ) {

            /* New Folder */
            case 0:

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            title    : 'Back to Post',
                            subtitle : {
                                pre : 'Are you sure to not save before going back?',
                            },
                        }
                    ],

                    actions : {

                        execute : ( _data ) => {

                            this.setView( 'post-container' );

                        }
                    },

                    actionStyle : {

                        dialogStyle   : {

                            width : '100%',
                            height : 'calc( 100% - 50px)',
                            top : 50

                        },
                    }

                });

            break;

        }

        this.setState({

            actionMenuOpen : false

        });

    }

    render () {

        let postTypes = this.structurePostTypes();
        let posts     = postTypes.posts;
        let uploads   = postTypes.uploads;

        let mainContainerStyle = {

            height: this.state.height,
            overflow: 'hidden'

        };

        let menuContainerStyle = {

            height    : this.state.view != 'post-container' ? 50 : 100,
            marginTop : this.state.view != 'post-container' ? -50 : ''

        };

        let primaryMenuStyle = {

            height    : 50,
            marginTop : this.state.view != 'post-container' ? -50 : '',

        };

        let logoStyle = {

            height    : '80%',
            marginTop : this.state.view != 'post-container' ? 100 : ''

        };

        let secondaryMenuItemStyles = [

            {
                display : this.state.view == 'post-container' ? '' : 'none',
                borderBottom: "1px solid rgb(230,230,230)"
            },

            {
                paddingTop : 4,
                marginTop : this.state.view == 'post-container' || this.state.view == 'project-editor' ? '0px' : '-100%',
                borderBottom: "1px solid rgb(230,230,230)",
            }

        ];

        let emptyDivStyle = {

            display   : 'inline-block',
            height    : this.state.view != 'post-container' ? 46 : 100,
            width     : '100%',
            marginTop : this.state.view != 'post-container' ? '' : ''

        };

        let appComponentStyles = [

            {
                marginTop : this.state.view == 'post-container' ? '' : '-100%',
                display : this.state.view == 'post-container' ? '' : 'none',
                height: this.state.height - 50,
                overflow: 'hidden'
            },

            {

                height    : '100%',
                display   : this.state.view == 'project-editor' ? 'inline' : 'none'
            },
            {
                marginTop : this.state.view == 'upload-container' ? '' : '',
                maxHeight : 'calc( 100% - 100px )'
            }

        ];

        return (

            <MuiThemeProvider muiTheme = { getMuiTheme( muiTheme )}>
                <div style = { mainContainerStyle }>
                    <div className = 'menu-container' style = { menuContainerStyle }>
                        <div className = 'row primary-menu' style = { primaryMenuStyle }>
                           <img id = 'logo' src = { CONFIG.backendUrl + '/images/logo.svg' } style = { logoStyle }/>
                           <MaterialButton
                               style = {{

                                   float       : 'right',
                                   fontWeight  : 'semi-bold',
                                   marginTop   : 0

                               }}
                               onClick = {
                                   () => {
                                       this.state.user.logout({} , () => {

                                           window.location.href = CONFIG.siteUrl + 'login';

                                       });
                                   }
                               }
                               label = { 'Logout' }
                               icon = { 'exit_to_app'}

                           />
                           <Seperator />

                           <MaterialButton
                               style = {{

                                   float       : 'right',
                                   fontWeight  : 'semi-bold',
                                   marginTop   : 0

                               }}
                               onClick = {
                                   () => {
                                       this.state.user.logout({} , () => {

                                           window.location.href = CONFIG.siteUrl + 'login';

                                       });
                                   }
                               }
                               label = { 'Settings' }
                               icon = { 'settings'}

                           />
                        </div>

                        <div className = 'row secondary-menu'>
                            <div className = 'secondary-menu-items' style = { secondaryMenuItemStyles[ 0 ] }>
                                {
                                    this.state.PostTypes ? <SelectField
                                        disabled       = { this.state.view != 'post-container' }
                                        style          = {{ width: '18.75%' }}
                                        labelStyle     = {{ fontSize : 20, color : CONFIG.theme.primaryColor }}
                                        underlineStyle = {{ borderBottom: 'none' }}
                                        value          = { this.state.selectedPostType }
                                        onChange       = { ( event, target, value ) => {

                                            this.setState({ selectedPostType : value });

                                        }}
                                    >
                                        { posts.selector }
                                    </SelectField> : ''
                                }
                                <ToggleIcon
                                    value = { this.state.displayPostInfo }
                                    style = {{

                                        float       : 'right',
                                        fontWeight  : 'semi-bold',
                                        marginTop   : 6,

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
                                {
                                    // <Seperator
                                    //     style = {{
                                    //         marginTop : 14
                                    //     }}
                                    // />
                                }
                            </div>
                            <div className = 'secondary-menu-items' style = { secondaryMenuItemStyles[ 1 ] }>
                                <MaterialButton
                                    style = {{

                                        float       : 'right',
                                        fontWeight  : 'semi-bold',
                                        marginTop   : 3,
                                        marginRight : 5

                                    }}
                                    onClick = {
                                        () => {
                                            this.state.currentProject.save();
                                        }
                                    }
                                    label = { 'Save' }
                                    icon  = { 'save' }

                                />
                                <Seperator
                                    style = {{
                                        marginTop : 11
                                    }}
                                />

                                <MaterialButton
                                    style = {{

                                        float       : 'right',
                                        fontWeight  : 'semi-bold',
                                        marginTop   : 3,

                                    }}
                                    onClick = {
                                        ( event ) => {

                                            const previousProject = { ...this.state.previousProject };
                                            const currentProject = { ...this.state.currentProject };

                                            previousProject.model = null;
                                            previousProject.parentModel = null;
                                            currentProject.model = null;
                                            currentProject.parentModel = null;

                                            console.log( 'the fck', this.state.previousProject, this.state.currentProject, previousProject, currentProject );

                                            if ( JSON.stringify( previousProject ) != JSON.stringify( currentProject ) ) {

                                                this.handleMenuActionChange( event, 0 );

                                            } else {

                                                this.setView( 'post-container' );

                                            }

                                        }

                                    }
                                    label = { 'Back to Posts' }
                                    icon = { 'keyboard_backspace' }
                                />
                            </div>
                        </div>
                    </div>

                    <div className = {"empty-div"} style = { emptyDivStyle } />
                    <div className = "row app-container">
                        <div className = "col-sm-12 components" style = { appComponentStyles[ 0 ] } >
                            <div style = {{ width : '100%', height: '100%' }}>
                                { posts.container[ this.state.selectedPostType ] ? posts.container[ this.state.selectedPostType ] : '' }
                            </div>
                        </div>
                        <div className = "col-sm-12 components" style = {  appComponentStyles[ 1 ] }>
                            <div style = {{ width : '100%', height:  '100%' }}>
                                {
                                   this.state.currentProject ?
                                   <ProjectEditor
                                      model         = { this.state.currentProject }
                                      updateCurrentProject = { ( currentProject ) => {
                                          this.setState({
                                              currentProject
                                          })
                                      }}
                                      post          = { this.state.currentPost }
                                      postContainer = { this.state.PostTypes }
                                      display       = { this.setView.bind( this ) }
                                      postTypes     = { this.state.PostTypes }
                                  /> : ''

                                }
                            </div>
                        </div>

                    </div>
                    <StatusBarContainer
                        queue = { this.state.statusBarQueue }
                        pop   = { this.popStatusBarQueue.bind( this ) }
                    />
                    <AdminAction
                        selected          = { null }
                        open              = { this.state.actionDialogOpen }
                        onRequestClose    = { this.handleActionDialogClose.bind( this ) }
                        actions           = { this.state.actions }
                        actionModel       = { this.state.actionModel }
                        actionDescription = { this.state.actionDescription }
                        actionDialogStyle = { this.state.actionStyle }
                    />
                </div>
            </MuiThemeProvider>

        );

    }

}

export default Admin;
