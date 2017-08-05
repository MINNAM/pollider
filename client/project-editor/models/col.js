
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Row from './row';
import Element from './element.js';
import ProjectBase from './project-base.js';

class Col extends ProjectBase {

    constructor ( width, parent, element, elementWidth = 0.2, padding = {top:0, right:0, bottom:0, left:0} ) {

        super( null );

        this.type    = '';
        this.parent  = parent;
        this.width   = width;
        this.rows    = [];
        this.elementWidth = elementWidth;
        this.padding = padding;

    }

    setPadding ( value ) {
        this.padding = value;
    }

    setElementWidth ( value ) {
        this.elementWidth = value;
    }

    setElement ( data ) {
        this.element = new Element( data.type, '', '', data.open );
    }

    deleteElement () {
        this.element = null;
    }

    copy (col) {
        this.type = col.type;
        this.width = col.width;
        this.elementWidth = col.elementWidth;
        this.padding = col.padding ? col.padding : {top:0, right:0, bottom:0, left:0};

        if ( col.element ) {
            this.element = new Element( col.element.type, col.element.content, col.element.contentRaw );
        }

        for ( let i = 0; i < col.rows.length; i++ ) {
            let newRow = new Row();

            newRow.copy( col.rows[ i ], true );
            newRow.parent = this;
            this.rows[ i ] = newRow;
        }

    }

    renderElement () {
        switch (this.element.type) {
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
                                    width     : ( this.elementWidth * 100 ) + '%',
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
