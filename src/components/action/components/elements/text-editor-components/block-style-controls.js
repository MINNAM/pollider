import { React, StyleButton } from './style-button.js';

const BLOCK_TYPES = [

  { label : 'Blockquote', style : 'blockquote' },
  { label : 'UL',         style : 'unordered-list-item' },
  { label : 'OL',         style : 'ordered-list-item' },

];

const BlockStyleControls = ( props ) => {

    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey( selection.getStartKey() )
        .getType();

    return (

        <div className = "text-control-container">
            {
                BLOCK_TYPES.map( ( type ) =>
                    <StyleButton
                        key      = { type.label }
                        active   = { type.style === blockType }
                        label    = { type.label }
                        onToggle = { props.onToggle }
                        style    = { type.style }
                    />
                )
            }
        </div>
    );

};

BlockStyleControls.propTypes = {

    onToggle : React.PropTypes.func.isRequired

};

export { BLOCK_TYPES, BlockStyleControls };
