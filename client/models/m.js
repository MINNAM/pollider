import CONFIG from './m-config.js';

class _M {

    constructor () {}

    getDate ( unformattedDate ) {

        let dateObject = new Date( unformattedDate );

        return CONFIG.shortMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear();

    }

    getDateTime ( unformattedDate ) {

        let dateObject = new Date( unformattedDate );
        return CONFIG.fullMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear() + ' ' + ( dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours() ) + ':' + ( dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes() ) + ':' + ( dateObject.getSeconds() < 10 ? '0' + dateObject.getSeconds() : dateObject.getSeconds() );

    }

}

const M = new _M;

export default M;
