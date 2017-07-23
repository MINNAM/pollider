import React, {Component} from 'react';
/* Material UI */
import Avatar from 'material-ui/Avatar';
import Photo from 'material-ui/svg-icons/image/photo';
import MusicNote from 'material-ui/svg-icons/image/music-note';
import Movie from 'material-ui/svg-icons/av/movie';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ViewQuilt from 'material-ui/svg-icons/action/view-quilt';
import Check from 'material-ui/svg-icons/navigation/check';
import Subject from 'material-ui/svg-icons/action/subject';
import ArtTrack from 'material-ui/svg-icons/av/art-track';
import SubdirectoryArrowRight from 'material-ui/svg-icons/navigation/subdirectory-arrow-right';

const STYLES = {
    parent: {
        position: 'relative',
        width: 40,
        height: 40,
        display: 'inline-block',
        float: 'left',
    },
    avatar: {
        width: '100%',
        height: '100%',
        float: 'left',
        background: 'rgb(180,180,180)'
    },
    alias: {
        parent: {
            position: 'absolute',
            bottom: -7,
            left: -7
        },
        content: {
            width: 14,
            height: 14
        }
    }
}

const ICONS = {
    'folder': <Avatar style = {STYLES.avatar} icon = { <FileFolder /> } />,
    'image': <Avatar style = {STYLES.avatar} icon = { <Photo /> } />,
    'post': <Avatar style = {STYLES.avatar} icon = { <ArtTrack /> } />,
    'audio': <Avatar style = {STYLES.avatar} icon = { <MusicNote /> } />,
    'video': <Avatar style = {STYLES.avatar} icon = { <Movie /> } />,
    'other': <Avatar style = {STYLES.avatar} icon = { <Movie /> } />,
};

class PostIcon extends Component {

    render () {
        const {
            model,
            style
        } = this.props;

        if (model.hide ) {
            if (ICONS[model.hide.dataType]) {
                return (
                    <span
                        style = {{
                            ...STYLES.parent,
                            ...style
                        }}
                    >
                        {ICONS[model.hide.dataType]}
                        {
                            model.alias_id ? <span
                                style = {STYLES.alias.parent}
                            >
                                <SubdirectoryArrowRight
                                    style = {STYLES.alias.content}
                                />
                            </span> : ''
                        }
                    </span>
                );
            } else {
                return <span/>;
            }
        } else {
            return <span/>;
        }
    }

}

export default PostIcon;
