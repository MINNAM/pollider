import React from 'react';

/* Pollider */
import RowContainer    from './row-container.js';
import Project         from '../model/project.js';
import Element         from './element';

class Col extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            model               : this.props.model,
            rowSelectorOpen     : false,
            elementSelectorOpen : false,
            height: '92%'

        };

    }

    componentDidMount() {

        if ( this._col.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className.indexOf( 'col-container') > -1 )  {

            this.setState({ height : '100%' });

        } else {

            this.setState({ height : '100%' });
        }

    }

    componentWillReceiveProps ( nextProps ) {

        this.setState({ model : nextProps.model });

    }

    addRow ( colIndex ) {

        let model = this.state.model;

        model.addRow({

            colIndex : colIndex,
            selected : this.state.selected,
            position : this.state.position,
            dynamic  : false

        });

        this.setState({ model });

    }

    setElement ( type ) {

        let model = this.state.model;

        model.setElement( type );

        this.setState({ model });

    }

    handleRowSelectorOpen () {

        this.setState({ rowSelectorOpen : true });

    }

    handleRowSelectorClose () {

        this.setState({

            rowSelectorOpen : false,
            selected        : null

        });

    }

    handleElementSelectorOpen () {

        this.setState({ elementSelectorOpen : true });

    }

    handleElementSelectorClose () {

        this.setState({

            elementSelectorOpen : false,
            selected            : null

        });

    }

    render () {

        let allowAddRow = true;
        let allowAddElement = true;
        let allowMarginTop = this._col ? (this._col.parentNode.offsetHeight / 2) - 30: '';

        if ( this.props.dynamic == false ) {

            allowAddRow = false;

        }

        if ( this.state.model ) {

            if ( this.state.model.rows.length > 0 ) {

                allowAddElement = false;

            }

        }

        if ( allowAddRow && this.state.model ) {

            allowMarginTop = this._col ? (this._col.parentNode.offsetHeight / ( this.state.model.rows.length == 1 ? 4 : 2  )  ) - 30: '';

            if ( this.state.model.rows.length < 2 ) {

                allowAddRow = true;

            } else {

                allowAddRow = false;

            }

        }

        if ( this.state.model.element ) {

            allowAddRow = false;
            allowAddElement = false;

        }

        let width;

        switch ( this.props.width ) {

            case '12' :
                width = '100%';
                break;

            case '9' :
                width = '75%';
                break;

            case '8' :
                width = '66.666667%';
                break;

            case '6' :
                width = '50%';
                break;

            case '4' :
                width = '33.333333%';
                break;

            case '3' :
                width = '25%';
                break;

            default :
                console.log( 'default' );

        }



        let addRow = allowAddRow ? <span

            onTouchTap = {
                () => {

                    this.props.handleActionDialogOpen({

                        actionModel : [
                            {
                                title    : 'Create Row',
                                dataType : 'row-selector'
                            }

                        ],

                        actions : {

                            execute : ( _data ) => {

                            this.addRow( _data.colIndex );

                            }
                        },
                        actionStyle : {
                            dialogStyle   : {

                                width : '50%',
                                height : 'calc( 100% - 50px)',
                                top : 50

                            },


                        }

                    });

                }
            }
        >
            Add Row

        </span> : '';

        let addElement = allowAddElement ? <span
            onTouchTap = {
                () => {

                    this.props.handleActionDialogOpen({

                        actionModel : [
                            {
                                title    : 'Create Element',
                                dataType : 'element-selector'
                            }

                        ],

                        actions : {

                            execute : ( _data ) => {

                            this.state.model.setElement( _data.type );

                            }
                        },

                        actionStyle : {

                            dialogStyle   : {

                                width : '50%',
                                height : 'calc( 100% - 50px)',
                                top : 50

                            },


                        }

                    });

                }
            }
        >
            Add Element
        </span> : '';


        return (

            <div
                className = { 'col-container' }
                style  = {{ padding: '',  position: 'relative', height: 'calc(100% - 25px)', width: width, display: 'inline-block' }}
            >
                <div
                    ref = { ( c ) => { this._col = c; } }
                    style = {{
                        background: 'white',
                        height: this.state.height,
                        width: '100%',
                        border: '1px solid rgb(245,245,245)',
                        borderBottom : '0px solid rgb(220,220,220)',
                        borderLeft : '0px solid rgb(245,245,245)',
                        borderRight: !this.props.last ? '1px solid rgb(245,245,245)' : '0px solid rgb(220,220,220)',
                        boxSizing: 'border-box', overflow: 'hidden'
                    }}
                >
                    <div style = {{ padding: '', height: '100%' }}>

                        { (!allowAddRow && !allowAddElement && this.state.model.element ) ? <Element uploads = { this.props.uploads } model = { this.state.model.element } parentModel = { this.state.model } handleActionChange = { this.props.handleActionChange } display  = { this.props.display }/> : '' }

                        <RowContainer
                            display            = { this.props.display }
                            model              = { this.state.model }
                            handleActionChange = { this.props.handleActionChange }
                            handleActionDialogOpen = { this.props.handleActionDialogOpen }
                        />
                        <span style = {{ marginTop : allowAddRow || allowAddElement ? allowMarginTop : 0, width: '100%', display: 'inline-block', textAlign: 'center'  }}>
                            { addRow }
                            <span style = {{ marginLeft : 10, marginRight : 10, display : allowAddRow && allowAddElement ? '' : 'none'  }} >/</span>
                            { addElement }
                        </span>
                    </div>
                </div>

            </div>

        );

    }

}

export default Col;
