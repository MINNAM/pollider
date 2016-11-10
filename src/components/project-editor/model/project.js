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

        this.model.data.map( ( element, key ) => {

            if ( element.field == props.projectField ) {

                this.dataKey = key;
                content_raw = element.content_raw;

            }

        });

        if ( content_raw  ) {

            this.load( JSON.parse( content_raw ) );

        }


    }

    save () {

        let data = this.model.data ;

        data[ this.dataKey ].content_raw = JSON.stringify( {

            index : this.index,
            rows  : this.rows

        });

        this.model.data = data;

        this.parentModel.updatePost( this.model );


    }

    load ( json ) {

        json.rows.map( ( row, key ) => {

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
