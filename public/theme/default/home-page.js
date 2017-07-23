import React from 'react';

import Body      from './body.js';
import Thumbnail from './thumbnail.js';

import {createProjectView} from '../index.js';

const PRIMARY_COLOR = 'rgb(76, 211, 173)';

class HomePage extends React.Component {

    render () {

        const { model, children } = this.props;

        return (

            <Body
                model = { model }
                profile = { this.props.profile }
                displayHeader = { this.props.displayHeader }
                toggleProfile = { this.props.toggleProfile }
                toggleContact = { this.props.toggleContact }
                displayPostInfo = { false }
                hintFold = { this.props.hintFold }
            >
                <div id = 'post-content'>
                    {createProjectView(model)}
                    {
                        children ? children.map( ( element, key ) => {

                            console.log ( element.data );

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

export default HomePage;
