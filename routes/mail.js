var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
import request    from 'request';


class Mail {

    constructor () {

        this.user          = "nsm12889@gmail.com";
        this.client_secret = 'sPcOSXz411zYY86lqBt-EPM2';
        this.refresh_token = '1/N_db7Q7KHUCEhauHP16iJhcYuJuJK3xBQqnYZb-JLBd3Ax8gu9F406ypGvyKcITs';
        this.client_id     = '518157074136-9vl3cgjaup45hk583v0bq9mvncdpdget.apps.googleusercontent.com';

    }

    refreshAccess ( callback ) {

        request.post(

            {
                url :'https://www.googleapis.com/oauth2/v4/token',
                form : {

                    client_secret: this.client_secret,
                    grant_type: 'refresh_token',
                    refresh_token: this.refresh_token,
                    client_id: this.client_id,

                }
            }, function( err, httpResponse, body ){

                callback( JSON.parse( body )[ 'access_token' ] );

            }

        );

    }

    send ( props, done ) {

        this.refreshAccess( ( accessToken ) => {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    xoauth2: xoauth2.createXOAuth2Generator({
                        user : this.user,
                        clientId : this.client_id,
                        clientSecret : this.client_secret,
                        refreshToken : this.refresh_token,
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

                if ( !error )
                    done( true );

            });

        });
    }

}

export default Mail;
