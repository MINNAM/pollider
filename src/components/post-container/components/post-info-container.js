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

import PostPreview from  './post-preview.js';

const fieldNames = {

    'name'          : 'Name',
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

        this.state = {

            status : null

        };

    }

    handleStatus ( event, index, value ) {

        this.props.model.status = value;
        this.props.parentModel.updatePost( this.props.model );

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

                if ( fieldNames[ key ] && model[ key ] !== null ) {

                    switch ( fieldNames[ key ] ) {

                        case 'Name' :

                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ fieldNames[ key ] }</span>
                                    <span
                                        className  = {'value'}
                                        style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                        onTouchTap = { () => {

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
                                                        this.props.parentModel.updatePost( this.props.model );

                                                    }

                                                }

                                            });

                                        }}
                                    >
                                        { model[ key ] }
                                    </span>

                                </span>

                            );
                            break;

                        case 'Status' :

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ fieldNames[ key ] }</span>
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
                                    <span className = { 'field' }>{ fieldNames[ key ] }</span>
                                    <span
                                        className  = { 'value' }
                                        style      = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                        onTouchTap = { () => {

                                            this.props.handleActionDialogOpen({

                                                actionModel : [
                                                    {
                                                        title    : 'Change Public Date' ,
                                                        subtitle : {
                                                            pre    : 'Change ',
                                                            middle : self.props.model.name,
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

                                        }}
                                    >
                                            { M.getDateTime( this.props.model.public_date ) }
                                    </span>
                                </span>

                            );
                            break;

                        case 'Size' :
                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ fieldNames[ key ] }</span>
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
                                    <span className = { 'field' }>{ fieldNames[ key ] }</span>
                                    <span className = { 'value' }>{ M.getDateTime( this.props.model.created_date ) }</span>
                                </span>

                            );

                            break;

                        case 'Modified Date':

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ fieldNames[ key ] }</span>
                                    <span className = { 'value' }>{ M.getDateTime( this.props.model.modified_date ) }</span>
                                </span>

                            );

                            break;


                        default :

                            fields.push(

                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ fieldNames[ key ] }</span>
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
                                                onTouchTap = { self.props.handleProjectEditor }
                                                style = {{ fontWeight: 'bold', cursor: 'pointer', color: CONFIG.theme.primaryColor }}
                                            >
                                                { "Click here to edit" }
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
                                                onTouchTap = { () => {

                                                    self.props.handleActionDialogOpen({

                                                        actionModel : [
                                                            {
                                                                title    : 'Edit ' + model.data[ key ].field,
                                                                subtitle : {
                                                                    pre    : 'Enter ',
                                                                    middle : self.props.model.name,
                                                                    post   : "'s New " + model.data[ key ].field
                                                                },
                                                                field    : 'content',
                                                                dataType : 'text',
                                                                default  : model.data[ key ].content
                                                            }

                                                        ],

                                                        actions : {

                                                            execute : ( data ) => {

                                                                model.data[ key ].content = data.content;

                                                                self.props.parentModel.updatePost( self.props.model );

                                                            }

                                                        }

                                                    });

                                                }}
                                            >
                                                { model.data[ key ].content == '' ? 'Click here to edit' : model.data[ key ].content }
                                            </span>
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
                        model = { model }
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
