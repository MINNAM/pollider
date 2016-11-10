import React from 'react';

import _Dialog from 'material-ui/Dialog';

class Dialog extends React.Component {

    constructor ( props ) {

        super ( props );

    }

    render () {

        let dialogStyle = {

            width    : '100%',
            height   : '100%',
            position : 'fixed',
            display  : this.props.open ? 'initial' : 'none',
            zIndex   : 100,
            top      : 0,
            left     : 0,

        };

        let contentStyle = {

            position    : 'absolute',
            background  : 'white',
            boxShadow   : '1px 1px 10px rgba(50,50,50,0.5)',
            padding     : '15px 15px 65px 15px',
            width       : '50%',
            top         : '50%',
            left        : '50%',
            transform   : 'translate(-50%, -50%)',
        };

        return (

            <div
                style       = { Object.assign( dialogStyle, this.props.dialogStyle ? this.props.dialogStyle : {} ) }
                onTouchTap = { ( event ) => {

                    event.stopPropagation();
                    this.props.onRequestClose();

                }}

            >
                <div
                    style = {{

                        position : 'absolute',
                        background: 'rgba(50,50,50,0.4)',
                        padding : '5%',
                        width : '100%',
                        height: '100%'

                    }}
                >
                    <div
                        style      = { Object.assign( contentStyle, this.props.contentStyle ? this.props.contentStyle : {} ) }
                        onTouchTap = { ( event ) => {

                            event.stopPropagation();

                        }}
                    >
                        { this.props.children }
                        <div style = {{ marginTop: 5, display: 'table', width : 'calc( 100% - 30px )', height: 50, bottom : 0, position: 'fixed', height : 50 }}>

                            {
                                this.props.actions.map( ( element, key ) => {

                                    return (

                                        <span key = { key } style = {{ display : 'table-cell' }}>
                                            { element }
                                        </span>

                                    );

                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );

    }

}

export default Dialog;
