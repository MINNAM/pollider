import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';
import TEXT_STYLE from '../../../../../../public/theme/default/text-style.js';

var TEXTS = [

    { value : 0, label : 'Normal Text', style : 'NORMALTEXT' },
    { value : 1, label : 'Subtitle'  , style: 'SUBTITLE'},
    { value : 2, label : 'Heading 1', style: 'HEADING1'},
    { value : 3, label : 'Heading 2', style: 'HEADING2'},

];


const textStyleMap = {

    STRIKETRHOUGH : {
        textDecoration : 'line-through'
    },

    ...TEXT_STYLE
};

class TextTypeControls extends React.Component {


    constructor ( props ) {

        super( props );

        this.state = { value : 0 };

    }

    onChange ( event, index, value ) {

        this.props.focus();
        this.props.onToggle( TEXTS[ value ].style );

    }

    render () {

        const currentStyle = this.props.editorState.getCurrentInlineStyle();
        let value = 0;

        TEXTS.map( ( type, key ) => {

            if ( currentStyle.has( type.style ) ) {

                value = key;

            }

        });

        return (

            <div
                className = "text-control-container"
                style = {{
                    display : this.props.display ? 'none' : ''
                }}
            >
                <SelectField
                    value      = { value }
                    onTouchTap = { ( event ) => { event.preventDefault(); }}
                    onChange   = { this.onChange.bind( this ) }
                    style = {{
                        width: 150,
                        fontSize : 15
                    }}
                >

                    {

                        TEXTS.map( ( type, key  ) => {

                            return (

                                <MenuItem
                                    key         = { type.label }
                                    value       = { key }
                                    primaryText = { type.label }
                                />

                            );

                        })

                    }
                </SelectField>
            </div>
        );

    }

}

TextTypeControls.propTypes = {

    editorState : React.PropTypes.object.isRequired,
    focus       : React.PropTypes.func.isRequired,
    onToggle    : React.PropTypes.func.isRequired

};

export { TEXTS, textStyleMap, TextTypeControls };
