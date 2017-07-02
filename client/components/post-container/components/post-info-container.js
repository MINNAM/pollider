import React from 'react';

/* Material UI */
import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

/* Pollider */
import M      from '../../../models/m.js';
import CONFIG from '../../../models/m-config.js';
import { formatHyperlink } from '../models/utility.js';
import PostPreview from  './post-preview.js';

const FIELD_NAMES = {

    'name'          : 'Name',
    'hyperlink'     : 'Hyperlink',
    'size'          : 'Size',
    'status'        : 'Status',
    'public'        : 'Public',
    'public_date'   : 'Public Date',
    'created_date'  : 'Created Date',
    'modified_date' : 'Modified Date'

};

class PostInfoContainer extends React.Component {

    constructor ( props ) {

        super ( props );

        const { postMeta, model } = this.props;

        let mainEdit;

        for ( let key in postMeta ) {

            if ( postMeta[ key ].main ) {

                mainEdit = postMeta[ key ].data_type;
// data_type
                for ( let key2 in model.data ) {

                    if ( key == model.data[ key2 ].field ) {

                        this.props.setMainEdit( () => {

                            this.handleActionDialog( postMeta[ model.data[ key2 ].field ].data_type, key2 );

                        })

                    }

                }

            }

        }

        this.state = {

            status : null

        };

    }

    handleStatus ( event, index, value ) {

        this.props.model.status = value;
        this.props.parentModel.updatePost( this.props.model );

    }

    handleActionDialog ( key, key2 ) {

        switch ( key ) {

            case 'Name' :
                this.props.handleActionDialogOpen({

                    actionModel : [
                        {

                            title    : 'Rename',
                            subtitle : {
                                pre : 'Enter ',
                                middle : this.props.model.name,
                                post  : "'s new name"
                            },
                            field    : 'name',
                            dataType : 'debounce-text',
                            model    : this.props.model,
                            parentModel : this.props.parentModel

                        }
                    ],

                    actions : {

                        execute : ( data ) => {


                            this.props.model.name = data.name;
                            this.props.model.hyperlink = formatHyperlink( data.name );

                            this.props.parentModel.updatePost( this.props.model );

                        }

                    }

                });
            break;

            case 'Public Date':
                this.props.handleActionDialogOpen({

                    actionModel : [
                        {
                            title    : 'Change Public Date' ,
                            subtitle : {
                                pre    : 'Change ',
                                middle : this.props.model.name,
                                post   : "'s New Public Date "
                            },
                            field : 'public_date',
                            dataType : 'date'
                        }

                    ],

                    actions : {

                        execute : ( data ) => {

                            this.props.model.public_date = data.public_date;

                            this.props.parentModel.updatePost( this.props.model );

                        }

                    }

                });

            break;

            case 'text' :
                this.props.handleActionDialogOpen({

                    actionModel : [
                        {
                            title    : 'Edit ' + this.props.model.data[ key2 ].field,
                            subtitle : {
                                pre    : 'Enter ',
                                middle : this.props.model.name,
                                post   : "'s New " + this.props.model.data[ key2 ].field
                            },
                            field    : 'content',
                            dataType : 'text',
                            default  : this.props.model.data[ key2 ].content
                        }

                    ],

                    actions : {

                        execute : ( data ) => {

                            this.props.model.data[ key2 ].content = data.content;

                            this.props.parentModel.updatePost( this.props.model );

                        }

                    }

                });

            break;

            case 'project' :
                this.props.handleProjectEditor();
            break;

            case 'post-container' :

                let data = this.props.model.data[ key2 ].content != '' ? this.props.model.data[ key2 ].content : null ;

                if ( data ) {

                    data = JSON.parse( data );

                }
                this.props.handleActionDialogOpen({

                    actionModel : [

                        {
                            dataType : 'post-container',
                            postTypes : this.props.postTypes.postTypes,
                            selected  : data ? data.id : null,
                            post_type_id : data ? data.post_type_id : null

                        }

                    ],
                    actions : {

                        execute : ( _data ) => {

                            const children = [];

                            for ( let key in _data.children  ) {

                                children.push( key );

                            }

                            this.props.model.data[ key2].content = JSON.stringify({
                                post_type_id : _data.post_type_id,
                                id : _data.id,
                                children
                            });

                            this.props.parentModel.updatePost( this.props.model );

                        },

                        update :  ( _data ) => {


                            // self.setState({
                            //
                            //     preview : self.props.model
                            //
                            // });

                        }

                    },

                    actionStyle : {

                        dialogStyle   : {

                            width  : '50%',
                            height : 'calc( 100% - 50px)',
                            top    : 50

                        },
                        contentStyle : {

                            width  : '95%',
                            height : '80%'

                        },

                    }

                });

            break;

        }

    }

