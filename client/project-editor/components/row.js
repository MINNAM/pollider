import React from 'react';

/* Material UI */
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import {
    MaterialButton
} from '../../ui-components/';

class Row extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = { _row : null, background : 'white', model : this.props.model };

    }

    componentDidMount () {

        let documentHeight;

        if (this.props.model.parent) {

            documentHeight = this._row.parentNode.className == 'parent-row' ? '340px' : (this.props.model.parent.rows.length == 1 ? '100%' : '50%');

        } else {
            documentHeight = this._row.parentNode.className == 'parent-row' ? '340px' : '50%';
        }


        let parentHeight   = this._row.parentNode.className;
        let rowContainer   = this._row.getElementsByClassName( 'row-container' );

        this.setState({ _row : this._row });

        this._row.style.height = documentHeight;

        for( let i = 0; i < rowContainer.length; i++ ) {

            rowContainer[i].style.height = documentHeight - 50 + 'px';

        }

        if ( this.state.model.updated ) {

            this.setState({ background : 'rgb(220,220,220)' });

        } else {

            this.setState({ background : 'white' });

        }

    }

    componentWillReceiveProps ( nextProps ) {
        if (nextProps.model.parent) {
            if( nextProps.model.parent.rows.length > 1 && this._row.className != 'parent-row' && nextProps.model.parent.dataKey == null)
                this._row.style.height = '50%';
        }

        this.setState({

            model : nextProps.model

        });

        if ( nextProps.model.updated ) {

            this.setState({ background : 'white' });

        }

    }

    handleActionMenuOpen (event) {
        this.setState({
            actionMenuOpen: true,
            actionMenuAnchorEl: event.currentTarget
        });
    }

    handleActionMenuClose () {
        this.setState({
            actionMenuOpen: false
        });
    }

    render () {

        const {
            mostChild,
            parentModel
        } = this.props;

        const {  model, background } = this.state;

        let actionsForElement = [];
        let addRows = [];

        if ( model.cols.length == 1 && model.cols[0].element ) {

            actionsForElement.push({
                primaryText: "Delete Element",
                value: {
                    title : 'Delete Element',
                    type : 'delete-element',
                    model : model.cols[0].element,
                    parentModel : model.cols[0]
                }
            });

            actionsForElement.push({
                primaryText: "Set Padding",
                value: {
                    title: 'Set Padding',
                    type: 'set-padding',
                    model: model.cols[0].element,
                    parentModel: model.cols[0],
                    default:  model.cols[0].padding
                }
            });

            switch ( model.cols[0].element.type ) {

                case 'video':
                case 'image':
                    actionsForElement.push({
                        primaryText: "Resize Image",
                        value: {
                            title: 'Resize Image',
                            type: 'resize-image',
                            model: model.cols[0].element,
                            parentModel: model.cols[0],
                            default: model.cols[0].padding
                        }
                    });

                break;

            }

        }
            if ( this.props.addRowFromCol ) {

                addRows.push({
                    primaryText: 'Add Row',
                    value: {
                        type: 'add-row-from-col',
                    }
                });

            } else {

                addRows.push({
                    primaryText: 'Add Row Above',
                    value: {
                        type : 'add-row-above', model
                    }
                });

                addRows.push({
                    primaryText: 'Add Row Below',
                    value: {
                        type : 'add-row-below', model
                    }
                });

            }

        return (

            <div
                className = 'row'
                ref       = { ( c ) => { this._row = c; } }
                style     = {{
                    borderTop    : "",
                    position     : 'relative',
                    padding       : 0,
                    background
                }}
            >
                <div
                    style = {{
                        display        : 'inline-block',
                        height         : 40,
                        width          : '100%',
                        background     : this.state._row ? 'white' : '',
                        backgroundSize : "100% 30px",
                        position       : 'relative',
                        boxSizing      : 'border-box',
                        borderBottom   : '1px solid rgb(220,220,220)',
                        marginTop      : 0,
                        position : 'relative'
                    }}
                >

                    <MaterialButton
                        style = {{
                            float: 'right',
                            margin: '2px 9.5px 0 0',
                            borderRadius: '50%'
                        }}

                        onClick = { this.handleActionMenuOpen.bind(this) }
                        icon = { 'more_horiz'}
                        iconStyle = {{
                            color: 'rgb(60,60,60)',
                        }}

                    />

                    <Popover
                      open           = { this.state.actionMenuOpen }
                      anchorEl       = { this.state.actionMenuAnchorEl }
                      anchorOrigin   = {{ horizontal: 'right', vertical: 'bottom' }}
                      targetOrigin   = {{ horizontal: 'right', vertical: 'top' }}
                      onRequestClose = { this.handleActionMenuClose.bind(this) }
                    >
                        <Menu
                            onChange = {(event, data) => {
                                this.handleActionMenuClose();
                                if ( data.type == 'add-row-from-col' ) {

                                    this.props.addRowFromCol( () => {

                                        this.forceUpdate();

                                    });


                                } else {

                                    if ( data.parentModel ) { // actions for Element

                                        this.props.handleDialogModel( data, data.parentModel );

                                    } else {

                                        this.props.handleDialogModel( data, this.props.parentModel );

                                    }

                                }

                            }}
                            style = {{
                                float: 'right'
                            }}
                            menuItemStyle = {{
                                fontSize: 14
                            }}
                        >
                            {

                                actionsForElement.length > 0 ? <Subheader
                                    style = {{
                                        color : 'rgb(150,150,150)',
                                        fontSize : 12
                                    }}
                                >
                                    Element
                                </Subheader> : ''

                            }

                            {
                                actionsForElement.length > 0 ? actionsForElement.map( (element,key) => {
                                    return (
                                        <MenuItem
                                            key = {key}
                                            primaryText = {element.primaryText}
                                            value = {element.value}
                                        />
                                    );
                                }) : ''
                            }

                            {

                                actionsForElement.length > 0 ? <Divider /> : ''

                            }
                            <Subheader
                                style = {{
                                    color : 'rgb(150,150,150)',
                                    fontSize : 12
                                }}
                            >
                                Row
                            </Subheader>
                            {
                                this.state.model.cols.length == 2 ? <MenuItem
                                    primaryText = "Push & Pull"
                                    value = {{ type : 'push-and-pull', model }}
                                /> : ''
                            }
                            <MenuItem
                                primaryText = "Delete"
                                value       = {{ type : 'delete-row', model }}
                            />
                            <MenuItem
                                primaryText = "Duplicate"
                                value       = {{ type : 'duplicate-row', model }}
                            />
                            <MenuItem
                                primaryText = "Move to Top"
                                value = {{ type : 'row-to-top', model }}
                            />
                            <MenuItem
                                primaryText = "Move to Bottom"
                                value = {{ type : 'row-to-bottom', model }}

                            />

                           <Divider />
                           {
                               addRows.map( (element,key) => {

                                   return (
                                       <MenuItem
                                           key = {key+10}
                                           primaryText = {element.primaryText}
                                           value = {element.value}
                                       />
                                   );

                               })
                           }

                        </Menu>
                    </Popover>

                    <span
                        style = {{
                            display: this.props.parentModel.rows.length == 1 ? 'none' : ''
                        }}
                    >
                        <MaterialButton
                            style = {{
                                marginTop: 1.25,
                                float     : 'left',
                                borderRadius : 33,
                                height : 33,
                                width : 33,
                                marginLeft : 5.5,
                                marginTop: 3
                            }}

                            icon = { 'keyboard_arrow_down'}
                            iconStyle = {{
                                color : 'rgb(60,60,60)',
                                fontSize : 20
                            }}
                            onClick = { () => {
                                this.props.handleDialogModel({ type : 'down-row', model }, this.props.parentModel );
                            }}
                        />
                        <MaterialButton
                            style = {{
                                marginTop: 1.25,
                                float     : 'left',
                                borderRadius : '50%',
                                height : 33,
                                width : 33,
                                marginLeft : 5.5,
                                marginTop: 3
                            }}

                            icon = { 'keyboard_arrow_up'}
                            iconStyle = {{
                                color : 'rgb(60,60,60)',
                                fontSize : 20
                            }}
                            onClick = { () => {

                                this.props.handleDialogModel({ type : 'up-row', model }, this.props.parentModel );

                            }}

                        />
                    </span>

                </div>

                <div className = 'row-container'
                    style = {{
                        position  : 'absoulte',
                        display   : 'inline-block',
                        width     : '100%',
                        padding    : this.state._row ? (this.state._row.parentNode.className == 'parent-row' ? '20px 40px 20px 40px' : '') : '',
                        height    : 'calc(100% - 40px)',
                        marginTop : -5,
                        background : 'rgb(240,240,240)'
                    }}
                >
                    { this.props.children }
                </div>
            </div>

        );

    }

}

export default Row;
