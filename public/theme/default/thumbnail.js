import React   from 'react';
import Wrapper from './wrapper';
import Heading from './components/heading.js';
import CONFIG from '../../../client/models/m-config.js';
import { ElementView } from '../../../client/components/project-editor/components/project-preview';
import Element         from '../../../client/components/project-editor/model/element';

const NavItem = ( props ) => {

    const { selected, last, onClick } = props;

    return (
        <div
            onClick = { onClick }
            style = {{
                background   : selected ? 'rgb(232, 131, 131)' : 'rgb(220,220,220)',
                borderRadius : '50%',
                display      : 'inline-block',
                float        : 'left',
                height       : 11,
                marginRight  : last ? 0 : 15,
                width        : 11,
            }}
        />
    );

}

class Thumbnail extends React.Component {

    constructor ( props ) {

        super( props );

        const thumbnails = [];

        this.state = {
            thumbnails,
            mouseOver : false,
            selected  : 0,
            status    : false
        }

        const { model } = this.props;

        console.log( model.data[ 'Thumbnail' ].content);

        if ( model.data[ 'Thumbnail' ].content ) {

            let element = new Element( 'image', JSON.parse( model.data[ 'Thumbnail' ].content ), JSON.parse( model.data[ 'Thumbnail' ].content ) );

            element.getPostById( ( contentModel ) => {

                if ( Array.isArray( contentModel ) ) {

                    this.setState({ thumbnails : contentModel });

                } else {

                    thumbnails.push( contentModel );

                    this.setState({ thumbnails });

                }


            });

        }

    }

    nextImage () {

        this.setState({

            selected : (this.state.selected + 1) % this.state.thumbnails.length

        })

    }

    render () {

        const { name, index, description, thumbnails, type, hyperlink } = this.props;
        const { mouseOver } = this.state;

        console.log( type );

        return (

                <div
                    className = { type == 0 ? 'col-sm-12' : 'col-sm-6' }
                    style = {{
                        background   : 'white',
                        cursor       : 'pointer',
                        marginBottom : 36,
                        paddingBottom : 36,
                        paddingLeft  : 0,
                        paddingRight : 0,
                        position     : 'relative',
                        transition   : '.25s all',
                        borderBottom : '2px solid rgb(220,220,220)',
                        float : 'left',
                        position :'inline-block'
                    }}
                    onMouseEnter = { () => {

                        this.nextImage();

                        this.setState({
                            mouseOver : true
                        })

                        this.slideInterval = setInterval(() => {

                            this.nextImage();

                        }, 1000);

                    }}
                    onMouseLeave = { () => {

                        if ( this.slideInterval ) {

                            clearInterval( this.slideInterval );

                        }

                        this.setState({
                            mouseOver : false
                        })

                    }}
                >
                    <a
                        href  = { `${ CONFIG.backendUrl }${ hyperlink }`}
                        style = {{
                            color : 'rgb(60,60,60)',
                            textDecoration : 'none'
                        }}
                    >
                        <div
                            style = {{
                                left         : 0,
                                marginBottom : 7.5,
                                transition   : '.25s all',
                                width        : '100%',
                            }}
                        >
                            <span style = {{ position : 'relative', display : 'inline-block', marginBottom : 5 }}>
                                <Heading
                                    textColor = { 'rgb(160,160,160)' }
                                    content   = { description }
                                />
                                <span
                                    style = {{
                                        borderBottom : '2px solid rgb(76, 211, 173)',
                                        display    : 'inline-block',
                                        left       : 0,
                                        position   : 'absolute',
                                        bottom     : 3.5,
                                        transition : '.25s ease all',
                                        width      : mouseOver ? '100%' : '0%',

                                    }}
                                />
                            </span>
                            <div
                                style = {{
                                    display       : 'block',
                                    fontFamily    : 'hind',
                                    fontSize      : 33,
                                    letterSpacing : '2px',
                                    fontWeight    : 400
                                }}
                            >
                                <span style = {{ position : 'relative' }}>
                                    { name }
                                </span>
                            </div>
                        </div>
                        <div
                            className = { type == 1 ? 'thumbnail-1' : 'thumbnail-2' }
                            style = {{
                                width    : '100%',
                                display  : type == 2 ? 'none' : '',
                                position : 'relative',
                                overflow : 'hidden'
                            }}
                        >
                            {
                                this.state.thumbnails.map( ( element, key ) => {
                                    return (
                                        <img
                                            key       = { key }
                                            className = { this.state.selected == key ? 'thumbnail-item-selected' : 'thumbnail-item' }
                                            src       = { `${ CONFIG.backendUrl }${element._hyperlink}`}
                                            style      = {{
                                                width : '100%',
                                                position : 'absolute'
                                            }}
                                        />
                                    )
                                })
                            }
                        </div>
                    </a>
                </div>

        )

    }


}

export default Thumbnail;
