/* Pollider */
import {SITE} from '../../global.js';

/*
* Collection of urls that model.PostContainer requests
*/
const UserQueryUrls = {
    getDetail: SITE.url + '/user-get-detail',
    login: SITE.url + '/user-login',
    logout: SITE.url + '/user-logout',
};

export {UserQueryUrls};
