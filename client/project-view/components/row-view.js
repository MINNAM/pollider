import React, {Component} from 'react';

import TEXT_STYLE from '../../../public/theme/default/text-style.js';
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
            editor
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
                    model.cols.map((col, key)=> {
                        return (
                            <ColView
                                key = {key}
                                index = {key}
                                model = {col}
                                editor = {editor}
                                queueElement = {(element) => {
                                    elements[ key ] = element;

                                    this.setState({
                                        elements
                                    });
                                }}
                            />
                        );
                    })
                }
            </div>
        );
    }

};

export default RowView;
