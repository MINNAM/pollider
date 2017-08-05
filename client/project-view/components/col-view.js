import React, {Component} from 'react';

import RowView from './row-view.js';
import ElementView from './element-view.js';

import {
    scroll
} from '../../global.js'

import {
    MaterialButton
} from '../../ui-components/';

class ColView extends Component {

    state = {
        verticalAlign: 'top'
    }

    displayByType ( type ) {

        switch ( type ) {
            case 'text' :
                this.props.handleDialogModel(
                    {
                        type : 'text-editor',
                        model : this.props.model.element
                    },
                    this.props.model.element

                );
                break;

            case 'image' :

                this.props.handleDialogModel(
                    {
                        type : 'post-container',
                        model : this.props.model.element
                    },
                    this.props.model.element

                );
                break;
            case 'code' :
                this.props.handleDialogModel(
                    {
                        type : 'code-editor',
                        model : this.props.model.element
                    },
                    this.props.model.element
                );

                // alert('code');
            break;

            case 'embed' :
                this.props.handleDialogModel(
                    {
                        type : 'embed',
                        model : this.props.model.element
                    },
                    this.props.model.element
                );

                // alert('code');
            break;


            default :
                // this.props.display( 'upload-container' );
                break;
        }

    }

    render () {
        const {
            model,
            queueElement,
            editor,
            editorGuide,
            handler
        } = this.props;
        const {
            verticalAlign
        } = this.state;

        if (model.element) {
            if (editor) {
                return (
                    <div
                        id = {'view-' + model.element.uniqueId}
                        className = {'col-sm-' + model.width}
                        style = {{
                            height: '100%',
                            marginBottom: 10,
                            float: 'none',
                            display: 'table-cell',
                            // why regular col 100% and this has to be 50% while they are all table-cell
                            position: 'relative',
                            padding: model.padding ? `${model.padding.top} ${model.padding.right} ${model.padding.bottom} ${model.padding.left}` : 0
                        }}
                    >
                        <div
                            style = {{
                                position: 'relative'
                            }}
                        >
                            <div
                                style = {{
                                    position: 'absolute',
                                    top: -38,
                                    left: -38,
                                }}
                            >
                                {
                                    editorGuide ? <MaterialButton
                                        style = {{
                                            background: 'rgba(255,255,255,0.5)',
                                            borderRadius: '50%',
                                        }}
                                        onClick = {() => {
                                            const editor = document.getElementById( 'project-editor-content' ).childNodes[0];
                                            const view = document.getElementById( 'editor-' + model.element.uniqueId );

                                            if (model.element) {
                                                this.displayByType( model.element.type);
                                            }

                                            scroll(editor, editor.scrollTop, view.getBoundingClientRect().top + editor.scrollTop - 200);

                                        }}
                                        icon = {'mode_edit'}
                                        iconStyle = {{
                                            color: 'rgb(60,60,60)',
                                            fontSize: 21
                                        }}
                                    /> : ''
                                }
                            </div>
                            <ElementView
                                col = {model}
                                model = {model.element}
                                editor = {editor}
                                queueElement = {queueElement}
                                setVerticalAlign = {(verticalAlign) => {
                                    this.setState({ verticalAlign })
                                }}
                                handler = {handler}
                            />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div
                        className = {'col-sm-' + model.width}
                        style = {{
                            height: '100%',
                            marginBottom: 10,
                            float: 'none',
                            display: 'table-cell',
                            // why regular col 100% and this has to be 50% while they are all table-cell
                            position: 'relative',
                            padding: model.padding ? `${model.padding.top} ${model.padding.right} ${model.padding.bottom} ${model.padding.left}` : 0
                        }}
                    >
                        <ElementView
                            col = {model}
                            model = {model.element}
                            editor = {editor}
                            queueElement = {queueElement}
                            setVerticalAlign = {(verticalAlign) => {
                                this.setState({verticalAlign});
                            }}
                            handler = {handler}
                        />
                    </div>
                );
            }
        }

        return (
            <div
                className = {'col-sm-' + model.width}
                style = {{
                    float: 'none',
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    padding: model.padding ? `${model.padding.top} ${model.padding.right} ${model.padding.bottom} ${model.padding.left}` : 0
                }}
            >
            {
                model.rows.map((row, key) => {
                    return (
                        <RowView
                            editor = { editor }
                            key = { key }
                            model = { row }
                            handler = {handler}
                            editorGuide = {editorGuide}
                            handleDialogModel = {this.props.handleDialogModel}
                        />
                    );
                })
            }
            </div>
        );

    }

};

export default ColView;
