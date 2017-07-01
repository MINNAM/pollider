import React from 'react';

import Body             from  './body.js';
import Thumbnail         from './thumbnail.js';

import { ProjectPreview } from '../../../client/components/project-editor/components/project-preview';

import Post    from '../../../client/components/post-container/models/post';
import Project from '../../../client/components/project-editor/model/project';


class PostContainer extends React.Component {

    constructor ( props ) {

        super( props );

        const { model } = this.props;

        const post    =  { ...new Post(), ...model };
        const project = new Project({ model : post, projectField : 'Content' });


        this.state = { project };

    }

    render () {

        const { model, children } = this.props;

        return (
            <Body
                model           = { model }
                profile         = { this.props.profile }
                displayHeader         = { this.props.displayHeader }
                toggleProfile = { this.props.toggleProfile }
                toggleContact = { this.props.toggleContact }
                displayPostInfo = { true }
                hintFold        = { this.props.hintFold }
            >

                <div id = 'post-content'>
                    <ProjectPreview model = { this.state.project } />
                    {
                        children ? children.map( ( element, key ) => {

                            console.log( element.data  );

                            return (

                                    <Thumbnail
                                        key         = { key }
                                        type        = { element.data ? (element.data[ 'Type' ] ? element.data[ 'Type' ].content : 1 ) : 1 }
                                        index       = { key }
                                        model       = { element }
                                        parentModel = { this.props.model }
                                        name        = { element.name }
                                        hyperlink   = { element.hyperlink }
                                        description = { element.data ? (element.data[ 'Description' ] ? element.data[ 'Description' ].content : '') : '' }                                        
                                    />

                            )
                        }) : ''
                    }
                </div>


            </Body>
        )

    }

}

export default PostContainer;
