import React, {PropTypes} from 'react';
/* Pollider */
import ControlButton from './control-button.js';

const BLOCK_TYPES = [
  {
      label: 'format_quote',
      style: 'blockquote'
  },
  {
      label: 'format_list_bulleted',
      style: 'unordered-list-item'
  },
  {
      label: 'format_list_numbered',
      style: 'ordered-list-item'
  },
];

const BlockStyleControls = (props) => {

    const {
        editorState,
        onToggle
    } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div
            className = 'text-control-container'
            style = {{
                display: props.display ? 'none' : ''
            }}
        >
            {
                BLOCK_TYPES.map((type) =>
                    <ControlButton
                        key = {type.label}
                        active = {type.style === blockType}
                        label = {type.label}
                        onToggle = {props.onToggle}
                        style = {type.style}
                    />
                )
            }
        </div>
    );

};

BlockStyleControls.propTypes = {
    onToggle : PropTypes.func.isRequired
};

export { BLOCK_TYPES, BlockStyleControls };
