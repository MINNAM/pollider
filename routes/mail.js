var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');


class Mail {

    constructor () {

        this.user          = "eric@startsmartedu.com";
        this.client_secret = 'Wufk8Br064zHAv8Kge4dV2k9';
        this.refresh_token = '1/SIHSv8_CFFZo5OtQ-Yqoza371yyICd6C9kDRX_b1U2A1NymtxwN6_B9mwTwTB5v-';
        this.client_id     = '521648276911-9kht2f7ugj52lq91nkh58vq3c0qu5hmq.apps.googleusercontent.com';

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

    html () {

        return `



        `;

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

                if ( error ) {

                    console.log( error );

                }

                console.log( info );

            });

        })
    }

}

const mail = new Mail();
