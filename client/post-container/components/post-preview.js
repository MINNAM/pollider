import React, {Component, PropTypes} from 'react';
/* Material UI*/
import CircularProgress from 'material-ui/CircularProgress';

const STYLES = {
    default: {
        display: 'inline-block',
        height: 270,
        width: '100%',
        backgroundPosition: 'center',
    },
    circularProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
};

class PostPreview extends Component {

    static propTypes = {
        /**
        *   There is a lag when dragging a post since when post is clicked,
        *   PostPreview updates. PostPreview will only update on Post.onMouseUp
        */
        update: PropTypes.bool
    }

    state = {
        loaded : false
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            nextModel : nextProps.model
        });
    }

    shouldComponentUpdate () {
        this.setState({
            loaded: false
        });
        return true;
    }

    displayDefault () {
        return (
            <div
                className = { 'preview' }
                style     = { STYLES.default }
            />
        );
    }

    render () {

        const {
            model,
            update,
            hyperlink
        } = this.props;
        const {
            loaded
        } = this.state;

        console.log( 'post preview', this.props );

        switch ( model.hide.dataType ) {
            case 'root_folder':
            case 'folder':
            case 'post':
                return (
                    <div
                        style = {{
                            height: 270,
                            width: '100%',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {
                            update ? <iframe
                                src = { update ? hyperlink + '/' + model._hyperlink : '' }
                                className = { 'preview' }
                                style = {{
                                    display: 'inline-block',
                                    height: 270 * 4,
                                    width: '400%',
                                    border: 'none',
                                    transform: 'scale( 0.25 )',
                                    transformOrigin: '0 0'
                                }}
                            /> : <CircularProgress
                                style = {STYLES.circularProgress}
                            />
                        }
                    </div>
                );
            break;
            case 'image':
                if (model.hide.path == null) {
                    return this.displayDefault();
                }

                if (!loaded) {
                    const downloadingImage = new Image();
                    downloadingImage.onload = () => {
                        this.setState({
                            loaded: true
                        });
                    };

                    downloadingImage.src = this.props.hyperlink + '/' + model._hyperlink;
                } else {
                    return (
                        <div
                            className = { 'preview' }
                            style = {{
                                display: 'inline-block',
                                height: 270,
                                width: '100%',
                                backgroundPosition : 'center',
                                backgroundImage : 'url(' + hyperlink + '/' + model._hyperlink + ')'
                            }}
                        />
                    );
                }

                return (
                    <div
                        style = {{
                            display: 'inline-block',
                            height: 270,
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        <CircularProgress
                            style = {STYLES.circularProgress}
                        />
                    </div>
                );


            default:
                return this.displayDefault();
        }

        return ( <CircularProgress /> );

    }

}

export default PostPreview;
