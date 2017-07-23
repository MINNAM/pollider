import React from 'react';

import SITE from './site.js';

const fullMonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

const THEME = {
    primaryColor : '#4CD3AD'
};

const formatDate = (unformattedDate) => {
    const dateObject = new Date( unformattedDate );
    return shortMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear();
}

const formatDateTime = ( unformattedDate ) => {
    let dateObject = new Date( unformattedDate );
    return fullMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear() + ' ' + ( dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours() ) + ':' + ( dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes() ) + ':' + ( dateObject.getSeconds() < 10 ? '0' + dateObject.getSeconds() : dateObject.getSeconds() );
}

const formatHyperlink = (name) => {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-' ).replace(/[-]+/g, '-').replace(/[-]$/g, '');
}

const buildHyperlink = (parentId, parentPosts, hyperlink) => {
    let _hyperlink = hyperlink;

    parentPosts.map( ( parent, key ) => {
        if (parentId == parent.id) {

            if ( parent.parent_id != 'null' ) {

                _hyperlink = this.buildHyperlink( parent.parent_id, parentPosts, `/${ parent.hyperlink + hyperlink }` );
            }
        }
    });

    return _hyperlink;
}

export {
    SITE,
    THEME,
    fullMonthNames,
    shortMonthNames,
    formatDate,
    formatDateTime,
    formatHyperlink,
    buildHyperlink
};
