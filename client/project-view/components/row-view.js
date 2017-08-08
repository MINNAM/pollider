import React, {Component} from 'react';

import ColView from './col-view.js';

class RowView extends Component {

    state = {
        elements : [],
        loaded : false
    }

    componentDidMount () {
        this.setState({
            loaded: true
        });
    }

    getHeight() {
        const {
            elements
        } = this.state;

        if (elements.length == 0) {
            return '50%';
        }

        const elementSorted = elements.sort(( a, b ) => {
            return b.offsetHeight - a.offsetHeight;
        });

        return elementSorted[ 0 ].offsetHeight;
    }

    render () {
        const {
            model,
            editor,
            editorGuide,
            handler,
            handleDialogModel
        } = this.props;

        const {
            elements
        } = this.state;

        return (
            <div
                className = {'row'}
                style = {{
                    display: 'table',
                    width: '100%'
                }}
            >
                {
                    model.pushAndPull ? model.cols.map((col, key)=> {
                        return (
                            <ColView
                                push = {key == 0}
                                pull = {key == 1}
                                key = {key}
                                index = {key}
                                model = {col}
                                editor = {editor}
                                editorGuide = {editorGuide}
                                handleDialogModel = {handleDialogModel}
                                queueElement = {(element) => {
                                    elements[ key ] = element;

                                    this.setState({
                                        elements
                                    });
                                }}
                                handler = {handler}
                            />
                        );
                    }) : model.cols.map((col, key)=> {
                        return (
                            <ColView
                                key = {key}
                                index = {key}
                                model = {col}
                                editor = {editor}
                                editorGuide = {editorGuide}
                                handleDialogModel = {handleDialogModel}
                                queueElement = {(element) => {
                                    elements[ key ] = element;

                                    this.setState({
                                        elements
                                    });
                                }}
                                handler = {handler}
                            />
                        );
                    })
                }
            </div>
        );
    }

};

export default RowView;
