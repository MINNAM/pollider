import React, {Component} from 'react';
/* Material UI */
import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

/* Pollider */
import {
    SITE,
    THEME,
    shortMonthNames,
    fullMonthNames,
    formatHyperlink
} from '../../global.js';
import PostPreview from  './post-preview.js';

const FIELD_NAMES = {
    'name': 'Name',
    'hyperlink': 'Hyperlink',
    'size': 'Size',
    'status': 'Status',
    'public': 'Public',
    'public_date': 'Public Date',
    'created_date': 'Created Date',
    'modified_date': 'Modified Date'
};

class PostInfoContainer extends Component {

    state = {
        status: null
    }

    componentDidMount () {

        const {
            model,
            postMeta,
            setMainEdit
        } = this.props;

        let mainEdit;

    }

    componentWillReceiveProps () {

    }

    getDate (unformattedDate) {
        const dateObject = new Date(unformattedDate);

        return shortMonthNames[dateObject.getMonth()] + ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear();
    }

    getDateTime ( unformattedDate ) {
        const dateObject = new Date(unformattedDate);

        return (
            fullMonthNames[ dateObject.getMonth() ] + ' ' +
            dateObject.getDate() + ', ' +
            dateObject.getFullYear() + ' ' +
            (dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours()) + ':' +
            (dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes()) + ':' +
            (dateObject.getSeconds() < 10 ? '0' + dateObject.getSeconds() : dateObject.getSeconds())
        );
    }

    handleStatus (event, index, value) {
        const {
            model,
            parentModel
        } = this.props;
        model.status = value;
        parentModel.updatePost(model);
    }



