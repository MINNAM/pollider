import React, {Component, PropTypes} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
/* Material UI */
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import AutoComplete from 'material-ui/AutoComplete';

/* Pollider */
import {
    SITE,
    THEME,
    formatHyperlink
} from '../../global.js';
import * as Model from '../models/post-container.js';
import Post from './post.js';
import PostInfoContainer from './post-info-container.js';
import PostDialog from './post-dialog.js';
import PostIcon from './post-icon';


import {
    MaterialButton,
    Seperator
} from '../../ui-components/';


class PostContainer extends Component {

    static propTypes = {
        model: PropTypes.object.isRequired,
        postType: PropTypes.object.isRequired,
        postDataTypes: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        allowMultiple: PropTypes.bool.isRequired,
        width: PropTypes.object,
        displayPostInfo: PropTypes.bool,
        setView: PropTypes.func,
        onExternalActionChange: PropTypes.func,
        onExternalActionUpdate: PropTypes.func,
    };

    state = {
        destination: null,
        fields: [],
        filterList: [],
        inputText: '',
        isDialogOpen: false,
        searchedSource: [],
        selectMultiple: false,
        selected: null,
        selectedSource: [],
        value: -1,
    };

    componentDidMount () {
        const {
            model,
            postType
        } = this.props;

        model.getPosts(postType, () => {
            for (let key in model.posts) {
                model.posts[key].update();
            }
            this.setState({model});
        });
    }

    setSelected (post) {
        const {
            onExternalActionChange,
            onExternalActionUpdate,
            postType
        } = this.props;
        const {
            selectMultiple,
            selected
        } = this.state;

        if (selectMultiple) {
            let _selected = selected;

            if (!_selected) {
                _selected = [];
            }

            for (let i = 0, max = _selected.length; i < max; i++) {
                if (selected[i].id == element.id) {
                    selected.splice(i, 1);

                    this.setState({
                        selected
                    });

                    return;
                }
            }

            selected.push(post);

            this.setState({selected});
        } else {
            /* onAction* in ProjectEditor  */
            if (onExternalActionChange) {
                onExternalActionChange({ ...post, post_type_id : postType.id });
            }

            if (onExternalActionUpdate) {
                onExternalActionUpdate({ ...post, post_type_id : postType.id });
            }

            this.setState({ selected : post });
        }
    }

    resetSelection () {
        this.setState({
            selected : null
        });
    }

    /**
    *   Sets destination parent id of a container.
    *   Called in Post->onDrop()
    */
    setDestination (destination) {
        this.setState({destination});
    }

