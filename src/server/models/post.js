import fs         from 'fs';
import formidable from 'formidable';

class Post {

    constructor ( connection ) {

        this.connection = connection;

    }

    checkPostExist ( req, res ) {

        let query = req.query.parent_id != 'null' ? 'SELECT id, name FROM  m_post WHERE parent_id = ? AND name LIKE ?' : 'SELECT id, name FROM m_post WHERE parent_id IS NULL AND name LIKE ?';
        let fields = req.query.parent_id != 'null' ? [ req.query.parent_id, req.query.name ] : [ req.query.name ];

        this.connection.query (

            query ,

            fields,

            function ( err, row ) {

                if ( row ) {

                    if ( row.length > 0) {

                        res.send( true );

                    } else {

                        res.send( false );

                    }


                } else {

                    res.send( false );

                }


            }

        );

    }

    updatePost ( req, res ) {

        let self        = this;
        let newFileName = req.body.hide.filename;

        if ( req.body.hide.path && req.body.hide.filename ) {

            if ( this.formatFileName( req.body.name ) != req.body.hide.filename ) {

                newFileName = this.formatFileName( req.body.name );

                this.renameFile( req.body.hide.path + req.body.hide.filename + '.' + req.body.extension, req.body.hide.path + newFileName + '.' + req.body.extension );

            }

        }

        let query;
        let fields;

        if ( !req.body.parent_id ) {

            query  = 'UPDATE m_post SET `parent_id` = null, `name` = ?, `public_date` = ?, `filename` = ?, `status` = ? WHERE id = ?;';
            fields = [

                req.body.name,
                new Date( req.body.public_date ).toISOString().slice( 0, 19 ).replace( 'T', ' ' ),
                newFileName,
                req.body.status,
                req.body.id,

            ];

        } else {

            query  = 'UPDATE m_post SET `parent_id` = ?, `name` = ?, `public_date` = ?, `filename` = ?, `status` = ? WHERE id = ?;';
            fields = [

                req.body.parent_id,
                req.body.name,
                new Date( req.body.public_date ).toISOString().slice( 0, 19 ).replace('T', ' '),
                newFileName,
                req.body.status,
                req.body.id

            ];

        }



        this.connection.query (

            query,

            fields,

            function ( err, row ) {

                if( err ) {

                    res.send( false );

                } else {

                    if ( req.body.data.length > 0 ) {

                        req.body.data.map( ( element, key ) => {

                            self.connection.query (

                                'UPDATE m_post_data SET `content` = ?, `content_raw` = ? WHERE id = ?',

                                [
                                    element.content,
                                    element.content_raw,
                                    element.id
                                ],

                                ( err, row ) => {}

                            );

                        });
                    }

                    res.send( true );

                }

            }

        );

    }

    fileExist ( path ) {

        try {

            fs.accessSync( path );

            return true;

        } catch (e) {

            return false;

        }

    }

    deletePost ( req, res ) {

        let self  = this;
        let ids   = [];
        let paths = [];

        for ( let key in req.body.posts ) {

            ( ( _key ) => {

                ids.push( req.body.posts[ _key ].id );

                if ( req.body.posts[ _key ].path ) {

                    paths.push( __dirname + '/..' + req.body.posts[ _key ].path );

                }

            })( key );

        }

        paths = Array.from( new Set( paths ) );

        paths.map( ( path ) => {

            if ( this.fileExist( path ) ) {

                fs.unlink( path );

            }

        });

        this.connection.query (

            'DELETE FROM m_post WHERE id IN ?',

            [[ ids ]],

            ( err, row ) => {

                res.send( true );

            }

        );

    }

