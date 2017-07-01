import React from 'react';

const LiterallyClock = ( props ) => {

    const h = ( ( props.hour / 12 ) + ( (1 / 12) * ( props.minute / 60 ) ) ) * 360;
    const m = ( props.minute / 60 ) * 360;
    const s = ( props.second / 60 ) * 360;

    console.log( props, h, m, s  );

    const style = Object.assign( props.style ? props.style : {}, {
        width   : props.size,
        height  : props.size,
        display : 'inline-block',
    });

    return (

        <span
            style = { style }
        >
            <svg viewBox="0 0 30 30" width="100%" height="100%">
                <circle
                    cx = '0'
                    cy = '0'
                    r = '40%'
                    stroke = { props.colors ? ( props.colors.parent ? props.colors.parent : 'rgb(90,90,90)' )  : 'rgb(90,90,90)' }
                    strokeWidth = {1.5}
                    fill = 'none'
                    transform = 'translate( 15, 15)'
                />
                <line
                    x1            = {0}
                    y1            = {0}
                    x2            = {0}
                    y2            = { '-25%' }
                    strokeLinecap = "round"
                    stroke        = { props.colors ? ( props.colors.minute ? props.colors.minute : 'rgb(90,90,90)' )  : 'rgb(90,90,90)' }
                    strokeWidth   = {1.5}
                    transform = { 'translate(15, 15) rotate(' + m + ')' }
                />

                <line
                    x1 = {0}
                    y1 = {0}
                    x2 = {0}
                    y2 = { '-18%' }
                    strokeLinecap = "round"
                    stroke        = { props.colors ? ( props.colors.hour ? props.colors.hour : 'rgb(90,90,90)' )  : 'rgb(90,90,90)' }
                    strokeWidth = {1.5}
                    transform = { 'translate(15, 15) rotate(' + h + ')' }
                />

                <circle
                    cx = {0}
                    cy = {0}
                    r  = {1.5}
                    stroke = { props.colors ? ( props.colors.second ? props.colors.second : 'rgb(59, 155, 219)' )  : 'rgb(59, 155, 219)' }
                    fill = { props.colors ? ( props.colors.second ? props.colors.second : 'rgb(59, 155, 219)' )  : 'rgb(59, 155, 219)' }
                    transform = 'translate( 15, 15) rotate(0)'
                />

                <line
                    x1 = {0}
                    y1 = {5}
                    x2 = {0}
                    y2 = {'-30%'}
                    strokeLinecap="round"
                    stroke = { props.colors ? ( props.colors.second ? props.colors.second : 'rgb(59, 155, 219)' )  : 'rgb(59, 155, 219)' }

                    strokeWidth = {1}
                    transform = { 'translate(15, 15) rotate(' + s + ')' }
                />
            </svg>
        </span>

    );

}

export default LiterallyClock;