    onSelectMultiple (event, isToggled) {
        if (isToggled) {
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

    reallocateModel (parentId, id, name, hyperlink) {
        const {
            destination,
            model,
            selectMultiple,
            selected,
        } = this.state;

        if (selectMultiple) {
            selected.map((element) => {
                if (this.reallocatePost(element.parent_id, element.id, destination)) {
                    element.parent_id = destination;
                }
            });
        } else {
            if (destination == null) {
                model.checkPostExist(null, name, hyperlink, (exists) => {
                    if (!exists) {
                        this.reallocatePost(parentId, id, null);
                    }
                });

            } else {
                model.checkPostExist(destination, name, hyperlink, (exists) => {
                    if (!exists) {
                        this.reallocatePost(parentId, id, destination);
                    }
                });
            }
        }
    }

    reallocatePost (parentId, id, destination) {
        const {
            model
        } = this.state;

        if (parentId == destination || id == destination) {
            return false;
        }

        if (parentId == null) {
            let tempPost = model.copyPost(model.posts[id], destination);
            let destinationPost = model.posts[destination] ? model.posts[destination] : model.navigateParent( model.posts, destination ); // this only works for single hireachy

            destinationPost.children[id] = tempPost;
            destinationPost.children[id].parent_id  = destination;
            destinationPost.children[id].parentNode = destinationPost;
            destinationPost.children[id].update();

            model.posts[id] = null;
            delete model.posts[id];

            this.setState({
                Posts: model,
                selected: destinationPost.children[id]
            });

            model.updatePost(destinationPost.children[id]); // at backend also

            return destinationPost.children[id];
        }

        let tempPost = model.copyPost(model.navigateParent(model.posts, parentId).children[id], destination);

        if (destination == null) {

            model.posts[id] = tempPost;
            model.posts[id].parentNode = null;
            model.posts[id].update();

            model.navigateParent(model.posts, parentId).children[id] = null;
            delete model.navigateParent(model.posts, parentId).children[id];

            this.setState({
                Posts: model,
                selected: model.posts[id]
            });
            model.updatePost(model.posts[id]); // at backend also

            return model.posts[id];
        }


        /* Find an element to copy, duplicate, and change it's field, parentId, to destination */
        /* Find a destination element, exclude if it's destination is one of it's child */
        let destinationPost = model.navigateParent(model.posts, destination, id);

        if (destinationPost) {
            destinationPost.children[id] = tempPost;
            destinationPost.children[id].parent_id = destination;
            destinationPost.children[id].parentNode = destinationPost;
            destinationPost.children[id].update(); // updating hyperlink

            model.navigateParent(model.posts, parentId).children[id] = null;
            delete model.navigateParent(model.posts, parentId).children[id];

            this.setState({
                Posts : model,
                selected : destinationPost.children[id]
            });
            model.updatePost(destinationPost.children[id]); // at backend also

            return destinationPost.children[id];
        }

        return false;
    }

    populatePost (id, parentId, element ) {
        if (element.container > 0) {
            let post = this.createPost(id, parentId, element, true);

            return post;
        } else {
            let post = this.createPost(id, parentId, element);

            return post;
        }
    }

    createPost (id, parentId, post, isParent) {
        const {
            postType,
            postDataTypes,
        } = this.props;
        const {
            selected
        } = this.state;

        if (post.id == selected) {
            if (!selected) {
                this.setState({
                    selected: post // Hmm.. is selected an object or string
                });
            }
        }

        return (
            <Post
                key = {post.id}
                model = {post}
                postType = {postType}
                postDataTypes = {postDataTypes}
                selected = {selected}
                setSelected = {this.setSelected.bind(this)}
                setDestination = {this.setDestination.bind(this)}
                reallocateModel = {this.reallocateModel.bind(this)}
                upload = {this.upload.bind(this)}
                setUpdatePreview = {(updatePreview) => {
                    this.setState({updatePreview});
                }}
                handleTopLevelPlacer = {(displayTopLevelPlacer) => {
                    this.setState({ displayTopLevelPlacer }) ;
                }}
                insertPost = {(target, file, dataType) => {
                    let parentId = target.parent_id;

                    if (target.container > 0) {
                        parentId = target.id;
                    }

                    this.insertPost({
                        name: file.name,
                        size: file.size,
                        container: 0,
                        parent_id: parentId,
                        post_data_type_id: dataType
                    }, file);
                }}
            >
                {
                    isParent ? (() => {
                        const children = [];
                        for (let key in post.children) {
                            children.push(this.populatePost(key, id, post.children[key]));
                        }
                        return children;
                    })() : null
                }
            </Post>
       );
    }

    insertPost (data, file) {
        const filename = data.name.split('.');

        data.name      = filename[0];
        data.extension = filename[1] ? filename[1] : null;
        data.hyperlink = formatHyperlink(data.name);

        let temp = {
            post_type_id: this.props.postType.id,
            ...data
        };

        this.state.model.insertPost(temp, (newPost) => {
            const {
                model
            } = this.state;

            newPost.fileToUpload = file;

            if (newPost.parent_id == null) {

                model.posts[newPost.id] = newPost;

            } else {

                const parent = model.navigateParent(model.posts, newPost.parent_id);

                parent.children[newPost.id] = newPost;
                parent.children[newPost.id].parentNode = parent;

            }

            newPost.update(); // update hyperlink

            this.setState({
                model: model,
                selected: newPost,
                updatePreview: true
            });
        });
    }

    deletePost () {
        const {
            model,
            selected,
            selectMultiple
        } = this.state;

        model.deletePost(selected, function () {

            if (Object.prototype.toString.call(selected) == '[object Array]') {
                for(let i = 0; i < selected.length; i++) {
                    if (selected[i].parent_id == null) {
                        delete model.posts[selected[i].id];
                    } else {
                        delete model.navigateParent(model.posts, selected[i].parent_id).children[selected[i].id];
                    }
                }
            } else {
                if (selected.parent_id == null) {
                    delete model.posts[selected.id];
                } else {
                    delete model.navigateParent(model.posts, selected.parent_id).children[selected.id];
                }
            }

            this.setState({
                model: model,
                selected: selectMultiple ? [] : null
            });

        }.bind(this));
    }

    openDialog (data) {
        const dialogModel = {
            actions: data.actions,
            fields: data.fields
        };

        this.setState({
            isDialogOpen : true,
            dialogModel
        });
    }

    closeDialog () {
        this.setState({
            isDialogOpen : false
        });
    }

    handleDialogModel (value, model) {
        const {
            postType
        } = this.props;
        const {
            selected
        } = this.state;

        let parentId;

        if (selected) {
            parentId = selected.parent_id;

            if (selected.container > 0) {
                parentId = selected.id;
            }
        } else {
            parentId = null;
        }

        switch (value) {

            /* New Subfolder */
            case 'new-folder':
                this.openDialog({
                    fields : [
                        {
                            title: 'New Folder',
                            field: 'name',
                            dataType: 'debounce-text',
                            parentModel: this.state.model,
                            selected
                        }
                   ],
                    actions: {
                        execute : (_data) => {

                            const folder = {
                                name: _data.name.value,
                                container: 1,
                                parent_id: parentId,
                                post_data_type_id: 1,
                                size: -1,
                            };

                            this.insertPost(folder);
                        }
                    }
                });
            break;

            /* New Post */
            case 'new-post':
                this.openDialog({
                    fields : [
                        {
                            title: 'New ' + postType.name_singular ,
                            field: 'name',
                            dataType: 'debounce-text',
                            parentModel: this.state.model,
                            selected
                        }
                   ],
                    actions: {
                        execute : (_data) => {
                            const post =  {
                                name: _data.name.value,
                                container: 0,
                                parent_id: parentId,
                                post_data_type_id: 6,
                                size: -1
                            };

                            this.insertPost(post);
                        }
                    }
                });
            break;

            /* Duplicate Post */
            case 'duplicate-post':
                this.openDialog({
                    fields : [
                        {
                            field: 'name',
                            dataType: 'text'
                        }
                    ],
                    actions: {

                        execute : (data) => {

                            const post = {
                                ...selected,
                                name: data.name.value
                            };
                            this.insertPost(post);
                        }
                    }
                });
            break;

            case 'create-alias':
                this.openDialog({
                    fields : [
                        {
                            title : 'Create Alias',
                            subtitle: {
                                pre: 'Would you like to create alias post for ',
                                middle: selected.name,
                                post: "?"
                            },
                        }
                    ],
                    actions: {
                        execute : () => {
                            selected.createAlias((_newPost) => {
                                const model = this.state.model;
                                const newPost =  model.new();
                                newPost.assign(_newPost);



                                if (newPost.parent_id == null) {
                                    model.posts[newPost.id] = newPost;
                                } else {
                                    const parent = model.navigateParent(model.posts, newPost.parent_id);

                                    parent.children[newPost.id] = newPost;
                                    parent.children[newPost.id].parentNode = parent;
                                }

                                newPost.update();
                                this.setState({updatePreview: true});

                                this.setState({
                                    model,
                                    selected: newPost
                                });
                            });
                        }
                    }
                });
            break;
            /* Delete Post */
            case 'delete-post':
                this.openDialog({
                    fields : [
                        {
                            title: 'Delete',
                            subtitle: {
                                pre: 'Are you sure to delete ',
                                middle: selected.name,
                                post: "?"
                            },
                            dataType: null
                        }
                   ],
                    actions: {
                        execute: () => {
                            this.deletePost();
                        }
                    }
                });
            break;

        }

        this.handleActionMenuClose();
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

    onDrag (event) {
        const selectedItem = document.getElementById('selected-item');

        selectedItem.style.display = 'inline';
        selectedItem.style.left = event.pageX + 20 + 'px';
        selectedItem.style.top = (event.pageY - document.body.scrollTop) + 'px';
    }

    onDragEnd (event) {
        const selectedItem = document.getElementById('selected-item');

        selectedItem.style.display = 'none';
        selectedItem.style.left = event.pageX + 20 + 'px';
        selectedItem.style.top = (event.pageY - document.body.scrollTop) + 'px';
    }

    handleSelectedItem () {
        const {
            selectMultiple,
            selected
        } = this.state;

        const selectedItems = [];

        if (selectMultiple) {
            if (selected.length > 0) {
                selected.map((element, key) => {
                    selectedItems.push (
                        <div
                            key = {key}
                            className = {'selected-item-label'}
                        >
                            {element.name}
                        </div>
                   );
                });
            }

            return selectedItems;

        } else {
            if (selected) {
                return (
                    <div className = { 'selected-item-label' } >
                        { selected.name }
                    </div>
                );
            }
        }
    }

    upload (parentId, id , updateStatus) {
        const {
            model
        } = this.state;

        const postToUpload = model.navigateParent(model.posts, parentId).children[id] ;

        postToUpload.upload(updateStatus, () => {
            this.setState({model});
        });
    }

    handlePostInfoFilterChange (event, value) {
        this.setState({
            filterList : value
        });
    }

    handleUpdateInput (searchText, dataSource) {
        this.setState({ inputText : searchText });
    }

    populateInput () {
        const {
            model,
            inputText
        } = this.state;

        return this.repeatInput(model ? model.posts : {}, inputText);
    }

    repeatInput (model, inputText) {
        const posts = [];

        for (let key in model) {
            let element = model[key];

            if (element.name.includes(inputText)) {
                posts.push(this.createPost(key, null, element));
            }

            if (element.children) {
                const tempPosts = this.repeatInput(element.children, inputText);

                tempPosts.map((element2, key) => {
                    posts.push(element2);
                });
            }
        }

        return posts;
    }

    render () {

        const {

            displayPostInfo,
            width,
            name,
            postType,
            postTypes,
            setView,
            hyperlink
        } = this.props;
        const {
            actionMenuOpen,
            actionMenuAnchorEl,
            selectMultiple,
            selected,
            displayTopLevelPlacer,
            topLevelPlacerStyle,
            mainEdit,
            updatePreview,
            filterList,
            dialogModel,
            isDialogOpen
        } = this.state;

        const model = this.state.model ? this.state.model.posts : {};
        let posts = [];

        let inputText = this.state.inputText;

        if (inputText) {
            posts = this.populateInput();
        } else {
            for (let key in model) {
                let element = model[key];

                posts.push(this.populatePost(key, null, element));
            }
        }

        return (
            <div style = {{height: '100%'}}>
                <div id = 'selected-item' className = 'selected-item'>
                    {this.handleSelectedItem()}
                </div>
                <div
                    className = {(displayPostInfo ? "col-sm-" + width.container : "col-sm-12") + " post-list-container"}
                >
                    <div
                        className = {'ui-container'}
                        style = {{
                            background: 'white',
                            height: '100%',
                            overflow: 'hidden',
                            paddingLeft: 0,
                            paddingRight: 0,
                        }}
                        onDrag = {this.onDrag.bind(this)}
                        onDragEnd = {this.onDragEnd.bind(this)}
                    >
                        <div
                            style = {{
                                borderBottom: '1px solid rgb(240,240,240)',
                                display:'inline-block',
                                height: 56,
                                padding: '0 10px',
                                width: '100%',
                            }}
                        >
                            <i
                                className = "material-icons"
                                style = {{
                                    color: 'rgb(200,200,200)',
                                    float: 'left',
                                    fontSize: 20,
                                    lineHeight: '48px',
                                    marginRight: 5,
                                }}
                            >
                                {'search'}
                            </i>
                            <AutoComplete
                                style = {{
                                    float: 'left',
                                    marginLeft : 0,
                                    width: '50%',
                                }}
                                underlineFocusStyle = {{
                                    color: THEME.primaryColor
                                }}
                                hintText = { "Search in " + name }
                                textFieldStyle = {{ width: '100%' }}
                                dataSource = {[]}
                                onUpdateInput = { this.handleUpdateInput.bind(this) }
                                open = {false}
                            />
                            <MaterialButton
                                style      = {{
                                    float: 'right',
                                    margin: '9.5px 0 0 0',
                                    float: 'right',
                                }}
                                iconStyle = {{
                                    color : 'rgb(60,60,60)'
                                }}
                                hoverStyle = {{
                                    color : 'white'
                                }}

                                onClick = {this.handleActionMenuOpen.bind(this)}
                                icon = {'more_horiz'}
                            />
                            <Seperator
                                style = {{
                                    marginTop : 18
                                }}
                            />
                            <MaterialButton
                                style = {{
                                    boxShadow: '1px 1px 3px 1px rgba(0,0,0,0.1)',
                                    float: 'right',
                                    margin: '9.5px 9.5px 0 0',
                                }}
                                hoverStyle = {{
                                    color: 'white'
                                }}

                                onClick = {() => {
                                    this.handleDialogModel('new-post');
                                }}
                                label = {`New ${postType.name_singular}`}
                            />
                            <Popover
                              open = {actionMenuOpen}
                              anchorEl = {actionMenuAnchorEl}
                              anchorOrigin = {{
                                  horizontal: 'left',
                                  vertical: 'bottom'
                              }}
                              targetOrigin = {{
                                  horizontal: 'right',
                                  vertical: 'top'
                              }}
                              onRequestClose = {this.handleActionMenuClose.bind(this)}
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
                                    <MenuItem
                                        value = {'new-folder'}
                                        disabled = {selectMultiple}
                                        primaryText="New Folder"
                                    />
                                    <MenuItem
                                        value = {'new-post'}
                                        disabled = {selectMultiple}
                                        primaryText = {`New ${postType.name_singular}`}
                                    />
                                    <Divider/>
                                    <MenuItem
                                        value = {'duplicate-post'}
                                        disabled = {selectMultiple || selected !== null}
                                        primaryText = "Duplicate"
                                    />
                                    <MenuItem
                                        value = {'create-alias'}
                                        disabled = {!selected}
                                        primaryText = "Alias"
                                    />
                                    <MenuItem
                                        value = {'delete-post'}
                                        primaryText="Delete"
                                    />
                                    <Divider/>
                                    <MenuItem
                                        value = {'delete-post'}
                                        primaryText="Download"
                                    />
                                </Menu>
                            </Popover>
                        </div>
                        <div
                            style = {{
                                height: 'calc(100% - 7px)',
                                marginTop: -3,
                                position: 'relative',
                            }}
                        >
                            <div
                                style = {{
                                    width: '100%',
                                    height: displayTopLevelPlacer ? 120 : 0,
                                    transition: '.5s all',
                                    background: 'white'
                                }}
                            />

                            <div
                                style = {{
                                    display: 'inline-block',
                                    fontFamily: 'Roboto',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    height: displayTopLevelPlacer ? 120 : 0,
                                    left: 0,
                                    lineHeight: '120px',
                                    overflow: 'hidden',
                                    position: 'absolute',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    top: 0,
                                    transition: '.25s all',
                                    width: '100%',
                                    zIndex: 1,
                                    ...topLevelPlacerStyle
                                }}
                                onDragEnter = {() => {
                                    this.setState({
                                        topLevelPlacerStyle : {
                                            background: 'rgb(220, 220, 220)',
                                            color: 'white'
                                        }
                                    });
                                }}
                                onDragLeave = {() => {
                                    this.setState({
                                        topLevelPlacerStyle : {
                                            background: '',
                                            color: ''
                                        }
                                    });
                                }}
                                onDragOver = {(event) => {
                                    event.preventDefault();
                                }}
                                onDrop = {(event) => {
                                    console.log( 'destination', null);
                                    this.setDestination(null);
                                }}
                                draggable = {true}
                            >
                                Drop here to place at the top level
                            </div>
                            <div
                                style = {{
                                    backgroundAttachment: 'local',
                                    backgroundImage: `url('${SITE.url}/../images/post-list-background.png')`,
                                    height: 'calc(100% - 100px)',
                                    overflow: 'auto',
                                }}
                                onMouseUp = {(event) => {
                                    this.setState({ selected : null });
                                }}
                            >
                                {posts}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className = {`col-sm-${width.info} post-info-container`}
                    style = {{
                        display: (displayPostInfo ? 'inline' : 'none')
                    }}
                >
                    <div
                        className = {'ui-container'}
                        style = {{
                            height: '100%',
                            paddingLeft : 0,
                            paddingRight: 0,
                        }}
                    >
                        <div
                            style = {{
                                borderBottom: '1px solid rgb(240,240,240)',
                                height: 56,
                                padding: '0 5px 10px 10px',
                                width: '100%',
                            }}
                        >
                            <span
                                style = {{
                                    display: 'inline-block',
                                    float: 'left',
                                    marginTop: 9,
                                }}
                            >
                                {
                                    selected ? <PostIcon
                                        model = {selected}
                                        style = {{
                                            width: 35,
                                            height: 35
                                        }}
                                    /> : ''
                                }
                            </span>
                            <span
                                style = {{
                                    display: 'inline-block',
                                    float: 'left',
                                    fontSize: 18,
                                    height: 56,
                                    lineHeight: '56px',
                                    marginLeft : 9,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '60%',
                                }}
                            >
                                { selected ? selected.name : name }
                            </span>
                            {
                                selected ? <MaterialButton
                                    style = {{
                                        float: 'right',
                                        fontWeight: 'semi-bold',
                                        margin: '10px 5px 0 0px',
                                        display: selected ? '' : 'none',
                                    }}
                                    onClick = {() => {
                                        mainEdit();
                                    }}
                                    disabled = { selected ? selected.alias_id != null : false }
                                    icon  = { 'mode_edit' }
                                    iconStyle = {{
                                        color : 'rgb(60,60,60)'
                                    }}
                                /> : ''
                            }
                        </div>
                        <div
                            className = 'row'
                            style = {{
                                boxSizing : 'border-box',
                                height: 'calc(100% - 112px)',
                                margin: 0,
                                overflow: 'auto',
                            }}
                        >
                            {
                                selected ? <div
                                    style = {{
                                        padding: '2.5% 2.5% 0 2.5%'
                                    }}
                                >
                                    <PostInfoContainer
                                        updatePreview = {updatePreview}
                                        parentModel = {this.state.model}
                                        model = {selected}
                                        openDialog = {this.openDialog.bind(this)}
                                        handleProjectEditor = { () => {
                                            setView('project-editor', selected);
                                        }}
                                        postMeta = {postType.meta}
                                        postTypes = {postTypes}
                                        filterList = {filterList}
                                        hyperlink = {hyperlink}
                                        setMainEdit = {(mainEdit) => {
                                            this.setState({mainEdit});
                                        }}
                                    />
                                </div> : <div
                                    style = {{
                                        width: '100%',
                                        height: '100%',
                                        background: 'rgb(250,250,250)',
                                        position: 'relative'
                                    }}
                                >
                                    <div
                                        style = {{
                                            padding: '5% 5% 5% 5%',
                                            display: 'inline-block',
                                            background: 'white',
                                            top: '20%',
                                            left: '50%',
                                            transform: 'translate(-50%,-50%)',
                                            position: 'absolute',
                                            borderRadius: 7.5
                                        }}
                                    >
                                        Select a post to view its detail
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                </div>
                <PostDialog
                    model = {dialogModel}
                    isOpen = {isDialogOpen}
                    onRequestClose = { this.closeDialog.bind(this) }
                />
            </div>
       );
    }

};

export default PostContainer;
