import React from 'react';
import SITE from './site.js';

//
//                            ╭──┐ ╭──┐              ╭──┐
//                            │  │ │  │              │  │
//                            │  │ │  │ ╭──┐         │  │
//                            │  │ │  │ └──┘         │  │  ╭──────────┐  ╭─────────┐
// ╭──────────┐ ╭──────────┐  │  │ │  │ ╭──┐ ╭───────┘  │  │  ╭────┐  │ ╱  ╭───────┘
// │  ╭────┐  │ │  ╭────┐  │  │  │ │  │ │  │ │  ╭─ ──┐  │  │  └────┘  │ │  │
// │  │    │  │ │  │    │  │  │  │ │  │ │  │ │       │  │  │  ╭───────┘ │  │
// │  └────┘  │ │  └────┘  │  │  │ │  │ │  │ │  └── ─┘  │  │  └───────┐ │  │
// │  ┌───────┘ └──────────┘  └──┘ └──┘ └──┘ └──────────┘  └──────────┘ └──┘
// │  │
// │  │
// │  │
// └──┘


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
    primaryColor: 'rgb(76,211,173)',
    secondaryColor: '#F9B7B1',
    error: 'rgb(244,67, 54)'
};

const formatDate = (unformattedDate, seperator = true) => {
    const dateObject = new Date( unformattedDate );
    return shortMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + `${seperator ? ',': ''} ` + dateObject.getFullYear();
};

const formatDateTime = ( unformattedDate ) => {
    let dateObject = new Date( unformattedDate );
    return fullMonthNames[ dateObject.getMonth() ]+ ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear() + ' ' + ( dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours() ) + ':' + ( dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes() ) + ':' + ( dateObject.getSeconds() < 10 ? '0' + dateObject.getSeconds() : dateObject.getSeconds() );
};

const formatHyperlink = (name) => {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-' ).replace(/[-]+/g, '-').replace(/[-]$/g, '');
};

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
};

const scroll = (target, _from, _to, done) => {

    let diff = _to - _from;
    let start = 0;
    let duration = 750;
    let easing = function (t) { return (--t)*t*t+1; };

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if ( !start ) {
            start = timestamp;
        }

        let time = timestamp - start;
        let percent = Math.min(time / duration, 1);

        percent = easing(percent);

        target.scrollTop = _from + diff * percent;        

        if (time < duration) {
            window.requestAnimationFrame( step );
        } else {
            if (done) {
                done();
            }
        }

    });
};

export {
    SITE,
    THEME,
    fullMonthNames,
    shortMonthNames,
    scroll,
    formatDate,
    formatDateTime,
    formatHyperlink,
    buildHyperlink
};
