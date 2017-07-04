import express from 'express';
import request from 'request';
import fs      from 'fs';
import url     from 'url';
import mime    from 'mime';

import React, {Component}                   from 'react';
import {renderToString}                     from 'react-dom/server';
import {RouterContext, match, createRoutes} from 'react-router';

import appRouter from '../client/router.js';

import Database from '../src/models/database.js';
import Post     from '../src/models/post';
import User     from '../src/models/user';
import Install  from '../src/models/install';

import Template from '../public/theme/default/template.js';
import Index from '../public/theme/default/index.js';
import HomePage from '../public/theme/default/home-page.js';
import _Post from '../public/theme/default/post.js';

import Mail from './mail.js';


const routes   = createRoutes(appRouter());
const database = new Database();
const post     = new Post();
const user     = new User();
const install  = new Install();



fs.readFile(__dirname + '/../src/db-config.js', 'utf8', (err, data) =>  {

    try {

        const db_config = JSON.parse( data.toString().trim() );

        database.initiate({

            host               : db_config.host,
            user               : db_config.user,
            password           : db_config.password,
            database           : db_config.name,
            table_prefix       : db_config.table_prefix,
            multipleStatements : true,

        });

        post.updateConnection(database);
        user.updateConnection( database );

    } catch ( e ) {

        console.log( e );

    }

});


class DataProvider extends Component {
    getChildContext() {
        return {data: this.props.data};
    }

    render() {
        return <RouterContext {...this.props}/>;
    }
}

DataProvider.propTypes = {
    data: React.PropTypes.object
};

DataProvider.childContextTypes = {
    data: React.PropTypes.object
};

/*eslint-disable*/
const router = express.Router();
/*eslint-enable*/


router.get('/admin', (req, res) => {

    var sess = req.session;

    if ( !sess.username ) {

        res.redirect( '/login' );

    } else {

        const {headers} = req;

        global.navigator = global.navigator || {};
        global.navigator.userAgent = req.headers['user-agent'] || 'all';

        match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {

            if ( error ) {

              res.status(500).send(error.message);

            } else if (redirectLocation) {

              res.redirect(302, redirectLocation.pathname + redirectLocation.search);

            } else if (renderProps) {

                const content = renderToString(<RouterContext {...renderProps} />);

                res.render('index', {title: 'Admin | Pollider', data : false, content});

            } else {

              res.status(404).send('Not Found');

            }

        });

    }




});

router.get('/install', (req, res) => {

    const { headers } = req;

    match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

        if (error) {

            res.status( 500 ).send( error.message );

        } else if (redirectLocation) {

            res.redirect(302, redirectLocation.pathname + redirectLocation.search);

        } else if (renderProps) {

            const content = renderToString(<RouterContext {...renderProps} />);

            res.render('index', {title: 'Install | Pollider', data : false, content});

        } else {

            res.status(404).send('Not Found');

        }

    });

});

router.get( '/login', (req, res) => {

    const { headers } = req;


    match( {routes, location: req.url }, (error, redirectLocation, renderProps) => {

        if (error) {

            res.status(500).send(error.message);

        } else if (redirectLocation) {

            res.redirect(302, redirectLocation.pathname + redirectLocation.search);

        } else if (renderProps) {

            const content = renderToString(<RouterContext {...renderProps} />);

            res.render( 'index', {title: 'Install | Pollider', data : false, content });

        } else {

            res.status(404).send('Not Found');

        }

    });

});


router.get( '/setting', (req, res) => {

    const { headers } = req;

    match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

        if (error) {

            res.status(500).send(error.message);

        } else if (redirectLocation) {

            res.redirect(302, redirectLocation.pathname + redirectLocation.search);

        } else if (renderProps) {

            const content = renderToString(<RouterContext {...renderProps} />);

            res.render( 'index', {title: 'Install | Pollider', data : false, content });

        } else {

            res.status(404).send('Not Found');

        }

    });

});


router.post( '/user-login', ( req, res ) => { user.login( req, res ); });
router.post( '/user-logout', ( req, res ) => { user.logout( req, res ); });

router.get( '/get-user-info', ( req, res ) => { user.getInfo( req, res ) });

router.get('/get-posts?', ( req, res ) => { post.getPosts( req, res ); });
router.get('/get-blog?', ( req, res ) => { post.getBlog( req, res ); });
router.get('/get-post?', ( req, res ) => { post.getPost( req, res ); });
router.get('/get-post-meta?', ( req, res ) => { post.getPost( req, res ); });
router.get('/get-post-type?', ( req, res ) => { post.getPostType( req, res ); });
router.get('/get-post-type-meta?', ( req, res ) => { post.getPostTypeMeta( req, res ); });
router.get('/get-post-data', ( req, res ) => { post.getPostData( req, res ); });
router.get('/get-post-data-types', ( req, res ) => { post.getPostDataTypes( req, res ); });
router.get('/get-post-by-id', ( req, res ) => { post.getPostById( req, res ); });
router.get('/check-post-exist', ( req, res ) => { post.checkPostExist( req, res ); });



router.post( '/insert-post', ( req, res ) => { post.insertPost( req, res ); } );
router.post( '/create-alias', ( req, res ) => { post.createAlias( req, res ); } );
router.post( '/update-post', ( req, res ) => { post.updatePost( req, res ); });
router.post( '/delete-post', ( req, res ) => { post.deletePost( req, res ); } );
router.post( '/upload-file', ( req, res ) => {  post.uploadFile( req, res ); } );
router.post( '/add-post-reference', ( req, res ) => { /*post.addPostReferece( req, res );*/ res.send( true ) } );

