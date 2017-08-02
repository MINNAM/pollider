import React, {Component} from 'react';

import TouchRipple from '../../../node_modules/material-ui/internal/TouchRipple';

class RowSelectorItem extends Component {
    state = {
        mouseOver: false
    }
    render () {
        const {
            style,
            children,
            onClick,
            src
        } = this.props;
        return (
            <span
                style = {{
                    ...style,
                    marginBottom: 10,
                    padding: '10px 0 10px 0'
                }}
                className = 'col-sm-3'
                onTouchTap = {onClick}
                onMouseOver = {() => {
                    this.setState({mouseOver: true})
                }}
                onMouseLeave = {() => {
                    this.setState({mouseOver: false})
                }}
            >
                <TouchRipple>
                    <img
                       src = {src}
                       style = {{
                           height: 30
                       }}
                    />
                </TouchRipple>


            </span>

        );
    }
};

export default RowSelectorItem;
