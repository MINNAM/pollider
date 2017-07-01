import fetch            from 'node-fetch';
import { PostQueryUrls } from '../../post-container/models/post-query.js';

class Element {

    constructor ( type, content, contentRaw ) {

        this.type       = type;
        this.content    = content;
        this.contentRaw = contentRaw;

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

                console.log( `${ PostQueryUrls.getPostById + id }&post_type_id=${this.contentRaw.post_type_id}` );

                fetch( `${ PostQueryUrls.getPostById + id }&post_type_id=${this.contentRaw.post_type_id}` ).then( ( res ) => {

                    return res.json()

                }).then( ( json ) => {

                    done( json );

                });

            }

        }

    }



}

export default Element;
