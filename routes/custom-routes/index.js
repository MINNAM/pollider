import Mail from './src/mail.js';
import GoogleApi from './src/google-api.js';

const googleApi = new GoogleApi();

const customRoutes = (router) => {

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

            mail.send({
                from    : data[ 'email' ],
                to      : 'nsm12889@gmail.com',
                subject : `Message from ${ data['first_name'] } ${ data['last_name'] } ${ data['company'] ? `@ ${ data['company'] }` : '' }`,
                text    : data[ 'message' ]

            }, ( sent ) => {

                mail.send({
                    from    : 'nsm12889@gmail.com',
                    to      : data[ 'email' ],
                    subject : `Sung Min Nam | Contact Receipt`,
                    html    : `
                        <div>
                            <p>
                                Hello ${ data[ 'first_name' ] },
                                <br />
                                <br />
                                Thank you for your inquiry. <br />
                                I'll get back to you soon!
                                <br />
                                <br />
                                Sung Min
                                <br />
                                <br />
                                -----------------------------------
                                ${ data[ 'message' ] }

                            </p>
                        </div>
                    `
                }, ( sent ) => {
                    res.send( sent );
                });
            });
        }
    });

};

export {customRoutes};
