
import ProjectBase from './project-base.js';
import Row          from './row';

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

        let html = '';

        for ( let key in this.rows ) {

            html += this.rows[ key ].html();

        }

        return html;

    }

}

export default Project;
