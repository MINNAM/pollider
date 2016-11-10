import React from 'react';

/* Material UI */
import Avatar            from 'material-ui/Avatar';
import Photo             from 'material-ui/svg-icons/image/photo';
import MusicNote         from 'material-ui/svg-icons/image/music-note';
import Movie             from 'material-ui/svg-icons/av/movie';
import FileFolder        from 'material-ui/svg-icons/file/folder';
import ViewQuilt         from 'material-ui/svg-icons/action/view-quilt';
import Check             from 'material-ui/svg-icons/navigation/check';

const icons = {

    'root_folder' : <Avatar style = {{ float: 'left', background: 'rgb(100,100,100)' }} icon = { <FileFolder /> } />,
    'folder'      : <Avatar style = {{ float: 'left' }} icon = { <FileFolder /> } />,
    'image'       : <Avatar style = {{ float: 'left' }} icon = { <Photo /> } />,
    'post'        : <Avatar style = {{ float: 'left' }} icon = { <ViewQuilt /> } />,
    'audio'       : <Avatar style = {{ float: 'left' }} icon = { <MusicNote /> } />,
    'video'       : <Avatar style = {{ float: 'left' }} icon = { <Movie /> } />,

};

class PostIcon extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {

        if ( this.props.model.hide  ) {

            switch ( this.props.model.hide.dataType ) {

                case 'root_folder' :

                    return <Avatar style = {{ float: 'left', background: 'rgb(100,100,100)' }} icon = { <FileFolder /> } />;

                case 'folder' :

                    return <Avatar style = {{ float: 'left' }} icon = { <FileFolder /> } />;

                case 'image' :

                    return <Avatar style = {{ float: 'left' }} icon = { <Photo /> } />;


                case 'post' :

                    return <Avatar style = {{ float: 'left' }} icon = { <ViewQuilt /> } />;

                case 'audio' :

                    return <Avatar style = {{ float: 'left' }} icon = { <MusicNote /> } />;

                case 'video' :

                    return <Avatar style = {{ float: 'left' }} icon = { <Movie /> } />;

                default :

                    return <span></span>;

            }

        } else {

            return <span></span>;

        }

    }

}

export default PostIcon;
