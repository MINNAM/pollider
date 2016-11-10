import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

/* Pollider */
import CONFIG from '../../../models/m-config.js';

const DEFAULT_STYLE = {

    display : 'inline-block',
    height  : 270,
    width   : '100%',
    backgroundPosition : 'center',

};

class PostPreview extends React.Component {

    constructor ( props ) {

        super( props );


        this.state = {

            loaded  : false

        };

        this.defaultStyle = {

            display : 'inline-block',
            height  : 270,
            width   : '100%',

        };

    }

    shouldComponentUpdate () {

        this.setState({

            loaded : false

        });

        return true;

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

        const model = this.props.model;

        switch ( model.hide.dataType ) {

            case 'post' :

                return (
                    <iframe
                        src = "hello"
                        className = { 'preview' }
                        style     = {{

                            display : 'inline-block',
                            height  : 270,
                            width   : '100%',

                        }}
                    >

                    </iframe>
                );

            break;

            case 'image' :

                if (  model.hide.path == null ) {

                    return this.displayDefault();

                }

                if ( !this.state.loaded ) {

                    let downloadingImage = new Image();



                    downloadingImage.onload = () => {

                        this.setState({

                            loaded : true

                        });

                    };

                    downloadingImage.src = CONFIG.backendUrl + model.hide.path + model.hide.filename + '.' + model.extension;

                }

                if ( this.state.loaded ) {

                    return (

                        <div
                            className = { 'preview' }
                            style     = {{

                                display : 'inline-block',
                                height  : 270,
                                width   : '100%',
                                backgroundPosition : 'center',
                                backgroundImage : 'url(' + CONFIG.backendUrl + model.hide.path + model.hide.filename + '.' + model.extension + ')'

                            }}
                        >

                        </div>

                    );

                } else {

                    return (

                        <div
                            style = {{
                                display : 'inline-block',
                                height  : 270,
                                width   : '100%',
                                position: 'relative'
                            }}
                        >
                            <CircularProgress
                                style = {{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        </div>

                    );

                }


            default :

                return this.displayDefault();


        }

        return ( <CircularProgress /> );

    }

}

export default PostPreview;
