import axios from 'axios';
axios.defaults.withCredentials = true;

/* Pollider */
import {PostQuery} from './post-query.js';
import * as Model        from '../models/post-container.js';

class _PostTypes {

    init (onFinish, onUpdate) {
        this.postTypes     = {};
        this.postDataTypes = {};

        axios.get(PostQuery.getPostDataTypes).then((response) => {
            this.postDataTypes = response.data;

            axios.get(PostQuery.getPostType).then((response) => {
                response.data.map((element, key) => {
                    const support = [];

                    if (element['support_audio'] == 1)
                        support.push('audio');
                    if (element['support_document'] == 1)
                        support.push('document');
                    if (element['support_image'] == 1)
                        support.push('image');
                    if (element['support_other'] == 1)
                        support.push('other');
                    if (element['support_video'] == 1)
                        support.push('video');
                    if (element['support_post'] == 1)
                        support.push('post');

                    const model = {
                        id: element['id'],
                        name: element['name'],
                        name_singular: element['name_singular'],
                        hyperlink: element.home == 1 ? '' : element['hyperlink'],
                        support: support,
                        uploadable: element['uploadable'],
                        meta: {}
                    }

                    this.postTypes[element['name']] = {
                        ...model,
                        post_container: new Model.PostContainer(model, onUpdate)
                    };

                    axios.get(PostQuery.getPostTypeMeta).then((response) => {
                        response.data.map((element, key) => {
                            if (this.postTypes[element['post_type_name']]) {
                                this.postTypes[element['post_type_name']].meta[element['post_meta_name']] = {
                                    data_type: element['data_type'],
                                    data: element['data'] ? JSON.parse(element['data']) : null,
                                    value: null,
                                    main: element['main'],
                                };
                            }
                        });

                        onFinish()
                    }).catch((error) => {
                        console.log(error);
                    });

                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });


    }

    get () {
        return this.postTypes;
    }

    map (handle) {
        for (let key in this.postTypes) {
            handle(this.postTypes[key], key);
        }
    }
}

const PostTypes = new _PostTypes();

export default PostTypes;
