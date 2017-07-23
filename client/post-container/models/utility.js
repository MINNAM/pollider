const CONFIG = {

    siteUrl         : 'http://localhost:3000/',
    backendUrl      : 'http://localhost:3000/',
    fullMonthNames  : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    shortMonthNames : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    theme           : {
        primaryColor : '#4CD3AD'
    }

};

const formatHyperlink = ( name ) => {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-' ).replace(/[-]+/g, '-').replace(/[-]$/g, '');
}

const formatDate  = ( unformattedDate ) => {
    let dateObject = new Date( unformattedDate );

    return CONFIG.shortMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear();
}

const getDateTime =  ( unformattedDate ) => {

    let dateObject = new Date( unformattedDate );
    return CONFIG.fullMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear() + ' ' + ( dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours() ) + ':' + ( dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes() ) + ':' + ( dateObject.getSeconds() < 10 ? '0' + dateObject.getSeconds() : dateObject.getSeconds() );

}

export {formatHyperlink, formatDate, getDateTime};
