import { React, StyleButton } from './style-button.js';

const INLINE_STYLES = [

    { label : 'format_bold', style : 'BOLD' },
    { label : 'format_italic', style : 'ITALIC' },
    { label : 'format_underlined', style : 'UNDERLINE' },
    { label : 'strikethrough_s', style : 'STRIKETRHOUGH' },

];

const InlineStyleControls = ( props ) => {

    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (

        <div
            className = "text-control-container"
            style = {{
                display : props.display ? 'none' : ''
            }}
        >
            {
                INLINE_STYLES.map( type =>
                    <StyleButton
                        key      = { type.label }
                        active   = { currentStyle.has( type.style ) }
                        label    = { type.label }
                        onToggle = { props.onToggle }
                        style    = { type.style }
                    />
                )
            }
        </div>

    );

};

InlineStyleControls.propTypes = {

    onToggle : React.PropTypes.func.isRequired

};

export { INLINE_STYLES, InlineStyleControls };
