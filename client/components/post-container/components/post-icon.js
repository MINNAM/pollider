import React from 'react';

/* Material UI */
import Avatar            from 'material-ui/Avatar';
import Photo             from 'material-ui/svg-icons/image/photo';
import MusicNote         from 'material-ui/svg-icons/image/music-note';
import Movie             from 'material-ui/svg-icons/av/movie';
import FileFolder        from 'material-ui/svg-icons/file/folder';
import ViewQuilt         from 'material-ui/svg-icons/action/view-quilt';
import Check             from 'material-ui/svg-icons/navigation/check';
import Subject           from 'material-ui/svg-icons/action/subject';
import ArtTrack           from 'material-ui/svg-icons/av/art-track';
import SubdirectoryArrowRight             from 'material-ui/svg-icons/navigation/subdirectory-arrow-right';

const icons = {

    'root_folder' : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(100,100,100)' }} icon = { <FileFolder /> } />,
    'folder'      : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(180,180,180)' }} icon = { <FileFolder /> } />,
    'image'       : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(180,180,180)' }} icon = { <Photo /> } />,
    'post'        : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(180,180,180)' }} icon = { <ArtTrack /> } />,
    'audio'       : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(180,180,180)' }} icon = { <MusicNote /> } />,
    'video'       : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(180,180,180)' }} icon = { <Movie /> } />,
    'other'       : <Avatar style = {{ width : '100%', height : '100%', float: 'left', background: 'rgb(180,180,180)' }} icon = { <Movie /> } />,

};

class PostIcon extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {

        const style = {
            position : 'relative',
            width : 40,
            height : 40,
            display : 'inline-block',
            float: 'left',
            ... this.props.style
        }

        if ( this.props.model.hide  ) {

            if ( icons[ this.props.model.hide.dataType ] ) {

                return (
                    <span
                        style = { style }
                    >
                        { icons[ this.props.model.hide.dataType ] }
                        {
                            this.props.model.alias_id ? <span
                                style = {{
                                    position : 'absolute',
                                    bottom : -7,
                                    left : -7
                                }}
                            >
                                <SubdirectoryArrowRight
                                    style = {{
                                        width : 14,
                                        height : 14
                                    }}
                                />
                            </span> : ''
                        }

                    </span>
                )

            } else {
                return <span></span>;
            }



        } else {

            return <span></span>;

        }

    }

}

export default PostIcon;
