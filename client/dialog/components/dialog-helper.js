import React, {Component, PropTypes} from 'react';
/* Pollider */
import Dialog from './dialog.js';
import {THEME} from '../../global.js';
import {
    DebounceField,
    TextEditor,
    DatePicker,
    ToggleIcon,
    Seperator,
    TextField,
    MaterialButton
} from '../../ui-components/';
/**
* Action class is responsible for populating requested dialog with particular inputs.
*/

class DialogHelper extends Component {

    static propTypes = {
        actions: PropTypes.object,
        actionModel: PropTypes.array,
        actionDialogStyle: PropTypes.object,
        onRequestClose: PropTypes.func,
        isOpen: PropTypes.bool.isRequired,
    };

    state = {
        values: {},
        error: {}
    };

    constructor (props) {
        super(props);
    }

    onExecute (values = this.state.values) {
        const {
            model,
            onRequestClose
        } = this.props;
        const {
            error = {}
        } = this.state;

        if (Object.keys(error).length == 0) {

            model.actions.execute(values);

            if (onRequestClose != null) {
                onRequestClose();
            }

        } else {
            this.setState({ error });
        }
    }

    onRequestClose () {
        const {
            model,
            onRequestClose
        } = this.props;

        if (model.actions.cancel) {
            model.actions.cancel();
        }

        if (onRequestClose) {
            this.setState({
                values: {}
            })

            onRequestClose();
        }
    }


    setError (error) {
        this.setState({
            error
        });
    }

    onTextChange (event, target, value, element) {
        const {
            values,
            error = {}
        } = this.state;

        values[element.field] = {
            value: event.target.value
        };

        if (element.validate) {
            values[element.field].error = element.validate(values[element.field].value);
        }


        this.setState({
            values,
            error
        });
    }

    setTitle (data) {
        const {
            title,
            subtitle
        } = data;

        return (
            <div>
                <span
                    style = {{
                        display: 'block',
                        fontSize: 20,
                        marginBottom: 5
                    }}
                >
                    {title}
                </span>
                <span
                    style = {{
                        color: 'rgb(100,100,100)',
                        display: 'block',
                        marginBottom: 5
                    }}
                >
                    { this.parseSubtitle(subtitle) }
                </span>
            </div>
        );
    }

    parseSubtitle (data) {
        if (data) {
            return (
                <span>
                    {data.pre}
                    <span
                        style = {{
                            color: THEME.primaryColor
                        }}
                    >
                        {data.middle}
                    </span>
                    {data.post}
                </span>
            );
        } else {
            return '';
        }
    }

    display () {
        const {
            model
        } = this.props;

        return (
            model.fields.map(( field, key ) => {
                if (this.components[field.dataType]) {
                    return (
                        <div
                            key = {key}
                            style = {{
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {this.components[field.dataType](field, key)}
                        </div>
                    );
                } else {
                    return (
                        <div key = {key}>
                            {this.setTitle( field )}
                        </div>
                    );
                }
            })
        );
    }

    render () {
        const {
            isOpen,
            model,
            onRequestClose,
        } = this.props;
        const {
            error
        } = this.state;

        if (!model) {
            return ( <div/> );
        }

        return (
            <div>
                <Dialog
                    id = {'action-dialog'}
                    modal = {false}
                    isOpen = {isOpen}
                    onExecute = {() => {
                        this.onExecute();
                    }}
                    values = {this.state.values}
                    error = { error ? Object.keys(error).length != 0 : false }
                    onRequestClose = {this.onRequestClose ? this.onRequestClose.bind(this) : null}
                    style = {model.style}
                    options = {model.options}
                >
                    {this.display()}
                </Dialog>
            </div>
        );
    }

}

export default DialogHelper;
