import axios from 'axios';
axios.defaults.withCredentials = true;
/* Pollider*/
import { UserQueryUrls } from './user-query.js';


class User {

    constructor () {
        this.getDetail();
    }

    getDetail () {
        axios({
            method: 'POST',
            url: UserQueryUrls.getDetail,
            data: {},
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }).then((response) => {
            for (let key in response.data) {
                this[key] = response.data[key];
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    login ( data, done ) {
        axios({
            method: 'POST',
            url: UserQueryUrls.login,
            data,
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }).then((response) => {
            if(response.data) {
                done(true);
            } else {
                done(false);
            }
        }).catch((error) => {
            done(false);
        });
    }

    logout (done) {
        axios({
            method: 'POST',
            url: UserQueryUrls.logout,
            data: null,
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }).then((response) => {
            done( response )
        }).catch((error) => {
            done(false);
        });
    }

}

export default User;
