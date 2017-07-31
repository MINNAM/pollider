import axios from 'axios';
axios.defaults.withCredentials = true;
/* Pollider */
import {Post}              from './post.js';
import { PostQuery } from './post-query.js';
import { formatHyperlink } from './utility.js';

class PostContainer {

    constructor (model, onUpdate) {
        this.posts = {};
        this.model = model; // Need to fix getting model more simpler.
        this.onUpdate = onUpdate;
    }

    getPostMeta () {
        axios.get(PostQuery.getPostMeta).then((response) => {
            this.model = response;
        }).catch((error) => {
            console.log(error);
        });
    }

    checkPostExist (parent_id, name, hyperlink, done) {
        let postExist;

        axios.get(PostQuery.checkPostExist,{
            params: {
                post_type_id: this.model.id,
                parent_id,
                name,
                hyperlink
            }
        }).then((response) => {
            if (done)
                done(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    getAccessToken (done) {
        axios.get(PostQuery.getAccessToken).then((response) => {
            done(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
    * Requests posts on start up.
    */
    getPosts (data) {
        axios.get(PostQuery.getPosts,{
            params: {
                post_type_id: data.postType.id
            }
        }).then((response) => {
            for (let key in response.data) {
                this.structurize(response.data, key, data.postType, 0, data.selected);
            }
            data.done();
        }).catch((error) => {
            console.log(error);
        });
    }

    getBlog (type, url, done) {
        axios.get(PostQuery.getPosts,{
            params: {
                post_type_id: type.id
            }
        }).then((response) => {
            for (let key in response.data) {
                this.structurize(response.data, key, type, 0);
            }
            done();
        }).catch((error) => {
            console.log(error);
        });
    }

    setOnUpdate (onUpdate) {
        this.onUpdate = onUpdate;
    }

    updatePost (post, done) {
        const date = new Date();

        setTimeout(() => {

            this.onUpdate(1, date, 'Updating ' + post.name, 0);

            // Fixing circular error when stringifying Post object
            const tempParent = {...post.parentNode};
            const tempChilden = {...post.children};

            post.children = null;
            post.parentNode = null;

            axios({
                method: 'POST',
                url: PostQuery.updatePost,
                data: post,
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).then((response) => {
                post.parentNode = tempParent;
                post.children   = tempChilden;

                if (Object.keys(post.children).length != 0) {
                    for (let key in post.children) {
                        post.children[key].parentNode = post;
                    }
                }

                post.update();

                if (done) {
                    console.log(done)
                    done();
                }

                this.onUpdate(1, date, 'Updated ' + post.name , 1);
            }).catch((error) => {
                done(false);
            });
        },250)


    }

    structurize (elements, key, type, depth, selected) {
      /* If is a root container, create a post on the top level of this.posts */
      if (elements[key].parent_id == null) {
          /* Create a root container if not exists or return the existing one */
          if(!this.posts[key]) {
            const post = this.new(type.meta);

            post.assign(elements[key]);
            post.postContainerHyperlink = this.model.hyperlink;

            this.posts[post.id] = post;

            if (selected == post.id ) {
                this.selected = post;
            }
          }

          return this.posts[key];

      } else {
            /* Recursively find a parent of a current object */
            const parent = this.navigateParent(this.posts, elements[key].parent_id);

            if (parent) {

                if(!parent.children[key]) {

                    let post = this.new(type.meta);

                    post.assign(elements[key]);

                    post.parentNode = parent;
                    post.postContainerHyperlink = this.model.hyperlink;

                    parent.children[post.id] = post;

                    if (selected == post.id ) {
                        this.selected = post;
                    }

                    post.update();
                }

                return parent.children[key];
            } else {
                const parentPost = this.structurize(elements, elements[key].parent_id, type, ++depth);
                const post = this.new(type.meta);

                post.assign(elements[key]);

                parentPost.children[post.id] = post;
                post.parentNode = parentPost;
                post.postContainerHyperlink = this.model.hyperlink;

                if (selected == post.id ) {
                    this.selected = post;
                }

                return post;
            }
        }
    }

    findPost (posts, id) {
        for (let key in posts) {

            if (key == id) {
                console.log( 'found', id);
                return posts[key];
            }

            if (posts[key].children != null) {
                let temp = this.findPost(posts[key].children, id);
                if ( temp ) {
                    return temp;
                }
            }
        }

    }

    navigateParent (element, id, exclude) {
        if (element.hasOwnProperty(id)) {
            return element[id];
        }

        if (exclude) {
            if(!element.hasOwnProperty(id) && element.hasOwnProperty(exclude) && element[exclude].container == 1) {
                return false;
            }
        }

        for (let key in element) {
            if (element[key].hasOwnProperty(id)) {
                return element[key][id];
            }

            if (element[key].container == 1) {
                let temp = this.navigateParent(element[key].children, id, exclude);
                if (temp) {
                    return temp;
                }
            }
        }
    }

    insertPost (data, done) {
        const hyperlink = formatHyperlink(data.name);

        this.checkPostExist(data.parent_id, data.name, hyperlink,  (exists) => {

            if (!exists) {
                axios({
                    method: 'POST',
                    url: PostQuery.insertPost,
                    data,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }).then((response) => {
                    let newPost;

                    newPost = this.new();
                    newPost.assign(response.data);
                    console.log( 'new', newPost );
                    done(newPost);
                }).catch((error) => {
                    done(false);
                });
            }
        });
    }

    getIds (post, postsToDelete) {
        if (post) {
            if (post.children) {
                for (let key in post.children) {
                    if (post.children[key].children ) {
                        this.getIds(post.children[key], postsToDelete);
                    }
                    postsToDelete.push({
                        id:  post.children[key].id,
                        alias_id: post.children[key].alias_id,
                        path: post.children[key].container ? null : post.children[key] .hide.path +  post.children[key] .hide.filename + '.' +  post.children[key].extension
                    });
                }
            }

            postsToDelete.push({ id : post.id, path : post.container ?  null : post.hide.path + post.hide.filename + '.' + post.extension });
        }
    }

    deletePost (posts, updateView) {
        const postsToDelete = [];

        if (Object.prototype.toString.call(posts) === '[object Array]') {
            for (let key in posts) {
                if (posts[key])  {
                    let test = this.getIds(posts[key], postsToDelete);
                };
            }
        } else {
            let test = this.getIds(posts, postsToDelete);
        }

        axios({
            method: 'POST',
            url: PostQuery.deletePost,
            data: {
                posts: postsToDelete
            },
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }).then((response) => {
            updateView();
        }).catch((error) => {
            console.log(error);
        });
    }

    new (meta, param) {
        console.log( 'new post', meta, param );
        return new Post(meta, param);
    }

    copyPost (param, parentId) {
        const post = new Post();

        for (let key in param) {
            post[key] = param[key];
        }

        post.parent_id = parentId;

        return post;
    }

}

export {PostContainer};
