import React from 'react';

/* Material UI */
import IconMenu          from 'material-ui/IconMenu';
import MenuItem          from 'material-ui/MenuItem';
import IconButton        from 'material-ui/IconButton/IconButton';
import MoreVertIcon      from 'material-ui/svg-icons/navigation/more-vert';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

class Row extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = { _row : null };

    }

    componentDidMount () {

        let documentHeight = this._row.parentNode.className == 'parent-row' ?  '30%' : '50%';
        let parentHeight   = this._row.parentNode.className;
        let rowContainer   = this._row.getElementsByClassName( 'row-container' );

        this.setState({ _row : this._row });

        this._row.style.height = documentHeight ;

        for( let i = 0; i < rowContainer.length; i++ ) {

            rowContainer[ i ].style.height = documentHeight - 50 + 'px';

        }

    }

    render () {

        let model = this.props.model;

        return (

            <div className = 'row' ref = { (c) => { this._row = c; } } style  = {{ borderTop : "", position: 'relative', borderBottom: this.props.last ? '1px solid rgb(240,240,240)' : '', marginBottom : this.state._row ? ( this.state._row.parentNode.className == 'parent-row' ?  0 : 0 ) : 0, padding: 0 }}>

                <div style = {{ display : 'inline-block', height: 25, width: '100%', background: this.state._row ? this.state._row.parentNode.className == 'parent-row' ?  'rgb(220,220,220)' : 'rgb(240,240,240)' : '', backgroundSize: "100% 30px", position: 'relative', boxSizing: 'border-box', borderTop : this.props.last ? '1px solid rgb(220,220,220)' : '', marginTop: 0  }}>

                    <IconMenu
                        style              = {{ float : 'right' }}
                        iconButtonElement  = { <IconButton style = {{ marginTop: -10, marginRight: 0 }}><KeyboardArrowDown style = {{ color : this.state._row ? ( this.state._row.parentNode.className == 'parent-row' ?  'rgb(10,100,100)' : 'rgb(230,230,230)' ) : 'red' }} /></IconButton> }
                        anchorOrigin       = {{ horizontal: 'right', vertical: 'top' }}
                        targetOrigin       = {{ horizontal: 'right', vertical: 'top' }}
                        onChange           = { ( event, data ) => { this.props.handleActionChange( event, data, this.props.parentModel ); } }
                    >
                        <MenuItem
                            primaryText = "Delete"
                            value       = {{ type : 0, model }}
                        />
                        <MenuItem
                            primaryText = "Move up"
                            value       = {{ type : 1, model }}
                        />
                        <MenuItem
                            primaryText = "Move down"
                            value       = {{ type : 2, model }}
                        />
                        <MenuItem
                            primaryText = "Duplicate"
                            value       = {{ type : 3, model }}
                        />
                        <MenuItem
                            primaryText = "Move to Top"
                            value       = {{ type : 4, model }}
                        />
                        <MenuItem
                            primaryText = "Move to Bottom"
                            value       = {{ type : 5, model }}
                        />
                        <MenuItem
                            primaryText = "Add Row Above"
                            value       = {{ type : 6, model }}
                        />
                        <MenuItem
                            primaryText = "Add Row Below"
                            value       = {{ type : 7, model }}
                        />

                    </IconMenu>
                </div>
                <div className = 'row-container' style = {{ position: 'absoulte', display: 'inline-block', width: '100%' }}>
                    { this.props.children }
                </div>
            </div>

        );

    }

}

export default Row;
