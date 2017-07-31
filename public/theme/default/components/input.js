import React from 'react';

class Input extends React.Component {

    constructor ( props ) {

        super ( props );

        this.state = {
            focus : false
        }
    }

    render () {

        const { label, multiline } = this.props;

        return (

            <div
                style = {{
                    paddingTop : 17,
                    paddingBottom : 15,
                    marginBottom: 5,
                    position : 'relative',
                    fontFamily : 'hind'
                }}

                onClick = {() => {

                    this.refs.input.focus();

                    this.setState({ focus : true });

                }}
            >
                <span
                    style = {{
                        fontSize : this.state.focus ? 13 : 15,
                        position : 'absolute',
                        top : this.state.focus ? 0 : 19.5,
                        left : 2.5,

                        transition : '0.25s all'
                    }}
                >
                    { label }
                    {( this.props.required ? <span style = {{ color : 'rgb(160,160,160)', fontSize : 11}}> {` *`}</span> : '' )}
                </span>
                {
                    multiline ? <div>
                        <textarea
                            ref = "input"
                            style = {{
                                width : '100%',
                                height : 150,
                                border : 'none',
                                borderBottom : `2px solid ${ this.props.error ? 'rgb(244, 67, 54)' : this.state.focus ? 'rgb(76, 211, 173)' : 'rgb(220,220,220)' }`,
                                outline : 'none',
                                padding : 2.5,
                                fontSize : 15,
                                resize : 'none',
                                transition : '0.25s all',
                                color : this.props.disabled ? 'rgb(200,200,200)' : 'rgb(60,60,60)'
                            }}

                            value = { this.props.value ? this.props.value : ''}

                            onFocus = { () => {
                                this.setState({
                                    focus : true
                                })
                            }}

                            disabled = { this.props.disabled }

                            onBlur = { () => {

                                if ( !this.refs.input.value ) {

                                    this.setState({
                                        focus : false
                                    })

                                }
                            }}

                            maxLength = { this.props.max }

                            onChange = {( event )=>{


                                this.props.onChange( event.target.value );
                                this.setState({ wordCount : event.target.value.length });

                            }}
                        />
                        <span
                            style = {{
                                float : 'right',
                                color : this.props.max == this.state.wordCount ?  'rgb(60,60,60)' : 'rgb(160,160,160)',
                                fontSize : 11
                            }}
                        >
                            {`${this.state.wordCount ? this.state.wordCount : 0}/${this.props.max}`}
                        </span>
                    </div> : <input
                        ref = "input"
                        style = {{
                            width : '100%',
                            border : 'none',
                            borderBottom : `2px solid ${ this.props.error ? 'rgb(244, 67, 54)' : this.state.focus ? 'rgb(76, 211, 173)' : 'rgb(220,220,220)' }`,
                            outline : 'none',
                            padding : 2.5,
                            fontSize : 15,
                            color : this.props.disabled ? 'rgb(200,200,200)' : 'rgb(60,60,60)'
                        }}

                        disabled = { this.props.disabled }

                        onFocus = { () => {
                            this.setState({
                                focus : true
                            })
                        }}

                        value = { this.props.value ? this.props.value : ''}

                        onBlur = { () => {

                            if ( !this.refs.input.value ) {

                                this.setState({
                                    focus : false
                                })

                            }
                        }}

                        onChange = {( event )=>{

                            this.props.onChange( event.target.value );

                        }}
                    />

                }
            </div>

        );
    }

}


export default Input;
