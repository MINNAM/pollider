import Col from './col.js';

const COL_WIDTH = [

    [ '12' ],
    [ '6','6' ],
    [ '4', '4', '4'],
    [ '3', '3', '3', '3' ],
    [ '3', '9' ],
    [ '9', '3' ],
    [ '6', '3', '3' ],
    [ '3', '6', '3' ],
    [ '3', '3', '6' ],
    [ '4', '8' ],
    [ '8', '4' ]

];

class Row {

    constructor ( index, colIndex, dynamic, updated, parent  ) {

        this.index   = index;
        this.cols    = [];
        this.dynamic = dynamic;
        this.updated = updated;
        this.parent = parent;

        if ( colIndex != undefined ) {

            for ( let i = 0; i < COL_WIDTH[ colIndex ].length; i++ ) {

                this.cols.push( new Col( COL_WIDTH[ colIndex ][ i ], this ) );

            }

        }

    }

    copy (row, copyIndex) {
        if (copyIndex) {
            this.index = row.index;
        }

        this.dynamic = row.dynamic;

        for ( let i = 0; i < row.cols.length; i++ ) {
            let newCol = new Col();            

            newCol.copy( row.cols[ i ] );

            newCol.parent = this;

            this.cols[ i ] = newCol;
        }
    }

    html () {

        let html = '<div class ="row">';

        for ( let i = 0; i < this.cols.length; i++ ) {

            html += this.cols[ i ].html();

        }

        html += '</div>';

        return html;

    }

}

export default Row;
