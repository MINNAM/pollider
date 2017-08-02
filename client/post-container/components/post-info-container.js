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

        for (let key in postMeta) {
            if (postMeta[key].main) {
                mainEdit = postMeta[key].data_type;
                for (let key2 in model.data) {
                    if (key == model.data[key2].field) {
                        setMainEdit(() => {
                            this.handleDialogModel(postMeta[model.data[key2].field].data_type, key2);
                        });
                    }
                }
            }
        }
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

    handleDialogModel (key, key2) {
        const {
            openDialog,
            model,
            parentModel,
            postTypes,
        } = this.props;

        switch (key) {
            case 'Name':
                openDialog({
                    fields: [
                        {
                            title: 'Rename',
                            subtitle: {
                                pre: 'Enter ',
                                middle: model.name,
                                post: "'s new name"
                            },
                            field: 'name',
                            dataType: 'debounce-text',
                            model,
                            parentModel
                        }
                   ],
                    actions: {
                        execute: (data) => {
                            console.log(data);
                            model.name = data.name.value;
                            model.hyperlink = formatHyperlink(data.name.value);
                            parentModel.updatePost(model);
                        }
                    }
                });
            break;

            case 'Public Date':
                openDialog({
                    fields: [
                        {
                            title: 'Change Public Date' ,
                            subtitle: {
                                pre: 'Change ',
                                middle: model.name,
                                post: "'s New Public Date "
                            },
                            field: 'public_date',
                            dataType: 'date',
                            default: model.public_date
                        }
                   ],
                    actions: {
                        execute: (data) => {

                            const defaultDate = new Date(model.public_date);
                            const defaultTime = `${defaultDate.getHours()}:${defaultDate.getMinutes()}:${defaultDate.getSeconds() < 10 ? 0 : ''}${defaultDate.getSeconds()}`;

                            const _data = {};

                            if (!data.public_date) {
                                _data.public_date = defaultDate
                            } else {
                                _data.public_date = data.public_date;
                            }

                            if (!data.time) {
                                _data.time = defaultTime
                            } else {
                                _data.time = data.time.value;
                            }

                            let newDate = new Date(_data.public_date);
                            const newTime = _data.time.split(':');

                            newDate = new Date(newDate.setHours(newTime[0], newTime[1], newTime[2]));

                            model.public_date = newDate.toISOString();
                            parentModel.updatePost(model);
                        }
                    }
                });
            break;

            case 'text':
                this.props.openDialog({
                    fields: [
                        {
                            title: `Edit ${model.data[key2].field}`,
                            subtitle: {
                                pre: 'Enter ',
                                middle: model.name,
                                post: `'s New ${model.data[key2].field}`
                            },
                            field: 'content',
                            dataType: 'text',
                            default: model.data[key2].content
                        }
                   ],
                    actions: {
                        execute: (data) => {
                            model.data[key2].content = data.content.value;
                            parentModel.updatePost(model);
                        }
                    }
                });
            break;

            case 'project':
                this.props.handleProjectEditor();
            break;

            case 'post-container':
                let data = model.data[key2].content != '' ? model.data[key2].content : null;

                if (data) {
                    data = JSON.parse(data);
                }
                this.props.openDialog({
                    fields: [
                        {
                            dataType: 'post-container',
                            postTypes: postTypes.postTypes,
                            postDataTypes: this.props.postDataTypes,
                            selected: data ? data.id : null,
                            post_type_id: data ? data.post_type_id : null
                        }
                   ],
                    actions: {
                        execute: (_data) => {
                            const children = [];

                            for (let key in _data[0].value.children ) {
                                children.push(key);
                            }

                            model.data[key2].content = JSON.stringify({
                                post_type_id: _data[0].value.post_type_id,
                                id: _data[0].value.id,
                                children
                            });

                            parentModel.updatePost(model);
                        },
                    },
                    style: {
                        dialog: {
                            width: '50%',
                            height: 'calc(100% - 50px)',
                            top: 50
                        },
                        content: {
                            width: '95%',
                            height: '80%'
                        },
                    }
                });

            break;
        }
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
                                            this.handleDialogModel(FIELD_NAMES[key]);
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
                                                console.log( value );
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
                                            this.handleDialogModel('Public Date');
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
                                                    this.handleDialogModel(postMeta[model.data[key].field].data_type);
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
                                                    this.handleDialogModel(this.props.postMeta[model.data[key].field].data_type, key);
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
                                                    this.handleDialogModel(this.props.postMeta[model.data[key].field].data_type, key)
                                                }}
                                            >
                                                {data ? data.id: 'Click here to edit'}
                                            </span>
                                        </span>
                                    );
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
