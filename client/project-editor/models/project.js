import $ from 'jquery';
import { ProjectQueryUrls } from './project-query.js';
import Row from './row';
import ProjectBase from './project-base.js';

class Project extends ProjectBase {

    constructor ( props ) {

        super ( null );

        this.model       = props.model;
        this.parentModel = props.parentModel;

        let content_raw;

        for ( let key in this.model.data ) {

            let element = this.model.data[ key ];

            if ( element.field == props.projectField ) {

                this.dataKey = key;
                content_raw = element.content_raw;

            }

        }

        if ( content_raw  ) {

            this.load( JSON.parse( content_raw ) );

        }


    }

    addPostReferece ( posts ) {

        $.ajax({

            url         : ProjectQueryUrls.addPostReference,
            type        : "POST",
            data        : JSON.stringify( posts ),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            success     : ( response ) => {

                console.log( 'addPostReferece', response );

            }

        });


    }

    circularStructure ( on ) {

        this.rows.map( row => {

            if ( row.cols ) {

                row.cols.map( col => {

                    col.parent = on ? row : null;

                    if ( col.element && col.element.content ) {

                        if ( col.element.content.parentNode )
                            delete col.element.content.parentNode;

                    }

                    if ( col.rows ) {

                        col.rows.map ( row2 => {

                            row2.parent = on ? col : null;

                            if( row2.cols ) {

                                row2.cols.map ( col2 => {

                                    col2.parent = on ? row2 : null;

                                    if ( col2.element && col2.element.content ) {

                                        if ( col2.element.content.parentNode )
                                            delete col2.element.content.parentNode;

                                    }

                                    return col2;

                                });

                            }

                            return row2;

                        });

                    }

                    return col;

                });

            }

        });

        console.log( this.rows );

    }

    save (done) {

        let data = this.model.data ;

        data[ this.dataKey ].content = this.html();


        this.circularStructure( false );

        data[ this.dataKey ].content_raw = JSON.stringify({

            index : this.index,
            rows  : this.rows

        });

        this.model.data = data;

        this.parentModel.updatePost( this.model, () => {

            this.circularStructure( true );

            done();

        });


    }

    load ( json ) {


        json.rows.map(( row, key ) => {

            const newRow = new Row( key );

            newRow.copy( row, true );

            this.rows[ key ]       = newRow;
            this.rows[ key ].index = this.index;

            this.index++;


        });

    }

    html () {

        let html = '<header></header>';

        for ( let key in this.rows ) {

            html += this.rows[ key ].html();

        }

        return html;

    }

}

export default Project;
