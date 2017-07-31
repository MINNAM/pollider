import React from 'react';
import StatusBar from './status-bar.js';

const StatusBarContainer = (props) => {
    let queue = props.queue;

    return (
        <div
            style = {{
                width: '27%',
                height: 60,
                position: 'fixed',
                zIndex: 100,
                bottom: 30,
                left: '50%',
                transform: 'translate(-50%, 0)'
            }}
        >
            {
                queue[0] ? <StatusBar
                    type = {queue[0].type}
                    text = {queue[0].message}
                    status = {queue[0].status}
                /> : ''
            }
        </div>
    );
};

export default StatusBarContainer;
