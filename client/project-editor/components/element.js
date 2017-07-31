import React from 'react';
import Slider from 'material-ui/Slider';
import Close from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

import {
    scroll
} from '../../global.js'
import {
    MaterialButton
} from '../../ui-components/';

class Element extends React.Component {

    constructor ( props ) {

        super( props );
        this.state  = {

            model : this.props.model,
            background : 'rgb(220,220,220)'

        };
    }

    componentDidMount () {

        const model = { ...this.state.model };

        if ( model.open ) {

            this.displayByType( model.type );

            model.open = false;

            this.setState({model})

        }

    }

    componentWillReceiveProps ( nextProps ) {

        this.setState({ model : nextProps.model });

    }

    displayByType ( type ) {

        const {
            model
        } = this.state;

        switch ( type ) {
            case 'text' :
                this.props.handleDialogModel(
                    {
                        type: 'text-editor',
                        model
                    },
                    this.props.model

                );
                break;

            case 'image' :

                this.props.handleDialogModel(
                    {
                        type: 'post-container',
                        model
                    },
                    this.props.model

                );
                break;
            case 'code' :
                this.props.handleDialogModel(
                    {
                        type: 'code-editor',
                        model
                    },
                    this.props.model
                );

                // alert('code');
            break;

            case 'embed' :
                this.props.handleDialogModel(
                    {
                        type : 'embed',
                        model : this.state.model
                    },
                    this.props.model
                );

                // alert('code');
            break;


            default :
                // this.props.display( 'upload-container' );
                break;
        }

    }

    scrollTo ( element, to, duration ) {

        if ( duration <= 0 )
            return;

        let difference = to - element.scrollTop;
        let perTick = difference / duration * 10;

        setTimeout( () => {

            element.scrollTop = element.scrollTop + perTick;

            if ( element.scrollTop === to )
                return;

            this.scrollTo(element, to, duration - 10);

        }, 10);
    }

    render () {

        const {
            model
        } = this.state;


        let icon;


        switch ( model.type ) {

            case 'image':
                icon = 'image';
            break;

            case 'code' :
                icon = 'code';
            break;

            case 'text' :
                icon = 'subject';
            break;


        }


        return (

            <div
                id = { 'editor-' + model.uniqueId }
                style = {{
                    position : 'relative',
                    height   : '100%'
                }}
            >
                <span
                    style = {{
                        position : 'absolute',
                        left :  '50%',
                        top : '50%',
                        transform : 'translate(-50%,-50%)'
                    }}
                >
                    <MaterialButton
                        onClick = {() => {

                            let parentNode = document.getElementById( 'view-' + model.uniqueId ).parentNode;

                            while ( parentNode.className == 'row') {

                                parentNode = parentNode.parentNode;

                            }

                            this.displayByType( model.type );

                            const polliderPublic = document.getElementById( 'pollider-public' );
                            const view = document.getElementById( 'view-' + model.uniqueId );

                            scroll(polliderPublic, polliderPublic.scrollTop, view.getBoundingClientRect().top + polliderPublic.scrollTop - 200);


                        }}
                        label = { model.type }
                        icon  = { icon }

                    />
                </span>

            </div>

        );

    }

}

export default Element;