    render () {

        const self = this;
        let model  = this.props.model;

        if ( Object.prototype.toString.call( this.props.model ) == '[object Array]' ) {

            return (

                <div className = {'post-info'}></div>

            );

        } else {

            const fields = [];


            for ( let key in model ) {

                if ( this.props.filterList.indexOf( key ) > -1 ) {

                    continue;

                }

                if ( FIELD_NAMES[ key ] && model[ key ] !== null ) {

                    switch ( FIELD_NAMES[ key ] ) {

                        case 'Name' :

                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ FIELD_NAMES[ key ] }</span>
                                    <span
                                        className  = {'value'}
                                        style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                        onTouchTap = { () => { this.handleActionDialog( FIELD_NAMES[ key ] ) }}
                                    >
                                        { model[ key ] }
                                    </span>

                                </span>

                            );
                            break;

                        case 'Hyperlink' :

                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ FIELD_NAMES[ key ] }</span>
                                    <span
                                        className  = {'value'}
                                        onTouchTap = { () => {} }
                                    >
                                        <a
                                            target = {'_blank'}
                                            href = { `${CONFIG.backendUrl}${model.postContainerHyperlink}/${model._hyperlink}`}
                                            style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                        >
                                        { model[ key ] }
                                        </a>
                                    </span>

                                </span>

                            );
                            break;

                        case 'Status' :

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ FIELD_NAMES[ key ] }</span>
                                    <span className = {'value'}>
                                        <RadioButtonGroup
                                            name          = 'status'
                                            valueSelected = { model[ key ] }
                                            onChange      = { ( event, value ) => {

                                                this.props.model.status = value;
                                                this.props.parentModel.updatePost( this.props.model );

                                            }}
                                        >
                                            <RadioButton
                                                viewBox    = '0 0 20 10'
                                                labelStyle = {{ fontSize: 12 }}
                                                value      = { 'public' }
                                                label      = { 'Public' }
                                            />
                                            <RadioButton
                                                viewBox    = '0 0 20 10'
                                                labelStyle = {{ fontSize: 12 }}
                                                value      = { 'private' }
                                                label      = { 'Private' }
                                            />
                                            <RadioButton
                                                viewBox    = '0 0 20 10'
                                                labelStyle = {{ fontSize: 12 }}
                                                value      = { 'hidden' }
                                                label      = { 'Hidden' }
                                            />
                                        </RadioButtonGroup>
                                    </span>
                                </span>

                            );

                            break;

                        case 'Public Date' :

                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ FIELD_NAMES[ key ] }</span>
                                    <span
                                        className  = { 'value' }
                                        style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                        onTouchTap = { () => { this.handleActionDialog( 'Public Date') } }
                                    >
                                            { M.getDateTime( this.props.model.public_date ) }
                                    </span>
                                </span>

                            );
                            break;

                        case 'Size' :
                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ FIELD_NAMES[ key ] }</span>
                                    <span className = { 'value' }>{

                                        function ( value ) {

                                            if ( value < 0  ) {

                                                return '-';

                                            }

                                            if ( value < 1000  ) {

                                                return value + ' Bytes';

                                            } else if ( value >= 1000 && value <= 100000 ) {

                                                return Math.round( value / 1000 ) + ' KB';

                                            } else if ( value >= 100000 && value <= 1000000000 ) {

                                                return Math.round( value / 1000000 ) + ' MB';

                                            } else if ( value >= 1000000000 && value <= 100000000000 ) {

                                                return Math.round( value / 100000000 ) + ' GB';

                                            }

                                        }( model[ key ] )

                                    }</span>
                                </span>
                            );
                            break;

                        case 'Created Date':

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ FIELD_NAMES[ key ] }</span>
                                    <span className = { 'value' }>{ M.getDateTime( this.props.model.created_date ) }</span>
                                </span>

                            );

                            break;

                        case 'Modified Date':

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ FIELD_NAMES[ key ] }</span>
                                    <span className = { 'value' }>{ M.getDateTime( this.props.model.modified_date ) }</span>
                                </span>

                            );

                            break;


                        default :

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ FIELD_NAMES[ key ] }</span>
                                    <span className = {'value'}>{ model[ key ] }</span>
                                </span>

                            );

                            break;

                    }

                }

            }

            if ( model[ 'data' ] ) {

                for ( let key in model.data ) {

                    ( function ( key ) {

                        if ( self.props.postMeta[ model.data[ key ].field ] ) {

                            switch ( self.props.postMeta[ model.data[ key ].field ].data_type ) {

                                case 'project' :

                                    fields.push (
                                        <span className = { 'post-info-field-container' } key = { key }>
                                            <span className = { 'field' }>{ model.data[ key ].field }</span>
                                            <span className = {'value'}
                                                onTouchTap = { () => { self.handleActionDialog( self.props.postMeta[ model.data[ key ].field ].data_type ) }}
                                                style = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                            >
                                                { "Click here to edit" }
                                            </span>
                                        </span>
                                    );

                                    break;

                                case 'select' :

                                    let items = self.props.postMeta[ model.data[ key ].field ].data;

                                    console.log( 'select', items[0], model.data[ key ] );

                                    fields.push (
                                        <span className = { 'post-info-field-container' } key = { key }>
                                            <span className = { 'field' }>{ model.data[ key ].field }</span>
                                            <span className = {'value'}
                                                style = {{
                                                    paddingBottom : 0
                                                }}
                                            >
                                                <SelectField
                                                    style = {{
                                                        height : 47,
                                                        fontSize : 12,
                                                        display : 'inline',
                                                        fontWeight : 'bold'
                                                    }}
                                                    labelStyle = {{ color : CONFIG.theme.primaryColor }}
                                                    value = { parseInt( model.data[ key ].content ) ? parseInt( model.data[ key ].content ) : items[ 0 ].value }
                                                    onChange = { ( event, index, value ) => {

                                                        model.data[ key ].content = value;

                                                        self.props.parentModel.updatePost( model );


                                                    }}
                                                >
                                                    {
                                                        items.map(( element, _key ) => {

                                                            console.log(model.data[ key ].content == element.value, model.data[ key ].content, element.value )

                                                            return (

                                                                <MenuItem
                                                                    key = { _key }
                                                                    primaryText = { element.name }
                                                                    value = { element.value }

                                                                />
                                                            )

                                                        })
                                                    }


                                                </SelectField>
                                            </span>


                                        </span>
                                    );

                                    break;

                                case 'text' :

                                    fields.push(
                                        <span className = { 'post-info-field-container' } key = { key }>
                                            <span className = {'field'}>{ model.data[ key ].field }</span>
                                            <span
                                                className  = {'value'}
                                                style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                                onTouchTap = { () => { self.handleActionDialog( self.props.postMeta[ model.data[ key ].field ].data_type, key ) }}
                                            >
                                                { model.data[ key ].content == '' ? 'Click here to edit' : model.data[ key ].content }
                                            </span>
                                        </span>
                                    );
                                    break;

                                case 'post-container' :

                                    let data = model.data[ key ].content != '' ? model.data[ key ].content : null ;

                                    if ( data ) {

                                        data = JSON.parse( data );

                                    }

                                    fields.push(
                                        <span
                                            className = { 'post-info-field-container' }
                                            key = { key }
                                        >
                                            <span className = { 'field' }>{ model.data[ key ].field }</span>
                                            <span
                                                className  = { 'value' }
                                                style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                                onTouchTap = {() => { self.handleActionDialog( self.props.postMeta[ model.data[ key ].field ].data_type, key )}}

                                            >{ data ? data.id : 'Click here to edit' }</span>
                                        </span>
                                    );
                                    break;

                                default :

                                    fields.push(

                                        <span className = { 'post-info-field-container' } key = { key }>
                                            <span className = { 'field' }>{ model.data[ key ].field }</span>
                                            <span className = { 'value' }>{ model.data[ key ].content }</span>
                                        </span>

                                    );
                                    break;

                            }

                        } else {

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ model.data[ key ].field }</span>
                                    <span className = { 'value' }>{ model.data[ key ].content }</span>
                                </span>

                            );

                        }

                    })( key );

                }

            }

            return (

                <div>
                    <PostPreview
                        update    = { this.props.updatePreview }
                        model     = { model }
                        hyperlink = { this.props.hyperlink }
                    />
                    <div className = {'post-info'}>
                        { fields }
                    </div>
                </div>

            );

        }

    }

}

export default PostInfoContainer;
