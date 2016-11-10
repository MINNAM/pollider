import $                    from 'jquery';
import React                from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

/* Material UI */
import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton       from 'material-ui/IconButton';
import FlatButton       from 'material-ui/FlatButton';
import Popover          from 'material-ui/Popover';
import IconMenu         from 'material-ui/IconMenu';
import Menu             from 'material-ui/Menu';
import MenuItem         from 'material-ui/MenuItem';
import Toggle           from 'material-ui/Toggle';
import Divider          from 'material-ui/Divider';
import Subheader        from 'material-ui/Subheader';
import Checkbox         from 'material-ui/Checkbox';
import AutoComplete     from 'material-ui/AutoComplete';
import MoreVertIcon     from 'material-ui/svg-icons/navigation/more-vert';
import FilterList       from 'material-ui/svg-icons/content/filter-list';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle }  from 'material-ui/Toolbar';

/* Pollider */
import CONFIG            from '../../../models/m-config.js';

import * as Model        from '../models/post-container.js';
import Post              from './post.js';
import PostInfoContainer from './post-info-container.js';
import PostAction        from './post-action.js';
import PostIcon          from './post-icon';

class PostContainer extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            actionDialogOpen : false,
            actionModel      : [],
            destination      : null,
            filterList       : [],
            selected         : null,
            selectMultiple   : false,
            searchedSource   : [],
            value            : -1,

        };

    }

    componentDidMount () {

        const model = this.props.model;

        model.getPosts( this.props.postType,  () => {

            this.setState({ model });

        });

    }

    shouldComponentUpdate ( nextProps, nextState ) {

        return true;

    }

    setSelected ( element ) {

        if ( this.state.selectMultiple ) {

            let selected = this.state.selected;

            if ( !selected ) {

                selected = [];

            }

            for ( let i = 0, max = selected.length; i < max; i++ ) {

                if ( selected[ i ].id == element.id ) {

                    selected.splice( i, 1 );

                    this.setState({ selected });

                    return;

                }

            }

            selected.push( element );

            this.setState({ selected });

        } else {

            /* onAction* in ProjectEditor  */
            if ( this.props.onExternalActionChange ) {

                this.props.onExternalActionChange( element );

            }

            if ( this.props.onExternalActionUpdate ) {

                this.props.onExternalActionUpdate( element );

            }

            this.setState({ selected : element });

        }

    }

    /**
    *   Sets destination parent id of a container.
    *   Called in Post->onDrop()
    */
    setDestination ( destination ) {

        this.setState({ destination });

    }

    onSelectMultiple ( event, isToggled ) {

        if ( isToggled ) {

            this.setState({

                selectMultiple : true,
                selected       : [],

            });

        } else {

            this.setState({

                selectMultiple : false,
                selected       : null,

            });

        }

    }

    resetSelection () {

        this.setState({ selected : null });

    }

    updatePostContainer () {

        this.setState({ model : this.state.model });

    }

    reallocateModel ( parentId, id, name ) {

        if ( this.state.selectMultiple ) {

            this.state.selected.map( ( element ) => {

                if ( this.reallocatePost( element.parent_id, element.id, this.state.destination ) ) {

                    element.parent_id = this.state.destination;

                }

            });

        } else {

            this.state.model.checkPostExist( this.state.destination , name, ( exists ) => {

                if ( !exists ) {

                    this.reallocatePost( parentId, id, this.state.destination );

                }

            });

        }

    }

    reallocatePost ( parentId, id, destination ) {

        if ( parentId == destination || id == destination || parentId == null ) {

            return false;

        }

        const posts         = this.state.model;
        /* Find an element to copy, duplicate, and change it's field, parentId, to destination */
        let temp            = posts.copyPost( posts.navigateParent( posts.posts, parentId ).children[ id ], destination );
        /* Find a destination element, exclude if it's destination is one of it's child */
        let destinationPost = posts.navigateParent( posts.posts, destination, id );

        if ( destinationPost ) {

            destinationPost.children[ id ] = temp;
            temp.parent_id = destination;

            posts.navigateParent( posts.posts, parentId ).children[ id ] = null;

            delete posts.navigateParent( posts.posts, parentId ).children[ id ];

            this.setState({ Posts : posts });

            posts.updatePost( temp );

            return temp;

        }

        return false;

    }

    populatePost ( id, parentId, element  ) {

        if ( element.container > 0 ) {

            return this.createPost( id, parentId, element, true );

        } else {

            return this.createPost( id, parentId, element );

        }

    }

    createPost ( id, parentId, element, isParent ) {

        let self = this;

        return (

            <Post
                key             = { element.id }
                model           = { element }
                postType        = { self.props.postType }
                postDataTypes   = { self.props.postDataTypes }
                selected        = { self.state.selected }
                setSelected     = { self.setSelected.bind( self ) }
                setDestination  = { self.setDestination.bind( self ) }
                reallocateModel = { self.reallocateModel.bind( self ) }
                upload          = { self.upload.bind( self ) }
                insertPost      = {

                    ( target, file, dataType ) => {

                        var parentId = target.parent_id;

                        if ( target.container > 0 ) {

                            parentId = target.id;

                        }

                        this.insertPost({

                            name              : file.name,
                            size              : file.size,
                            container         : 0,
                            parent_id         : parentId,
                            post_data_type_id : dataType

                        }, file );

                    }

                }
            >
                {
                    isParent ? function () {

                        const children = [];

                        for ( var key in element.children ) {

                            children.push( self.populatePost( key, id, element.children[ key ] ) );

                        }

                        return children;

                    }() : null
                }
            </Post>
        );

    }

    insertPost ( data, file ) {

        const filename = data.name.split( '.' );

        data.name      = filename[ 0 ];
        data.extension = filename[ 1 ] ? filename[ 1 ] : null;

        let temp = Object.assign({ post_type_id : this.props.postType.id }, data );

        this.state.model.insertPost( temp , ( newPost ) => {

            const model = this.state.model;

            newPost.fileToUpload = file;

            if ( newPost.parent_id == null ) {

                model.posts[ newPost.id ] = newPost;

            } else {

                model.navigateParent( model.posts, newPost.parent_id ).children[ newPost.id ] = newPost;

            }

            this.setState({ model: model, selected: newPost });

        });

    }

    deletePost () {

        const model    = this.state.model;
        const selected = this.state.selected;

        model.deletePost( selected, function () {

            if ( Object.prototype.toString.call( selected ) == '[object Array]' ) {

                for( var i = 0; i < selected.length; i++ ) {

                    if ( selected[ i ].parent_id == null ) {

                        delete model.posts[ selected[ i ].id ];

                    } else {

                        delete model.navigateParent( model.posts, selected[ i ].parent_id ).children[ selected[ i ].id ];

                    }

                }

            } else {

                if ( selected.parent_id == null ) {

                    delete model.posts[ selected.id ];

                } else {

                    delete model.navigateParent( model.posts, selected.parent_id ).children[ selected.id ];

                }

            }

            this.setState({

                model    : model,
                selected : this.state.selectMultiple ? [] : null

            });

        }.bind( this ) );

    }

    handleActionChange ( event, value ) {

        var parentId;

        if ( this.state.selected ) {

            parentId = this.state.selected.parent_id;

            if ( this.state.selected.container > 0 ) {

                parentId = this.state.selected.id;

            }

        }

        switch ( value ) {

            /* New Folder */
            case 0:

                this.handleActionDialogOpen({

                    actionModel : [
                        {

                            title    : 'New folder',
                            field    : 'name',
                            dataType : 'debounce-text',
                            option   : 'PARENT_NULL'

                        }

                    ],
                    actions : {

                        execute : ( param ) => {

                            const folder = Object.assign( param,  {

                                container         : 1,
                                parent_id         : null,
                                post_data_type_id : 1,
                                size              : -1,

                            });

                            this.insertPost( folder );

                        }

                    }

                });

            break;

            /* New Subfolder */
            case 1:

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            title       : 'New Subfolder',
                            field       : 'name',
                            dataType    : 'debounce-text',
                            model       : this.props.model,
                            selected    : this.state.selected

                        }
                    ],

                    actions : {

                        execute : ( param ) => {

                            const subfolder = Object.assign( param, {

                                container         : 1,
                                parent_id         : parentId,
                                post_data_type_id : 2,
                                size              : -1,

                            });

                            this.insertPost( subfolder );

                        }

                    }

                });

            break;

            /* New Post */
            case 2:

                this.handleActionDialogOpen({

                    actionModel : [

                        {

                            title    : 'New ' + this.props.postType.name_singular ,
                            field    : 'name',
                            dataType : 'debounce-text'

                        }

                    ],

                    actions : {

                        execute : ( param ) => {

                            const post = Object.assign( param,  {

                                container         : 0,
                                parent_id         : parentId,
                                post_data_type_id : 7,
                                size              : -1

                            });

                            this.insertPost( post );

                        }

                    }

                });

            break;

            /* Duplicate Post */
            case 3:

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            field : 'name',
                            dataType : 'text'

                        }

                    ],

                    actions : {

                        execute : () => {

                            const post = Object.assign( this.state.selected,  {

                                name : data.name

                            });

                            this.insertPost( post );

                        }
                    }
                });

            break;

            case 4:

                this.deletePost();
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

    handleActionDialogOpen ( data ) {

        this.setState({

            actionDialogOpen : true,
            actions          : data.actions,
            actionModel      : data.actionModel

        });

    }

    handleActionDialogClose () {

        this.setState({

            actionDialogOpen : false

        });

    }

    onDrag ( event ) {

        $( '#selected-item' ).css({

            display : 'inline',
            left    : event.pageX + 20 + 'px',
            top     : ( event.pageY - document.body.scrollTop ) + 'px'

        });

    }

    onDragEnd ( event ) {

        $( '#selected-item' ).css({

            display : 'none',
            left    : event.pageX + 20 + 'px',
            top     : ( event.pageY - document.body.scrollTop ) + 'px'

        });

    }

    handleSelectedItem () {

        const selectedItems = [];

        if ( this.state.selectMultiple ) {

            if ( this.state.selected.length > 0 ) {

                this.state.selected.map( ( element, key ) => {

                    selectedItems.push (

                        <div
                            key       = { key }
                            className = { 'selected-item-label' + ( element.parent_id == null ? ' none-movable-item' : '' ) }
                        >
                            { element.name }
                        </div>

                    );

                });

            }

            return selectedItems;

        } else {

            if ( this.state.selected ) {

                var element = this.state.selected;

                return (
                    <div className = { 'selected-item-label' + ( element.parent_id == null ? ' none-movable-item' : '' ) } >
                        { element.name }
                    </div>
                );

            }

        }

    }

    upload ( parentId, id , updateStatus ) {

        const posts        = this.state.model;
        const postToUpload = posts.navigateParent( posts.posts, parentId ).children[ id ] ;

        postToUpload.upload( updateStatus, () => {

            this.setState({ model : posts });

        });

    }

    handlePostInfoFilterChange ( event, value ) {

        this.setState({

            filterList : value

        });

    }


    render () {

        const model = this.state.model ? this.state.model.posts : {};
        const posts = [];

        for ( let key in model ) {

            var element = model[ key ];

            if ( element.container > 0 ) {

                posts.push( this.populatePost( key, null, element ) );

            }

        }

        return (

            <div>
                <div id = 'selected-item' className = 'selected-item'>
                    { this.handleSelectedItem() }
                </div>
                <div className = { ( this.props.displayPostInfo ? "col-sm-" + this.props.width.container : "col-sm-12" ) + " post-list-container" }  onTouchTap = { this.resetSelection.bind( this ) }>
                    <div
                        className = { 'ui-container' }
                        style     = {{ paddingLeft: 0, paddingRight: 0, overflow: 'hidden', height: '100%' }}
                        onDrag    = { this.onDrag.bind( this ) }
                        onDragEnd = { this.onDragEnd.bind( this ) }
                    >
                        <Toolbar
                            style = {{ background : 'white', paddingRight : 10, paddingLeft: 40, borderBottom: '1px solid rgb(240,240,240)' }}
                            onTouchTap = { ( event ) => { event.stopPropagation(); }}
                        >
                            <ToolbarGroup firstChild = {true} >
                                <AutoComplete
                                  hintText       = { "Search in " + this.props.name }
                                  dataSource     = { this.state.searchedSource }
                                  textFieldStyle = {{ width: '100%' }}
                                />
                            </ToolbarGroup>
                            <ToolbarGroup>
                                {
                                    this.props.allowMultiple ? <Toggle
                                        label    = "Select Multiple"
                                        onToggle = { this.onSelectMultiple.bind( this ) }
                                        style    = {{ width: 150, marginTop: 17 }}
                                    /> : ''
                                }
                                <ToolbarSeparator />
                                <FlatButton
                                  onTouchTap = { this.handleActionMenuOpen.bind( this ) }
                                  label      = "Actions"
                                  style      = {{ marginTop: 11, float: 'right', margin: '0 0 0 10px' }}
                                />
                                <Popover
                                  open           = { this.state.actionMenuOpen }
                                  anchorEl       = { this.state.actionMenuAnchorEl }
                                  anchorOrigin   = {{ horizontal: 'right', vertical: 'bottom' }}
                                  targetOrigin   = {{ horizontal: 'right', vertical: 'top' }}
                                  onRequestClose = { this.handleActionMenuClose.bind( this ) }
                                >
                                    <Menu onChange = { this.handleActionChange.bind( this )}>
                                        <MenuItem value = { 0 } disabled = { this.state.selectMultiple } primaryText="New Folder" />
                                        <MenuItem value = { 1 } disabled = { this.state.selectMultiple || this.state.selected == null } primaryText="New Subfolder" />
                                        <MenuItem value = { 2 } disabled = { this.state.selectMultiple } primaryText = {'New ' + this.props.postType.name_singular} />
                                        <Divider/>
                                        <MenuItem value = { 3 } disabled = { this.state.selectMultiple } primaryText="Duplicate" />
                                        <MenuItem value = { 4 } primaryText="Delete" />
                                        <Divider/>
                                        <MenuItem value = { 5 } primaryText="Download" />
                                    </Menu>
                                </Popover>
                            </ToolbarGroup>
                        </Toolbar>
                        <div style = {{ height: '93%', position: 'relative' }}>
                            <div style = {{ height: '100%', overflow: 'auto', backgroundImage: "url( '" + CONFIG.backendUrl + "../img/post-list-background.png' )", backgroundAttachment: 'local' }}>
                                {
                                  posts /* Adding Posts*/
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className = { "col-sm-" + this.props.width.info + " post-info-container"} style = {{ display : ( this.props.displayPostInfo ? 'inline' : 'none' ) }}>
                    <div className = { 'ui-container' } style = {{ paddingLeft : 0, paddingRight: 0 }}>
                        <Toolbar style  = {{ background : 'white', paddingRight : 10, paddingLeft: 40, borderBottom: '1px solid rgb(240,240,240)' }}>
                            <ToolbarGroup firstChild={true}>
                                { this.state.selected !== null ? <PostIcon model = { this.state.selected } /> : '' }
                                <ToolbarTitle text = { this.state.selected ? this.state.selected.name : this.props.name } />
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <IconMenu
                                    iconButtonElement = { <IconButton><FilterList /></IconButton>}
                                    style             = {{ marginTop: 8 }}
                                    menuStyle         = {{ width: 200 }}
                                    multiple          = { true }
                                    value             = { this.state.filterList }
                                    onChange          = { this.handlePostInfoFilterChange.bind( this ) }
                                >
                                    <MenuItem value = { 'name' } primaryText = "Name" />
                                    <MenuItem value = { 'public_date' } primaryText = "Public Date" />
                                    <MenuItem value = { 'created_date' } primaryText = "Created Date" />
                                    <MenuItem value = { 'modified_date' } primaryText = "Modified Date" />
                                    <MenuItem value = { 'size' } primaryText = "Size" />

                                </IconMenu>
                            </ToolbarGroup>
                        </Toolbar>
                        <div className = "row" style = {{ margin: 0, height: '90%', overflow: 'auto', padding: '2.5 2.5% 0 2.5%', boxSizing : 'border-box' }}>
                            {
                                this.state.selected ?
                                    <PostInfoContainer
                                        parentModel            = { this.state.model }
                                        model                  = { this.state.selected }
                                        handleActionDialogOpen = { this.handleActionDialogOpen.bind( this ) }
                                        handleProjectEditor        = { () => { this.props.setView( 'project-editor', this.state.selected ); } }
                                        postMeta               = { this.props.postType.meta }
                                        filterList             = { this.state.filterList }
                                    />
                                : ''
                            }
                        </div>
                    </div>

                </div>


                <PostAction
                    model          = { this.state.model }
                    selected       = { this.state.selected }
                    open           = { this.state.actionDialogOpen }
                    onRequestClose = { this.handleActionDialogClose.bind( this ) }
                    actions        = { this.state.actions }
                    actionModel    = { this.state.actionModel }
                />
            </div>

        );

    }

};

PostContainer.propTypes = {

    model                   : React.PropTypes.object.isRequired,
    postType                : React.PropTypes.object.isRequired,
    postDataTypes           : React.PropTypes.object.isRequired,
    name                    : React.PropTypes.string.isRequired,
    allowMultiple           : React.PropTypes.bool.isRequired,
    width                   : React.PropTypes.object,
    displayPostInfo         : React.PropTypes.bool,
    setView                 : React.PropTypes.func,
    onExternalActionChange  : React.PropTypes.func,
    onExternalActionUpdate  : React.PropTypes.func,

};

export default PostContainer;
