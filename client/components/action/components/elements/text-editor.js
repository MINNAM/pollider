import React from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw, ContentState, Entity, convertFromHTML }  from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';

import { INLINE_STYLES, InlineStyleControls }    from './text-editor-components/inline-style-controls.js';
import { BLOCK_TYPES, BlockStyleControls }       from './text-editor-components/block-style-controls.js';
import { TEXTS, textStyleMap, TextTypeControls } from './text-editor-components/text-type-controls.js';

import TEXT_STYLE from '../../../../../public/theme/default/text-style.js';

import { StyleButton } from './text-editor-components/style-button.js';

class TextEditor extends React.Component {

    constructor ( props ) {

        super( props );

        if ( this.props.default ) {

            this.state = { editorState : EditorState.createWithContent( convertFromRaw( this.props.default ) ) };

        } else {

            this.state = { editorState : EditorState.createEmpty() };

        }

    }

    componentDidMount () {

        this.focus();

    }

    debounce ( callback ) {

        if ( this.timeout ) {

            clearTimeout( this.timeout );

        }

    	this.timeout = setTimeout( () => {

            callback();

            this.timeout = null;

        }, 100 );

    }

    onChange ( editorState, done ) {

        this.setState({

            editorState

        }, () => {

            const content = this.state.editorState.getCurrentContent();

            let inlineStyles = {};

            for ( let key in textStyleMap ) {

                inlineStyles[ key ] = {

                    style : textStyleMap[ key ]

                };

            }


            let options = {

              inlineStyles

            };

            if ( this.props.onUpdate ) {

                this.debounce ( () => {

                    this.props.onChange({

                        content    : stateToHTML( content, options ),
                        contentRaw : convertToRaw( content )

                    });

                    this.props.onUpdate({

                        content    : stateToHTML( content, options ),
                        contentRaw : convertToRaw( content )

                    });

                });

            }

            if ( done  ) {

                setTimeout( () => {

                    done();


                }, 10 );

            }

        });

    }


    toggleInlineStyle ( inlineStyle ) {

        this.onChange (

            RichUtils.toggleInlineStyle(

                this.state.editorState,
                inlineStyle

            )

        );

    }

    onTab( e ) {
        e.preventDefault();

        const {editorState} = this.state;

       var contentState = editorState.getCurrentContent();
       var selection    = editorState.getSelection();
       var startKey     = selection.getStartKey();
       var currentBlock = contentState.getBlockForKey(startKey);

       var newContentState;

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

       this.onChange( EditorState.push(editorState, newContentState, 'insert-characters') );
    }

    toggleBlockType( blockType ) {

        this.onChange(

            RichUtils.toggleBlockType(

                this.state.editorState,
                blockType

            )

        );

    }

    toggleTextType( toggledTextType ) {

        const { editorState } = this.state;
        const selection       = editorState.getSelection();

        const nextContentState = Object.keys( textStyleMap )
            .reduce( ( contentState, color ) => {

                return Modifier.removeInlineStyle( contentState, selection, color );

            }, editorState.getCurrentContent() );

        let nextEditorState = EditorState.push(

            editorState,
            nextContentState,
            'change-inline-style'

        );

        const currentStyle = editorState.getCurrentInlineStyle();

        // Unset style override for current color.
        if ( selection.isCollapsed() ) {

            nextEditorState = currentStyle.reduce( ( state, color ) => {

                return RichUtils.toggleInlineStyle( state, color );

            }, nextEditorState );

        }

        // If the color is being toggled on, apply it.
        if ( !currentStyle.has( toggledTextType ) ) {

            nextEditorState = RichUtils.toggleInlineStyle(

                nextEditorState,
                toggledTextType

            );

        }

        this.onChange( nextEditorState, () => { this.focus(); } );

    }

    textAlignRenderer( block ) {

      if ( block.getType() === 'atomic' ) {

        return { component: Media, }

      }

      return null;

    }

    removeLink( event ) {

        event.preventDefault();

        const { editorState } = this.state;
        const selection       = editorState.getSelection();

        if ( !selection.isCollapsed() ) {

            this.setState({

                editorState: RichUtils.toggleLink( editorState, selection, null ),

            });

        }

    }

    focus () {

        this.refs.editor.focus();

    }

