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
    formatHyperlink,
    scroll
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

const POST_INFO_ICON = [];

for (let i = 0; i < 6; i++ ) {

    let x2 = 200 - 20;

    if (i == 4) {
        x2 = 200 * 0.9 - 20;
    } else if ( i == 5) {
        x2 = 200 * 0.75 - 20;
    }

    POST_INFO_ICON.push(<line
        key = {i}
        x1 = '0'
        y1 = {20 * i + 10}
        x2 = {x2}
        y2 = {20 * i + 10}
        style = {{
            stroke: 'rgb(230,230,230)',
            strokeWidth: 8,
        }}
    />);
}


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
            postType,
            selected
        } = this.props;

        model.getPosts({
            postType,
            selected,
            done: () => { // after getPost function, PostContainer.posts get set.

                for (let key in model.posts) {
                    model.posts[key].update();
                }
                this.setState({model, selected: model.findPost(model.posts, selected)});
            }
        });

    }

    componentWillReceiveProps (nextProps) {
        // this.setState({ updatePreview: false });
        if (this.props.currentView == 'project-editor' && nextProps.currentView == 'post-container') {
            setTimeout(() => {
                this.setState({ updatePreview: true });
            },500)
        }

    }

    locatePost (post) {

        scroll( this.refs['post-container'], this.refs['post-container'].scrollTop, post.offsetTop, () => {

            this.setState({
                updatePreview: true
            })
        });

    }

    onPreviewLoad (status) {
        // this.setState({
        //     previewLoaded: status
        // })
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

            if (selected) {
                if (selected.id == post.id) {
                    this.setState({
                        selected: null
                    })
                    return null;
                }
            }


            /* onAction* in ProjectEditor  */
            if (onExternalActionChange) {
                onExternalActionChange({ ...post, post_type_id : postType.id });
            }

            if (onExternalActionUpdate) {
                onExternalActionUpdate({ ...post, post_type_id : postType.id });
            }

            let mainEdit
            if (this.props.allowEdit) {
                for (let key in postType.meta) {
                    if (postType.meta[key].main) {
                        for (let key2 in post.data) {
                            if (key == post.data[key2].field) {
                                mainEdit = () => {
                                    this.handleDialogModel(postType.meta[post.data[key2].field].data_type, key2)
                                };
                            }
                        }
                    }
                }
            }

            this.setState({
                selected: post,
                previewLoaded: false,
                mainEdit
            });
        }
    }

    resetSelection () {
        this.setState({
            selected : null,
            previewLoaded: false
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

    reallocateModel (parentId, id, name, hyperlink, done) {
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
                        this.reallocatePost(parentId, id, null, done);
                    } else {
                        setTimeout(() => {
                            this.setState({ updatePreview: true });
                        },300);
                    }
                });

            } else {
                model.checkPostExist(destination, name, hyperlink, (exists) => {
                    if (!exists) {
                        this.reallocatePost(parentId, id, destination, done);
                    } else {
                        setTimeout(() => {
                            this.setState({ updatePreview: true });
                        },300);
                    }
                });
            }
        }
    }

    reallocatePost (parentId, id, destination, done) {

        const {
            model
        } = this.state;

        if (parentId == destination || id == destination) {
            setTimeout(() => {
                this.setState({ updatePreview: true });
            },300);
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

            model.updatePost(destinationPost.children[id], () => {
                setTimeout(() => {
                    this.setState({ updatePreview: true });
                },1500);
            }); // at backend also

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
            model.updatePost(model.posts[id], () => {
                setTimeout(() => {
                    this.setState({ updatePreview: true });
                },1000);
            }); // at backend also

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
            model.updatePost(destinationPost.children[id], () => {
                setTimeout(() => {
                    this.setState({ updatePreview: true });
                },1000);
            }); // at backend also

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
                getPreviewLoaded = {() => {
                    return this.state.previewLoaded;
                }}
                locatePost = {this.locatePost.bind(this)}
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

            case 'Name':
                this.openDialog({
                    fields: [
                        {
                            title: 'Rename',
                            subtitle: {
                                pre: 'Enter ',
                                middle: selected.name,
                                post: "'s new name"
                            },
                            field: 'name',
                            dataType: 'debounce-text',
                            model,
                            parentModel: this.state.model
                        }
                   ],
                    actions: {
                        execute: (data) => {
                            selected.name = data.name.value;
                            selected.hyperlink = formatHyperlink(data.name.value);
                            this.state.model.updatePost(selected);
                        }
                    }
                });
            break;

            case 'Public Date':
                this.openDialog({
                    fields: [
                        {
                            title: 'Change Public Date' ,
                            subtitle: {
                                pre: 'Change ',
                                middle: selected.name,
                                post: "'s New Public Date "
                            },
                            field: 'public_date',
                            dataType: 'date',
                            default: selected.public_date
                        }
                   ],
                    actions: {
                        execute: (data) => {

                            const defaultDate = new Date(selected.public_date);
                            const defaultTime = `${defaultDate.getHours()}:${defaultDate.getMinutes()}:${defaultDate.getSeconds() < 10 ? 0 : ''}${defaultDate.getSeconds()}`;

                            const _data = {};

                            if (!data.public_date) {
                                _data.public_date = defaultDate
                            } else {
                                _data.public_date = data.public_date;
                            }

                            if (!data.time) {
                                _data.time = defaultTime
                            } else {
                                _data.time = data.time.value;
                            }

                            let newDate = new Date(_data.public_date);
                            const newTime = _data.time.split(':');

                            newDate = new Date(newDate.setHours(newTime[0], newTime[1], newTime[2]));

                            selected.public_date = newDate.toISOString();
                            this.state.model.updatePost(selected);
                        }
                    }
                });
            break;

            case 'text':
                this.openDialog({
                    fields: [
                        {
                            title: `Edit ${selected.data[model].field}`,
                            subtitle: {
                                pre: 'Enter ',
                                middle: selected.name,
                                post: `'s New ${selected.data[model].field}`
                            },
                            field: 'content',
                            dataType: 'text',
                            default: selected.data[model].content
                        }
                   ],
                    actions: {
                        execute: (data) => {
                            selected.data[model].content = data.content.value;
                            this.state.model.updatePost(selected);
                        }
                    }
                });
            break;

            case 'project':
                this.setState({ updatePreview: false });
                this.props.setView('project-editor', selected);
            break;

            case 'post-container':
                let data = selected.data[model].content != '' ? selected.data[model].content : null;

                if (data) {
                    data = JSON.parse(data);
                }
                this.openDialog({
                    fields: [
                        {
                            dataType: 'post-container',
                            postTypes: this.props.postTypes.postTypes,
                            postDataTypes: this.props.postDataTypes,
                            selected: data ? data.id : null,
                            post_type_id: data ? data.post_type_id : null
                        }
                   ],
                    actions: {
                        execute: (_data) => {
                            const children = [];

                            if (_data[0]) {
                                for (let key in _data[0].value.children ) {
                                    children.push(key);
                                }

                                selected.data[model].content = JSON.stringify({
                                    post_type_id: _data[0].value.post_type_id,
                                    id: _data[0].value.id,
                                    children
                                });
                            } else {

                                selected.data[model].content = JSON.stringify({
                                    post_type_id: null,
                                    id: null,
                                    children
                                });
                            }

                            this.state.model.updatePost(selected, () => {
                                setTimeout(() => {
                                    this.setState({ updatePreview: true });
                                },300);
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
                            width: '95%',
                            height: '80%'
                        },
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
            hyperlink,
            postDataTypes
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
                                    borderRadius: 100,
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
                            {
                                this.state.model ? this.state.model.model.uploadable != '1' ? <Seperator
                                    style = {{
                                        marginTop : 15
                                    }}
                                /> : '' : ''
                            }
                            {
                                this.state.model ? this.state.model.model.uploadable != '1' ? this.props.allowEdit ? <MaterialButton
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
                                /> : '' : '' : ''

                            }
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
                                        this.handleDialogModel(value);
                                    }}
                                    style = {{
                                        float: 'right'
                                    }}
                                    menuItemStyle = {{
                                        fontSize: 14
                                    }}
                                >
                                    {
                                        this.props.allowEdit ? <MenuItem
                                            value = {'new-folder'}
                                            disabled = {selectMultiple}
                                            primaryText="New Folder"
                                        /> : ''
                                    }
                                    {
                                        this.state.model ? this.state.model.model.uploadable != '1' ? this.props.allowEdit ? <MenuItem
                                            value = {'new-post'}
                                            disabled = {selectMultiple}
                                            primaryText = {`New ${postType.name_singular}`}
                                        /> : '' : '' : ''
                                    }
                                    {
                                        this.props.allowEdit ? <Divider/> : ''
                                    }
                                    <MenuItem
                                        value = {'duplicate-post'}
                                        style = {{
                                            fontSize: 14
                                        }}
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
                                            background: 'rgb(60, 60, 60)',
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
                                    this.setDestination(null);
                                }}
                                draggable = {true}
                            >
                                Drop here to place at the top level
                            </div>
                            <div
                                ref = 'post-container'
                                style = {{
                                    backgroundAttachment: 'local',
                                    backgroundImage: `url('/assets/post-list-background.png')`,
                                    height: displayTopLevelPlacer ? 'calc(100% - 240px)' : 'calc(100% - 100px)',
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
                                display: selected ? '' : 'none'
                            }}
                        >

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
                                this.props.allowEdit ? selected ? mainEdit ? <MaterialButton
                                    style = {{
                                        float: 'right',
                                        fontWeight: 'semi-bold',
                                        margin: '10px 5px 0 0px',
                                        display: selected ? '' : 'none',
                                        borderRadius: 100,
                                    }}
                                    onClick = {() => {
                                        mainEdit();
                                    }}
                                    disabled = { selected ? selected.alias_id != null : false }
                                    icon  = { 'mode_edit' }
                                    iconStyle = {{
                                        color : 'rgb(60,60,60)'
                                    }}
                                /> : '' : '' : ''
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
                                        allowEdit = {this.props.allowEdit}
                                        onPreviewLoad = {this.onPreviewLoad.bind(this)}
                                        updatePreview = {updatePreview}
                                        parentModel = {this.state.model}
                                        model = {selected}
                                        openDialog = {this.openDialog.bind(this)}
                                        handleDialogModel = {this.handleDialogModel.bind(this)}
                                        handleProjectEditor = { () => {
                                            this.setState({ updatePreview: false });
                                            setView('project-editor', selected);
                                        }}
                                        postMeta = {postType.meta}
                                        postDataTypes = {postDataTypes}
                                        postTypes = {postTypes}
                                        filterList = {filterList}
                                        hyperlink = {hyperlink}

                                    />
                                </div> : <div
                                    style = {{
                                        width: '100%',
                                        height: '100%',
                                        background: 'white',
                                        position: 'relative'
                                    }}
                                >
                                    <div
                                        style = {{
                                            display: 'inline-block',
                                            top: 'calc(50% - 50px)',
                                            left: '50%',
                                            transform: 'translate(-50%,-50%)',
                                            position: 'absolute',
                                            borderRadius: 7.5
                                        }}
                                    >
                                        <div
                                            style = {{
                                                height: 120,
                                                position: 'relative',
                                                zoom: 0.8
                                            }}
                                        >
                                            <svg
                                                style = {{
                                                    width: 180,
                                                    height: 120,
                                                    margin: '0 auto',
                                                    display: 'inherit'
                                                }}
                                            >
                                                {POST_INFO_ICON}
                                                <rect
                                                    width = {100}
                                                    height = {75}
                                                    style = {{
                                                        fill: 'white'
                                                    }}
                                                />
                                                <polygon
                                                    points="30,70 60,20 90,70"
                                                    style= {{
                                                        fill: 'rgba(200,200,200,1)'
                                                    }}
                                                />
                                                <polygon
                                                    points="2.5,70 27.5,35 52.5,70"
                                                    style= {{
                                                        fill: 'white'
                                                    }}
                                                />
                                                <polygon
                                                    points="0,70 25,35 50,70"
                                                    style= {{
                                                        fill: 'rgba(180,180,180,1)'
                                                    }}
                                                />
                                            </svg>
                                            <i
                                                className="material-icons"
                                                style = {{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 23,
                                                    fontSize: 40,
                                                    color: 'rgb(180,180,180)'
                                                }}
                                            >
                                                mode_edit
                                            </i>
                                        </div>
                                        <span
                                            style = {{
                                                display: 'inline-block',
                                                marginTop: 50
                                            }}
                                        >
                                            <span>
                                                {`Select a `}
                                            </span>
                                            <span
                                                style = {{
                                                    fontWeight: 500,
                                                    paddingBottom: 5
                                                }}
                                            >
                                                {`${postType.name_singular}`}
                                            </span>
                                            {` or `}
                                            <span
                                                style = {{
                                                    fontWeight: 500,
                                                    paddingBottom: 5
                                                }}
                                            >
                                                 {`Folder`}
                                            </span>
                                            {` to Edit`}
                                        </span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                </div>
                {
                    isDialogOpen ? <PostDialog
                        model = {dialogModel}
                        isOpen = {isDialogOpen}
                        onRequestClose = { this.closeDialog.bind(this) }
                    /> : ''
                }
            </div>
       );
    }

};

export default PostContainer;
