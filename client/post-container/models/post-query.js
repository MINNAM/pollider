/* Pollider */
import SITE from '../../site.js';

console.log('from post query', SITE);

/*
* Collection of urls that model.PostContainer requests
*/
const PostQuery = {
    getPosts: '/get-posts',
    getBlog: '/get-blog',
    checkPostExist: '/check-post-exist?',
    updatePost: '/update-post',
    insertPost: '/insert-post',
    deletePost: '/delete-post',
    getPostMeta: '/get-post-meta',
    uploadFile: '/upload-file',
    getPostType: '/get-post-type',
    getPostTypeMeta: '/get-post-type-meta',
    getPostDataTypes: '/get-post-data-types',
    getPostById  : '/get-post-by-id',
    createAlias: '/create-alias',
    getAccessToken: '/get-access-token',
};

export {PostQuery};
