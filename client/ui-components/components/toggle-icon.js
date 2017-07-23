import React from 'react';

import TouchRipple from '../../../node_modules/material-ui/internal/TouchRipple';

const ICON_STYLE = {
    fontSize: 22,
    paddingRight: 8,
    paddingLeft: 8,
    lineHeight : '36px',
    color : 'rgb(100, 100, 100)'
};


class ToggleIcon extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            value : this.props.value,

        }

    }

    handleChange () {

        // var value = this.state.value;
        //
        // var test = value ? false : true
        //
        // console.log('value');
        //
        // this.setState({ value : test });

        const value = !this.state.value;

        this.setState({ value });

        return false;

    }

    render(){

        let value = this.props.value

        return(

            <span
                style = {{
                    ...this.props.style,
                    position : 'relative',
                    height : 36,
                    background : this.state.hover ? 'rgba(153,153,153,0.2)' : '',
                    borderRadius: 2,
                    transition : 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                    cursor : 'pointer'
                }}
                onMouseEnter = {() =>{

                    this.setState({ hover : true });

                }}

                onMouseLeave = {() =>{

                    this.setState({ hover : false });

                }}

                onClick = { this.props.onChange }
            >
                <TouchRipple>

                    <i
                        className="material-icons"
                        style = { ICON_STYLE }
                    >{ value ? this.props.on : this.props.off }</i>
                </TouchRipple>
            </span>

        )
    }
}

export default ToggleIcon;
