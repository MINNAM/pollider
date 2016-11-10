import $                    from 'jquery';
import React                from 'react';
import ReactDOM             from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

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

import PostTypes  from './components/post-container/models/post-types.js';
import * as Model from './components/post-container/models/post-container.js';
import Project    from './components/project-editor/model/project.js';

import PostContainer      from './components/post-container/components/post-container.js';
import ProjectEditor      from './components/project-editor/components/project-editor.js';
import StatusBarContainer from './components/status-bar/components/status-bar-container.js';

injectTapEventPlugin();

const muiTheme = getMuiTheme({

    palette: {

        primary1Color : CONFIG.theme.primaryColor,
        accent1Color  : CONFIG.theme.primaryColor,

    }

});

class App extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            view             : 'post-container',
            height           : $( window ).height(),
            postTypes        : null,
            selectedPostType : 0,
            statusBarQueue   : [],
            currentPost      : null,
            currentProject   : null,
            displayPostInfo  : true

        };

        /* Required for responsive layout */
        $( window ).resize( () => {

            this.setState({ height : $( window ).height() });

        });

    }

    componentDidMount () {

        PostTypes.init( () => {

            this.setState({ PostTypes });

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

            this.state.PostTypes.map( function ( element, key ) {

                postContainers.push(

                    <PostContainer
                        key             = { key }
                        name            = { key }
                        model           = { element.post_container }
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
                    />

                );

                postSelector.push( <MenuItem key = { key } value = { postIndex++ } primaryText = { element.name } /> );

                if ( element.uploadable == true ) {


                    uploadContainers.push({

                        model : element.post_container,
                        postType : element

                    });


                }

            }.bind( this ));

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

                if ( i == this.state.selectedPostType ) {

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
                currentProject : new Project({ model : currentPost, projectField : projectField, parentModel : postContainer })

            });

        } else {

            this.setState({

                view,
                currentPost,
                currentProject : null

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

    render () {

        let postTypes = this.structurePostTypes();
        let posts     = postTypes.posts;
        let uploads   = postTypes.uploads;

        let mainContainerStyle = {

            height: this.state.height

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
                marginTop : this.state.view == 'post-container' ? '' : '-100%',
                borderBottom: "1px solid rgb(230,230,230)"
            },

            {
                marginTop : this.state.view == 'post-container' || this.state.view == 'project-editor' ? '' : '-100%',
                borderBottom: "1px solid rgb(230,230,230)"
            }

        ];

        let emptyDivStyle = {

            display   : 'inline-block',
            height    : this.state.view != 'post-container' ? 50 : 100,
            width     : '100%',
            marginTop : this.state.view != 'post-container' ? '' : ''

        };

        let appComponentStyles = [

            {
                marginTop : this.state.view == 'post-container' ? '' : -this.state.height + 100,
                maxHeight : 'calc( 100% - 100px )'
            },

            {

                height    : 'calc( 100% - 50px )',
                maxHeight : 'calc( 100% - 50px )',
                display   : this.state.view == 'project-editor' ? 'inline' : 'none'
            },
            {
                marginTop : this.state.view == 'upload-container' ? '' : '',
                maxHeight : 'calc( 100% - 100px )'
            }

        ];

        return (

            <MuiThemeProvider muiTheme = { getMuiTheme( muiTheme ) }>
                <div style = { mainContainerStyle }>
                    <div className = 'menu-container' style = { menuContainerStyle }>
                        <div className = 'row primary-menu' style = { primaryMenuStyle }>
                            <img id = 'logo' src = { CONFIG.backendUrl + '/img/logo6.svg' } style = { logoStyle }/>
                        </div>
                        <div className = 'row secondary-menu'>
                            <div className = 'secondary-menu-items' style = { secondaryMenuItemStyles[ 0 ] }>
                                {
                                    this.state.PostTypes ? <SelectField
                                        disabled       = { this.state.view != 'post-container' }
                                        style          = {{  width: 100 }}
                                        labelStyle     = {{ fontSize : '1.8vh', color : CONFIG.theme.primaryColor }}
                                        underlineStyle = {{ borderBottom: 'none' }}
                                        value          = { this.state.selectedPostType }
                                        onChange       = { ( event, target, value ) => {


                                            this.setState({ selectedPostType : value });

                                        }}
                                    >
                                        { posts.selector }
                                    </SelectField> : ''
                                }

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
                            <div className = 'secondary-menu-items' style = { secondaryMenuItemStyles[ 1 ] }>

                                <FlatButton
                                    style = {{

                                        marginTop : 2.5,
                                        float     : 'right'

                                    }}
                                    label = "HTML"
                                    onTouchTap = { () => {

                                        console.log( this.state.currentProject.html() );

                                    }}
                                />
                                <FlatButton
                                    style = {{
                                        marginTop : 2.5,
                                        float     : 'right'
                                    }}
                                    label = "Save"
                                    onTouchTap = { () => {

                                        console.log( this.state.currentProject );

                                        this.state.currentProject.save();

                                    }}
                                />
                                <FlatButton
                                    disabled = { this.state.view != 'project-editor' }
                                    onTouchTap = { () => {

                                        this.setView( 'post-container' );

                                    }}
                                    style = {{ marginTop : 2.5, float: 'right'}}
                                    label = "Back to Posts"
                                />
                            </div>
                        </div>
                    </div>

                    <div className = {"empty-div"} style = { emptyDivStyle } />
                    <div className = "row app-container" >
                        <div className = "col-sm-12 components" style = { appComponentStyles[ 0 ] } >
                            <div style = {{ width : '100%', height:  '100%' }}>
                                { posts.container[ this.state.selectedPostType ] ? posts.container[ this.state.selectedPostType ] : '' }
                            </div>
                        </div>
                        <div className = "col-sm-12 components" style = {  appComponentStyles[ 1 ] }>
                            <div style = {{ width : '100%', height:  '100%' }}>
                                {
                                   this.state.currentProject ?
                                   <ProjectEditor
                                      model   = { this.state.currentProject}
                                      post    = { this.state.currentPost }
                                      display = { this.setView.bind( this ) }
                                      uploads = { uploads }
                                  /> : ''

                                }
                            </div>
                        </div>

                    </div>
                    <StatusBarContainer
                        queue = { this.state.statusBarQueue }
                        pop   = { this.popStatusBarQueue.bind( this ) }
                    />
                </div>
            </MuiThemeProvider>

        );

    }

}

ReactDOM.render ( <App />, document.querySelector('#pollider') );
