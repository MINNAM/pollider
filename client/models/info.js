import $ from 'jquery';
import { InstallQueryUrls } from './install-query.js';

class Info {

    constructor ( copy ) {

    }

    load (callback, data) {

        $.ajax({

            url : InstallQueryUrls.userInfo,
            type : "GET",
            data : JSON.stringify( data ),
            dataType : "json",
            success : ( model ) => {

                callback ( model );

            }
        })
    }

}

export default Info;
