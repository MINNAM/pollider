import React     from 'react';
import TextField from 'material-ui/TextField';

const errorStyle = [ 'red','green' ];

class DebounceField extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            errorText  : null,
            errorStyle : 0

        };

        this.timeout;
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

    onChange ( event, target, _value ) {

        const value = event.target.value;

        this.debounce( () => {

            let parentId = this.props.selected ? this.props.selected.parent_id : null;

            if ( this.props.selected ) {

                if ( this.props.selected.container ) {

                    parentId = this.props.selected.id;

                }

            };

            if ( this.props.model  ) {

                if ( this.props.model.name == value ) {

                    this.setState({

                        errorText : 'Post is already that name',
                        errorStyle : 1

                    });

                    this.props.setError( false );

                } else {

                    this.setState({

                        errorText : null

                    });

                }

            }

            if ( !this.state.errorText ) {

                this.props.parentModel.checkPostExist( parentId, value, ( exists ) => {

                    if ( exists ) {

                        this.setState({ errorText : 'Post Already Exitsts.' });
                        this.props.setError( true );

                    } else {

                        this.setState({ errorText : null });
                        this.props.setError( false );

                    }

                });

            }

            if ( value == '' ) {

                this.setState({ errorText : 'Post Name Cannot be Empty' });
                this.props.setError( true );
            }

        });

        this.props.onChange( event, target, _value );

    }

    render () {

        return (

            <TextField
                style          = {{ width: '100%'}}
                underlineStyle = {{ color : errorStyle[ this.state.errorStyle ] }}
                defaultValue   = { this.props.model ? this.props.model.name : null }
                hintText       = { this.props.hintText }
                onChange       = { this.onChange.bind( this ) }
                errorText      = { this.state.errorText }
                autoFocus
            />

        );

    }

}

DebounceField.propTypes = {

    selected    : React.PropTypes.object.isRequired,
    model       : React.PropTypes.object.isRequired,
    parentModel : React.PropTypes.object.isRequired,
    onChange    : React.PropTypes.func.isRequired,
    setError    : React.PropTypes.func.isRequired,
    hintText    : React.PropTypes.string

};

export default DebounceField;
