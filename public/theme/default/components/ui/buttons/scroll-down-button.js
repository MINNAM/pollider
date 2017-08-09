import React from 'react';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

const ScrollDownButton = (props) => {
    const {
        style,
        onMouseEnter,
        onMouseLeave,
        onClick,
        hover,
        target,
        primaryColor,
        secondaryColor
    } = props;

    return (
        <div
            className = 'scroll-down-button'
            style = {{
                animationDuration: '4s',
                animationIterationCount: 'infinite',
                animationName: 'scroll-down-animation-2',
                height: 50,
                position: 'absolute',
                width: 50,
                zIndex: 5,
                cursor: 'pointer',
                animationPlayState: hover ? 'paused' : '',
                ...style
            }}
            onMouseEnter = {() => {onMouseEnter();}}
            onMouseLeave = {() => {onMouseLeave();}}
            onClick = {() => {

                const videos = document.getElementsByTagName('video');

                if (videos.length > 0) {
                    for( let i = 0; i < videos.length; i++ ) {
                        videos[i].pause();
                    }
                }

                let startingY = window.scrollY;
                let diff = (target().clientHeight + 25) - startingY
                let start = 0;
                let duration = 750;
                let easing = function (t) { return (--t)*t*t+1 }

              // Bootstrap our animation - it will get called right before next frame shall be rendered.
                window.requestAnimationFrame(function step(timestamp) {
                    if (!start) {
                        start = timestamp;
                    }

                    let time = timestamp - start
                    let percent = Math.min(time / duration, 1);

                    percent = easing(percent);

                    window.scrollTo(0, startingY + diff * percent);

                    if (time < duration) {
                        window.requestAnimationFrame(step);
                    }
                });

            }}
        >
            <svg
                style = {{
                    height: 50,
                    left: 0,
                    position: 'absolute',
                    top:0,
                    width: 50,
                }}
            >
                <polyline
                    points = "12.5,17.5 25,34 37.5,17.5"
                    style  = {{
                        fill: 'none',
                        stroke: secondaryColor ? secondaryColor : 'rgb(76, 211, 173)',
                        strokeWidth: 2,
                    }}
                />
            </svg>
            <svg
                style = {{
                    animationDuration: '4s',
                    animationIterationCount: 'infinite',
                    animationName: 'scroll-down-animation-1',
                    background: 'rgba(0,0,0,0)',
                    height: 30,
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: 50,
                    animationPlayState:hover ? 'paused' : '',
                }}
            >
                <polyline
                    points = "12.5,17.5 25,34 37.5,17.5"
                    style = {{
                        fill: 'none',
                        strokeWidth: 2,
                        stroke: primaryColor ? primaryColor : 'rgb(30,30,30)'
                    }}
                />
            </svg>
        </div>
    );

};

export default ScrollDownButton;
