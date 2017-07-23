import React, {Component} from 'react';

import {SITE} from '../../global.js';
import FontAwesomeButton from '../../../public/theme/default/components/ui/buttons/font-awesome-button.js';

class ElementView extends Component {

    state = {
        contentModel: null
    }

    constructor (props) {

        console.log( 'elements') ;
        super(props);

        const {
            model,
            setVerticalAlign
        } = this.props;

        model.getPostById((contentModel) => {
            this.setState({ contentModel });

            if (model.type == 'image') {
                setVerticalAlign('center');
            } else {
                setVerticalAlign('top');
            }
        });
    }

    componentDidMount () {
        const {
            queueElement
        } = this.props;
        const {
            element
        } = this.refs;

        if (element) {
            queueElement(element);
        }
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
            queueElement
        } = this.props;
        const {
            contentModel,
            toggleCode
        } = this.state;
        const {
            element,
            code
        } = this.refs;

        switch (model.type) {
            case 'image':
                let path;

                if (contentModel) {
                    return (
                        <div>
                            <div
                                style = {{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    height: '100%',
                                    width: '100%',
                                    // why regular col 100% and this has to be 50% while they are all table-cell
                                    alignItems: 'center'
                                }}
                            >
                            {
                                <img
                                    ref = 'element'
                                    onLoad = {() => {
                                        queueElement(element);
                                    }}
                                    src = { `${SITE.url}/${ contentModel._hyperlink }` }
                                    alt = { contentModel.data ? (contentModel.data[ 'Alt Text' ] ? contentModel.data[ 'Alt Text' ].content: ''): '' }
                                    style = {{
                                        // margin: '0 auto',
                                        // // top: '50%',
                                        // // left: '50%',
                                        // // transform: 'translate(-50%,-50%)'
                                        width: (col.padding * 100) + '%', // 70
                                    }}
                                />
                            }
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
                    className = { 'code' }
                    ref = 'code'
                    style = {{
                        display: 'inline-block',
                        color: 'rgb(220,220,220)',
                        padding: '5px 20px 5px 5px',
                        fontFamily: 'monaco',
                        letterSpacing: '0px',
                        lineHeight: '21px',
                        fontSize: 14,
                        width: 500,
                        position: 'absolute'
                    }}
                >
                    <div
                        style = {{
                            width: 25,
                            float: 'left',
                            textAlign: 'right',
                            fontFamily: 'monaco',
                            lineHeight: '21px',
                            color: 'rgb(160,160,160)',
                        }}
                    >
                    {
                        lineNumbers
                    }
                    </div>
                    <div
                        style = {{
                            width: 'calc(100% - 25px)',
                            float: 'left',
                            paddingLeft: 20,
                            fontFamily: 'monaco',
                            lineHeight: '21px !important',
                        }}
                        dangerouslySetInnerHTML = {{ __html: model.content }}
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
                                height: toggleCode ? 'initial' : 310,
                                overflow: 'hidden',
                                transition: '0.5s all'
                            }}
                        >
                            <div
                                style = {{
                                    // width: '100%',
                                    display: 'block',
                                    overflow: 'auto',
                                    height: code ? code.offsetHeight : 200,
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                    width: '100%',
                                    background: 'rgb(0, 14, 29)',
                                }}
                            >
                                { code }
                            </div>
                            <FontAwesomeButton
                                className   = { toggleCode ? 'fa-angle-up': 'fa-angle-down' }
                                size        = { 28 }
                                iconStyle   = {{
                                    color: 'rgb(76, 211, 173)'
                                }}
                                hoverStyle  = {{ color: 'rgb(60,60,60)' }}
                                parentStyle = {{
                                    left: '50%',
                                    bottom: 10,
                                    transform: 'translate(-50%, 0)',
                                    position: 'absolute',
                                }}
                                onClick = {() => {
                                    this.setState({
                                        toggleCode: !toggleCode
                                    })
                                }}
                            />
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
