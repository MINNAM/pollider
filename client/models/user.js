import $ from 'jquery';
import { UserQueryUrls } from './user-query.js';

class User {

    constructor ( copy ) {

    }


    login ( data, done ) {

        $.ajax({

            url         : UserQueryUrls.login,
            type        : "POST",
            data        : JSON.stringify( data ),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            xhrFields:{
                withCredentials : true
            },
            success     : ( response ) => {

                done( response );

            }

        });

    }

    logout ( data, done ) {

        $.ajax({

            url         : UserQueryUrls.logout,
            type        : "POST",
            data        : JSON.stringify( data ),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            xhrFields   : { withCredentials : true },
            success     : ( response ) => {

                done( response );

            }

        });

    }

}

export default User;
