import React, {PropTypes} from 'react';
/* Pollider */
import ControlButton from './control-button.js';

const INLINE_STYLES = [
    {
        label: 'format_bold',
        style: 'BOLD'
    },
    {
        label: 'format_italic',
        style: 'ITALIC'
    },
    {
        label: 'format_underlined',
        style: 'UNDERLINE'
    },
    {
        label: 'strikethrough_s',
        style: 'STRIKETRHOUGH'
    },
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div
            className = 'text-control-container'
            style = {{
                display : props.display ? 'none' : ''
            }}
        >
            {
                INLINE_STYLES.map( type =>
                    <ControlButton
                        key = {type.label}
                        active = {currentStyle.has( type.style )}
                        label = {type.label}
                        onToggle = {props.onToggle}
                        style = {type.style}
                    />
                )
            }
        </div>

    );
};

InlineStyleControls.propTypes = {
    onToggle : PropTypes.func.isRequired
};

export { INLINE_STYLES, InlineStyleControls };
