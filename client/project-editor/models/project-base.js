import {ProjectQueryUrls} from './project-query.js';
import Row from './row';

class ProjectBase {

    constructor () {

        this.rows = [];
        this.index = 0;

    }

    reindexRows () {

        this.rows.map( ( row, key ) => {

            row.index = key;

        }) ;

    }

    deleteRow ( row ) {

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                this.rows.splice( i, 1 );
                break;

            }

        }

        this.reindexRows();
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

        this.reindexRows();

        console.log( this.rows );

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

        this.reindexRows();

        console.log( this.rows );

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

        this.reindexRows();


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

        this.reindexRows();

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

        this.reindexRows();

    }


    addRow ( data ) {


        if ( !data.selected ) {

            this.rows.push( new Row( this.index++, data.colIndex, data.dynamic, true, this ) );

        } else {

            var _row;

            for ( var i = 0; i < this.rows.length; i++ ) {

                if ( this.rows[ i ].index == data.selected.index ) {

                    this.rows.splice( i + data.position , 0, new Row( this.index++, data.colIndex, data.dynamic, true, this ) );

                    break;

                }

            }



        }

        this.reindexRows();

    }

}

export default ProjectBase;
