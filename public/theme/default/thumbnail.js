import React   from 'react';
import Wrapper from './wrapper';
import Heading from './components/heading.js';
import {SITE} from '../../../client/global.js';
import {ElementView} from '../../../client/project-view/';
import Element from '../../../client/project-editor/models/element';

const NavItem = ( props ) => {

    const {
        selected,
        last,
        onClick
    } = props;

    return (
        <div
            onClick = {onClick}
            style = {{
                background: selected ? 'rgb(232, 131, 131)' : 'rgb(220,220,220)',
                borderRadius: '50%',
                display: 'inline-block',
                float: 'left',
                height: 11,
                marginRight: last ? 0 : 15,
                width: 11,
            }}
        />
    );
}

class Thumbnail extends React.Component {

    state = {
        thumbnails: [],
        mouseOver: false,
        selected: 0,
        loaded: false
    }

    constructor (props) {
        super(props);
    }

    componentDidMount() {
        const {
            model,
            addLoadingQueue,
            addLoadedQueue
        } = this.props;

        if (model.data['Thumbnail'] && model.data['Thumbnail'].content) {

            const element = new Element('image', JSON.parse(model.data['Thumbnail'].content), JSON.parse(model.data['Thumbnail'].content));

            console.log(element);

            element.getPostById((contentModel) => {
                if (Array.isArray(contentModel)) { // check if multiple images

                    const sortedThumbnails = contentModel.sort((a,b) => {
                        return new Date(b.public_date) - new Date(a.public_date);
                    });

                    this.setState({
                        thumbnails: sortedThumbnails,
                        selected: 0,
                        loaded: true
                    });
                    addLoadingQueue({index: contentModel.length});
                    sortedThumbnails.map((element) => {
                        const image = new Image();
                        image.src = `/${element._hyperlink}`;
                        image.onload = () => {
                            addLoadedQueue(`/${element._hyperlink}`);
                        }
                    })

                } else {
                    addLoadingQueue();
                    [contentModel].map((element) => {
                        const image = new Image();
                        image.src = `/${element._hyperlink}`;
                        image.onload = () => {
                            addLoadedQueue(`/${element._hyperlink}`);
                        }
                    })
                    this.setState({
                        thumbnails: [contentModel],
                        loaded: true
                    });
                }
            });
        }
    }

    nextImage () {
        const {
            selected,
            thumbnails
        } = this.state;
        this.setState({
            selected: (selected + 1) % thumbnails.length
        });
    }

    render () {
        const {
            name,
            index,
            subtitle,
            type,
            hyperlink,
            addLoadingQueue,
            addLoadedQueue
        } = this.props;
        const {
            thumbnails,
            mouseOver,
            selected,
            loaded
        } = this.state;

        return (

                <div
                    className = {'col-sm-12'}
                    style = {{
                        background: 'white',
                        float: 'left',
                        marginBottom: 36,
                        paddingLeft: 0,
                        paddingRight: 0,
                        position: 'relative',
                        position:'inline-block',
                        transition: '.25s all',
                    }}
                >
                    <a
                        href = {`${ hyperlink }`}
                        style = {{
                            color: 'rgb(60,60,60)',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                        onMouseEnter = {() => {
                            this.setState({
                                mouseOver: true
                            });
                            if (loaded) {
                                this.nextImage();
                                this.slideInterval = setInterval(() => {
                                    this.nextImage();
                                }, 1000);
                            }
                        }}
                        onMouseLeave = {() => {
                            this.setState({
                                mouseOver : false
                            });
                            if (loaded) {
                                if (this.slideInterval) {
                                    clearInterval(this.slideInterval);
                                }
                            }
                        }}
                    >
                        <div
                            style = {{
                                left: 0,
                                marginBottom: 7.5,
                                transition: '.25s all',
                                width: '100%'
                            }}
                        >
                            <span
                                style = {{
                                    position: 'relative',
                                    display: 'inline-block',
                                    marginBottom: 5
                                }}
                            >
                            <span
                                style = {{
                                    borderBottom: '2px solid rgb(76, 211, 173)',
                                    display: 'inline-block',
                                    left: '50%',
                                    position: 'absolute',
                                    bottom: 3.5,
                                    transition: '.25s ease all',
                                    width: this.state.mouseOver ? '100%' : '0%',
                                    transform: 'translate(-50%,0)'

                                }}
                            />
                                <Heading
                                    textColor = {'rgb(160,160,160)'}
                                    content = {subtitle}
                                />
                            </span>
                            <div
                                style = {{
                                    display: 'block',
                                    fontFamily: 'hind',
                                    fontSize: 33,
                                    marginBottom: 20,
                                    letterSpacing: '2px',
                                    fontWeight: 400
                                }}
                            >
                                <span
                                    style = {{
                                        position: 'relative'
                                    }}
                                >
                                    {name}
                                </span>
                            </div>
                        </div>
                        <div
                            className = {type == 1 ? 'thumbnail-1' : 'thumbnail-2'}
                            style = {{
                                width: '100%',
                                display: type == 2 ? 'none' : '',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {
                                thumbnails.map(( element, key ) => {

                                    return (
                                        <img
                                            key = { key }
                                            src = { `/${element._hyperlink}`}
                                            style = {{
                                                width: '100%',
                                                float: 'left',
                                                top: 0,
                                                left: 0,
                                                position: selected == key ? 'relative' : 'absolute',
                                                opacity: selected == key ? 1 : 0,
                                                transition: '.5s all'
                                            }}
                                        />
                                    );
                                })
                            }
                        </div>
                    </a>
                    <div
                        style = {{
                            borderBottom: '2px solid rgb(230,230,230)',
                            marginTop: 60,
                            width: '100%',
                        }}
                    />
                </div>
        );
    }


}

export default Thumbnail;
