import $                 from 'jquery';

/* Pollider */
import Post              from './post.js';
import { PostQueryUrls } from './post-query.js';

class PostContainer {

    constructor ( onUpdate ) {

        this.posts = {};
        this.model = {};
        this.onUpdate = onUpdate;

        this.getPostMeta();

    }

    getPostMeta () {

        $.get( PostQueryUrls.getPostMeta , function ( response ) {

            this.model = response;

        }.bind( this ));

    }

    checkPostExist ( parent_id, name, done ) {

        let postExist;

        $.get ( PostQueryUrls.checkPostExist + 'parent_id=' + parent_id + '&name=' + name, ( response )=> {

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

            for ( var key in response ) {

                this.structurize( response, key, type, 0 );

            }

        }.bind( this )).done( done );

    }

    setOnUpdate ( onUpdate ) {

        this.onUpdate = onUpdate;

    }

    updatePost ( post ) {

        const date = new Date();

        this.onUpdate( date, 'Updating ' + post.name  , 0 );

        $.ajax({

            url         : PostQueryUrls.updatePost,
            type        : "POST",
            data        : JSON.stringify( post ),
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            success     : ( response ) => {

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

                parent.children[ post.id ] = post;

              }

              return parent.children[ key ];

          } else {

            const parentPost = this.structurize( elements, elements[ key ].parent_id, type, ++depth );
            const post       = this.new( type.meta );

            post.assign( elements[ key ] );

            parentPost.children[ post.id ] = post;

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

        for ( var key in element ) {

            if ( element[ key ].hasOwnProperty( id ) ) {

                return element[ key ][ id ];

            }

            if ( element[ key ].container == 1 ) {

                var temp = this.navigateParent( element[ key ].children, id, exclude );

                if( temp ) {

                    return temp;

                }

            }

        }

    }

    insertPost ( data, done ) {

        let newPost;

        this.checkPostExist( data.parent_id, data.name, function ( exists ) {

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

                    postsToDelete.push({ id :  post.children[ key ].id, path : post.children[ key ].container ?  null : post.children[ key ] .hide.path +  post.children[ key ] .hide.filename + '.' +  post.children[ key ].extension });


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

        $.post( PostQueryUrls.deletePost, { posts : postsToDelete } ).done( function ( response ) {

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