router.post( '/install', ( req, res ) => {

    install.createConfig( req, res, () => {

        fs.readFile( __dirname + '/../src/db-config.js', 'utf8', ( err, data ) =>  {

            const db_config = JSON.parse( data.toString().trim() );

            database.initiate({

                host               : db_config.host,
                user               : db_config.user,
                password           : db_config.password,
                database           : db_config.name,
                table_prefix       : db_config.table_prefix,
                multipleStatements : true,

            });

            install.updateConnection( database );
            post.updateConnection( database );
            user.updateConnection( database );

            install.installDatabase( req, res, db_config, () => {

                install.installUser( req, res, db_config );

            });

        });

    });

});

router.post( '/contact', ( req, res ) => {

    const data = [];

    if ( req.body ) {

        req.body.map( ( element ) => {

            data[ element.id ] = element.value

        });

        const mail = new Mail();

        mail.send({
            from    : data[ 'email' ],
            to      : 'nsm12889@gmail.com',
            subject : `Message from ${ data['first_name'] } ${ data['last_name'] } ${ data['company'] ? `@ ${ data['company'] }` : '' }`,
            text    : data[ 'message' ]

        }, ( sent ) => {

            mail.send({
                from    : 'nsm12889@gmail.com',
                to      : data[ 'email' ],
                subject : `Sung Min Nam | Contact Receipt`,
                html    : `
                    <div>
                        <p>
                            Hello ${ data[ 'first_name' ] },
                            <br />
                            <br />
                            Thank you for your inquiry. <br />
                            I'll get back to you soon!
                            <br />
                            <br />
                            Sung Min
                            <br />
                            <br />
                            -----------------------------------
                            ${ data[ 'message' ] }

                        </p>
                    </div>
                `

            }, ( sent ) => {

                res.send( sent );

            });



        });

    }
    
});

const handleContainer = function ( row, res ) {


    post.getBlog({

        parentId : row.id,
        parentStatus : row.status,
        postDataCount : row.post_data_count,
        postTypeId : 1,
        container : false,
        parentHyperlink : 'projects',
        hyperlink : row.hyperlink,
        postDataCount : row.post_data_count

    }, ( posts ) => {

        const initialState = {
            model : {
                ...row,
                first_name : 'Min',
                last_name : 'Nam',
            },
            children : posts,
            displayProfile : true,
            type : 'post-container',

        };
        const content = renderToString(
                <Index {...initialState }></Index>
         );


        res.send( Template({
            body         : content,
            title        : `Sung Min Nam | ${ post.name }`,
            initialState : JSON.stringify( initialState )
        }));

    });

}

router.get('/', (req, res) => {

    post.getBlog({

        postTypeId : 1,
        container : false,
        hyperlink : 'projects'

    }, ( posts ) => {

        const initialState = {
            model : {
                first_name : 'Min',
                last_name : 'Nam',
                hyperlinks : [{
                    name : 'Projects',
                    hyperlink : 'projects'
                }]
            },
            children : posts,
            displayHeader : true,
            type : 'home'

        };
        const content = renderToString(
                <Index {...initialState }></Index>
         );


        res.send( Template({
            body : content,
            title : `Sung Min Nam | Web Developer`,
            initialState : JSON.stringify( initialState )
        }));

    });

});


router.get('/*', ( req, res ) => {

    const links = req.originalUrl.replace( '//', '/').split('/');

    post.getPostTypeByHyperlink({

        hyperlink : links[ 1 ]

    }, ( postType ) => {

        if ( links.length > 2 ) {

            if ( postType ) {

                post.getPostByHyperlink({

                    links : links.slice(2),
                    index : 0,
                    postTypeId : postType.id,
                    parentId : null,
                    hyperlinks : [{
                        name : 'Projects',
                        hyperlink : links[ 1 ]
                    }]

                }, ( post ) => {

                    const _post = Object.assign({ ...post, post_data_count : postType.post_data_count, hyperlink : req.originalUrl });

                    if ( !post ) {

                        res.send( 'not found' );

                    } else {

                        if ( post.extension && post.path ) {

                            const path = __dirname + '/../src' + post.path + post.filename + '.' + post.extension;

                            var file = fs.readFileSync( path );

                            res.writeHead(200, {'Content-Type': mime.lookup( path ) });
                            res.end(file, 'binary');

                        } else {

                            if ( post.container == 1 ) {

                                handleContainer( _post, res );

                            } else {

                                const initialState = {

                                    model : { ...post },
                                    type  : 'post',
                                    displayProfile : false

                                };

                                const content = renderToString( <Index {...initialState }/> );

                                res.send( Template({

                                    body         : content,
                                    title        : `Sung Min Nam | ${ post.name }`,
                                    initialState : JSON.stringify(initialState)

                                }));

                            }

                        }

                    }

                })

            }

        } else {

            if ( postType.home == 1  ) {

                res.redirect('/');

            } else {

                post.getBlog({

                    postTypeId : postType.id,
                    container : false,
                    hyperlink : req.originalUrl

                }, ( posts ) => {

                    const initialState = {
                        model : {
                            first_name : 'Min',
                            last_name : 'Nam',
                        },
                        displayProfile : true,
                        model : posts,
                        type : 'home'

                    };
                    const content = renderToString(
                            <Index {...initialState }></Index>
                     );


                    res.send( Template({
                        body : content,
                        title        : `Sung Min Nam | ${ post.name }`,
                        initialState : JSON.stringify( initialState )
                    }));

                });

            }

        }

    });

});


module.exports = router;
