import React from 'react';
import Body from './body.js';
import Footer from './footer.js';
import {createProjectView} from '../index.js';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

class Post extends React.Component {

    handler = {
        element: {
            image: {
                enlarge: {
                    timeout: 500,
                    classNames : {
                        before: 'image-enlarge-container',
                        after: 'image-enlarge-container-toggled'
                    }
                }
            }
        }
    }

    render () {
        const {
            model,
            children,
            toggle,
            toggled,
            allowTransition,
            loadFinish,
            addLoadingQueue,
            addLoadedQueue
        } = this.props;

        return (
            <Body
                model = {model}
                toggle = {toggle}
                toggled = {toggled}
                allowTransition = {allowTransition}
                displayPostInfo = {true}
                displayNav = {true}
                innerContentStyle = {{
                    margin: '0 auto'
                }}
                displayFooter = {true}
                loadFinish = {loadFinish}
                addLoadingQueue = {addLoadingQueue}
                addLoadedQueue = {addLoadedQueue}
            >
                <div id = 'post-content'>
                    {createProjectView(model, this.handler)}
                </div>
            </Body>
        );
    }
}

export default Post;
