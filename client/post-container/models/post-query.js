/* Pollider */
import SITE from '../../site.js';

console.log('from post query', SITE);

/*
* Collection of urls that model.PostContainer requests
*/
const PostQuery = {
    getPosts: SITE.url + '/get-posts',
    getBlog: SITE.url + '/get-blog',
    checkPostExist  : SITE.url + '/check-post-exist?',
    updatePost: SITE.url + '/update-post',
    insertPost: SITE.url + '/insert-post',
    deletePost: SITE.url + '/delete-post',
    getPostMeta: SITE.url + '/get-post-meta',
    uploadFile: SITE.url + '/upload-file',
    getPostType: SITE.url + '/get-post-type',
    getPostTypeMeta: SITE.url + '/get-post-type-meta',
    getPostDataTypes: SITE.url + '/get-post-data-types',
    getPostById  : SITE.url + '/get-post-by-id?id=',
    createAlias: SITE.url + '/create-alias',
    getAccessToken: SITE.url + '/get-access-token',
};

export {PostQuery};
