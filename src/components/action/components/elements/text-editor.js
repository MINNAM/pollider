import React from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw, ContentState }  from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';

import { INLINE_STYLES, InlineStyleControls }    from './text-editor-components/inline-style-controls.js';
import { BLOCK_TYPES, BlockStyleControls }       from './text-editor-components/block-style-controls.js';
import { TEXTS, textStyleMap, TextTypeControls } from './text-editor-components/text-type-controls.js';
import Link                                      from './text-editor-components/link.js';


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

    promptForLink ( event ) {

        event.preventDefault();

        const { editorState } = this.state;
        const selection       = editorState.getSelection();

        if ( !selection.isCollapsed() ) {

            const contentState             = editorState.getCurrentContent();
            const startKey                 = editorState.getSelection().getStartKey();
            const startOffset              = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey( startKey );
            const linkKey                  = blockWithLinkAtBeginning.getEntityAt( startOffset );

            let url = '';

            if ( linkKey ) {

                const linkInstance = contentState.getEntity( linkKey );
                url = linkInstance.getData().url;

            }

            this.setState({

                showURLInput : true,
                urlValue     : url,

            }, () => {

                setTimeout( () => this.refs.url.focus(), 0 );

            });

        }

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

    onURLChange ( event ) {

        this.setState({ urlValue : event.target.value });

    }

    confirmLink( event ) {

        event.preventDefault();

        const { editorState, urlValue } = this.state;
        const contentState              = editorState.getCurrentContent();
        const contentStateWithEntity    = contentState.createEntity(
            'LINK',
            'MUTABLE',
            { url : urlValue }
        );

        const entityKey      = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set( editorState, { currentContent: contentStateWithEntity });

        this.setState({

            editorState : RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            ),
            showURLInput : false,
            urlValue     : '',

        }, () => {

            setTimeout( () => this.refs.editor.focus(), 0 );
        });
    }

    focus () {

        this.refs.editor.focus();

    }

    render () {

        return (

            <div>
                <div className = { 'controls-container' }>
                    <TextTypeControls
                        editorState = { this.state.editorState }
                        onToggle    = { ( style ) => {  this.toggleTextType( style ); } }
                        focus       = { this.focus.bind( this )}
                    />

                    <BlockStyleControls
                        editorState = { this.state.editorState }
                        onToggle    = { this.toggleBlockType.bind( this ) }
                    />
                    <InlineStyleControls
                        editorState = { this.state.editorState }
                        onToggle    = { this.toggleInlineStyle.bind( this ) }
                    />
                </div>
                <Editor
                    customStyleMap = { Object.assign( textStyleMap ) }
                    onChange       = { this.onChange.bind( this )  }
                    editorState    = { this.state.editorState }
                    placeHolder    = "This is the editor"
                    onClick        = { this.focus.bind( this ) }
                    ref            = "editor"
                />
            </div>

        );

    }

}

export default TextEditor;
