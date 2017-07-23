import React, {Component} from 'react';

import RowView from './row-view.js';
import ElementView from './element-view.js';

import {
    MaterialButton
} from '../../ui-components/';

class ColView extends Component {

    state = {
        verticalAlign: 'top'
    }

    render () {
        const {
            model,
            queueElement,
            editor
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
                            position: 'relative'
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
                                    top: 0,
                                    left: -38
                                }}
                            >
                                <MaterialButton
                                    style = {{
                                        background: 'rgba(255,255,255,0.5)'
                                    }}
                                    onClick = { () => {}}
                                    icon = {'mode_edit'}
                                    iconStyle = {{
                                        color: 'rgb(60,60,60)'
                                    }}
                                />
                            </div>
                            <ElementView
                                col = {model}
                                model = {model.element}
                                editor = {editor}
                                queueElement = {queueElement}
                                setVerticalAlign = {(verticalAlign) => {
                                    this.setState({ verticalAlign })
                                }}
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
                            position: 'relative'
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
                    verticalAlign: 'middle'
                }}
            >
            {
                model.rows.map((row, key) => {
                    return (
                        <RowView editor = { editor } key = { key } model = { row }/>
                    );
                })
            }
            </div>
        );

    }

};

export default ColView;
