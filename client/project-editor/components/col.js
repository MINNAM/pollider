import React from 'react';

/* Pollider */
import RowContainer    from './row-container.js';
import Project         from '../models/project.js';
import Element         from './element';

import {
    MaterialButton,
} from '../../ui-components/';

class Col extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            elementSelectorOpen: false,
            height: '100%',
            model: this.props.model,
            rowSelectorOpen: false,
        };
    }

    componentWillReceiveProps (nextProps) {
        this.setState({model: nextProps.model});
    }

    addRow (colIndex) {
        const {
            model,
            selected,
            position,
        } = this.state;

        model.addRow({
            colIndex,
            selected,
            position,
            dynamic: false
        });

        this.setState({ model });
    }

    setElement (type) {
        const {
            model
        } = this.state;

        model.setElement(type);

        this.setState({model});
    }

    render () {

        let allowAddRow     = true;
        let allowAddElement = true;
        let allowMarginTop  = this._col ? (this._col.parentNode.offsetHeight / 2) - 30: '';

        if (this.props.dynamic == false) {

            allowAddRow = false;

        }

        if (this.state.model) {

            if (this.state.model.rows.length > 0) {

                allowAddElement = false;

            }

        }

        if (allowAddRow && this.state.model) {

            allowMarginTop = this._col ? (this._col.parentNode.offsetHeight / (this.state.model.rows.length == 1 ? 4: 2 ) ) - 30: '';

            if (this.state.model.rows.length < 2) {

                allowAddRow = true;

            } else {

                allowAddRow = false;

            }

        }

        if (this.state.model.parent) {
            if ( this.state.model.parent.cols.length == 1 ) {
                allowAddRow = false;
            }
        }

        if (this.state.model.element) {

            allowAddRow     = false;
            allowAddElement = false;

        }

        let width;

        switch (this.props.width) {

            case '12':
                width = '100%';
                break;

            case '9':
                width = '75%';
                break;

            case '8':
                width = '66.666667%';
                break;

            case '6':
                width = '50%';
                break;

            case '4':
                width = '33.333333%';
                break;

            case '3':
                width = '25%';
                break;

            default:
                break;

        }

        let addRow = allowAddRow ? <MaterialButton
            onClick = {
                () => {

                    this.props.openDialog({

                        fields: [
                            {
                                title  : 'Add Row',
                                dataType: 'row-selector'
                            }

                        ],

                        actions: {

                            execute: (_data) => {

                                const model = this.state.model;

                                model.addRow({

                                    colIndex: _data.colIndex,
                                    selected: this.state.selected,
                                    position: this.state.position,
                                    dynamic: false

                                });

                                this.setState({ model });

                            }
                        },
                        style: {
                            dialog : {

                                width: '50%',
                                height: 'calc(100% - 50px)',
                                top  : 50

                            },
                        }
                    });

                }
            }
            label = { 'ADD ROW' }
            icon  = { 'view_stream' }

        />: '';


        let addElement = allowAddElement ? <MaterialButton
            onClick = {
                () => {
                    const {
                        model
                    } = this.state;

                    this.props.openDialog({

                        fields: [
                            {
                                title  : 'Add Element',
                                dataType: 'element-selector'
                            }

                        ],

                        actions: {

                            execute: (_data) => {

                                if (model.parent.cols.length > 1) {
                                    model.addRow({
                                        colIndex: 0,
                                        dynamic: false
                                    });

                                    model.rows[0].cols[0].setElement({
                                         type: _data.type,
                                         open: true
                                    });

                                } else {

                                    model.setElement({
                                         type: _data.type,
                                         open: true
                                     });

                                }

                                this.setState({
                                    model
                                })


                            }
                        },

                        style: {

                            dialog : {

                                width: '50%',
                                height: 'calc(100% - 50px)',
                                top  : 50

                            },


                        }

                    });

                }
            }
            label = { 'ADD ELEMENT' }
            icon  = { 'perm_media' }

        />: '';

        return (

            <div
                className = { 'col-container' }
                style  = {{
                    padding  : '',
                    position : 'relative',
                    display  : 'inline-block',
                    height   : '100%',
                    width,
                    background: 'white'
                }}
            >
                <div
                    ref = { (c) => { this._col = c; } }
                    style = {{
                        height     : this.state.height,
                        width      : '100%',
                        border     : '1px solid rgb(245,245,245)',
                        borderBottom: '0px solid rgb(220,220,220)',
                        borderLeft : '0px solid rgb(245,245,245)',
                        borderRight: !this.props.last ? '1px solid rgb(235,235,235)': '0px solid rgb(220,220,220)',
                        boxSizing  : 'border-box',
                        overflow   : 'hidden',
                    }}
                >
                    <div style = {{ padding: '', height: '100%',position:'relative' }}>
                        <span
                            style = {{
                                position : 'absolute',
                                display  : 'table',
                                textAlign: 'center',
                                top      : allowAddRow && !allowAddElement  ? '75%': '50%',
                                left      : '50%',
                                transform: 'translate(-50%,-50%)',
                                lineHeight: '20px',

                            }}
                        >
                            { addElement }
                        </span>
                        {
                            (!allowAddRow && !allowAddElement && this.state.model.element) ?
                                <Element
                                    uploads            = { this.props.uploads }
                                    model              = { this.state.model.element }
                                    parentModel        = { this.state.model }
                                    handleDialogModel  = { this.props.handleDialogModel }
                                    display            = { this.props.display }
                                    toggle             = { this.state.model.displayElement }
                                />
                            : ''
                        }
                        <RowContainer
                            display = { this.props.display }
                            model = { this.state.model }
                            handleDialogModel = { this.props.handleDialogModel }
                            openDialog = { this.props.openDialog }
                            addRowFromCol = { allowAddRow ? (done) => {

                                this.props.openDialog({

                                    fields: [
                                        {
                                            title  : 'Add Row',
                                            dataType: 'row-selector'
                                        }

                                    ],

                                    actions: {

                                        execute: (_data) => {

                                            const model = this.state.model;

                                            model.addRow({

                                                colIndex: _data.colIndex,
                                                selected: this.state.selected,
                                                position: this.state.position,
                                                dynamic: false

                                            });

                                            this.setState({ model });

                                            done();

                                        }
                                    },
                                    style: {
                                        dialog : {

                                            width: '50%',
                                            height: 'calc(100% - 50px)',
                                            top  : 50

                                        },
                                    }
                                });

                            }: null }
                        />
                    </div>
                </div>
            </div>

       );

    }

}

export default Col;
