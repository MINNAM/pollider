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

    componentWillReceiveProps(nextProps) {

        console.log( 'what', this.props.model.id, nextProps.model.id );

        this.setState({
            nextModel : nextProps.model
        });


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

            case 'root_folder' :
            case 'folder' :
            case 'post' :

                return (
                    <div
                        style = {{
                            height  : 270,
                            width   : '100%',
                            overflow: 'hidden'
                        }}
                    >

                        <iframe
                            src       = { this.props.update ? this.props.hyperlink + '/' + model._hyperlink : '' }
                            className = { 'preview' }
                            style     = {{

                                display : 'inline-block',
                                height  : 270 * 4,
                                width   : '400%',
                                border : 'none',
                                transform    : 'scale( 0.25 )',
                                transformOrigin : '0 0'

                            }}
                        />


                    </div>
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

                    downloadingImage.src = this.props.hyperlink + '/' + model._hyperlink;

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
                                backgroundImage : 'url(' + this.props.hyperlink + '/' + model._hyperlink + ')'

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
