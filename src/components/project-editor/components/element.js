import React from 'react';

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

        return (

            <div>
                <span
                    onTouchTap = {  () => {

                        this.displayByType( model.type );

                    }}
                >
                    { model.type }
                </span>

            </div>

        );

    }

}

export default Element;
