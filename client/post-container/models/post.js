import axios from 'axios';
axios.defaults.withCredentials = true;
/* Pollider */
import {PostQuery} from './post-query.js';

class Post {

    constructor (data) {
        this.data = data;
        this.children = null;
    }

    assign (object) {
        Object.assign(this, object);

        this.hyperlink = object.hyperlink;

        if (this.container > 0) {
            this.children = {};
        }
    }

    /*
    *   Calls Post.uploadFile method at backend: differs from simply inserting a new post.
    */
    upload (setUploadStatus, done) {
        if (this.fileToUpload) {
            const self = this;
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            const onReady = function(event) {};
            const onError = function(error) {};

            formData.append('files', this.fileToUpload);
            formData.append('id', this.id);
            formData.append('userId', 1);

            xhr.open('post', PostQuery.uploadFile, true);
            xhr.addEventListener('error', onError);

            xhr.upload.addEventListener('progress', (event) => {
                let percentComplete = (event.loaded / event.total) * 100;

                setUploadStatus(percentComplete);
            }, false);

            xhr.addEventListener("load", () => {

                this.fileToUpload = null;

            });

            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const res = JSON.parse(this.response);

                    for (let key in res) {
                        self[ key ] = res[ key ];
                    }

                    self.update();

                    done();
                }
            };

            xhr.send(formData);
            xhr.addEventListener('readystatechange', onReady, false);
        }
    }

    buildLink (hyperlink, node) {
        if (node.parentNode) {
            if (Object.keys(node.parentNode).length === 0 && node.parentNode.constructor === Object) {
                if (this.container ==  1) {
                    return `${hyperlink}/`;
                } else {
                    return `${hyperlink}`;
                }
            }            

            return this.buildLink (`${node.parentNode.hyperlink}/${hyperlink}`, node.parentNode);
        } else {
            if (this.container ==  1) {
                return `${hyperlink}/`;
            } else {
                return `${hyperlink}`;
            }
        }
    }

    /*
    *   Rebuilds hyperlink for preview
    */
    update () {
        this._hyperlink = this.buildLink(this.hyperlink, this);
    }

    createAlias (done) {
        axios({
            method: 'POST',
            url: PostQuery.createAlias,
            data: {
                id: this.id
            },
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }).then((response) => {
            done(response.data);

            // this.onUpdate(date, 'Updated ' + post.name , 1);
        }).catch((error) => {
            done(false);
        });
    }
}

export {Post};
