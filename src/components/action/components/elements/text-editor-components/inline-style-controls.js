import { React, StyleButton } from './style-button.js';

const INLINE_STYLES = [

    { label : 'Bold',      style : 'BOLD' },
    { label : 'Italic',    style : 'ITALIC' },
    { label : 'Underline', style : 'UNDERLINE' },
    { label : 'Monospace', style : 'CODE' }

];

const InlineStyleControls = ( props ) => {

    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (

        <div className = "text-control-container">
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
