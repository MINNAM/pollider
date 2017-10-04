import React from 'react';
import Body from  './body.js';
import Thumbnail from './thumbnail.js';
import Footer from './footer.js';

import {createProjectView} from '../index.js';


class Posts extends React.Component {

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

    constructor (props) {
        super(props);

        const {
            children,
            addLoadedQueue
        } = this.props;

        if (children) {
            if (children.length == 0) {
                addLoadedQueue(null);
                this.state = {
                    children: []
                };
            } else {
                this.state = {
                    children: children ? children.sort((a,b) => {                        
                        return new Date(b.public_date) - new Date(a.public_date);
                    }) : []
                }
            }
        } else {
            addLoadedQueue(null);
        }
    }

    render () {
        const {
            model,
            toggle,
            toggled,
            allowTransition,
            loadFinish,
            addLoadingQueue,
            addLoadedQueue
        } = this.props;
        const {
            children
        } = this.state;

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
                    <div>
                    {
                        createProjectView(model, this.handler)
                    }
                    {
                        children ? children.map((element, key) => {

                            return (

                                <Thumbnail
                                    key = {key}
                                    type = {element.data ? (element.data['Type'] ? element.data['Type'].content : 1 ) : 1}
                                    index = {key}
                                    model = {element}
                                    parentModel = {model}
                                    name = {element.name}
                                    hyperlink = {element.hyperlink}
                                    subtitle = {element.data ? (element.data[ 'Subtitle' ] ? element.data[ 'Subtitle' ].content : '') : ''}
                                    addLoadingQueue = {addLoadingQueue}
                                    addLoadedQueue = {addLoadedQueue}
                                />

                            );
                        }) : ''
                    }
                    </div>
                </div>

            </Body>
        );

    }

}

export default Posts;
