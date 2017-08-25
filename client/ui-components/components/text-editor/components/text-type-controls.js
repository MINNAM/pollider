import React, {PropTypes} from 'react';
/* Material UI */
import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';
/* Pollider */
import TEXT_STYLE from '../../../../../public/theme/default/styles/text-style.js';
import {THEME} from '../../../../';

// The actual style object is derived from theme, text-style.js
const TEXTS = [
    {
        value: 0,
        label: 'Normal Text',
        style: 'NORMALTEXT'
   },
    {
        value: 1,
        label: 'Subtitle',
        style: 'SUBTITLE'
   },
    {
        value: 2,
        label: 'Heading 1',
        style: 'HEADING1'
   },
    {
        value: 3,
        label: 'Heading 2',
        style: 'HEADING2'
   },
];

const TEXT_STYLE_MAP = {
    STRIKETRHOUGH: {
        textDecoration: 'line-through'
   },
    ...TEXT_STYLE
};

class TextTypeControls extends React.Component {

    static propTypes = {

        editorState: React.PropTypes.object.isRequired,
        focus      : React.PropTypes.func.isRequired,
        onToggle   : React.PropTypes.func.isRequired

    };

    state = {
        value: 0
    }

    onChange (event, index, value) {
        event.preventDefault();
        this.props.onToggle(TEXTS[value].style);
        setTimeout(() => {
            console.log('focus');
            this.props.focus();
        }, 500);
    }

    render () {
        const currentStyle = this.props.editorState.getCurrentInlineStyle();
        let value = 0;

        TEXTS.map((type, key) => {
            if (currentStyle.has(type.style)) {
                value = key;
            }
        });

        return (

            <div
                className = "text-control-container"
                style = {{
                    display: this.props.display ? 'none': ''
                }}
            >
                <SelectField
                    value = {value}
                    onTouchTap = {(event) => {
                        event.preventDefault();
                    }}
                    onChange = {this.onChange.bind(this)}
                    labelStyle = {{
                        color: THEME.primaryColor
                    }}
                    style = {{
                        width: 150,
                        fontSize: 15
                    }}
                    underlineFocusStyle = {{
                        color: THEME.primaryColor
                    }}
                >
                    {
                        TEXTS.map((type, key) => {
                            return (
                                <MenuItem
                                    key = {type.label}
                                    value = {key}
                                    primaryText = {type.label}
                                />
                           );
                        })
                    }
                </SelectField>
            </div>
       );

    }

}

export {TEXTS, TEXT_STYLE_MAP, TextTypeControls};
