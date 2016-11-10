import ProjectBase  from './project-base.js';
import Row          from './row';
import Element      from './Element.js';

class Col extends ProjectBase {

    constructor ( width, element ) {

        super( null );

        this.type  = '';
        this.width = width;
        this.rows  = [];

    }

    setElement ( type ) {

        this.element = new Element( type, '', '' );

    }

    copy ( col ) {

        this.type  = col.type;
        this.width = col.width;

        if ( col.element ) {

            this.element = new Element( col.element.type, col.element.content, col.element.contentRaw );

        }

        for ( let i = 0; i < col.rows.length; i++ ) {

            let newRow = new Row();

            newRow.copy( col.rows[ i ], true );

            this.rows[ i ] = newRow;

        }

    }

    html () {

        let html = '<div class="col-sm-' + this.width + '">';

        if ( this.element ) {

            html += this.element.content;

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
