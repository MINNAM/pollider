import $ from 'jquery';
import { InstallQueryUrls } from './install-query.js';

class Install {

    constructor ( copy ) {

    }

    execute ( data ) {

        const install_data = {
            "user": [{
                "label": "Email",
                "name": "email",
                "type": "email",
                "required": true,
                "validate": {
                    "email": true
                },
                "value": "nsm12889@gmail.com",
                "error": null
            }, {
                "label": "First Name",
                "name": "first_name",
                "required": true,
                "value": "Min",
                "error": null
            }, {
                "label": "Last Name",
                "name": "last_name",
                "required": true,
                "value": "Nam",
                "error": null
            }, {
                "label": "Password",
                "name": "password",
                "type": "password",
                "required": true,
                "value": "tjdals128",
                "error": null
            }, {
                "label": "Re-Password",
                "name": "re_password",
                "type": "password",
                "required": true,
                "validate": {
                    "equal": 3
                },
                "value": "tjdals128",
                "error": null
            }],
            "database": [{
                "label": "Database Host",
                "name": "host",
                "required": true,
                "value": "localhost",
                "error": null
            }, {
                "label": "Database Name",
                "name": "name",
                "required": true,
                "value": "pollider",
                "error": null
            }, {
                "label": "Database User",
                "name": "user",
                "required": true,
                "value": "root",
                "error": null
            }, {
                "label": "Database Password",
                "name": "password",
                "required": true,
                "type": "password",
                "value": "1111",
                "error": null
            }, {
                "label": "Table Prefix",
                "name": "table_prefix"
            }]
        };

        const createConfig = $.ajax({

            url         : InstallQueryUrls.install,
            type        : "POST",
            data        : JSON.stringify( data ),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            success     : ( response ) => {

                console.log( 'config', response );

            }

        });

    }

}

export default Install;
