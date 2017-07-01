import React      from 'react';

/* Material UI */
import FlatButton from 'material-ui/FlatButton';

/* Pollider */
import Dialog        from './dialog.js';
import DebounceField from './elements/debounce-field.js';
import TextEditor    from './elements/text-editor.js';
import CodeEditor    from './elements/code-editor.js';
import TextField     from './elements/text-field.js';
import DatePicker    from './elements/date-picker.js';

import CONFIG     from '../../../models/m-config.js';

/*
* Action class is responsible for populating requested dialog with particular inputs.
*/
class Action extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            values : {},
            error  : false

        };

    }

    componentDidMount () {}

    onExecute ( values ) {

        this.props.actions.execute( values ? values : this.state.values );
        this.props.onRequestClose();

    }

    setError ( error ) {

        this.setState({ error });

    }

    onTextChange ( event, target, value, element ) {

        const values = this.state.values;

        values[ element.field ] = event.target.value;

        if ( values[ element.field ] ) {

            this.setState({

                error : false

            });

        }

        this.setState({

            values : values

        });


    }

    setTitle ( element ) {

        return (

            <div>
                <span style = {{ display: 'block', fontSize: 20, marginBottom: 5 }}>
                    { element.title }
                </span>
                <span style = {{ display: 'block', color: 'rgb(100,100,100)', marginBottom : 5 }}>
                    { this.parseSubtitle( element.subtitle ) }
                </span>
            </div>

        );

    }

    parseSubtitle ( data ) {

        if ( data ) {

            return <span>{ data.pre }<span style = {{ color: CONFIG.theme.primaryColor }} >{ data.middle}</span>{ data.post }</span>;

        } else {

            return "";

        }

    }

    display () {

        return (

            this.props.actionModel.map( ( element, key ) => {

                if ( this.components[ element.dataType ] ) {

                    return (
                        <div
                            key = { key }
                            style = {{ height : '100%' }}
                        >
                            { this.components[ element.dataType ]( element, key ) }
                        </div>
                    )

                } else {

                    return (

                        <div key = { key }>
                            { this.setTitle( element ) }
                        </div>

                    );

                }

            })

        );

    }

    onRequestClose () {

        if ( this.props.actions.cancel ) {

            this.props.actions.cancel();

        }
        this.props.onRequestClose();

    }

    render () {

        const actions = [

            <FlatButton
                label      = "Cancel"
                primary    = { true }
                style      = {{ float : 'left' }}
                onTouchTap = { () => {

                    if ( this.props.actions.cancel ) {

                        this.props.actions.cancel();

                    }

                    this.props.onRequestClose();

                }}
            />,
            <FlatButton
                label           = "OK"
                style           = {{ float: 'right' }}
                disabled        = { this.props.actionModel.length !== 0 ? false : this.state.error }
                primary         = { true }
                onTouchTap      = { () => {

                    console.log( this.onExecute );

                    if( !this.state.error ) { this.onExecute(); }
                }}
            />

        ];

        if ( !this.props.open ) {

            return ( <div></div> );

        }

        return (

            <div>
                <Dialog
                    id              = {'action-dialog'}
                    actions         = { actions }
                    modal           = { false }
                    open            = { this.props.open }
                    onRequestClose  = { this.onRequestClose.bind ( this ) }
                    dialogStyle     = { this.props.actionDialogStyle ? this.props.actionDialogStyle.dialogStyle : {} }
                    contentStyle    = { this.props.actionDialogStyle ? this.props.actionDialogStyle.contentStyle : {} }
                >
                    {this.display()}
                </Dialog>
            </div>

        );

    }

}

Action.propTypes = {

    actions           : React.PropTypes.object,
    actionModel       : React.PropTypes.array,
    actionDialogStyle : React.PropTypes.object,
    onRequestClose    : React.PropTypes.func.isRequired,
    open              : React.PropTypes.bool.isRequired,

};

export { React, Action, TextEditor, CodeEditor, DebounceField, TextField, DatePicker };
