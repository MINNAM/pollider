import request    from 'request';

class GoogleApi {

    constructor () {

        this.user          = "hi@minnam.io";
        this.client_secret = 'BNSZpSvuzuY4fw7Ji6X5HUEs'; // BNSZpSvuzuY4fw7Ji6X5HUEs
        this.refresh_token = '1/hQ3DNLWEZdnRn248ifOvW1CDqRf7aAKGsUw--Fr9Er1N1oiGKxbyOIUWrViYm6Z2';
        this.client_id     = '871610360530-pu586abnrsg1hso8m5uq5a5ntm2l9t09.apps.googleusercontent.com'; // 871610360530-pu586abnrsg1hso8m5uq5a5ntm2l9t09.apps.googleusercontent.com

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
            }, function(err, httpResponse, body){
                console.log( err );
                callback( JSON.parse( body )[ 'access_token' ] );
            }

        );

    }


}

export default GoogleApi;
