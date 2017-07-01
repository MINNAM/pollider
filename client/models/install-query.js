/* Pollider */
import CONFIG from './m-config.js';

/*
* Collection of urls that model.PostContainer requests
*/
const InstallQueryUrls = {

    install         : CONFIG.backendUrl + 'install',
    createConfig    : CONFIG.backendUrl + 'create-config',
    installUser     : CONFIG.backendUrl + 'install-user',
    installDatabase : CONFIG.backendUrl + 'install-database',

};

export { InstallQueryUrls };
