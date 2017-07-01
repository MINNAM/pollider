import React       from 'react';
import _DatePicker from 'material-ui/DatePicker';
import _TimePicker from 'material-ui/TimePicker';

import CONFIG     from '../../../../models/m-config.js';

class DatePicker extends React.Component {

    constructor ( props ) {

        super( props );

    }

    onDateChange ( event, date ) {

        const { field, values, setError, setValues } = this.props;

        values[ field ] = date;

        if ( values[ field ] ) {

            setError( false );

        }

        setValues( values );

    }

    onTimeChange ( event, date )  {

        const { field, values, setError, setValues } = this.props;

        values[ field ].setHours( date.getHours() );
        values[ field ].setMinutes( date.getMinutes() );
        values[ field ].setSeconds( date.getSeconds() );

        if ( values[ field ] ) {

            setError( false );

        }

        setValues( values );

    }

    render () {

        const { hintText } = this.props;

        return (

            <div>
                <_DatePicker
                    textFieldStyle = {{ width : '100%' }}
                    autoOk         = { true }
                    hintText       = { hintText }
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
