import React from 'react';

/* Pollider */
import CONFIG from '../../../models/m-config.js';

const DEFAULT_STYLE = {

    display : 'inline-block',
    height  : 270,
    width   : '100%'

};

class PostPreview extends React.Component {

    constructor ( props ) {

        super( props );

        this.defaultStyle = {

            display : 'inline-block',
            height  : 270,
            width   : '100%'

        };

    }

    displayDefault () {

        return (

            <div
                className = { 'preview' }
                style     = { DEFAULT_STYLE }
            >
            </div>

        );


    }

    render () {

        let model = this.props.model;

        let defaultStyle = {

            display : 'inline-block',
            height  : 270,
            width   : '100%'

        };

        switch ( model.hide.dataType ) {

            case 'image' :

                if (  model.hide.path == null ) {

                    return this.displayDefault();

                }

                var style = Object.assign( DEFAULT_STYLE , {

                    backgroundPosition : 'center',
                    backgroundImage    : 'url(' + CONFIG.backendUrl + model.hide.path + model.hide.filename + '.' + model.extension + ')'

                });

                return (

                    <div
                        className = { 'preview' }
                        style     = { style }
                    >
                    </div>

                );


            default :

                return this.displayDefault();


        }

    }

}

export default PostPreview;