    insertPost ( req, res ) {

        let self = this;

        this.connection.query (

            'SELECT * FROM ( SELECT pm.field, pct.id as data_type_id FROM m_post_meta pm INNER JOIN m_post_content_type pct ON pm.data_type LIKE pct.name WHERE pm.post_type_id = ? ) pmnpct;',

            [ req.body.post_type_id ],

            function ( err, row ) {

                var postDataTypes = row;

                self.connection.query (

                    "INSERT INTO m_post ( `id`, `parent_id`, `user_id`, `post_type_id`, `post_data_type_id`, `name`, `extension`, `size`, `container`, `status` ) VALUES ( null, ?, 1, ?, ?, ?, ?, ?, ?, 'public' );",

                    [ req.body.parent_id ? req.body.parent_id : null, req.body.post_type_id, req.body.post_data_type_id, req.body.name, req.body.extension, req.body.size ? req.body.size : -1, req.body.container ],

                    ( err, row ) => {

                        let postData = [];

                        postDataTypes.map( function ( element, key ) {

                            postData.push( [ row.insertId, element.data_type_id, element.field, '' ] ); // Last Field is going to be default value

                        });

                        self.connection.query (

                            "INSERT INTO m_post_data ( `post_id`, `post_content_type_id`, `field`, `content` ) VALUES ?",

                            [ postData ],

                            ( err, row2 ) => {

                                self.connection.query (

                                    "SELECT pd.id, pd.field, pd.content FROM m_post p LEFT JOIN m_post_data pd ON p.id = pd.post_id WHERE p.id = ?",

                                    [ row.insertId ],

                                    ( err, row3 ) => {

                                        self.connection.query (

                                            "SELECT p.id, p.parent_id, p.path, p.filename, p.name, p.container, p.public_date, p.extension, p.size, p.created_date, p.modified_date, pdt.name AS post_data_type FROM m_post p INNER JOIN m_post_data_type pdt ON pdt.id = p.post_data_type_id  WHERE p.id = ?",

                                            [ row.insertId ],

                                            ( err, row4 ) => {


                                                var newPost = {

                                                    id            : row4[ 0 ].id,
                                                    parent_id     : row4[ 0 ].parent_id,
                                                    name          : row4[ 0 ].name,
                                                    container     : row4[ 0 ].container,
                                                    public_date   : row4[ 0 ].public_date,
                                                    created_date  : row4[ 0 ].created_date,
                                                    modified_date : row4[ 0 ].modified_date,
                                                    size          : row4[ 0 ].size,
                                                    data          : row3,
                                                    hide          : {
                                                        dataType : row4[ 0 ].post_data_type,
                                                        path     : row4[ 0 ].path,
                                                        filename : row4[ 0 ].filename
                                                    },


                                                };

                                                res.send( newPost );

                                            }

                                        );

                                    }

                                );

                            }

                        );

                    }

                );


            }

        );

    }

    getPosts ( req, res ) {

        this.connection.query (

            'SELECT p.id AS post_id, p.parent_id, p.post_type_id as post_type_id, pdt.name AS post_data_type, p.name, p.extension, p.path, p.filename, p.size, p.container, p.status, p.public_date, p.created_date, p.modified_date, pd.id AS post_data_id, pd.field, pd.content, pd.content_raw FROM m_post p INNER JOIN m_post_data pd ON p.id = pd.post_id INNER JOIN m_post_data_type pdt ON p.post_data_type_id = pdt.id  WHERE p.post_type_id = ? ORDER BY p.parent_id;',

            [ req.query.post_type_id ],

            ( err, rows ) => {

                const posts = {};

                if ( rows ) {

                    rows.map( ( element, key ) => {

                        if ( !posts[ element.post_id ] ) {

                            posts[ element.post_id ] = {

                                id            : element.post_id,
                                parent_id     : element.parent_id,
                                name          : element.name,
                                status        : element.status,
                                extension     : element.extension,
                                container     : element.container,
                                public_date   : element.public_date,
                                created_date  : element.created_date,
                                modified_date : element.modified_date,
                                size          : element.size,
                                data          : [],
                                hide          : {

                                  path     : element.path,
                                  filename : element.filename,
                                  dataType : element.post_data_type

                                }

                            };

                        }

                        posts[ element.post_id ].data.push({

                            id      : element.post_data_id,
                            field   : element.field,
                            content : element.content,
                            content_raw : element.content_raw

                        });

                    });

                }

                res.send( posts );

            }

        );

    }

