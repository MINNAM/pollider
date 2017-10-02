import Mail from './src/mail.js';
import GoogleApi from './src/google-api.js';
import User from '../../src/models/user.js';

const googleApi = new GoogleApi();

const customRoutes = (router, database, user) => {

    router.get('/get-access-token', (req, res) => {
        googleApi.refreshAccess( ( accessToken ) => {
            res.send( accessToken );
        });
    });

    router.post( '/contact', ( req, res ) => {
        const data = [];

        if ( req.body ) {

            req.body.map( ( element ) => {
                data[ element.id ] = element.value;
            });

            const mail = new Mail();

            user._get((_user) => {
                mail.send({

                    from    : data[ 'email' ],
                    to      : _user.username,
                    subject : `Message from ${ data['first_name'] } ${ data['last_name'] } ${ data['company'] ? `@ ${ data['company'] }` : '' }`,
                    text    : data[ 'message' ]
                }, ( sent ) => {

                    mail.send({
                        from    : _user.username,
                        to      : data[ 'email' ],
                        subject : `${_user.first_name} ${_user.last_name} | Contact Receipt`,
                        html    : `
                        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <title></title>
                            </head>
                            <body>
                                <style>
                                    @import url('https://fonts.googleapis.com/css?family=Hind:400,600');
                                    * {
                                        font-family: Hind;
                                    }
                                </style>
                                <div style = "background-color:red;padding-top:50px;padding-bottom:50px;background-color:rgb(245,245,245)">
                                    <div style="max-width:700px;margin-left:auto;margin-right:auto">
                                        <div style="min-width:100%;width:100%;margin-top:15px;margin-bottom:40px;">
                                            <div style="overflow:auto;min-height:150px;margin-bottom:15px;background-color:#ffffff;box-shadow:1px 1px 1px rgba(0,0,0,0.1); position: relative">
                                                <div style="padding-top:15px;padding-left:15px;padding-right:15px">
                                                    <div style="font-size:20px;line-height:1.2;margin-bottom:20px">
                                                        Hello ${data['first_name']}!
                                                    </div>
                                                    <div style="font-size:16px;color:rgb(60,60,60);margin-top:5px">
                                                        Thank you for your contacting me!<br/>
                                                        I will get back to you as soon as possible.<br/>
                                                        <br/>
                                                    </div>
                                                </div>
                                                <div style="margin-top:15px;padding-bottom:15px;padding-left:15px;padding-right:15px">
                                                    <div>
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    <b style = "font-weight: 600">${_user.first_name} ${_user.last_name}</b>, Web Developer
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table>
                                                            <tr>
                                                                <td style = 'color:rgb(180,180,180); padding-right: 12px'>
                                                                    Website
                                                                </td>
                                                                <td>
                                                                    <a href='http://minnam.io'>minnam.io</a><br>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style = 'color:rgb(180,180,180); padding-right: 12px'>
                                                                    Email
                                                                </td>
                                                                <td>
                                                                    ${_user.username}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style = 'color:rgb(180,180,180); padding-right: 12px'>
                                                                    Phone
                                                                </td>
                                                                <td>
                                                                    1 (778) 989-2385
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div style = "border-bottom: 2px solid rgb(230,230,230);margin-bottom: 15px;margin-top: 15px;">
                                                    </div>
                                                    ${data['message']}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                        </html>`
                    }, ( sent ) => {
                        res.send( sent );
                    });
                });
            });
        }
    });

};

export {customRoutes};
