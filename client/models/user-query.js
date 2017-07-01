/* Pollider */
import CONFIG from './m-config.js';

/*
* Collection of urls that model.PostContainer requests
*/
const UserQueryUrls = {

    login : CONFIG.backendUrl + 'user-login',
    logout : CONFIG.backendUrl + 'user-logout',


};

export { UserQueryUrls };
