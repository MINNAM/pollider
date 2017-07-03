import React from 'react';

import Body from './body.js';

import _Post            from '../../../client/components/post-container/models/post';
import Project          from '../../../client/components/project-editor/model/project';
import {ProjectPreview} from '../../../client/components/project-editor/components/project-preview';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

class Post extends React.Component {

    constructor ( props ) {

        super( props );

        const { model } = this.props;

        const post    =  { ...new _Post(), ...model };
        const project = new Project({ model : post, projectField : 'Content' });

        this.state = { project };

    }

    render () {

        const model = this.props.model || {};



        return (
            <Body
                model           = { model }
                displayHeader   = { this.props.displayHeader }
                toggleProfile   = { this.props.toggleProfile }
                toggleContact   = { this.props.toggleContact }
                displayPostInfo = { true }
                hintFold        = { this.props.hintFold }
            >
                <div id = 'post-content'>
                    <ProjectPreview model = { this.state.project } />
                </div>
            </Body>
        );

    }

}

export default Post;