    getPost ( req, res ) {

        this.connection.query (

            'SELECT p.id AS post_id, p.post_type_id as post_type_id, p.name, p.size, p.status, p.created_date, p.modified_date, pd.id AS post_data_id, pd.name AS post_name, pd.content FROM m_post p INNER JOIN m_post_data pd ON p.id = pd.post_id WHERE p.id = ?;',

            [ req.query.id ],

            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    getPostMeta ( req, res ) {

        this.connection.query (

            'SHOW COLUMNS FROM m_post',

            [],

            ( err, rows ) => {

                let model = {};

                for ( let key in rows ) {

                    model[ rows[ key ][ 'Field' ]  ] = null;

                }

                res.send( model );

            }

        );

    }

    getPostDataTypes ( req, res ) {

        this.connection.query (

            'SELECT * FROM m_post_data_type',

            ( err, rows ) => {

                let model = {};

                for ( let key in rows ) {

                    model[ rows[ key ].name ] = rows[ key ].id;

                }

                res.send( model );

            }

        );

    }

    getPostTypeMeta ( req, res ) {

        this.connection.query (

            'SELECT pt.id, pt.name AS post_type_name, pm.field AS post_meta_name, pm.data_type FROM m_post_type pt LEFT JOIN m_post_meta pm ON pt.id = pm.post_type_id;',

            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    getPostType ( req, res ) {

        this.connection.query (

            'SELECT * FROM m_post_type;',

            [],

            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    getPostData ( req, res ) {

        this.connection.query (

            'SELECT * from m_post_data WHERE id = ?',

            [ req.query.post_id ],

            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    renameFile ( fromFile, toFile) {

        let dir = __dirname + "/.." ;

        fs.rename( dir + fromFile, dir + toFile, function ( err ) {

            if ( err ) throw err;

        });

    }

    /**
    *   Replace all special characters that occurs in a filename.
    */
    formatFileName ( filename ) {

        return filename.replace( /[^0-9a-zA-Z\-]+/g, '-' ).toLowerCase().replace( /^-/, '' ).replace( /-$/, '' );

    }

    splitFileNameAndExt ( filename ) {

        return filename.split( /(?:\.([^.]+))?$/ );

    }

    uploadFile ( req, res ) {

        let self  = this;
        let form  = new formidable.IncomingForm();

        form.uploadDir = __dirname + '/../tmp/';
        form.encoding  = 'binary';

        // str = str.replace(/\s+/g, '-').toLowerCase();

        let parsing = form.parse( req, function( err, fields, files ) {

            for ( let key in files ) {

                let today        = new Date();
                let year         = today.getFullYear();
                let month        = today.getMonth();
                let dirYear      = __dirname + "/../uploads/" + year.toString();
                let dirYearMonth = __dirname + "/../uploads/" + year.toString() + '/' + month.toString();

                if ( !fs.existsSync( dirYear ) ) {

                    fs.mkdirSync( dirYear );

                }

                if ( !fs.existsSync( dirYearMonth ) ) {

                    fs.mkdirSync( dirYearMonth );

                }

                let file = files[ key ];

                fs.readFile( file.path, function ( err, data ) {


                    let fileNameSplit     = self.splitFileNameAndExt( file.name );
                    let fileNameFormatted = self.formatFileName( fileNameSplit[ 0 ] );
                    let fileName          = fileNameFormatted + '.' + fileNameSplit[ 1 ];
                    let newPath           = dirYearMonth + "/" + fileName;

                    fs.writeFile( newPath, data, function ( err ) {

                        let path = "/uploads/" + ( year.toString() + "/" + month.toString() ) + "/";

                        self.connection.query (

                            'UPDATE m_post SET `path` = ?, `filename` = ?, `extension` = ? WHERE id = ?;',

                            [ path, fileNameFormatted, fileNameSplit[ 1 ], fields.id ],

                            function ( err, rows ) {

                                self.connection.query (

                                    'SELECT p.id AS post_id, p.parent_id, p.post_type_id as post_type_id, pdt.name AS post_data_type, p.name, p.extension, p.path, p.filename, p.size, p.container, p.status, p.public_date, p.created_date, p.modified_date, pd.id AS post_data_id, pd.field, pd.content, pd.content_raw FROM m_post p INNER JOIN m_post_data pd ON p.id = pd.post_id INNER JOIN m_post_data_type pdt ON p.post_data_type_id = pdt.id  WHERE post_id = ?',

                                    [ fields.id ],

                                    function ( err, rows ) {

                                        const posts = {};

                                        if ( rows ) {

                                            rows.map( ( element, key ) => {

                                                if ( !posts[ element.post_id ] ) {

                                                    posts[ element.post_id ] = {

                                                        id            : element.post_id,
                                                        parent_id     : element.parent_id,
                                                        name          : element.name,
                                                        status        : element.status,
                                                        extension     : element.extension,
                                                        container     : element.container,
                                                        public_date   : element.public_date,
                                                        created_date  : element.created_date,
                                                        modified_date : element.modified_date,
                                                        size          : element.size,
                                                        data          : [],
                                                        hide          : {

                                                          path     : element.path,
                                                          filename : element.filename,
                                                          dataType : element.post_data_type

                                                        }

                                                    };

                                                }

                                                posts[ element.post_id ].data.push({

                                                    id      : element.post_data_id,
                                                    field   : element.field,
                                                    content : element.content,
                                                    content_raw : element.content_raw

                                                });

                                            });

                                        }

                                        res.send( posts[ fields.id ] );

                                    }

                                );

                            }

                        );

                        fs.unlink( file.path );

                    });

                });

            }

            if ( err ) {}

        });

    }

}

export default Post;
