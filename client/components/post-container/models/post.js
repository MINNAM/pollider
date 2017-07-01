import $ from 'jquery';

/* Pollider */
import { PostQueryUrls } from './post-query.js';

class Post {

    constructor ( data ) {

        this.data     = data;
        this.children = null;

    }

    assign ( object ) {

        Object.assign( this, object );

        this.hyperlink = object.hyperlink;

        if( this.container > 0 ) {

            this.children = {};

        }

    }

    /*
    *   Calls Post.uploadFile method at backend: differs from simply inserting a new post.
    */
    upload ( setUploadStatus, done ) {

        if ( this.fileToUpload ) {

            const self     = this;
            const xhr      = new XMLHttpRequest();
            const formData = new FormData();
            const onReady  = function( event ) {};
            const onError  = function( error ) {};

            formData.append( 'files', this.fileToUpload );
            formData.append( 'id', this.id );
            formData.append( 'userId', 1 );

            xhr.open( 'post', PostQueryUrls.uploadFile, true );
            xhr.addEventListener( 'error', onError );

            xhr.upload.addEventListener( 'progress', ( event ) => {

                let percentComplete = ( event.loaded / event.total ) * 100;

                setUploadStatus( percentComplete );

            }, false );

            xhr.addEventListener( "load", function () {

                this.fileToUpload = null;

            }.bind( this ));

            xhr.onreadystatechange = function () {

                if ( this.readyState == 4 && this.status == 200 ) {

                    const res = JSON.parse( this.response );

                    for ( let key in res ) {

                        self[ key ] = res[ key ];

                    }

                    self.update();

                    done();

                }

            };

            xhr.send( formData );
            xhr.addEventListener( 'readystatechange', onReady, false );

        }

    }

    refresh () {}

    buildLink ( hyperlink, node ) {

        if ( node.parentNode ) {

            return this.buildLink ( `${node.parentNode.hyperlink}/${hyperlink}`, node.parentNode );

        } else {

            if ( this.container ==  1 ) {

                return `${hyperlink}/`;

            } else {

                return `${hyperlink}`;

            }



        }

    }

    /*
    *   Rebuilds hyperlink for preview
    */
    update () {

        this._hyperlink = this.buildLink( this.hyperlink, this );

    }

    createAlias ( done ) {

        $.post( PostQueryUrls.createAlias, {

            id : this.id

        } ).done( function ( response ) {            

            done( response );

        }.bind( this ));

    }

    insert () {}

}

export default Post;
