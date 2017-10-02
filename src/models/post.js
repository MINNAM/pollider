import fs         from 'fs';
import formidable from 'formidable';

class Post {

    constructor ( db ) {

        this.updateConnection( db );

    }

    updateConnection ( db ) {

        this.db = db;
        this.table_prefix = this.db ? (this.db.config.table_prefix ? this.db.config.table_prefix + '_' : '') : null;

    }

    /*
    *   Called to check if there is a post with the same name in parent directory when creating or modifiying a post.
    */
    checkPostExist ( req, res ) {

        const { post_type_id, parent_id, hyperlink } = req.query;

        const sql    = `SELECT
            name FROM ${ this.table_prefix }post
            WHERE
                parent_id ${ parent_id ? '= ?' : 'IS NULL' }
                AND hyperlink LIKE ?
                AND post_type_id = ?
            `;
        const fields = parent_id ? [parent_id, hyperlink, post_type_id] : [hyperlink, post_type_id];

        this.db.connection.query (
            sql,
            fields,
            ( err, row ) => {

                if ( row ) {

                    if ( row.length > 0 ) {

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

    /*
    *   Change in every fields are handled here at once.
    */
    updatePost ( req, res ) {

        const {
            id,
            parent_id,
            name,
            hyperlink,
            public_date,
            status,
            data
        } = req.body;

        console.log('updating');

        const formattedDate = new Date( public_date ).toISOString().slice( 0, 19 ).replace('T', ' ');

        console.log(data);

        let sql    = `UPDATE ${ this.table_prefix }post SET \`parent_id\` = ${ !parent_id ? 'null' : '?' }, \`name\` = ?, \`hyperlink\` = ?, \`public_date\` = ?, \`status\` = ? WHERE id = ?;`;
        let fields = !parent_id ? [name, hyperlink, formattedDate, status, id,] : [parent_id, name, hyperlink, formattedDate, status, id];

        this.db.connection.query (

            sql,
            fields,
            ( err, row ) => {

                if( err ) {

                    res.send( false );

                } else {

                    if ( data.length > 0 ) {

                        data.map( ( element, key ) => {

                            this.db.connection.query (

                                `UPDATE ${this.table_prefix }post_data SET \`content\` = ?, \`content_raw\` = ? WHERE id = ?`,

                                [
                                    element.content,
                                    element.content_raw,
                                    element.id
                               ],

                                ( err, row ) => { /**/ console.log(err) }

                            );

                        });

                    }

                    res.send( true );

                }

            }

        );

    }

    /*
    *   Called when deleting a post
    */
    fileExist ( path ) {

        try {

            fs.accessSync( path );

            return true;

        } catch ( err ) {

            return false;

        }

    }

    deletePost (req, res ) {
        const {
            posts
        } = req.body;

        const itemsToDelete = []; // id
        const paths = [];

        for ( let key in posts ) {

            (( _key ) => {

                itemsToDelete.push( posts[_key].id );

                if ( posts[_key].path ) {

                    paths.push( __dirname + '/..' + posts[_key].path );

                }

            })( key );

        }

        itemsToDelete.sort( ( a, b ) => {

            if ( parseInt( a ) < parseInt( b ) ) {

                return -1;

            }

            if ( parseInt( a ) > parseInt( b ) ) {

                return 1;

            }

            return 0;

        });


        const _paths = Array.from( new Set( paths ) ); // to array

        _paths.map( ( path ) => {

            if ( this.fileExist( path ) ) {

                fs.unlink( path );

            }

        });

        this.db.connection.query (

            `DELETE FROM ${ this.table_prefix }post WHERE id IN ?`,
            [[itemsToDelete]],
            ( err, row ) => {

                res.send( true );

            }

        );

    }

    addPostReferece ( req, res ) {

        res.send( true );

    }

    insertPost ( req, res ) {

        const {

            post_type_id,
            parent_id,
            post_data_type_id,
            name,
            hyperlink,
            extension,
            size,
            container

        } = req.body;

        this.db.connection.query (

            `SELECT * FROM ( SELECT pm.field, pct.id as data_type_id FROM ${ this.table_prefix }post_meta pm INNER JOIN ${ this.table_prefix }post_content_type pct ON pm.data_type LIKE pct.name WHERE pm.post_type_id = ? ) pmnpct;`,
            [post_type_id],
            ( err, postDataTypes ) => {                

                this.db.connection.query (

                    `INSERT INTO ${ this.table_prefix }post ( \`id\`, \`parent_id\`, \`user_id\`, \`post_type_id\`, \`post_data_type_id\`, \`name\`, \`hyperlink\`, \`extension\`, \`size\`, \`container\`, \`status\` ) VALUES ( null, ?, 1, ?, ?, ?, ?, ?, ?, ?, 'private' );`,

                    [parent_id ? parent_id : null, post_type_id, post_data_type_id, name, hyperlink, extension, size ? size : -1, container],

                    ( err, post ) => {

                        const postData = [];

                        postDataTypes.map(( element, key ) => {

                            postData.push([post.insertId, element.data_type_id, element.field, '']); // The last field is going to be a default value

                        });

                        this.db.connection.query (

                            `INSERT INTO ${ this.table_prefix }post_data ( \`post_id\`, \`post_content_type_id\`, \`field\`, \`content\` ) VALUES ?`,

                            [postData],

                            ( err, row2 ) => {

                                this.db.connection.query (

                                    `SELECT pd.id, pd.field, pd.content FROM ${ this.table_prefix }post p LEFT JOIN ${ this.table_prefix }post_data pd ON p.id = pd.post_id WHERE p.id = ?`,

                                    [post.insertId],

                                    ( err, newPostData ) => {

                                        this.db.connection.query (

                                            `SELECT p.id, p.parent_id, p.path, p.filename, p.status, p.name, p.hyperlink, p.container, p.public_date, p.extension, p.size, p.created_date, p.modified_date, pdt.name AS post_data_type FROM ${ this.table_prefix }post p INNER JOIN ${this.table_prefix }post_data_type pdt ON pdt.id = p.post_data_type_id  WHERE p.id = ?`,
                                            [post.insertId],
                                            ( err, newPost ) => {

                                                var newPost = {

                                                    id: newPost[0].id,
                                                    parent_id: newPost[0].parent_id,
                                                    name: newPost[0].name,
                                                    hyperlink: newPost[0].hyperlink,
                                                    status: newPost[0].status,
                                                    container: newPost[0].container,
                                                    public_date: newPost[0].public_date,
                                                    created_date: newPost[0].created_date,
                                                    modified_date: newPost[0].created_date,
                                                    size: newPost[0].size,
                                                    data: newPostData,
                                                    hide: {
                                                        dataType: newPost[0].post_data_type,
                                                        path: newPost[0].path,
                                                        filename: newPost[0].filename
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

    createAlias ( req, res ) {

        const { id } = req.body;

        this.db.connection.query(

            `SELECT * FROM ${ this.table_prefix }post p WHERE id = ?`,
            [id],
            ( err, rows ) => {

                this.db.connection.query(
                    `INSERT INTO ${ this.table_prefix }post
                        (
                            \`id\`,
                            \`parent_id\`,
                            \`alias_id\`,
                            \`user_id\`,
                            \`post_type_id\`,
                            \`post_data_type_id\`,
                            \`name\`,
                            \`hyperlink\`,
                            \`extension\`,
                            \`size\`,
                            \`container\`,
                            \`status\`
                        ) VALUES ( null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
                    `,
                    [
                        rows[0].parent_id,
                        rows[0].id,
                        rows[0].user_id,
                        rows[0].post_type_id,
                        rows[0].post_data_type_id,
                        rows[0].name,
                        rows[0].hyperlink,
                        null,
                        null,
                        rows[0].container,
                        rows[0].status,
                   ], ( err, rows ) => {

                        this.db.connection.query(

                            `SELECT
                                p.id, p.alias_id, p.parent_id, p.path, p.filename, p.name, p.hyperlink, p.container, p.public_date, p.extension, p.size, p.created_date, p.status, p.modified_date, pdt.name AS post_data_type
                                FROM ${ this.table_prefix }post p
                                INNER JOIN ${ this.table_prefix }post_data_type pdt
                                    ON p.post_data_type_id = pdt.id
                                WHERE p.id = ?`,
                            [rows.insertId],
                            ( err, posts ) => {

                                const post = posts[0];

                                res.send({

                                    id            : post.id,
                                    alias_id      : post.alias_id,
                                    parent_id     : post.parent_id,
                                    name          : post.name,
                                    hyperlink     : post.hyperlink,
                                    status        : post.status,
                                    extension     : post.extension,
                                    container     : post.container,
                                    public_date   : post.public_date,
                                    created_date  : post.created_date,
                                    modified_date : post.modified_date,
                                    size          : post.size,
                                    data          : [],
                                    hide          : {

                                      path     : post.path,
                                      filename : post.filename,
                                      dataType : post.post_data_type

                                    }

                                });

                            }
                        )



                    }
                )

            }

        );


    }

    /*
    *   For populating posts in Admin view
    */
    getPosts ( req, res ) {

        const { post_type_id } = req.query;

        this.db.connection.query (
            `SELECT
                a.post_id,
                a.alias_id,
                a.parent_id,
                a.post_type_id,
                a.post_data_type,
                a.name,
                a.hyperlink,
                a.extension,
                a.path,
                a.filename,
                a.size,
                a.container,
                a.status,
                a.public_date,
                a.created_date,
                a.modified_date,
                b.post_data_id,
                b.field,
                b.content,
                b.content_raw
            FROM (
        	        SELECT
                        p.id AS post_id,
                        p.alias_id,
                        p.parent_id,
                        p.post_type_id as post_type_id,
                        pdt.name AS post_data_type,
                        p.name,
                        p.hyperlink,
                        p.extension,
                        p.path,
                        p.filename,
                        p.size,
                        p.container,
                        p.status,
                        p.public_date,
                        p.created_date,
                        p.modified_date
        			FROM ${ this.table_prefix }post p
                    INNER JOIN post_data_type pdt
                        ON p.post_data_type_id = pdt.id
                    WHERE p.post_type_id = ?
                ) a
                LEFT OUTER JOIN
                    (
                        SELECT
                            p.id AS post_id,
                            p.alias_id,
                            p.parent_id,
                            p.post_type_id as post_type_id,
                            pdt.name AS post_data_type,
                            p.name,
                            p.hyperlink,
                            p.extension,
                            p.path,
                            p.filename,
                            p.size,
                            p.container,
                            p.status,
                            p.public_date,
                            p.created_date,
                            p.modified_date,
                            pd.id AS post_data_id,
                            pd.field,
                            pd.content,
                            pd.content_raw
                        FROM ${ this.table_prefix }post p
                        INNER JOIN ${ this.table_prefix }post_data pd
                            ON p.id = pd.post_id
                        INNER JOIN post_data_type pdt
                            ON p.post_data_type_id = pdt.id
                        WHERE p.post_type_id = ?
                        ORDER BY p.parent_id
                    ) b
                ON a.post_id = b.post_id`,
            [post_type_id, post_type_id],
            ( err, posts ) => {

                const _posts = {};

                if ( posts ) {

                    posts.map( ( element, key ) => {

                        if ( !_posts[element.post_id] ) {

                            _posts[element.post_id] = {

                                id            : element.post_id,
                                alias_id      : element.alias_id,
                                parent_id     : element.parent_id,
                                name          : element.name,
                                hyperlink     : element.hyperlink,
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

                        _posts[element.post_id].data.push({

                            id      : element.post_data_id,
                            field   : element.field,
                            content : element.content,
                            content_raw : element.content_raw

                        });

                    });

                }

                res.send( _posts );

            }

        );

    }

    getPost ( req, res ) {
        this.db.connection.query (

            `SELECT
                p.id AS post_id,
                p.post_type_id as post_type_id,
                p.name,
                p.hyperlink,
                p.size,
                p.status,
                p.created_date,
                p.modified_date,
                pd.id AS post_data_id,
                pd.name AS post_name,
                pd.content
            FROM ${ this.table_prefix }post p
            INNER JOIN ${ this.table_prefix }post_data pd
                ON p.id = pd.post_id
            WHERE p.id = ?;`,
            [req.query.id],
            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    buildHyperlink ( parentId, parentPosts, hyperlink ) {

        let _hyperlink = hyperlink;

        parentPosts.map( ( parent, key ) => {

            if ( parentId == parent.id ) {

                if ( parent.parent_id != 'null' ) {
                    _hyperlink = this.buildHyperlink( parent.parent_id, parentPosts, `/${ parent.hyperlink + hyperlink }` );
                }

            }

        });

        return _hyperlink;

    }

    findChildren ( id, rows, children ) {

        let _children = { ...children };

        rows.map(( row ) => {

            if ( row.parent_id == id ) {

                _children[row.id] = row;
                _children = { ...this.findChildren ( row.id, rows, _children ) };

            }

        });

        return _children;

    }

    /*
    *   For populating post container (home-page and container-page)
    */
    getBlog ( query, done ) {

        const { parentId, parentStatus, container,postTypeId, parentHyperlink, hyperlink } = query;

        this.db.connection.query(
            `SELECT id, parent_id, alias_id, container, name, status FROM ${ this.table_prefix }post;`,
            ( err, posts ) => {

                let children = {};
                let aliases  = {};

                posts.map( ( post ) => {

                    if ( post.parent_id == parentId ) {

                        children[post.id] = post;

                        if ( post.alias_id ) {

                            if ( aliases[post.alias_id] ) {

                                aliases[post.alias_id].push( post );

                            } else {

                                aliases[post.alias_id] = [post];

                            }

                        }

                        if ( post.container == 1 ) {

                            children = { ...this.findChildren ( post.alias_id ? post.alias_id : post.id, posts, children )};

                            for ( let key in children ) {

                                if ( children[key].alias_id ) {

                                    if ( aliases[post.alias_id] ) {

                                        aliases[children[key].alias_id].push( children[key] );

                                    } else {

                                        aliases[children[key].alias_id] = [children[key]];

                                    }

                                }

                            }


                        }

                    }

                });

                const _children = Object.keys( children ).map( key => children[key] );

                let sqlOnIds = '';

                const allowedChildren = [];

                _children.map( ( child, key ) => {

                    if (parentStatus == 'private') {
                        if (child.status != 'hidden') {
                            allowedChildren.push(child)
                        }

                    } else {
                        if (child.status != 'private' && child.status != 'hidden') {
                            allowedChildren.push(child)
                        }

                    }

                });

                allowedChildren.map((child,key) => {
                    sqlOnIds += `p.id = ${ child.alias_id ? child.alias_id : child.id } ${ key < allowedChildren.length - 1 ? 'OR' : ''} `;
                });

                this.db.connection.query (
                    `SELECT
                        a.post_id,
                        a.alias_id,
                        a.parent_id,
                        a.post_type_id,
                        a.post_data_type,
                        a.name,
                        a.hyperlink,
                        a.extension,
                        a.path,
                        a.filename,
                        a.size,
                        a.container,
                        a.status,
                        a.public_date,
                        a.created_date,
                        a.modified_date,
                        b.post_data_id,
                        b.field,
                        b.content,
                        b.content_raw
                    FROM (
                	        SELECT
                                p.id AS post_id,
                                p.alias_id,
                                p.parent_id,
                                p.post_type_id as post_type_id,
                                pdt.name AS post_data_type,
                                p.name,
                                p.hyperlink,
                                p.extension,
                                p.path,
                                p.filename,
                                p.size,
                                p.container,
                                p.status,
                                p.public_date,
                                p.created_date,
                                p.modified_date
                			FROM ${ this.table_prefix }post p
                            INNER JOIN post_data_type pdt
                                ON p.post_data_type_id = pdt.id
                            WHERE p.post_type_id = ? ${ !container ? 'AND p.container = 0' : '' }${ sqlOnIds ? ` AND (${ sqlOnIds })` : ''}
                        ) a
                        LEFT OUTER JOIN
                            (
                                SELECT
                                    p.id AS post_id,
                                    p.alias_id,
                                    p.parent_id,
                                    p.post_type_id as post_type_id,
                                    pdt.name AS post_data_type,
                                    p.name,
                                    p.hyperlink,
                                    p.extension,
                                    p.path,
                                    p.filename,
                                    p.size,
                                    p.container,
                                    p.status,
                                    p.public_date,
                                    p.created_date,
                                    p.modified_date,
                                    pd.id AS post_data_id,
                                    pd.field,
                                    pd.content,
                                    pd.content_raw
                                FROM ${ this.table_prefix }post p
                                INNER JOIN ${ this.table_prefix }post_data pd
                                    ON p.id = pd.post_id
                                INNER JOIN post_data_type pdt
                                    ON p.post_data_type_id = pdt.id
                                WHERE p.post_type_id = ? ${ !container ? 'AND p.container = 0' : '' }${ sqlOnIds ? ` AND (${ sqlOnIds })` : ''}
                                ORDER BY p.parent_id
                            ) b
                        ON a.post_id = b.post_id`,
                    [postTypeId, postTypeId],
                    ( err, rows ) => {

                        console.log(err);

                        const posts = {};

                        let _posts;

                        const lookup = {};

                        if ( rows ) {

                            for ( let i = 0, len = rows.length; i < len; i++ ) {

                                lookup[rows[i].post_id] = rows[i];

                            }

                            rows.map( ( element, key ) => {

                                if ( !posts[element.post_id] ) {

                                    posts[element.post_id] = {

                                        id            : element.post_id,
                                        parent_id     : element.parent_id,
                                        name          : element.name,
                                        hyperlink     : element.hyperlink,
                                        status        : element.status,
                                        extension     : element.extension,
                                        container     : element.container,
                                        public_date   : element.public_date,
                                        created_date  : element.created_date,
                                        modified_date : element.modified_date,
                                        size          : element.size,
                                        data          : {},
                                        hide          : {

                                          path     : element.path,
                                          filename : element.filename,
                                          dataType : element.post_data_type

                                        }

                                    };

                                    // lookup[element.id] = posts[element.hyperlink];

                                }

                                posts[element.post_id].data[element.field] = {

                                    id      : element.post_data_id,
                                    field   : element.field,
                                    content : element.content,
                                    content_raw : element.content_raw

                                };


                            });

                            _posts = [];

                            allowedChildren.map( ( element, key ) => {

                                if ( posts[element.id] ) {

                                    _posts.push( posts[element.id] );

                                } else {

                                    if ( posts[element.alias_id] ) {

                                        const _post = { ...posts[element.alias_id] };

                                        _post.id = element.id;
                                        _post.name = element.name;

                                        _posts.push ( _post );

                                    }

                                }

                            })

                            // _posts = Object.keys( posts ).map( key => posts[key] );

                            this.db.connection.query (

                                `SELECT id, parent_id, hyperlink FROM ${ this.table_prefix }post WHERE post_type_id = ?`,
                                [postTypeId],
                                ( err, rows ) => {

                                    _posts.map( ( element, key ) => {

                                        if ( parentId ) {

                                            _posts[key].hyperlink = parentHyperlink + this.buildHyperlink( element.id, rows, '' );

                                        } else {

                                            _posts[key].hyperlink = hyperlink + this.buildHyperlink( element.id, rows, '' );

                                        }

                                    });

                                    done( _posts );

                                }

                            );

                        } else {

                            done( null );
                        }

                    }

                );

            }

        );

    }

    getPostById ( req, res ) {

        const { post_type_id } = req.query;
        const id = JSON.parse( req.query.id );

        let whereClauseForPostId = 'WHERE';
        let whereClauseForPostData = 'WHERE';

        if ( Array.isArray( id ) ) {

            id.map( ( element, key ) => {

                whereClauseForPostId += ` id = ${element}${ key < id.length -1 ? ' OR ' : ';'}`;
                whereClauseForPostData += ` post_id = ${element}${ key < id.length -1 ? ' OR ' : ';'}`;

            });



        } else {

            whereClauseForPostId += ` id = ${id};`;
            whereClauseForPostData += ` post_id = ${id};`;

        }


        this.db.connection.query (

            `SELECT *
            FROM ${ this.table_prefix }post p
            ${whereClauseForPostId}`,
            [id],
            ( err, posts ) => {

                this.db.connection.query (
                    `SELECT *
                    FROM ${ this.table_prefix }post p
                    WHERE p.post_type_id = ?;`,
                    [post_type_id],
                    ( err, rows ) => {

                        this.db.connection.query (
                            `SELECT *
                            FROM ${ this.table_prefix }post_type
                            WHERE id = ?;`,
                            [post_type_id],
                            ( err, postTypes ) => {


                                if ( posts.length == 1 ) {

                                    this.db.connection.query(
                                        `SELECT *
                                        FROM ${ this.table_prefix }post_data
                                        ${whereClauseForPostData}`,
                                        [],
                                        ( err, postData ) => {

                                            const _postData = {};

                                            /*
                                            *   Other post data is array but this is type of object for varification.
                                            */
                                            postData.map( ( element ) => {

                                                _postData[element.field] = element;

                                            });

                                            const post = {
                                                ...posts[0],
                                                _hyperlink : postTypes[0].hyperlink + this.buildHyperlink( posts[0].parent_id, rows, '' ) + '/' + posts[0].hyperlink,
                                                data : _postData
                                            }

                                            res.send( post );


                                        }

                                    );

                                } else {

                                    this.db.connection.query(
                                        `SELECT *
                                        FROM ${ this.table_prefix }post_data
                                        ${whereClauseForPostData}`,
                                        [],
                                        ( err, postData ) => {

                                            const _posts = [];

                                            posts.map( ( post ) => {

                                                const _postData = {};

                                                /*
                                                *   Other post data is array but this is type of object for varification.
                                                */
                                                postData.map( ( element ) => {

                                                    if ( element.post_id == post.id ) {

                                                        _postData[element.field] = element;

                                                    }



                                                });

                                                const _post = {
                                                    ...post,
                                                    _hyperlink : postTypes[0].hyperlink + this.buildHyperlink( post.parent_id, rows, '' ) + '/' + post.hyperlink,
                                                    data : _postData
                                                }

                                                _posts.push( _post );


                                            });

                                            res.send( _posts );


                                        }

                                    );


                                }







                            }

                        );

                    }

                );

            }

        );

    }

    getPostTypeByHyperlink ( query, done ) {

        const { hyperlink } = query;

        if ( hyperlink != 'favicon.ico' ) {

            this.db.connection.query (

                `SELECT
                    pt.*,
                    COUNT(*) AS post_data_count
                FROM ${ this.table_prefix }post_type pt
                INNER JOIN ${ this.table_prefix }post_meta pm
                    ON pt.id = pm.post_type_id
                WHERE pt.hyperlink = ?
                GROUP BY pt.id;`,
                [hyperlink],

                ( err, postTypes ) => {
                    done( postTypes[0] );
                }

            );

        }

    }

    getPostByHyperlink ( query, done ) {

        const {
            links,
            parentId,
            index,
            postTypeId,
            parentStatus,
            hyperlinks
        } = query;

        if ( links != 'favicon.ico' ) {
            let sql = `SELECT
                p.id AS id,
                p.alias_id,
                p.user_id,
                u.first_name,
                u.last_name,
                p.parent_id,
                p.container,
                p.post_type_id as post_type_id,
                p.name,
                p.filename,
                p.extension,
                p.path,
                p.hyperlink,
                p.size,
                p.status,
                p.created_date,
                p.public_date,
                p.modified_date
            FROM ${this.table_prefix }post p
            INNER JOIN ${this.table_prefix }user u ON p.user_id
            WHERE
                p.hyperlink LIKE ? AND
                post_type_id = ?
                ${ parentId ? '' : 'AND p.parent_id IS NULL'};
            `;
            this.db.connection.query (

                sql,
                [
                    links[index],
                    postTypeId

               ],
                ( err, rows ) => {

                    let _row;
                    rows.map ((row) =>  {
                        if (row.parent_id == parentId) {
                            _row = row;
                        }
                    });

                    if (_row == null) {
                        done( null );
                        return;
                    }

                    if ( index + 1 < links.length  ) {

                        if ( links[index + 1] == '' ) {

                            this.db.connection.query (

                                `SELECT * FROM ${ this.table_prefix }post_data WHERE post_id = ?;`,

                                [_row.id],

                                ( err, data ) => {

                                    _row.data = [];

                                    data.map( ( row ) => {

                                        _row.data[row.field] = row;

                                    })

                                    _row.parentStatus = parentStatus;
                                    _row.hyperlinks   = hyperlinks;

                                    done( _row );

                                    return;

                                }

                            );
                            return;

                        }

                        let parentStatus;

                        const _hyperlinks = hyperlinks;

                        _hyperlinks.push({
                            name : _row.name,
                            hyperlink : _row.hyperlink
                        })

                        if ( !parentStatus ) {

                            parentStatus = _row.status;

                        } else {

                            if ( _row.status == 'hidden' ) {

                                parentStatus = _row.status;

                            } else if ( parentStatus != 'hidden' && _row.status == 'private' ) {

                                parentStatus = _row.status;

                            } else {

                                parentStatus = parentStatus;

                            }

                        }

                        const _query = { ...query };
                        _query.hyperlinks = _hyperlinks;

                        this.getPostByHyperlink({

                            ..._query,
                            index : index + 1,
                            parentId : _row.id,
                            parentStatus,

                        }, done );


                    } else {

                        this.db.connection.query (

                            `SELECT * FROM ${ this.table_prefix }post_data WHERE post_id = ?;`,

                            [_row.alias_id ? _row.alias_id : _row.id],

                            ( err, data ) => {

                                _row.data = {};

                                data.map( ( row ) => {

                                    _row.data[row.field] = row;

                                })

                                _row.parentStatus = parentStatus;
                                _row.hyperlinks   = hyperlinks;

                                done( _row );
                                return;

                            }

                        );



                    }


                }

            );

        } else {

            done( null );

        }

    }

    getPostMeta ( req, res ) {

        this.db.connection.query (

            `SHOW COLUMNS FROM ${ this.table_prefix }post`,

            [],

            ( err, rows ) => {

                let model = {};

                for ( let key in rows ) {

                    model[rows[key]['Field'] ] = null;

                }

                res.send( model );

            }

        );

    }

    getPostDataTypes ( req, res ) {

        this.db.connection.query (

            `SELECT * FROM ${ this.table_prefix }post_data_type`,

            ( err, rows ) => {

                let model = {};

                for ( let key in rows ) {

                    model[rows[key].name] = rows[key].id;

                }

                res.send( model );

            }

        );

    }

    getPostTypeMeta ( req, res ) {

        this.db.connection.query (

            `SELECT
                pt.id,
                pt.name AS post_type_name,
                pm.field AS post_meta_name,
                pm.data_type,
                pm.data,
                pm.main
            FROM ${ this.table_prefix }post_type pt
            LEFT JOIN ${ this.table_prefix }post_meta pm ON pt.id = pm.post_type_id;`,

            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    getPostType ( req, res ) {
        this.db.connection.query (
            `SELECT * FROM ${ this.table_prefix }post_type;`,
            [],
            ( err, rows ) => {
                res.send( rows );
            }
        );
    }

    _getPostType (done) {
        this.db.connection.query (
            `SELECT * FROM ${ this.table_prefix }post_type;`,
            [],
            ( err, rows ) => {
                done( rows );
            }
        );
    }

    getPostData ( req, res ) {

        const { post_id } = req.query;

        this.db.connection.query (

            `SELECT * from ${ this.table_prefix }post_data WHERE id = ?`,

            [post_id],

            ( err, rows ) => {

                res.send( rows );

            }

        );

    }

    renameFile ( fromFile, toFile) {

        const dir = __dirname + "/.." ;

        fs.rename( dir + fromFile, dir + toFile, ( err ) => {

            if ( err ) throw err;

        });

    }

    /**
    *   Replace all special characters that occurs in a filename.
    */
    formatFileName ( filename ) {

        return filename.replace( /[^0-9a-zA-Z\-.]+/g, '-' ).toLowerCase().replace( /^-/, '' ).replace( /-$/, '' );

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

        let parsing = form.parse( req, ( err, fields, files ) => {


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

                let file = files[key];

                fs.readFile( file.path, ( err, data ) => {


                    let fileNameSplit     = self.splitFileNameAndExt( file.name );
                    let fileNameFormatted = self.formatFileName( fileNameSplit[0] );
                    let fileName          = fileNameFormatted + '.' + fileNameSplit[1];
                    let newPath           = dirYearMonth + "/" + fileName;

                    fs.writeFile( newPath, data,  ( err ) => {

                        let path = "/uploads/" + ( year.toString() + "/" + month.toString() ) + "/";

                        self.db.connection.query (

                            `UPDATE ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post SET \`path\` = ?, \`filename\` = ?, \`extension\` = ? WHERE id = ?;`,

                            [path, fileNameFormatted, fileNameSplit[1], fields.id],

                            ( err, rows ) => {

                                self.db.connection.query (

                                    `SELECT p.id AS post_id, p.parent_id, p.post_type_id as post_type_id, pdt.name AS post_data_type, p.name, p.hyperlink, p.status, p.extension, p.path, p.filename, p.size, p.container, p.public_date, p.created_date, p.modified_date, pd.id AS post_data_id, pd.field, pd.content, pd.content_raw FROM ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post p INNER JOIN ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post_data pd ON p.id = pd.post_id INNER JOIN ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post_data_type pdt ON p.post_data_type_id = pdt.id  WHERE post_id = ?`,

                                    [fields.id],

                                    ( err, rows ) => {

                                        const posts = {};

                                        if ( rows ) {

                                            rows.map( ( element, key ) => {

                                                if ( !posts[element.post_id] ) {

                                                    posts[element.post_id] = {

                                                        id            : element.post_id,
                                                        parent_id     : element.parent_id,
                                                        name          : element.name,
                                                        hyperlink     : element.hyperlink,
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

                                                posts[element.post_id].data.push({

                                                    id      : element.post_data_id,
                                                    field   : element.field,
                                                    content : element.content,
                                                    content_raw : element.content_raw

                                                });

                                            });

                                        }

                                        res.send( posts[fields.id] );

                                    }

                                );

                            }

                        );

                        fs.unlink( file.path );

                    });

                });

            }

            if ( err ) {

                console.log( err );

            }

        });

    }

}

export default Post;
