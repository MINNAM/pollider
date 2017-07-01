
import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import CONFIG     from './models/m-config.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

import _Info from './models/info.js';

const muiTheme = getMuiTheme({

    palette: {

        primary1Color : CONFIG.theme.primaryColor,
        accent1Color  : CONFIG.theme.primaryColor,

    }

});

const StepperMenuItem = ( props ) => {

    return (

        <span
            style = {{

                lineHeight : '50px',
                marginLeft : 7.5,
                float      : 'left',
                color      : props.selected ? 'rgb(48,48,48)' : 'rgb(220,220,220)'

            }}
            onClick = { () => {

                props.onClick( props.index );

            }}
        >
            { props.label }
        </span>
    );

};

class StepperMenu extends React.Component {

    render () {

        return (

            <div
                style = {{
                    display : 'inline-block',
                    float : 'right',
                    height : '100%'
                }}
            >

                {

                    this.props.items.map( ( element, key ) => {


                        return (
                            <span>
                                <StepperMenuItem
                                    index = { key }
                                    label = { element  }
                                    selected = {key == this.props.index  }
                                />
                                {
                                    key % 1 == 0 && key != this.props.items.length - 1 ? <i
                                        className="material-icons"
                                        style = {{

                                            lineHeight: '50px',
                                            marginLeft: 7.5,
                                            fontSize: 13,
                                            float: 'left',
                                            color : 'rgb(220,220,220)'

                                        }}
                                    >
                                        remove
                                    </i> : ''
                                }
                            </span>
                        );

                    })

                }

            </div>

        );

    }

}

const StepperContent = ( props ) => {

    return (

        <div
            style = {{
                display : props.selected ? 'block' : 'none'
            }}
        >
            { props.children  }
        </div>

    );

};

const StepperContentContainer = ( props ) => {

    const style = Object.assign( {}, props.style );

    return (

        <div
            style = { style }
        >
            {
                props.children.map( ( element, key ) => {

                    return React.cloneElement( element, {

                        selected : key == props.selected

                    });

                })

            }
        </div>

    );

};

class _TextField extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {

        const model = this.props.model;

        return (
            <TextField
                style = {{
                    width: '100%'
                }}
                floatingLabelText = { model.label }
                floatingLabelFixed = { true }
                value = { model.value }
                errorText = { model.error }
                type = { model.type == 'password' ? 'password' : 'text' }
                onChange = { ( event, newValue ) => {

                    this.props.onChange( this.props.index, newValue );


                }}
            />
        );

    }

}

const Form = ( props ) => {

    return (

        <div>
        {
            props.model.map( ( element, key ) => {

                return (

                    <_TextField
                        model = { element }
                        key = { key }
                        index = { key }
                        onChange = { props.onChange }
                    />

                );

            })
        }
        </div>
    );

};

class Setting extends React.Component{

    constructor ( props ) {

        super(props);

        this.state = {

            stepperIndex : 0,
            model : null,
            dbmodel : null,

        };

        const info = new _Info();

        info.load( ( model ) => {

            this.setState({ model });

        })

    }

    render(){

        const fields = this.state.model.map ( ( object ) => {

            var jsonData = {object};

            let field = [];

            for ( var i in jsonData) {

                var key = i;

                var val = jsonData[i];

                for ( var j in val ) {

                    field += j + ' : ' + val[j] + '\n' ;
                }
            }

            console.log(field);

            if ( this.state.model != null ) {

                return (
                    <div>
                        {
                            field.split('\n').map( line => {
                                return (
                                    <span>{line}<br/></span>
                                );
                            })
                        }
                    </div>
                );
            }
        })

        return(
            <div>
                <MuiThemeProvider muiTheme = {getMuiTheme ( muiTheme ) } >
                    <div
                        style = {{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width : 500,
                            minHeight : 500,
                            transform: 'translate(-50%, -50%)',
                            padding: '15px 15px 50px 15px',
                            background: 'white',
                            boxShadow : 'rgba(50, 50, 50, 0.1) 1px 1px 10px'
                        }}
                    >
                        <div>
                            <div
                                style = {{
                                    height : 45,
                                    width : '100%',
                                    marginBottom : 15
                                }}
                            >
                                <img
                                    id = 'logo'
                                    src = { CONFIG.backendUrl + '/img/logo6.svg' }
                                    style = {{
                                        height : '100%',
                                        display: 'inline-block',
                                        float: 'left'
                                    }}
                                />
                                    <StepperMenu
                                        index = { this.state.stepperIndex }
                                        items = {[
                                            'User Info',
                                            'Modified'
                                        ]}
                                    />
                            </div>
                            <StepperContentContainer
                                selected = { this.state.stepperIndex }
                                children = {[

                                    <StepperContent>

                                        <span style = {{
                                            fontSize : 20,
                                            width : '100%',
                                            textAlign : 'center',
                                            display : 'inline-block',
                                            letterSpacing: 3,
                                            fontWeight: 300,
                                            padding: '40px 0 20px 0',
                                            textTransform : 'uppercase'
                                        }}>
                                            User Info
                                        </span>

                                        <span style = {{ width: '100%', display: 'inline-block',  fontSize : 16, color: 'rgb(160, 160, 160)', padding : '0 40px 0 40px' }} >
                                            {fields}
                                        </span>
                                    </StepperContent>,

                                ]}
                            />

                        </div>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Setting;
