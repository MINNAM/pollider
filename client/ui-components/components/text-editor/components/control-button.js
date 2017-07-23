import React, {Component, PropTypes} from 'react';

const STYLES = {
    icon : {
        cursor: 'pointer',
        fontSize: 22,
        marginTop: 6,
    }
};

class ControlButton extends Component {

    static propTypes = {
        label: PropTypes.string.isRequired,
        onToggle: PropTypes.func.isRequired,
    };

    onToggle (event) {
        const {
            onToggle,
            style
        } = this.props;

        event.preventDefault();
        onToggle(style);
    };

    render () {
        const {
            active,
            label
        } = this.props;
        const className = 'text-editor-control-button';

        return (
            <i
                className = {'material-icons ' + className}
                onMouseDown = {this.onToggle.bind(this)}
                style = {{
                    ...STYLES.icon,
                    color: active ? 'rgb(60,60,60)' : 'rgb(180,180,180)'
                }}
            >
                {label}
            </i>
       );
    }

}

export default ControlButton;
