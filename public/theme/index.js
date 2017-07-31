import React from 'react';

import {PostModel} from '../../client/post-container';
import Project from '../../client/project-editor/models/project.js';
import {ProjectView} from '../../client/project-view/';

const createProjectView = (model, handler) => {
    const post =  {
        ...new PostModel(),
        ...model
    };

    const project = new Project({
         model : post,
         projectField : 'Content'
    });

    return <ProjectView model = {project} handler = {handler}/>;
};

export {createProjectView};
