import React from 'react';
import Slider from 'material-ui/Slider';
import Dialog  from '../../action/components/dialog.js';

class Element extends React.Component {

    constructor ( props ) {

        super( props );
        this.state  = {

            model : this.props.model

        };

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
                        type : 'uploads',
                        model : this.state.model
                    },
                    this.props.model

                );
            break;


            default :
                // this.props.display( 'upload-container' );
                break;
        }

    }

    render () {

        let model = this.state.model;

        let optionComponents;

        switch ( model.type ) {

            case 'image':

            optionComponents = <Slider
                defaultValue = { this.props.parentModel.padding }
                max = { 1 }
                onChange  = { ( event, value ) => {

                    this.props.handleActionChange(
                        null,
                        {
                            type : 'set-padding',
                            value : value
                        },
                        this.props.parentModel

                    );

                }}
            />;

            break;

        }

        return (

            <div
                style = {{
                    padding : '5%'
                }}
            >
                <span
                    onTouchTap = {  () => {

                        this.displayByType( model.type );

                    }}
                >
                    { model.type }
                </span>

                {optionComponents}

            </div>

        );

    }

}

export default Element;
