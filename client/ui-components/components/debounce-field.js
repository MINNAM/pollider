import React, {Component, PropTypes} from 'react';
/* Material UI */
import TextField from 'material-ui/TextField';
/* Pollider */
import {THEME, formatHyperlink} from '../../global.js';

const STYLES = {
    errors: [
        {
            color: THEME.primaryColor
        },
        {
            color: 'red'
        }
    ]
}

class DebounceField extends Component {

    static propTypes = {
        selected: PropTypes.object,
        model: PropTypes.object,
        parentModel: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired,
        hintText: PropTypes.string
    }

    state = {
        errorText: null,
        errorStyle: 0
    };

    debounce (callback) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

    	this.timeout = setTimeout(() => {
            callback();

            this.timeout = null;
        }, 250);
    }

    /*
    *   Currently, only implemented for debouncing 'Post'
    */
    onChange (event, target, _value) {
        event.persist();

        const value = event.target.value;
        const {
            model,
            selected,
            parentModel,
            hintText,
            setError,
            onChange,
        } = this.props;



        this.debounce(() => {
            let id = null;
            let parentId;

            const hyperlink = formatHyperlink( value );

            if (selected) {
                if (selected.container) {
                    parentId = selected.id;
                } else {
                    parentId = selected.parent_id;
                }
            }

            this.props.parentModel.checkPostExist(parentId, value, hyperlink, (exists) => {

                this.props.onChange(value, exists);

            });

        });

    }

    render () {
        const {
            model,
            hintText,
            error,
            selected
        } = this.props;
        const {
            errorStyle,
            errorText
        } = this.state;

        console.log( 'selected', model, selected );

        return (
            <TextField
                autoFocus = {true}
                defaultValue   = { model ? model.name : null }
                errorText      = { error }
                hintText       = { hintText }
                onChange       = { this.onChange.bind(this) }
                style          = {{width: '100%'}}
                underlineStyle = { STYLES.errors[ errorStyle ] }
            />
        );
    }

}

export default DebounceField;