    render () {
        const {
            model,
            filterList,
            postMeta,
            updatePreview
        } = this.props;

        if (Object.prototype.toString.call(model) == '[object Array]') {
            return (
                <div className = {'post-info'}></div>
           );
        } else {
            const fields = [];

            for (let key in model) {
                if (filterList.indexOf(key) > -1) {
                    continue;
                }

                if (FIELD_NAMES[key] && model[key] !== null) {
                    switch (FIELD_NAMES[key]) {
                        case 'Name':
                            fields.push(
                                <span
                                    className = {'post-info-field-container'}
                                    key = {key}
                                >
                                    <span className = {'field'}>
                                        {FIELD_NAMES[key]}
                                    </span>
                                    <span
                                        className = {'value'}
                                        style = {{
                                            color: THEME.primaryColor ,
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                         }}
                                        onClick = {() => {
                                            this.props.handleDialogModel(FIELD_NAMES[key]);
                                        }}
                                    >
                                        {model[key]}
                                    </span>
                                </span>
                            );
                            break;

                        case 'Hyperlink':
                            fields.push(
                                <span
                                    className = {'post-info-field-container'}
                                    key = {key}
                                >
                                    <span
                                         className = {'field'}
                                    >
                                        {FIELD_NAMES[key]}
                                    </span>
                                    <span
                                        className = {'value'}
                                    >
                                        <a
                                            target = {'_blank'}
                                            href = { `/${model.postContainerHyperlink ? model.postContainerHyperlink + '/' : ''}${model._hyperlink}`}
                                            style = {{
                                                color: THEME.primaryColor,
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {model[key]}
                                        </a>
                                    </span>
                                </span>
                            );
                            break;

                        case 'Status':
                            fields.push(
                                <span
                                    className = { 'post-info-field-container' }
                                    key = { key }
                                >
                                    <span
                                        className = {'field'}
                                    >
                                        {FIELD_NAMES[key]}
                                    </span>
                                    <span
                                        className = {'value'}
                                    >
                                        <RadioButtonGroup
                                            name = 'status'
                                            valueSelected = {model[key]}
                                            onChange = {(event, value) => {
                                                model.status = value;
                                                // parentModel.updatePost(model);
                                                this.props.parentModel.updatePost(model);
                                            }}
                                        >
                                            <RadioButton
                                                viewBox = '0 0 20 10'
                                                labelStyle = {{ fontSize: 12 }}
                                                value = { 'public' }
                                                label = { 'Public' }
                                            />
                                            <RadioButton
                                                viewBox = '0 0 20 10'
                                                labelStyle = {{ fontSize: 12 }}
                                                value = { 'private' }
                                                label = { 'Private' }
                                            />
                                            <RadioButton
                                                viewBox = '0 0 20 10'
                                                labelStyle = {{ fontSize: 12 }}
                                                value = { 'hidden' }
                                                label = { 'Hidden' }
                                            />
                                        </RadioButtonGroup>
                                    </span>
                                </span>
                            );
                            break;

                        case 'Public Date':
                            fields.push(
                                <span
                                    className = {'post-info-field-container'}
                                    key = {key}
                                >
                                    <span
                                        className = {'field'}
                                    >
                                        {FIELD_NAMES[key]}
                                    </span>
                                    <span
                                        className = { 'value' }
                                        style = {{
                                            color: THEME.primaryColor,
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                        onClick = {() => {
                                            this.props.handleDialogModel('Public Date');
                                        }}
                                    >
                                        { this.getDateTime(model.public_date) }
                                    </span>
                                </span>
                           );
                            break;

                        case 'Size':
                            fields.push(
                                <span
                                    className = {'post-info-field-container'}
                                    key = {key}
                                >
                                    <span
                                        className = {'field'}>
                                        { FIELD_NAMES[key] }
                                    </span>
                                    <span
                                        className = { 'value' }
                                    >
                                        {
                                            ((size) => {
                                                if (size < 0 ) {
                                                    return '-';
                                                }
                                                if (size < 1000 ) {
                                                    return size + ' Bytes';
                                                } else if (size >= 1000 && size <= 100000) {
                                                    return Math.round(size / 1000) + ' KB';
                                                } else if (size >= 100000 && size <= 1000000000) {
                                                    return Math.round(size / 1000000) + ' MB';
                                                } else if (size >= 1000000000 && size <= 100000000000) {
                                                    return Math.round(size / 100000000) + ' GB';
                                                }
                                            })(model[key])
                                        }
                                    </span>
                                </span>
                            );
                            break;

                        case 'Created Date':
                            fields.push(
                                <span
                                    className = {'post-info-field-container'}
                                    key = {key}
                                >
                                    <span
                                        className = {'field'}
                                    >
                                        {FIELD_NAMES[key]}
                                    </span>
                                    <span
                                        className = {'value'}
                                    >
                                        {this.getDateTime(model.created_date)}
                                    </span>
                                </span>
                           );
                            break;

                        case 'Modified Date':
                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = { 'field' }>{ FIELD_NAMES[key] }</span>
                                    <span className = { 'value' }>{ this.getDateTime(model.modified_date) }</span>
                                </span>
                            );
                            break;

                        default:
                            fields.push(
                                <span className = { 'post-info-field-container' } key = { key }>
                                    <span className = {'field'}>{ FIELD_NAMES[key] }</span>
                                    <span className = {'value'}>{ model[key] }</span>
                                </span>

                            );
                            break;
                    }
                }
            }

            if (model['data']) {
                for (let key in model.data) {
                    ((key) => {
                        if (postMeta[model.data[key].field]) {
                            switch (postMeta[model.data[key].field].data_type) {
                                case 'project':
                                    if (this.props.allowEdit == true) {
                                        fields.push (
                                            <span
                                                className = {'post-info-field-container'}
                                                key = {key}
                                            >
                                                <span
                                                    className = { 'field' }
                                                >
                                                    {model.data[key].field}
                                                </span>
                                                <span
                                                    className = {'value'}
                                                    onTouchTap = {() => {
                                                        this.props.handleDialogModel(postMeta[model.data[key].field].data_type);
                                                    }}
                                                    style = {{
                                                        color: THEME.primaryColor,
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    { "Click here to edit" }
                                                </span>
                                            </span>
                                        );
                                    }
                                    break;

                                case 'select':
                                    const items = this.props.postMeta[model.data[key].field].data;

                                    fields.push (
                                        <span
                                            className = {'post-info-field-container'}
                                            key = { key }
                                        >
                                            <span
                                                className = { 'field' }>
                                                { model.data[key].field }
                                            </span>
                                            <span
                                                className = {'value'}
                                                style = {{
                                                    paddingBottom: 0
                                                }}
                                            >
                                                <SelectField
                                                    style = {{
                                                        display: 'inline',
                                                        fontWeight: 'bold',
                                                        height: 47,
                                                    }}
                                                    labelStyle = {{
                                                        color: THEME.primaryColor,
                                                        fontSize: 12,
                                                    }}
                                                    menuItemStyle = {{
                                                        fontSize: 12
                                                    }}
                                                    value = {parseInt(model.data[key].content) ? parseInt(model.data[key].content): items[0].value}
                                                    onChange = {(event, index, value) => {
                                                        model.data[key].content = value;
                                                        this.props.parentModel.updatePost(model);
                                                    }}
                                                >
                                                    {
                                                        items.map((element, _key) => {
                                                            return (
                                                                <MenuItem
                                                                    key = {_key}
                                                                    primaryText = {element.name}
                                                                    value = {element.value}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </SelectField>
                                            </span>
                                        </span>
                                    );
                                    break;

                                case 'text':
                                    fields.push(
                                        <span
                                            className = {'post-info-field-container'}
                                            key = { key }
                                        >
                                            <span
                                                className = {'field'}
                                            >
                                                {model.data[key].field }
                                            </span>
                                            <span
                                                className = {'value'}
                                                style = {{
                                                    color: THEME.primaryColor,
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                }}
                                                onTouchTap = {() => {
                                                    this.props.handleDialogModel(this.props.postMeta[model.data[key].field].data_type, key);
                                                }}
                                            >
                                                {model.data[key].content == '' ? 'Click here to edit': model.data[key].content}
                                            </span>
                                        </span>
                                    );
                                    break;

                                case 'post-container':
                                    let data = model.data[key].content != '' ? model.data[key].content: null;

                                    if (data) {
                                        data = JSON.parse(data);
                                    }

                                    if (this.props.allowEdit == true) {
                                        fields.push(
                                            <span
                                                className = {'post-info-field-container'}
                                                key = {key}
                                            >
                                                <span
                                                    className = { 'field' }
                                                >
                                                    {model.data[key].field}
                                                </span>
                                                <span
                                                    className = { 'value' }
                                                    style = {{
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        color: THEME.primaryColor
                                                    }}
                                                    onTouchTap = {() => {
                                                        this.props.handleDialogModel(this.props.postMeta[model.data[key].field].data_type, key)
                                                    }}
                                                >
                                                    {data ? data.id: 'Click here to edit'}
                                                </span>
                                            </span>
                                        );
                                    }

                                    break;

                                default:
                                    fields.push(
                                        <span
                                            className = { 'post-info-field-container' }
                                            key = {key}
                                        >
                                            <span
                                                className = { 'field' }
                                            >
                                                { model.data[key].field }
                                            </span>
                                            <span
                                                className = { 'value' }
                                            >
                                                { model.data[key].content }
                                            </span>
                                        </span>
                                    );
                                    break;
                            }

                        } else {
                            fields.push(
                                <span
                                    className = {'post-info-field-container'}
                                    key = {key}
                                >
                                    <span className = { 'field' }>{ model.data[key].field }</span>
                                    <span className = { 'value' }>{ model.data[key].content }</span>
                                </span>
                           );
                        }
                    })(key);
                }
            }

            return (
                <div>
                    <PostPreview
                        onPreviewLoad = {this.props.onPreviewLoad}
                        update = {updatePreview}
                        model = { model }
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
