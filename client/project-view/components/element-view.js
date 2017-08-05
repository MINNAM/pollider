import React, {Component} from 'react';

import {SITE} from '../../global.js';
import FontAwesomeButton from '../../../public/theme/default/components/ui/buttons/font-awesome-button.js';

const RESERVES = [
    'abstract ',
    'else ',
    'instanceof ',
    'super ',
    'boolean ',
    'enum ',
    'int ',
    'switch ',
    'break ',
    'export ',
    'interface ',
    'synchronized ',
    'byte ',
    'extends ',
    'let ',
    'this ',
    'case ',
    'false ',
    'long ',
    'throw ',
    'catch ',
    'final ',
    'native ',
    'throws ',
    'char ',
    'finally ',
    'new ',
    'transient ',
    'class ',
    'float ',
    'null ',
    'true ',
    'const ',
    'for ',
    'package ',
    'try ',
    'continue ',
    'function ',
    'private ',
    'typeof ',
    'debugger ',
    'goto ',
    'protected ',
    'var ',
    'default ',
    'if ',
    'public ',
    'void ',
    'delete ',
    'implements ',
    'return ',
    'volatile ',
    'do ',
    'import ',
    'short ',
    'while ',
    'double ',
    'in ',
    'static ',
    'with '
];

const colorString = (str, color) => {
    return `<span style = 'color: ${color}'>${str}</span>`;
};

