import React, {Component, PropTypes} from 'react';
/* Material UI */
import _DatePicker from 'material-ui/DatePicker';
import _TimePicker from 'material-ui/TimePicker';


class DatePicker extends React.Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        hintText: PropTypes.string,
        setError: PropTypes.func,
        setValues: PropTypes.func,
        values: PropTypes.array.isRequired,
    };

    onDateChange (event, date) {
        const {
            field,
            values,
            setError,
            setValues
        } = this.props;

        values[field] = date;

        if (values[field]) {
            setError(false);
        }

        setValues(new Date(values));
    }

    render () {
        const {
            hintText,
            defaultDate
        } = this.props;

        return (
            <div>
                <_DatePicker
                    defaultDate = {defaultDate}
                    textFieldStyle = {{width: '100%'}}
                    autoOk = {true}
                    hintText = {hintText}
                    onChange = {this.onDateChange.bind(this)}
                />
            </div>
       );
    }

}

export default DatePicker;
