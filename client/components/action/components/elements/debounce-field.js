import React     from 'react';
import TextField from 'material-ui/TextField';

import CONFIG     from '../../../../models/m-config.js';

import { formatHyperlink } from '../../../post-container/models/utility.js';

const ERROR_STYLES = [ CONFIG.theme.primaryColor, 'red' ];

class DebounceField extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            errorText  : null,
            errorStyle : 0

        };

    }

    debounce ( callback ) {

        if ( this.timeout ) {

            clearTimeout( this.timeout );

        }

    	this.timeout = setTimeout( () => {

            callback();

            this.timeout = null;

        }, 250 );

    }

    /*
    *   Only implemented for debouncing posts, need to implement any given data
    */
    onChange ( event, target, _value ) {

        const value = event.target.value;
        const {
            model,
            selected,
            parentModel,
            hintText,
            setError,
            onChange
        } = this.props;

        this.debounce( () => {

            const { id } = model;
            const parentId = selected ? selected.parent_id : null;
            const hyperlink = formatHyperlink( value );


            this.props.parentModel.checkPostExist( id, parentId, value, hyperlink, ( exists ) => {

                if ( exists ) {

                    this.setState({ errorText : 'Post Already Exitsts.' });
                    setError( true );

                } else {

                    this.setState({ errorText : null });
                    setError( false );

                    if ( value == '' ) {

                        this.setState({ errorText : 'Post Name Cannot be Empty' });
                        setError( true );
                    }

                }

            });

        });

        onChange( event, target, _value );

    }

    render () {
        const { model, hintText } = this.props;
        const { errorStyle, errorText } = this.state;

        return (

            <TextField
                style          = {{ width: '100%'}}
                underlineStyle = {{ color : ERROR_STYLES[ errorStyle ] }}
                defaultValue   = { model ? model.name : null }
                hintText       = { hintText }
                onChange       = { this.onChange.bind( this ) }
                errorText      = { errorText }
                autoFocus
            />

        );

    }

}

DebounceField.propTypes = {

    selected    : React.PropTypes.object,
    model       : React.PropTypes.object,
    parentModel : React.PropTypes.object,
    onChange    : React.PropTypes.func.isRequired,
    setError    : React.PropTypes.func.isRequired,
    hintText    : React.PropTypes.string

};

export default DebounceField;
