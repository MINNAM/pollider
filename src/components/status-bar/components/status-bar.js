import React from 'react';

class StatusBar extends React.Component {

    constructor ( props ) {

        super ( props );

        this.state = {

            status : 0

        };

    }

    onClick () {

        let status =  this.state.status;

        this.setState({

            status : ( ++status % 4 )

        });

    }

    render () {


        return (

            <div onTouchTap = { this.onClick.bind( this ) } style = {{ width: '100%', height: '80%', display: 'inline-block', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.26)', position: 'relative' }} >
                <div style = {{ width: '100%', height: '100%', display : 'inline-block', color : 'white', position: 'absolute', top: 0, zIndex : 100 }}>
                    <span style = {{ height: '100%', lineHeight : '300%', display: 'inline-block', padding: '0 5% 0 5%'}}>{ this.props.text }</span>
                </div>
                <div style = {{ width: '100%', height: '100%', display : 'inline-block', overflow: 'hidden' }}>
                    <div className = {'snack-bar-status-item'} style = {{ marginTop: this.props.status < 1 ? '0%' : '-50%', width: '100%', height: '100%', display : 'inline-block', background: 'rgba(20, 20, 20, 0.7)', color : 'white' }}></div>
                    <div className = {'snack-bar-status-item'} style = {{ marginTop: this.props.status < 2 ? '0%' : '-50%', width: '100%', height: '100%', display : 'inline-block', background: 'rgba(20, 20, 20, 0.7)', color : 'white' }}></div>
                    <div className = {'snack-bar-status-item'} style = {{ marginTop: this.props.status < 3 ? '0%' : '-50%', width: '100%', height: '100%', display : 'inline-block', background: 'rgba(20, 20, 20, 0.7)', color : 'white' }}></div>
                    <div className = {'snack-bar-status-item'} style = {{ marginTop: this.props.status < 4 ? '0%' : '-50%', width: '100%', height: '100%', display : 'inline-block', background: 'rgba(20, 20, 20, 0.7)', color : 'white' }}></div>
                </div>

            </div>

        );

    }

}

export default StatusBar;
