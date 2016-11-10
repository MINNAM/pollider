/* Pollider */
import CONFIG from '../../../models/m-config.js';

/*
* Collection of urls that model.PostContainer requests
*/
const PostQueryUrls = {

    getPosts            : CONFIG.backendUrl + 'get-posts?post_type_id=',
    checkPostExist      : CONFIG.backendUrl + 'check-post-exist?',
    updatePost          : CONFIG.backendUrl + 'update-post',
    insertPost          : CONFIG.backendUrl + 'insert-post',
    deletePost          : CONFIG.backendUrl + 'delete-post',
    getPostMeta         : CONFIG.backendUrl + 'get-post-meta',
    uploadFile          : CONFIG.backendUrl + 'upload-file',
    getPostType         : CONFIG.backendUrl + 'get-post-type',
    getPostTypeMeta     : CONFIG.backendUrl + 'get-post-type-meta',
    getPostDataTypes    : CONFIG.backendUrl + 'get-post-data-types'

};

export { PostQueryUrls };