function highlightSyntax (code, colors = {
    string: '#FF9800', // orange
    object: '#E57373', // red
    function: '#00BCD4', // cyan
    reserve: '#64B5F6', // blue
    comment: '#9E9E9E' // grey
}) {
    // string
    code = code.replace(/['"].*['"]/g, (str) => {
        return colorString(str, colors.string );
    });
    // object
    code = code.replace(/[a-zA-Z][a-zA-Z0-9]*[.][a-zA-Z][a-zA-Z0-9]*/g, (str) => {
        return colorString(str.split('.')[0], colors.object) + '.' + str.split('.')[1]
    });
    // function
    code = code.replace(/[a-zA-Z][a-zA-Z0-9]*[ ]*[(]/g, (str) => {
        return colorString(str.replace( '(','' ), colors.function) + '(';
    });

    RESERVES.map((str) => {
        code = code.replace(new RegExp(str, 'g'), colorString(str, colors.reserve));
    })

    // Comments
    code = code.replace(/[\/][\/\*][^<]*[\*\/]+/g, (str) => {
        return colorString(str, colors.comment);
    });

    return code;
}


class ElementView extends Component {

    state = {
        contentModel: null
    }

    componentDidMount () {
        const {
            queueElement,
            model,
            setVerticalAlign
        } = this.props;
        const {
            element
        } = this.refs;

        if (element) {
            queueElement(element);
        }

        setTimeout(()=>{
            model.getPostById((contentModel) => {
                this.setState({ contentModel });

                if (model.type == 'image') {
                    setVerticalAlign('center');
                } else {
                    setVerticalAlign('top');
                }
            });
        },500);
    }

    componentWillReceiveProps (props, state) {
        const {
            model
        } = this.props;

        model.getPostById((contentModel) => {
            this.setState({ contentModel });
        });
    }

    render () {

        const {
            model,
            col,
            queueElement,
            handler = {},
            editor
        } = this.props;
        const {
            contentModel,
            toggleCode
        } = this.state;
        const {
            element,
            code
        } = this.refs;

        const _handler = handler.element ? handler.element : {};

        switch (model.type) {
            case 'image':
                let imageHandler = _handler.image ? _handler.image : {};
                let path;

                if (contentModel) {

                    let enlargeClassName = '';
                    let enlargeTimeout = null;
                    if ( imageHandler.enlarge ) {
                        if (imageHandler.enlarge.classNames) {
                            if (this.state.enlarge) {
                                enlargeClassName = imageHandler.enlarge.classNames.after;
                            } else {
                                enlargeClassName = imageHandler.enlarge.classNames.before;
                            }
                        }

                        if (imageHandler.enlarge.timeout) {
                            enlargeTimeout = imageHandler.enlarge.timeout;
                        }
                    }

                    return (
                        <div>
                            <div
                                style = {{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    height: '100%',
                                    width: '100%',
                                    // why regular col 100% and this has to be 50% while they are all table-cell
                                    alignItems: 'center',
                                    cursor: editor ? '' : 'zoom-in'
                                }}
                            >
                            <img
                                ref = 'element'
                                onLoad = {() => {
                                    queueElement(element);
                                }}
                                onClick = {() => {
                                    if ( imageHandler.enlarge ) {
                                        this.setState({enlargeDisplay: true });

                                        if (this.enlargeTimeout) {
                                            clearTimeout(this.enlargeTimeout);
                                        }

                                        this.enlargeTimeout = setTimeout(() => {
                                            this.setState({enlarge: true });
                                        }, 100)

                                    }
                                }}
                                src = { `/${ contentModel._hyperlink }` }
                                alt = { contentModel.data ? (contentModel.data[ 'Alt Text' ] ? contentModel.data[ 'Alt Text' ].content: ''): '' }
                                style = {{
                                    width: (col.padding * 100) + '%', // 70
                                }}
                            />
                            </div>
                            <div
                                className = {enlargeClassName}
                                style = {{
                                    display: this.state.enlargeDisplay ? 'inline-block' : 'none',
                                    cursor: 'zoom-out',
                                    zIndex: 100
                                }}
                                onClick = {() => {
                                    this.setState({enlarge: false});

                                    if (enlargeTimeout) {
                                        if (this.enlargeTimeout) {
                                            clearTimeout(this.enlargeTimeout);
                                        }

                                        this.enlargeTimeout = setTimeout(() => {
                                            this.setState({enlargeDisplay: false });
                                        }, enlargeTimeout)

                                    } else {
                                        this.setState({enlargeDisplay: false });
                                    }
                                }}
                            >
                                <img
                                    className = 'element'                                                                         
                                    onLoad = {() => {
                                        queueElement(element);
                                    }}
                                    src = { `/${ contentModel._hyperlink }` }
                                    alt = { contentModel.data ? (contentModel.data[ 'Alt Text' ] ? contentModel.data[ 'Alt Text' ].content: ''): '' }
                                />
                            </div>
                        </div>
                    );

                } else {
                    return <div></div>;
                }
            break;

            case 'code': {
                const lines = model.content.split(/\r\n|\r|\n/).length;
                const lineNumbers = [];

                for (let i = 0; i < lines; i++) {
                    lineNumbers.push(
                        <div
                            key = {i}
                        >
                            { i + 1}
                        </div>
                    );
                }

                const code = <div
                    className = {'code'}
                    ref = 'code'
                    style = {{
                        display: 'inline-block',
                        padding: 0,
                        fontFamily: 'monaco',
                        letterSpacing: '0px',
                        lineHeight: '21px',
                        fontSize: 14,
                        background: 'rgb(245,245,245)',
                        width: '100%',
                        padding: 15
                    }}
                >
                    <div
                        style = {{
                            width: '100%',
                            float: 'left',
                            fontFamily: 'monaco',
                            lineHeight: '21px !important',
                        }}
                        dangerouslySetInnerHTML = {{
                            __html: highlightSyntax(model.content)
                        }}
                    >
                    </div>
                </div>

                return (
                    <div
                        ref = 'element'
                    >
                        <div
                            style = {{
                                display: 'inline-block',
                                width: '100%',
                                transition: '0.5s all',
                            }}
                        >
                            { code }
                        </div>
                    </div>
                );
            }

            default:
                return (
                    <div
                        ref = 'element'
                        style = {{
                            float: 'none',
                            display: 'table-cell',
                            verticalAlign: 'top'
                        }}
                        dangerouslySetInnerHTML = {{ __html: model.content }}
                    />

                );
        }
    }

}

export default ElementView;
