import React       from 'react';
import _DatePicker from 'material-ui/DatePicker';
import _TimePicker from 'material-ui/TimePicker';

class DatePicker extends React.Component {

    constructor ( props ) {

        super( props );

    }

    onDateChange ( event, date ) {

        const values = this.props.values;

        values[ this.props.field ] = date;

        if ( values[ this.props.field ] ) {

            this.props.setError( false );

        }

        this.props.setValues( values );

    }

    onTimeChange ( event, date )  {

        const values = this.props.values;

        values[ this.props.field ].setHours( date.getHours() );
        values[ this.props.field ].setMinutes( date.getMinutes() );
        values[ this.props.field ].setSeconds( date.getSeconds() );

        if ( values[ this.props.field ] ) {

            this.props.setError( false );

        }

        this.props.setValues( values );

    }

    render () {

        return (

            <div>
                <_DatePicker
                    textFieldStyle = {{ width : '100%' }}
                    autoOk         = { true }
                    hintText       = { this.props.hintText }
                    onChange       = { this.onDateChange.bind( this ) }
                />
                <_TimePicker
                    textFieldStyle = {{ width : '100%' }}
                    onChange       = { this.onTimeChange.bind( this ) }
                    hintText       = "12hr Format"
                />
            </div>

        );

    }

}

DatePicker.propTypes = {

    values : React.PropTypes.array.isRequired,
    field  : React.PropTypes.string.isRequired

};

export default DatePicker;
