import React from 'react';
import CONFIG from '../../../models/m-config.js';

import TEXT_STYLE from '../../../../public/theme/default/text-style.js';

class ElementView extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            contentModel : null
        }

        this.props.model.getPostById( ( contentModel ) => {

            this.setState({ contentModel });

        });

    }

    componentDidMount () {

        if ( this.refs.element ) {

            this.props.queueElement( this.refs.element );

        }

    }

    componentWillReceiveProps ( props, state ) {

        this.props.model.getPostById( ( contentModel ) => {

            this.setState({ contentModel });

        });

    }

    render () {

        const { model, col }   = this.props;
        const { contentModel } = this.state;

        switch ( model.type ) {

            case 'image' :

                let path;

                if ( contentModel ) {

                    return (

                        <div
                            className = { 'col-sm-' + col.width }
                            style = {{
                                height : '100%', marginBottom : 10,
                                float : 'none',
                                display : 'table-cell',
                                // why regular col 100% and this has to be 50% while they are all table-cell
                                verticalAlign: 'top',
                                position : 'relative'

                            }}
                        >
                            <div
                                style = {{
                                    justifyContent : 'center',
                                    display : 'flex',
                                    height : '100%',
                                    width : '100%',
                                    // why regular col 100% and this has to be 50% while they are all table-cell
                                    alignItems : 'center'
                                }}
                            >
                            {
                                <img
                                    ref = 'element'
                                    onLoad = { () => {
                                        this.props.queueElement( this.refs.element );
                                    }}
                                    src = { `${CONFIG.backendUrl}${ contentModel._hyperlink }` }
                                    alt = { contentModel.data ? ( contentModel.data[ 'Alt Text' ] ? contentModel.data[ 'Alt Text' ].content : '' ) : '' }
                                    style = {{
                                        // margin: '0 auto',
                                        // // top : '50%',
                                        // // left : '50%',
                                        // // transform : 'translate(-50%,-50%)'
                                        width : (col.padding * 100) + '%', // 70
                                    }}
                                />
                            }
                            </div>



                        </div>
                    );

                } else {

                    return (
                        <div></div>
                    )
                }


            break;

            default:
                return (
                    <div
                        ref = 'element'
                        className = { 'col-sm-' + col.width }
                        style = {{
                            width : '100%'
                        }}
                        dangerouslySetInnerHTML = {{ __html : model.content }}
                    />

                );

        }

    }





}

class ColView extends React.Component {

    constructor ( props ) {

        super( props );

    }

    componentDidMount () {

    }

    render () {

        const model = this.props.model;

        if ( model.element ) {

            return (
                <ElementView
                    col = { model }
                    model = { model.element }
                    queueElement = { this.props.queueElement }
                />
            )
        }

        return (

            <div
                className = { 'col-sm-' + model.width }
                style = {{
                    float : 'none',
                    display : 'table-cell',
                    verticalAlign: 'top',
                    width : '50%'
                }}

            >
            {
                model.rows.map( ( row, key )=> {

                    return (

                        <RowView key = { key } model = { row }/>

                    );

                })
            }
            </div>
        );

    }



};

class RowView extends React.Component {

    constructor ( props ) {

        super( props );

        this.state = {

            elements : [],
            loaded : false

        };

    }

    componentDidMount () {

        this.setState({

            loaded : true

        });


    }

    getHeight() {

        const elements = this.state.elements;

        if ( elements.length == 0 ) {

            return '50%';

        }

        const sorted = elements.sort( ( a, b ) => {

            return b.offsetHeight - a.offsetHeight;

        });


        return sorted[ 0 ].offsetHeight;


    }

    render () {

        const model = this.props.model;



        return (
            <div
                className = { 'row' }
                style     = {{
                    display : 'table',
                    width : '100%'
                }}
            >

            {
                model.cols.map( ( col, key)=> {

                    return (

                        <ColView
                            key   = { key }
                            index = { key }
                            model = { col }
                            queueElement = { ( element ) => {

                                let elements = this.state.elements;

                                elements[ key ] = element;

                                this.setState({

                                    elements : elements

                                });

                            }}

                        />

                    );

                })
            }
            </div>
        );

    }



};

class ProjectPreview extends React.Component {

    constructor ( props ) {

        super( props );



    }

    render () {

        return (

            <div
                className = 'project-preview'
                style = {{
                    background : 'white',
                    ...this.props.style,
                    ...TEXT_STYLE[ 'NORMALTEXT' ]
                }}
            >
            {

                this.props.model.rows.map( ( row, rowKey ) => {

                    return (
                        <RowView key = { rowKey } model = { row } />
                    );

                })
            }
            </div>
        );

    }

}

export { ElementView, ProjectPreview };