    render () {

        const default_style = this.props.defaultStyle ? this.props.defaultStyle : TEXT_STYLE[ 'NORMALTEXT' ];

        return (

            <div style = {{ height : '100%' }} >
                <div
                    className = { 'controls-container' }
                    style = {{
                        display : this.props.disableStyle ? 'none' : ''
                    }}
                >
                    <div
                        style = {{
                            display : 'inline-block',
                            float   : 'left',
                            marginRight : 15
                        }}
                    >
                        <TextTypeControls
                            editorState = { this.state.editorState }
                            onToggle    = { ( style ) => {  this.toggleTextType( style ); } }
                            focus       = { this.focus.bind( this )}
                            display     = { this.state.viewHtml }
                        />
                    </div>

                    <div
                        style = {{
                            display : 'inline-block',
                            float   : 'left',
                            marginRight : 15,
                        }}
                    >
                        <InlineStyleControls
                            editorState = { this.state.editorState }
                            onToggle    = { this.toggleInlineStyle.bind( this ) }
                            display     = { this.state.viewHtml }
                        />
                    </div>
                    <div
                        style = {{
                            display : 'inline-block',
                            float   : 'left',
                            marginRight : 15
                        }}
                    >
                        <BlockStyleControls
                            editorState = { this.state.editorState }
                            onToggle    = { this.toggleBlockType.bind( this ) }
                            display     = { this.state.viewHtml }
                        />
                    </div>
                    <div
                        style = {{
                            float: 'left',
                            display : this.state.viewHtml ? '' : 'none'
                        }}

                    >
                        <span
                            style = {{
                                display : 'inline-block',
                                height: 47,
                                lineHeight: '48px',
                                marginTop: 6,
                                fontSize : 15,
                                fontWeight: 500,
                                fontSize: 14,
                                textTransform : 'uppercase',
                                color: 'rgb(180,180,180)'
                            }}
                        >
                            HTML
                        </span>
                    </div>
                    <div
                        style = {{
                            float: 'right',
                            display : this.props.disableHTML ? 'none' : ( !this.state.viewHtml ? '' : 'none' )
                        }}
                    >
                        <StyleButton
                            active   = { this.state.viewHtml }
                            label    = { 'code' }
                            onToggle = { () => {

                                const content = this.state.editorState.getCurrentContent();

                                let inlineStyles = {};

                                for ( let key in textStyleMap ) {

                                    inlineStyles[ key ] = {

                                        style : textStyleMap[ key ]

                                    };

                                }

                                let options = { inlineStyles };

                                this.setState({
                                    viewHtml : !this.state.viewHtml,
                                    html : stateToHTML( content, options )

                                }, () => {

                                    this.refs.htmlEditor.focus();

                                });

                            }}
                        />
                    </div>
                    <div
                        style = {{
                            float: 'right',
                            display : this.state.viewHtml ? '' : 'none',
                            cursor : 'pointer'
                        }}
                        onClick = {() => {

                            this.setState({ viewHtml : false });
                            const content = this.state.editorState.getCurrentContent();

                            let inlineStyles = {};

                            for ( let key in textStyleMap ) {

                                inlineStyles[ key ] = {

                                    style : textStyleMap[ key ]

                                };

                            }


                            let options = {

                              inlineStyles

                            };

                            this.props.onChange({

                                content    : stateToHTML( content, options ),
                                contentRaw : convertToRaw( content )

                            });

                            if ( this.props.onUpdate ) {

                                this.debounce ( () => {

                                    this.props.onUpdate({

                                        content    : stateToHTML( content, options ),
                                        contentRaw : convertToRaw( content )

                                    });

                                });

                            }

                            // if ( done  ) {
                            //
                            //     setTimeout( () => {
                            //
                            //         done();
                            //
                            //
                            //     }, 10 );
                            //
                            // }
                        }}
                    >
                        <span
                            style = {{
                                display : 'inline-block',
                                height: 47,
                                lineHeight: '48px',
                                marginTop: 6,
                                fontSize : 15,
                                float: 'right',
                                fontWeight: 500,
                                fontSize: 14,
                                textTransform : 'uppercase'
                            }}
                        >
                            Convert
                        </span>
                    </div>
                </div>
                <div
                    style = {{ height : '100%' }}
                >
                    <textarea
                        ref = 'htmlEditor'
                        value = { this.state.html }
                        onChange = { ( event ) => {

                            const value          = event.target.value;
                            const blocksFromHTML = convertFromHTML(value);
                            const state          = ContentState.createFromBlockArray( blocksFromHTML );

                            this.setState({ html : value, editorState : EditorState.createWithContent( state ) });

                        }}
                        style = {{
                            width   : '100%',
                            height  : 'calc(100% - 50px)',
                            display : 'inline-block',
                            outline : 'none',
                            border  : 'none',
                            padding : 15,
                            display : this.state.viewHtml ? '' : 'none'
                        }}

                    />
                    <div
                        style = {{
                            display : this.state.viewHtml ? 'none' : '',
                            height  : 'calc(100% - 50px)',
                            width    : '100%',
                            overflow : 'scroll',
                            ...default_style
                        }}
                    >
                        <Editor
                            customStyleMap = { Object.assign( textStyleMap ) }
                            onChange       = { this.onChange.bind( this )  }
                            editorState    = { this.state.editorState }
                            placeHolder    = "This is the editor"
                            onClick        = { this.focus.bind( this ) }
                            ref            = "editor"
                            onTab          = { this.onTab.bind( this ) }
                        />
                    </div>

                </div>
            </div>

        );

    }

}

export default TextEditor;
