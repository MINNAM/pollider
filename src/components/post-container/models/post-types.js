import $ from 'jquery';

/* Pollider */
import { PostQueryUrls } from './post-query.js';
import * as Model        from '../models/post-container.js';

class _PostTypes {

    init ( onFinish, onUpdate ) {

        const self = this;

        this.postTypes     = {};
        this.postDataTypes = {};

        const postDataTypes = $.get( PostQueryUrls.getPostDataTypes, ( response ) => {

          this.postDataTypes = response;

        });

        const gettingPostType = $.get( PostQueryUrls.getPostType, ( response ) => {

            response.map( ( element, key ) => {

                var support = [];

                if ( element[ 'support_audio' ] == 1 ) support.push( 'audio' );
                if ( element[ 'support_document' ] == 1 ) support.push( 'document' );
                if ( element[ 'support_image' ] == 1 ) support.push( 'image' );
                if ( element[ 'support_other' ] == 1 ) support.push( 'other' );
                if ( element[ 'support_video' ] == 1 ) support.push( 'video' );
                if ( element[ 'support_post' ] == 1 ) support.push( 'post' );

                this.postTypes[ element[ 'name'] ] = {

                    id             : element[ 'id' ],
                    name           : element[ 'name' ],
                    name_singular  : element[ 'name_singular' ],
                    support        : support,
                    uploadable     : element[ 'uploadable' ],
                    meta           : {},
                    post_container : new Model.PostContainer( onUpdate )

                };

            });

        });

        $.get( PostQueryUrls.getPostTypeMeta, ( response ) => {

            response.map( ( element, key ) => {

                if( this.postTypes[ element[ 'post_type_name'] ] ) {

                    this.postTypes[ element[ 'post_type_name'] ].meta[ element[ 'post_meta_name'] ] = {

                        data_type      : element[ 'data_type' ],
                        value          : null

                    };

                }


            });

        }).done( () => {

            onFinish();

        });

    }

    get () {

        return this.postTypes;

    }

    map ( handle ) {

        for( let key in this.postTypes ) {

            handle ( this.postTypes[ key ], key );

        }

    }

}

const PostTypes = new _PostTypes();

export default PostTypes;
