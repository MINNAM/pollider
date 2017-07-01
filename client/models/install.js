import $ from 'jquery';
import { InstallQueryUrls } from './install-query.js';

class Install {

    constructor ( copy ) {

    }


    execute ( data ) {

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
