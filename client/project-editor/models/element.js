import fetch from 'node-fetch';
import { PostQuery } from '../../post-container/';

let idIndex = 1;

class Element {

    constructor ( type, content, contentRaw, open ) {



        this.type       = type;
        this.content    = content;
        this.contentRaw = contentRaw;
        this.open       = open;
        this.uniqueId   =  'element-' + idIndex++;

    }

    copy ( element ) {

        this.type       = type;
        this.content    = content;
        this.contentRaw = contentRaw;

    }

    getPostById ( done ) {

        if ( this.contentRaw ) {

            if ( this.contentRaw.id && this.contentRaw.post_type_id ) {

                let id = this.contentRaw.id;

                if ( typeof this.contentRaw.children !== 'undefined' && this.contentRaw.children.length > 0 ) {

                    id = JSON.stringify( this.contentRaw.children );
                }

                fetch( `${ PostQuery.getPostById + id }&post_type_id=${this.contentRaw.post_type_id}` ).then( ( res ) => {

                    return res.json()

                }).then( ( json ) => {

                    done( json );

                });

            }

        }

    }



}

export default Element;
