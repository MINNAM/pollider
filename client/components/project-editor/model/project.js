import $            from 'jquery';
import { ProjectQueryUrls } from './project-query.js';
import Row          from './row';

class ProjectBase {

    constructor () {

        this.rows = [];
        this.index = 0;

    }

    deleteRow ( row ) {

        var _row;

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                this.rows.splice( i, 1 );
                break;
            }

        }
    }

    upRow ( row ) {

        var _row;

        for ( var i = 0; i < this.rows.length; i++ ) {


            if ( this.rows[ i ].index == row.index ) {



                if ( this.rows[ i - 1 ] ) {

                    _row = this.rows[ i ];

                    this.rows[ i ] = this.rows[ i - 1 ];
                    this.rows[ i - 1 ] = _row;

                    break;

                } else {

                    // already most bottom

                }

                break;
            }

        }

    }

    downRow ( row ) {

        var _row;

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                if ( this.rows[ i + 1 ] ) {

                    _row = this.rows[ i ];

                    this.rows[ i ] = this.rows[ i + 1 ];
                    this.rows[ i + 1 ] = _row;

                    break;

                } else {

                    // already most bottom

                }

                break;
            }

        }

    }

    duplicate ( row ) {

        var _row;

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                    var duplicatedRow = new Row( this.index++ );

                    duplicatedRow.copy( row, false );

                    console.log( row, duplicatedRow );

                    this.rows.splice( i + 1 , 0, duplicatedRow  );

                break;

            }

        }


    }

    topRow ( row ) {

        var _row;

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                var tempRows = [];

                _row = Object.assign( {}, this.rows[ i ] );

                this.rows.splice( i,1 );

                tempRows.push( _row );

                this.rows = tempRows.concat( this.rows );



                break;

            }

        }

    }

    bottomRow ( row ) {

        var _row;

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                _row = Object.assign( {}, this.rows[ i ] );

                this.rows.splice( i,1 );

                this.rows.push( _row );

                break;

            }

        }

    }


    addRow ( data ) {

        if ( !data.selected ) {

            this.rows.push( new Row( this.index++, data.colIndex, data.dynamic ) );

        } else {

            var _row;

            for ( var i = 0; i < this.rows.length; i++ ) {

                if ( this.rows[ i ].index == data.selected.index ) {

                    this.rows.splice( i + data.position , 0, new Row( this.index++, data.colIndex, data.dynamic ) );

                    break;

                }

            }



        }

    }

}

class Project extends ProjectBase {

    constructor ( props ) {

        super ( null );

        this.model       = props.model;
        this.parentModel = props.parentModel;

        let content_raw;

        for ( let key in this.model.data ) {

            let element = this.model.data[ key ];

            if ( element.field == props.projectField ) {

                console.log( 'yeah' );

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

    save () {

        let data = this.model.data ;

        console.log( 'data', data );


        data[ this.dataKey ].content = this.html();

        const tempRows = [ ...this.rows ];

        const elements = [];


        tempRows.map( row => {

            if ( row.cols ) {

                row.cols.map( col => {

                    if ( col.rows ) {

                        col.rows.map ( row => {

                            if( row.cols ) {

                                row.cols.map ( col2 => {

                                    if ( col2.element && col2.element.content.parentNode ) {

                                        elements.push( col2.element );

                                        delete col2.element.content.parentNode;

                                    }

                                })

                            }

                        });

                    }

                    if ( col.element && col.element.content.parentNode ) {

                        elements.push( col.element );

                        delete col.element.content.parentNode;

                    }

                });

            }

        });

        this.addPostReferece( elements ); // add element;


        data[ this.dataKey ].content_raw = JSON.stringify({

            index : this.index,
            rows  : this.rows

        });

        this.model.data = data;


        this.parentModel.updatePost( this.model );

        return ( 'what?' );


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

        console.log( 'html', html );

        return html;

    }

}

export default Project;
