import React from 'react';

import Body from './body.js';

import {createProjectView} from '../index.js';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

class Post extends React.Component {

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
                    {
                        createProjectView(model)
                    }
                </div>
            </Body>
        );

    }

}

export default Post;
