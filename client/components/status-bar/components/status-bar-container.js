import React from 'react';
import StatusBar from './status-bar.js';

class StatusBarContainer extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            display : false

        };

    }

    render () {

        let queue = this.props.queue;
        let display;

        return (

            <div
                style = {{

                    width      : '27%',
                    height     : 60,
                    position   : 'fixed',
                    zIndex     : 100,
                    display    : display ? '' : '',
                    bottom     : 10,
                    left       : '50%',
                    transform  : 'translate(-50%, 0)'

                }}
            >
                {

                    queue[ 0 ] ? <StatusBar
                        text   = { queue[ 0 ].message }
                        status = { queue[ 0 ].status }
                    /> : ''
                }

            </div>

        );

    }

}

export default StatusBarContainer;
