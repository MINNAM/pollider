import request    from 'request';

class GoogleApi {

    constructor () {

        this.user          = "nsm12889@gmail.com";
        this.client_secret = 'sPcOSXz411zYY86lqBt-EPM2';
        this.refresh_token = '1/p7NfUHeJieflsy5KhFGtdf8nfyRSUd3xjFrGFPe8YW522Qs0KQNmHr0Z4MgRV-aj';
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

                console.log( err );

                callback( JSON.parse( body )[ 'access_token' ] );

            }

        );

    }


}

export default GoogleApi;
