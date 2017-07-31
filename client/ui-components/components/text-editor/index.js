import React, {Component, PropTypes} from 'react';
/* Draft.js */
import {
    ContentState,
    Editor,
    EditorState,
    Entity,
    Modifier,
    RichUtils,
    convertFromHTML,
    convertFromRaw,
    convertToRaw,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
/* Material UI */
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
/* Pollider */
import {INLINE_STYLES, InlineStyleControls} from './components/inline-style-controls.js';
import {BLOCK_TYPES, BlockStyleControls} from './components/block-style-controls.js';
import {TEXTS, TEXT_STYLE_MAP, TextTypeControls} from './components/text-type-controls.js';
import ControlButton from './components/control-button.js';

import TEXT_STYLE from '../../../../public/theme/default/styles/text-style.js';

const STYLES = {
    controls: {
        display: 'inline-block',
        float: 'left',
        marginRight: 15
    },
    htmlButton: {
        color: 'rgb(180,180,180)',
        display: 'inline-block',
        fontSize: 14,
        fontWeight: 500,
        height: 47,
        lineHeight: '48px',
        marginTop: 6,
        textTransform: 'uppercase',
    },
    convertButton: {
        color: 'rgb(180,180,180)',
        display: 'inline-block',
        float: 'right',
        fontSize: 14,
        fontWeight: 400,
        height: 47,
        lineHeight: '48px',
        marginTop: 6,
        textTransform: 'uppercase'
    },
    htmlEditor: {
        border: 'none',
        display: 'inline-block',
        height: 'calc(100% - 50px)',
        outline: 'none',
        padding: 15,
        width: '100%',
    },
    textEditor: {
        height : 'calc(100% - 50px)',
        width: '100%',
        overflow: 'scroll',
    }
};

class TextEditor extends Component {

    static propTypes = {
        contentStyle :PropTypes.object,        
        disableHTML: PropTypes.bool,
        disableStyling: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired,
    };

    constructor (props) {
        super(props);

        const {
            defaultValue
        } = this.props;

        console.log(defaultValue);

        if (defaultValue) {
            this.state = {
                editorState: EditorState.createWithContent(convertFromRaw(defaultValue))
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            };
        }
    }

    componentDidMount () {
        this.focus();
    }

    /**
    *   Debouncing update on 'Project View' for performance matter
    */
    debounce (callback) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

    	this.timeout = setTimeout(() => {
            callback();
            this.timeout = null;
        }, 100);
    }

    focus () {
        this.refs.editor.focus();
    }

    onChange (editorState, done) {
        const {
            onUpdate,
            onChange,
            disableStyling
        } = this.props;

        this.setState({

            editorState

        }, () => {

            const content = this.state.editorState.getCurrentContent();

            const inlineStyles = {};

            for (let key in TEXT_STYLE_MAP) {
                inlineStyles[key] = {
                    style: TEXT_STYLE_MAP[key]
                };
            }

            console.log( convertToRaw(content) );

            const options = {inlineStyles};

            if (onUpdate) {
                this.debounce (() => {
                    onChange({
                        content: stateToHTML(content, options),
                        contentRaw: convertToRaw(content)
                    });

                    onUpdate({
                        content: stateToHTML(content, options),
                        contentRaw: convertToRaw(content)
                    });
                });
            }



            if (done) {
                setTimeout(() => {
                    done();
                }, 10);
            }
        });
    }

    onTab (event) {
        event.preventDefault();

        const {editorState} = this.state;
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const startKey = selection.getStartKey();
        const currentBlock = contentState.getBlockForKey(startKey);

        let newContentState;

        if (selection.isCollapsed()) {
            newContentState = Modifier.insertText(
                contentState,
                selection,
                '      '
            );
        } else {
            newContentState = Modifier.replaceText(
                contentState,
                selection,
                '      '
            );
        }

        this.onChange(EditorState.push(editorState, newContentState, 'insert-characters'));
    }

    toggleInlineStyle (inlineStyle) {
        this.onChange (
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
           )
       );
    }

    toggleBlockType (blockType) {
        const { editorState } = this.state;

        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
           )
       );
    }

    toggleTextType(toggledTextType) {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const nextContentState = Object.keys(TEXT_STYLE_MAP)
            .reduce((contentState, color) => {
                return Modifier.removeInlineStyle(contentState, selection, color);
            }, editorState.getCurrentContent());

        let nextEditorState = EditorState.push(
            editorState,
            nextContentState,
            'change-inline-style'
        );

        const currentStyle = editorState.getCurrentInlineStyle();

        // Unset style override for current color.
        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce((state, color) => {
                return RichUtils.toggleInlineStyle(state, color);
            }, nextEditorState);
        }

        // If the color is being toggled on, apply it.
        if (!currentStyle.has(toggledTextType)) {
            nextEditorState = RichUtils.toggleInlineStyle(
                nextEditorState,
                toggledTextType
           );
        }

        this.onChange(nextEditorState, () => { this.focus(); });
    }

    render () {
        const {
            contentStyle = TEXT_STYLE['NORMALTEXT'],
            disableStyling,
            disableHTML,
            onChange,
            onUpdate
        } = this.props;
        const {
            editorState,
            displayHtmlEditor,
            html
        } = this.state;
        const {
            htmlEditor
        } = this.refs;

        return (

            <div style = {{ height: '100%' }}>
                <div
                    className = {'controls-container'}
                    style = {{
                        display: disableStyling ? 'none': ''
                    }}
                >
                    <div
                        style = {STYLES.controls}
                    >
                        <TextTypeControls
                            editorState = {editorState}
                            onToggle = {
                                (style) => {
                                    this.toggleTextType(style);
                                }
                            }
                            focus = {this.focus.bind(this)}
                            display = {displayHtmlEditor}
                        />
                    </div>

                    <div
                        style = {STYLES.controls}
                    >
                        <InlineStyleControls
                            editorState = {editorState}
                            onToggle = {this.toggleInlineStyle.bind(this)}
                            display = {displayHtmlEditor}
                        />
                    </div>
                    <div
                        style = {STYLES.controls}
                    >
                        <BlockStyleControls
                            editorState = { editorState }
                            onToggle = {this.toggleBlockType.bind(this)}
                            display = {displayHtmlEditor}
                        />
                    </div>
                    <div
                        style = {{
                            display: displayHtmlEditor ? '': 'none',
                            float: 'left',
                        }}
                    >
                        <span
                            style = {STYLES.htmlButton}
                        >
                            HTML
                        </span>
                    </div>
                    <div
                        style = {{
                            float: 'right',
                            display: disableHTML ? 'none' : (!displayHtmlEditor ? '' : 'none')
                        }}
                    >
                        <ControlButton
                            active = { displayHtmlEditor }
                            label = {'code'}
                            onToggle = {() => {
                                const content = editorState.getCurrentContent();
                                const inlineStyles = {};

                                for (let key in TEXT_STYLE_MAP) {
                                    inlineStyles[key] = {style: TEXT_STYLE_MAP[key]};
                                }

                                const options = {inlineStyles};

                                this.setState({
                                    displayHtmlEditor: !displayHtmlEditor,
                                    html: stateToHTML(content, options)
                                }, () => {
                                    htmlEditor.focus();
                                });
                            }}
                        />
                    </div>
                    <div
                        style = {{
                            cursor: 'pointer',
                            display: displayHtmlEditor ? '' : 'none',
                            float: 'right',
                        }}
                        onClick = {() => {
                            const content = editorState.getCurrentContent();
                            const inlineStyles = {};

                            this.setState({displayHtmlEditor: false});

                            for (let key in TEXT_STYLE_MAP) {
                                inlineStyles[key] = {style: TEXT_STYLE_MAP[key]};
                            }

                            const options = {inlineStyles};

                            onChange({
                                content: stateToHTML(content, options),
                                contentRaw: convertToRaw(content)
                            });

                            if (onUpdate) {
                                this.debounce (() => {
                                    onUpdate({
                                        content: stateToHTML(content, options),
                                        contentRaw: convertToRaw(content)
                                    });
                                });
                            }
                        }}
                    >
                        <span
                            style = {STYLES.convertButton}
                        >
                            Convert
                        </span>
                    </div>
                </div>
                <div
                    style = {{ height: '100%' }}
                >
                    <textarea
                        ref = 'htmlEditor'
                        value = { html }
                        onChange = {(event) => {
                            const value = event.target.value;
                            const blocksFromHTML = convertFromHTML(value);
                            const state = ContentState.createFromBlockArray(blocksFromHTML);

                            this.setState({
                                html: value,
                                editorState: EditorState.createWithContent(state)
                            });
                        }}
                        style = {{
                            ...STYLES.htmlEditor,
                            display: displayHtmlEditor ? '': 'none'
                        }}

                    />
                    <div
                        style = {{
                            ...STYLES.textEditor,
                            display: displayHtmlEditor ? 'none': '',
                            ...contentStyle
                        }}
                    >
                        <Editor
                            customStyleMap = {{ ...TEXT_STYLE_MAP }}
                            editorState = { editorState }
                            onChange = {this.onChange.bind(this)}
                            onClick = {this.focus.bind(this)}
                            onTab = {this.onTab.bind(this)}
                            placeHolder = 'This is the editor'
                            ref = 'editor'
                        />
                    </div>

                </div>
            </div>

       );

    }

}

export default TextEditor;
