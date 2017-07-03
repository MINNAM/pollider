import React from 'react';
import Slider from 'material-ui/Slider';
import Close from 'material-ui/svg-icons/navigation/close';
import IconMenu          from 'material-ui/IconMenu';
import MenuItem          from 'material-ui/MenuItem';
import IconButton        from 'material-ui/IconButton/IconButton';
import Dialog  from '../../action/components/dialog.js';
import MaterialButton          from '../../ui/components/material-button.js';
import MoreHorizIcon      from 'material-ui/svg-icons/navigation/more-horiz';

class Element extends React.Component {

    constructor ( props ) {

        super( props );
        this.state  = {

            model : this.props.model

        };

    }

    componentDidMount () {

        if ( this.props.toggle ) {

            this.displayByType( this.state.model.type )

        }


    }

    componentWillReceiveProps ( nextProps ) {

        this.setState({ model : nextProps.model });

    }

    displayByType ( type ) {

        switch ( type ) {
            case 'text' :

                this.props.handleActionChange(
                    null,
                    {
                        type : 'text-editor',
                        model : this.state.model
                    },
                    this.props.model

                );
                break;

            case 'image' :

                this.props.handleActionChange(
                    null,
                    {
                        type : 'post-container',
                        model : this.state.model
                    },
                    this.props.model

                );
                break;
            case 'code' :
                this.props.handleActionChange(
                    null,
                    {
                        type : 'code-editor',
                        model : this.state.model
                    },
                    this.props.model

                );

                // alert('code');
            break;

            case 'embed' :
                this.props.handleActionChange(
                    null,
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

    handleActionChange ( event, data ) {

        switch ( data.type ) {

            case 'delete-element' :
                this.props.handleActionChange(
                    null,
                    {
                        type : 'delete-element',
                        model : this.state.model
                    },
                    this.props.parentModel

                );

            break;

            case 'resize-image':
                this.props.handleActionChange(
                    null,
                    {
                        title : 'Resize Image',
                        type : 'resize-element',
                        default : this.props.parentModel.padding,
                        model : this.state.model
                    },
                    this.props.parentModel

                );

            break;

        }

    }

    render () {

        const model = this.state.model;

        let optionComponents;
        let icon;

        const actions = [
            <MenuItem
                primaryText = "Delete"
                value       = {{ type : 'delete-element' }}
            />
        ];

        switch ( model.type ) {

            case 'image':

                icon = 'image';
                actions.push(<MenuItem
                    primaryText = "Resize Image"
                    value       = {{ type : 'resize-image' }}
                />);

            break;

            case 'text' :
                icon = 'subject';
            break;


        }





        return (

            <div
                style = {{
                    position : 'relative',
                    height   : '100%'
                }}
            >
                <span
                    style = {{
                        position : 'absolute',
                        right :  5,
                        top : 7.5,
                    }}
                >
                    <IconMenu
                        style              = {{ float : 'right' }}
                        iconButtonElement  = { <IconButton style = {{ marginTop: -10, marginRight: 0 }} iconStyle = {{ height : 22, width : 22, color : 'rgb(60,60,60)'}}><MoreHorizIcon /></IconButton> }
                        anchorOrigin       = {{ horizontal: 'right', vertical: 'top' }}
                        targetOrigin       = {{ horizontal: 'right', vertical: 'top' }}
                        onChange           = { ( event, data ) => { this.handleActionChange( event, data ); } }
                    >

                        { actions }

                    </IconMenu>

                </span>
                <span
                    style = {{
                        position : 'absolute',
                        left :  '50%',
                        top : '50%',
                        transform : 'translate(-50%,-50%)'
                    }}
                >
                    <MaterialButton
                        onClick = { () => { this.displayByType( model.type ); } }
                        label = { model.type }
                        icon  = { icon }

                    />
                </span>

            </div>

        );

    }

}

export default Element;
