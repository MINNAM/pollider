import React from 'react';

import TouchRipple from '../../../../node_modules/material-ui/internal/TouchRipple';

const ICON_STYLE = {
    fontSize: 20,
    paddingRight: 8,
    paddingLeft: 8,
    lineHeight : '36px',
    color : 'rgb(200,200,200)'
};

class MaterialButton extends React.Component{

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
                    cursor : 'pointer',
                }}
                onMouseEnter = {() =>{

                    this.setState({ hover : true });

                }}

                onMouseLeave = {() =>{

                    this.setState({ hover : false });

                }}
            >
                <span
                    onClick = { this.props.onClick }
                >
                    <TouchRipple>
                        <span>
                        {
                            this.props.icon ? <button
                                value = { this.state.value }
                                style =  {{
                                    float : 'left',
                                }}
                            >
                                <i className="material-icons" style = {{ ...ICON_STYLE, ...this.props.iconStyle }}>{this.props.icon}</i>
                            </button> : ''
                        }
                        {
                            this.props.label ? <span
                                style = {{
                                    position: 'relative',
                                    paddingLeft : this.props.icon ? 0 : 12,
                                    paddingRight: 12,
                                    letterSpacing: 0,
                                    textTransform: 'uppercase',
                                    fontWeight: 500,
                                    fontSize: 12,
                                    lineHeight : '36px',
                                    float : 'left',
                                }}

                            >
                                { this.props.label }
                            </span> : ''
                        }
                        </span>
                    </TouchRipple>
                </span>
            </span>

        )
    }
}

export default MaterialButton;
