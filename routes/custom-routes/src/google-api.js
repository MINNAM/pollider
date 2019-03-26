import request    from 'request';

class GoogleApi {

    constructor () {

        this.user          = "hi@minnam.io";
        this.client_secret = 'OpTZ-Y1KBHkXm1zeyh1WTgmP';
        this.refresh_token = '1/oCVwqBNocTZUl9qyAkVbEcmJ_DfId408SvG2Y_lATmQ';
        this.client_id     = '871610360530-shuinpl59btc88dll12k24ujcno33d8j.apps.googleusercontent.com';

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
