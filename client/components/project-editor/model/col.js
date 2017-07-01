
import React from 'react';
import {renderToStaticMarkup}                     from 'react-dom/server';
import Row          from './row';
import Element      from './element.js';

class ProjectBase {

    constructor () {

        this.rows = [];
        this.index = 0;

    }

    deleteRow ( row ) {

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                this.rows.splice( i, 1 );
                break;
            }

        }
    }

    upRow ( row ) {

        let _row;

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

        let _row;

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

        for ( var i = 0; i < this.rows.length; i++ ) {

            if ( this.rows[ i ].index == row.index ) {

                    var duplicatedRow = new Row( this.index++ );

                    duplicatedRow.copy( row, false );

                    this.rows.splice( i + 1 , 0, duplicatedRow  );

                break;

            }

        }

    }

    displayElement ( displayElement ) {

        this.displayElement = displayElement;

    }

    topRow ( row ) {

        let _row;

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

        let _row;

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

            for ( var i = 0; i < this.rows.length; i++ ) {

                if ( this.rows[ i ].index == data.selected.index ) {

                    this.rows.splice( i + data.position , 0, new Row( this.index++, data.colIndex, data.dynamic ) );

                    break;

                }

            }



        }

    }

}

class Col extends ProjectBase {

    constructor ( width, element, padding = 0.2 ) {

        super( null );

        this.type    = '';
        this.width   = width;
        this.rows    = [];
        this.padding = padding;

    }

    setPadding ( value ) {

        this.padding = value;

    }

    setElement ( type ) {

        this.element = new Element( type, '', '' );

    }

    deleteElement () {

        this.element = null;

    }

    copy ( col ) {

        this.type    = col.type;
        this.width   = col.width;
        this.padding = col.padding;

        if ( col.element ) {

            this.element = new Element( col.element.type, col.element.content, col.element.contentRaw );

        }

        for ( let i = 0; i < col.rows.length; i++ ) {

            let newRow = new Row();

            newRow.copy( col.rows[ i ], true );

            this.rows[ i ] = newRow;

        }

    }

    renderElement () {

        switch ( this.element.type ) {

            case 'image' :

                let path;

                return renderToStaticMarkup(

                    <div className = 'element' style = {{ position : 'relative' }}>
                        {
                            <img
                                ref   = 'element'
                                src   = { '/' + this.element.content.postContainerHyperlink + '/' + this.element.content._hyperlink }
                                alt   = "hello"
                                style = {{
                                    width     : ( this.padding * 100 ) + '%',
                                    position  : 'absolute',
                                    top       : '50%',
                                    left      : '50%',
                                    transform : 'translate(-50%,-50%)'
                                }}
                            />
                        }
                    </div>

                );

            default :
                return renderToStaticMarkup( <div ref = 'element' dangerouslySetInnerHTML = {{ __html : this.element.content }} /> );

        }

    }

    html () {

        let html = '<div class="col-sm-' + this.width + '">';

        if ( this.element ) {

            html += this.renderElement();

        } else {


            for ( let key in this.rows ) {

                html += this.rows[ key ].html();

            }

        }

        html += '</div>';

        return html;

    }

}

export default Col;
