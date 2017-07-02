import $                 from 'jquery';

/* Pollider */
import Post              from './post.js';
import { PostQueryUrls } from './post-query.js';
import { formatHyperlink } from './utility.js';

class PostContainer {

    constructor ( model, onUpdate ) {

        this.posts    = {};
        this.model    = model; // Need to fix getting model more simpler.
        this.onUpdate = onUpdate;

        // this.getPostMeta();

    }

    getPostMeta () {

        $.get( PostQueryUrls.getPostMeta , function ( response ) {

            this.model = response;

        }.bind( this ));

    }

    checkPostExist ( id, parent_id, name, hyperlink, done ) {

        let postExist;

        $.get ( `${PostQueryUrls.checkPostExist}id=${id}&parent_id=${parent_id}&name=${name}&hyperlink=${hyperlink}`, ( response )=> {

            postExist = response;

        }).done( () => {

            return done( postExist );

        });

    }

    /**
    * Requests posts on start up.
    */
    getPosts ( type, done ) {

        $.get( PostQueryUrls.getPosts + type.id, function ( response ) {

            for ( let key in response ) {

                this.structurize( response, key, type, 0 );

            }

        }.bind( this )).done( done );

    }

    getBlog ( type, url, done ) {

        $.get( PostQueryUrls.getBlog + type.id, function ( response ) {

            for ( let key in response ) {

                this.structurize( response, key, type, 0 );

            }

        }.bind( this )).done( done );

    }

    setOnUpdate ( onUpdate ) {

        this.onUpdate = onUpdate;

    }

    updatePost ( post, done ) {

        const date = new Date();

        this.onUpdate( date, 'Updating ' + post.name  , 0 );

        // Fixing circular error when stringifying Post object
        const tempParent  = { ...post.parentNode };
        const tempChilden = { ...post.children };

        post.children   = null;
        post.parentNode = null;

        $.ajax({

            url         : PostQueryUrls.updatePost,
            type        : "POST",
            data        : JSON.stringify( post ),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            success     : ( response ) => {

                post.parentNode = tempParent;
                post.children   = tempChilden;

                if ( Object.keys( post.children ).length != 0 ) {

                    for ( let key in post.children ) {

                        post.children[ key ].parentNode = post;


                    }

                }

                post.update();

                this.onUpdate( date, 'Updated ' + post.name , 1 );

            }

        });

    }

    structurize ( elements, key, type, depth ) {

      /* If is a root container, create a post on the top level of this.posts */
      if ( elements[ key ].parent_id == null ) {

          /* Create a root container if not exists or return the existing one */
          if( !this.posts[ key ] ) {

            const post = this.new( type.meta );

            post.assign( elements[ key ] );
            post.postContainerHyperlink = this.model.hyperlink;

            this.posts[ post.id ] = post;

          }

          return this.posts[ key ];

      } else {

          /* Recursively find a parent of a current object */
          const parent = this.navigateParent( this.posts, elements[ key ].parent_id );

          if ( parent ) {

              if( !parent.children[ key ] ) {

                let post = this.new( type.meta );

                post.assign( elements[ key ] );

                post.parentNode = parent;
                post.postContainerHyperlink = this.model.hyperlink;

                parent.children[ post.id ] = post;

                post.update();

              }

              return parent.children[ key ];

          } else {

            const parentPost = this.structurize( elements, elements[ key ].parent_id, type, ++depth );
            const post       = this.new( type.meta );

            post.assign( elements[ key ] );

            parentPost.children[ post.id ] = post;
            post.parentNode = parentPost;
            post.postContainerHyperlink = this.model.hyperlink;


            return post;

          }

      }

    }

    navigateParent ( element, id, exclude ) {

        if ( element.hasOwnProperty( id ) ) {

            return element[ id ];

        }

        if ( exclude ) {

            if( !element.hasOwnProperty( id ) && element.hasOwnProperty( exclude ) && element[ exclude ].container == 1 ) {

                return false;

            }

        }

        for ( let key in element ) {

            if ( element[ key ].hasOwnProperty( id ) ) {

                return element[ key ][ id ];

            }

            if ( element[ key ].container == 1 ) {

                let temp = this.navigateParent( element[ key ].children, id, exclude );

                if( temp ) {

                    return temp;

                }

            }

        }

    }

    insertPost ( data, done ) {

        let newPost;

        const hyperlink = formatHyperlink( data.name );

        this.checkPostExist( null, data.parent_id, data.name, hyperlink, function ( exists ) {

            if ( !exists ) {

                $.post( PostQueryUrls.insertPost, data ).done( function ( response ) {

                    newPost = this.new();

                    newPost.assign( response );


                }.bind( this ) ).done( function () {

                    done( newPost );

                });

            }

        }.bind( this ));


    }

    getIds ( post, postsToDelete ) {

        if ( post ) {

            if ( post.children ) {

                for ( let key in post.children ) {

                    if ( post.children[ key ].children  ) {

                        this.getIds( post.children[ key ], postsToDelete );

                    }

                    postsToDelete.push({
                        id :  post.children[ key ].id,
                        alias_id : post.children[ key ].alias_id,
                        path : post.children[ key ].container ?  null : post.children[ key ] .hide.path +  post.children[ key ] .hide.filename + '.' +  post.children[ key ].extension

                    });


                }

            }

            postsToDelete.push({ id : post.id, path : post.container ?  null : post.hide.path + post.hide.filename + '.' + post.extension });

        }

    }

    deletePost ( posts, updateView ) {

        const postsToDelete = [];

        if (  Object.prototype.toString.call( posts ) === '[object Array]' ) {

          for( let key in posts ) {

            if ( posts[ key ] )  {

                let test = this.getIds( posts[ key ], postsToDelete );

            };

          }

        } else {

            let test = this.getIds( posts, postsToDelete );

        }

        $.post( PostQueryUrls.deletePost, { posts : JSON.stringify( postsToDelete ) } ).done( function ( response ) {

            updateView();

        }.bind( this ));

    }

    new ( meta, param ) {

        return new Post( meta, param );

    }

    copyPost ( param, parentId ) {

        const post = new Post();

        for ( let key in param ) {

            post[ key ] = param[ key ];

        }

        post.parent_id = parentId;

        return post;

    }

}

export { PostContainer };
