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

        if( this.container > 0 ) {

            this.children = {};

        }

    }

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

                    done();

                }

            };

            xhr.send( formData );
            xhr.addEventListener( 'readystatechange', onReady, false );

        }

    }

    refresh () {}

    update () {}

    insert () {}

}

export default Post;
