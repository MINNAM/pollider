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

import MaterialButton          from '../../ui/components/material-button.js';
import Seperator          from '../../ui/components/seperator.js';

import { formatHyperlink } from '../models/utility.js';

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
            selectedSource   : [],
            inputText        : '',

        };

    }

    componentDidMount () {

        const model = this.props.model;

        model.getPosts( this.props.postType,  () => {

            for ( let key in model.posts ) {

                model.posts[ key ].update();

            }

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

                this.props.onExternalActionChange({ ...element, post_type_id : this.props.postType.id });

            }

            if ( this.props.onExternalActionUpdate ) {

                this.props.onExternalActionUpdate({ ...element, post_type_id : this.props.postType.id });

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

    reallocateModel ( parentId, id, name, hyperlink ) {

        if ( this.state.selectMultiple ) {

            this.state.selected.map( ( element ) => {

                if ( this.reallocatePost( element.parent_id, element.id, this.state.destination ) ) {

                    element.parent_id = this.state.destination;

                }

            });

        } else {

            this.state.model.checkPostExist( id, this.state.destination, name, hyperlink, ( exists ) => {

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
            destinationPost.children[ id ].parent_id = destination;
            destinationPost.children[ id ].parentNode = destinationPost;

            destinationPost.children[ id ].update();

            posts.navigateParent( posts.posts, parentId ).children[ id ] = null;

            delete posts.navigateParent( posts.posts, parentId ).children[ id ];

            this.setState({ Posts : posts, selected : destinationPost.children[ id ] });

            posts.updatePost( destinationPost.children[ id ] );



            return destinationPost.children[ id ];

        }

        return false;

    }

    populatePost ( id, parentId, element  ) {

        if ( element.container > 0 ) {

            let post = this.createPost( id, parentId, element, true );

            return post;

        } else {

            let post = this.createPost( id, parentId, element );

            return post;

        }

    }

    createPost ( id, parentId, element, isParent ) {

        let self = this;

        if ( element.id == this.props.selected ) {

            if ( !this.state.selected ) {

                this.setState({

                    selected : element

                });

            }

        }

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

                        let parentId = target.parent_id;

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

                        for ( let key in element.children ) {

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

        data.hyperlink = formatHyperlink( data.name );

        let temp = Object.assign({ post_type_id : this.props.postType.id }, data );

        this.state.model.insertPost( temp, ( newPost ) => {

            const model = this.state.model;

            newPost.fileToUpload = file;

            if ( newPost.parent_id == null ) {

                model.posts[ newPost.id ] = newPost;

            } else {

                const parent = model.navigateParent( model.posts, newPost.parent_id );

                parent.children[ newPost.id ] = newPost;
                parent.children[ newPost.id ].parentNode = parent;

            }

            this.setState({ model: model, selected: newPost });

        });

    }

    deletePost () {

        const model    = this.state.model;
        const selected = this.state.selected;

        model.deletePost( selected, function () {

            if ( Object.prototype.toString.call( selected ) == '[object Array]' ) {

                for( let i = 0; i < selected.length; i++ ) {

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

        let parentId;

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
                            option   : 'PARENT_NULL',
                            parentModel  : this.props.model,
                            selected : null

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
                            parentModel  : this.props.model,
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
                            dataType : 'debounce-text',
                            model       : this.props.model,
                            parentModel  : this.props.model,
                            selected    : this.state.selected

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

                this.handleActionDialogOpen({

                    actionModel : [
                        {

                            title : 'Alias',

                        }
                    ],

                    actions : {
                        execute : () => {

                            // this.createAlias( this.state.selected );

                            this.state.selected.createAlias( ( _newPost ) => {

                                const model = this.state.model;
                                const newPost =  model.new();

                                newPost.assign( _newPost );

                                if ( newPost.parent_id == null ) {

                                    model.posts[ newPost.id ] = newPost;

                                } else {

                                    const parent = model.navigateParent( model.posts, newPost.parent_id );

                                    parent.children[ newPost.id ] = newPost;
                                    parent.children[ newPost.id ].parentNode = parent;

                                }

                                this.setState({ model: model, selected: newPost });

                            });


                            // const alias = Object.assign({}, this.state.selected, {
                            //     name : this.state.selected.name + '.alias',
                            //     id : 5,
                            //
                            // });
                            //
                            // const model = this.state.model;
                            //
                            // if ( alias.parent_id == {} ) {
                            //
                            //     model.posts[ alias.id ] = alias;
                            //
                            // } else {
                            //
                            //     model.navigateParent( model.posts, alias.parent_id ).children[ alias.id ] = alias;
                            //
                            // }
                            //
                            // this.setState({ model: model, selected: alias });

                        }
                    }
                });

            break;
            /* Delete Post */
            case 5 :

                this.handleActionDialogOpen({

                    actionModel : [
                        {
                            title : 'Delete',
                            subtitle : {
                                pre : 'Are you sure to delete ',
                                middle : this.state.selected.name,
                                post  : "?"
                            },
                            dataType : null

                        }

                    ],

                    actions : {

                        execute : () => {

                            console.log( 'hello' );

                            this.deletePost();

                        }
                    }
                });

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

                let element = this.state.selected;

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

    handleUpdateInput ( searchText, dataSource ) {

        const searchedSource = [];

        this.setState({ searchedSource, inputText : searchText });
    }

    populateInput () {

        const model = this.state.model ? this.state.model.posts : {};

        let posts = [];

        let inputText = this.state.inputText;

        posts = this.repeatInput( model, inputText );

        return posts;

    }


    repeatInput ( model, inputText ) {

        const posts = [];

        for ( let key in model ) {

            let element = model[ key ];

            if ( element.name.includes( inputText ) ) {

                posts.push( this.createPost( key, null, element ) );

            }

            if ( element.children ) {

                const tempPosts = this.repeatInput( element.children, inputText );

                tempPosts.map ( ( element2, key ) => {

                    posts.push( element2 );

                });
            }
        }
        return posts;
    }

    render () {

        const model = this.state.model ? this.state.model.posts : {};
        let posts = [];

        let inputText = this.state.inputText;

        if ( inputText ) {

            posts = this.populateInput();

        } else {

            for ( let key in model ) {

                let element = model[ key ];

                if ( element.container > 0 ) {

                    posts.push( this.populatePost( key, null, element ) );

                }
            }
        }

        return (

            <div style = {{height:'100%'}}>
                <div id = 'selected-item' className = 'selected-item'>
                    { this.handleSelectedItem() }
                </div>
                <div className = { ( this.props.displayPostInfo ? "col-sm-" + this.props.width.container : "col-sm-12" ) + " post-list-container" }  onTouchTap = { () => { /* this.resetSelection.bind( this ) */ } }>
                    <div
                        className = { 'ui-container' }
                        style     = {{ background : 'white', paddingLeft: 0, paddingRight: 0, overflow: 'hidden', height: '100%' }}
                        onDrag    = { this.onDrag.bind( this ) }
                        onDragEnd = { this.onDragEnd.bind( this ) }
                    >
                        <div
                            style = {{
                                width : '100%',
                                display :'inline-block',
                                height : 56,
                                borderBottom: '1px solid rgb(240,240,240)',
                                padding : '0 10px'
                            }}
                        >
                            <AutoComplete
                                style = {{
                                    marginLeft : 0,
                                    float : 'left',
                                    width : '50%'
                                }}
                                underlineFocusStyle = {{
                                    color : CONFIG.theme.primaryColor
                                }}
                                hintText       = { "Search in " + this.props.name }
                                dataSource     = { this.state.searchedSource }
                                textFieldStyle = {{ width: '100%' }}
                                onUpdateInput  = { this.handleUpdateInput.bind( this ) }
                                open           = {false}
                            />
                            <MaterialButton
                                style      = {{
                                    float: 'right',
                                    margin: '9.5px 0 0 0',
                                    float: 'right'
                                }}

                                onClick = { this.handleActionMenuOpen.bind( this ) }
                                icon  = { 'more_vert' }
                                iconStyle = {{
                                    color : 'rgb(60,60,60)'
                                }}

                            />

                            {
                                // <Seperator
                                //     style = {{
                                //         marginTop : 18
                                //     }}
                                // />
                            }

                            <Popover
                              open           = { this.state.actionMenuOpen }
                              anchorEl       = { this.state.actionMenuAnchorEl }
                              anchorOrigin   = {{ horizontal: 'left', vertical: 'bottom' }}
                              targetOrigin   = {{ horizontal: 'right', vertical: 'top' }}
                              onRequestClose = { this.handleActionMenuClose.bind( this ) }
                            >
                                <Menu
                                    onChange = { this.handleActionChange.bind( this )}
                                    style = {{
                                        float : 'right'
                                    }}
                                    menuItemStyle = {{
                                        fontSize : 14
                                    }}
                                >
                                    <MenuItem value = { 0 } disabled = { this.state.selectMultiple } primaryText="New Folder" />
                                    <MenuItem value = { 1 } disabled = { this.state.selectMultiple || this.state.selected == null } primaryText="New Subfolder" />
                                    <MenuItem value = { 2 } disabled = { this.state.selectMultiple } primaryText = {'New ' + this.props.postType.name_singular } />
                                    <Divider/>
                                    <MenuItem value = { 3 } disabled = { this.state.selectMultiple || this.state.selected !== null } primaryText="Duplicate" />
                                    <MenuItem value = { 4 } disabled = { this.state.selectMultiple || ( this.state.selected !== null && this.state.selected.container == 1 ) } primaryText="Alias" />
                                    <MenuItem value = { 5 } primaryText="Delete" />
                                    <Divider/>
                                    <MenuItem value = { 6 } primaryText="Download" />
                                </Menu>
                            </Popover>

                            {
                                // this.props.allowMultiple ? <Toggle
                                //     label    = "Select Multiple"
                                //     onToggle = { this.onSelectMultiple.bind( this ) }
                                //     style    = {{
                                //         width: 150,
                                //         marginTop: 17,
                                //         float: 'right'
                                //     }}
                                //     labelStyle = {{
                                //         fontSize : 12
                                //     }}
                                // /> : ''
                            }

                        </div>

                        <div style = {{ height: 'calc(100% - 7px)', marginTop: -3, position: 'relative' }}>
                            <div style = {{ height: 'calc(100% - 100px)', overflow: 'auto', backgroundImage: "url( '" + CONFIG.backendUrl + "../images/post-list-background.png' )", backgroundAttachment: 'local' }}>
                                {
                                  posts /* Adding Posts*/
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className = { "col-sm-" + this.props.width.info + " post-info-container"} style = {{ display : ( this.props.displayPostInfo ? 'inline' : 'none' ) }}>
                    <div className = { 'ui-container' } style = {{ height: '100%', paddingLeft : 0, paddingRight: 0 }} >
                        <div
                            style = {{
                                width : '100%',
                                height : 56,
                                padding : '0 5px 10px 10px',
                                borderBottom: '1px solid rgb(240,240,240)',
                            }}
                        >

                            <span style = {{ marginTop: 9, display: 'inline-block', float: 'left'}}>{ this.state.selected ? <PostIcon model = { this.state.selected } style = {{ width : 35, height : 35 }} /> : '' }</span>

                            <span
                                style = {{
                                    marginLeft : 9,
                                    lineHeight: '56px',
                                    fontSize: 18,
                                    width: '60%',
                                    display: 'inline-block',
                                    overflow: 'hidden',
                                    height: 56,
                                    float: 'left',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                { this.state.selected ? this.state.selected.name : this.props.name }
                            </span>

                            {
                                this.state.mainEdit ? <MaterialButton
                                    style = {{

                                        float       : 'right',
                                        fontWeight  : 'semi-bold',
                                        margin      : '10px 5px 0 0px',

                                    }}
                                    onClick = { () => { this.state.mainEdit(); } }
                                    icon  = { 'mode_edit' }
                                    iconStyle = {{
                                        color : 'rgb(60,60,60)'
                                    }}

                                /> : ''
                            }
                            {
                                // this.state.mainEdit ? <Seperator
                                //     style = {{
                                //         marginTop : 18
                                //     }}
                                // /> : ''
                            }

                        </div>
                        <div className = "row" style = {{ margin: 0, height: 'calc(100% - 112px)', overflow: 'auto', padding: '2.5% 2.5% 0 2.5%', boxSizing : 'border-box' }}>
                            {
                                this.state.selected ?
                                    <PostInfoContainer
                                        parentModel            = { this.state.model }
                                        model                  = { this.state.selected }
                                        handleActionDialogOpen = { this.handleActionDialogOpen.bind( this ) }
                                        handleProjectEditor    = { () => { this.props.setView( 'project-editor', this.state.selected ); } }
                                        postMeta               = { this.props.postType.meta }
                                        postTypes              = { this.props.postTypes }
                                        filterList             = { this.state.filterList }
                                        hyperlink              = { this.props.hyperlink }
                                        setMainEdit            = { ( mainEdit ) => {
                                            this.setState({
                                                mainEdit
                                            })
                                        }}
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
