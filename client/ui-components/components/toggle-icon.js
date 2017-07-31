import React from 'react';

import TouchRipple from '../../../node_modules/material-ui/internal/TouchRipple';
import {THEME} from '../../global.js';

const ICON_STYLE = {
    fontSize: 23,
    paddingRight: 6,
    paddingLeft: 6,
    lineHeight: '36px',
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
                    borderRadius: '100%',
                    position : 'relative',
                    overflow: 'hidden',
                    height : 36,
                    background : this.state.hover ? 'rgba(153,153,153,0.2)' : (value ? 'rgba(153,153,153,0.2)' : '' ),
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
                <TouchRipple
                    style = {{
                        overflow: ''
                    }}
                >
                    <i
                        className="material-icons"
                        style = {{
                            ...ICON_STYLE,
                            color: 'rgb(123,123,123)'
                        }}
                    >{this.props.on}</i>
                </TouchRipple>
            </span>

        )
    }
}

export default ToggleIcon;
