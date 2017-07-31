import React, {Component} from 'react';

import TEXT_STYLE from '../../../public/theme/default/styles/text-style.js';
import RowView from './row-view.js';

class ProjectView extends Component {

    render () {
        const {
            model,
            style,
            editor,
            handler,
            handleDialogModel
        } = this.props;

        return (

            <div
                className = 'project-preview'
                style = {{
                    background: 'white',
                    ...style,
                    ...TEXT_STYLE['NORMALTEXT']
                }}
            >
                {
                    model.rows.map((row, rowKey) => {
                        return (
                            <RowView
                                key = {rowKey}
                                model = {row}
                                editor = {editor}
                                handler = {handler}
                                handleDialogModel = {handleDialogModel}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default ProjectView;
