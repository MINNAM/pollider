import React from 'react';
/* Material UI */
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
/* Pollider*/
import PostContainer from './components/post-container.js';
import PostDialog from './components/post-dialog.js';
import PostIcon from './components/post-icon.js';
import PostInfoContainer from './components/post-info-container.js';
import Post from './components/post.js';

import {PostContainer as PostContainerModel} from './models/post-container.js';
import {PostQuery} from './models/post-query.js';
import PostTypes from './models/post-types.js';
import {Post as PostModel} from './models/post.js';

const structurePostTypes = (postTypes, displayPostInfo, setView, currentView) => {

    const postContainers = [];
    const postSelector = [];
    let postIndex = 0;

    if (postTypes) {
        postTypes.map((postType, key) => {
            postContainers[postType.id] = <PostContainer
                key = {key}
                index = {key}
                name = {key}
                postTypes = {postTypes}
                model = {postType.post_container}
                hyperlink = {postType.hyperlink}
                postType = {postType}
                width = {{
                    container: 9,
                    info: 3
                }}
                allowMultiple = {true}
                postDataTypes = {postTypes.postDataTypes}
                displayPostInfo = {displayPostInfo}
                setView = {setView ? setView : null}
                onUpdate = {(date, message, status) => {
                    this.triggerStatusBar(date, message, status);
                }}
                currentView = {currentView}
            />;

            postSelector.push(<MenuItem key = {key} value = {postType.id} primaryText = {postType.name} />);

        });
    }

    return {
        container: postContainers,
        selector: postSelector
    };
};

export {
    PostContainer,
    PostDialog,
    PostIcon,
    PostInfoContainer,
    Post,
    PostContainerModel,
    PostQuery,
    PostTypes,
    PostModel,
    structurePostTypes
};
