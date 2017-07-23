import GoogleApi from './google-api';

var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
import request    from 'request';


class Mail {

    constructor () {

        this.googleApi = new GoogleApi();

    }

    send ( props, done ) {

        this.googleApi.refreshAccess( ( accessToken ) => {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    xoauth2: xoauth2.createXOAuth2Generator({
                        user : this.googleApi.user,
                        clientId : this.googleApi.client_id,
                        clientSecret : this.googleApi.client_secret,
                        refreshToken : this.googleApi.refresh_token,
                        accessToken
                    })
                }
            });

            const mailOptions = {

                from        : props.from,
                to          : props.to,
                subject     : props.subject,
                text        : props.text,
                html        : props.html,
                attachments : props.attachments

            };

            // send mail with defined transport object
            transporter.sendMail( mailOptions, function( error, info ){

                console.log( error );

                if ( !error )
                    done( true );

            });

        });
    }

}

export default Mail;
