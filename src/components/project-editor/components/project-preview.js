import React from 'react';

import CONFIG from '../../../models/m-config.js';

class ColView extends React.Component {

    constructor ( props ) {

        super( props );

    }

    componentDidMount () {

        if ( this.refs.element ) {

            this.props.queueElement( this.refs.element );

        }


    }

    render () {

        const model = this.props.model;

        if ( model.element ) {

            switch ( model.element.type ) {

                case 'image' :

                    let path;

                    if( model.element.content ) {

                        path = CONFIG.backendUrl + model.element.content.hide.path + model.element.content.hide.filename + '.' + model.element.content.extension;

                     }

                    return (
                        <div className = { 'col-sm-' + model.width } style = {{ height : '100%' }} >
                            <div className = 'element' style = {{  height: "100%", position : 'relative' }}>
                                {
                                    path ? <img ref = 'element' src = { path } alt = "hello" style = {{ width : ( model.padding * 100 ) + '%', position: 'absolute', top: '50%', left : '50%', transform: 'translate(-50%,-50%)'}}/> : ''
                                }
                            </div>
                        </div>
                    );
                break;

                default :

                    return (
                        <div ref = 'element' className = { 'col-sm-' + model.width } style = {{ padding : '5%' }} dangerouslySetInnerHTML = {{ __html : model.element.content }}>
                        </div>
                    );
            }

        }

        return (

            <div className = { 'col-sm-' + model.width }>
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

        if ( !this.state.loaded ) {

            return <div></div>;

        }


        return (
            <div className = { 'row' } style = {{ minHeight: this.getHeight() }}>

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

            <div className = 'project-preview' style = {{ background : 'white' }}>
            {

                this.props.model.rows.map( ( row, rowKey ) => {

                    return (
                        <RowView key = { rowKey } model = { row } />
                    );

                    // row.cols.map( ( col, colKey ) => {
                    //
                    //     console.log( 'Col', col);
                    //
                    //     col.rows.map( ( row2, rowKey2 ) => {
                    //
                    //         console.log( 'Row2', row2);
                    //
                    //         row2.cols.map( ( col2, colKey2 ) => {
                    //
                    //             console.log( 'Col2', col2);
                    //
                    //         });
                    //
                    //
                    //     });
                    //
                    //
                    // });

                })
            }
            </div>
        );

    }

}

export default ProjectPreview;
