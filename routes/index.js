import express from 'express';
import fs from 'fs';
import url from 'url';
import mime from 'mime';
import path from 'path';
import React, {Component} from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext, match, createRoutes} from 'react-router';

import appRouter from '../client/router.js';

import Database from '../src/models/database.js';
import Site from '../src/models/site';
import Post from '../src/models/post';
import User from '../src/models/user';

import Template from '../public/theme/default/template.js';
import Index from '../public/theme/default/index.js';

import {customRoutes} from './custom-routes/'

const routes = createRoutes(appRouter());
const database = new Database();
const site = new Site();
const post = new Post();
const user = new User();

const router = express.Router();

fs.readFile(__dirname + '/../src/db-config.json', 'utf8', (error, data) =>  {
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

        site.updateConnection(database);
        post.updateConnection(database);
        user.updateConnection(database);

    } catch (error) {
        console.log(error);
    }
});

router.get('/admin', (req, res) => {
    const sess = req.session;

    if ( !sess.username ) {
        res.redirect( '/login' );
    } else {
        const {headers} = req;

        global.navigator = global.navigator || {};
        global.navigator.userAgent = req.headers['user-agent'] || 'all';

        match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

            if (error) {
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


router.get('/login', (req, res) => {
    const {
        headers
    } = req;


    match({routes, location: req.url }, (error, redirectLocation, renderProps) => {

        if (error) {
            res.status(500).send(error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            const content = renderToString(<RouterContext {...renderProps} />);
            res.render( 'index', {title: 'Login | Pollider', data : false, content });
        } else {
            res.status(404).send('Not Found');
        }
    });
});

router.post('/user-login', ( req, res ) => { user.login( req, res ); });
router.post('/user-logout', ( req, res ) => { user.logout( req, res ); });
router.post('/user-get-detail', (req, res) => { user.getDetail(req, res) });
router.get('/get-user-info', ( req, res ) => { user.get( req, res ) });
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


/* User defined routes */
customRoutes(router, database, user);


const handleContainer = function ( row, res ) {

    post.getBlog({
        parentId: row.alias_id ? row.alias_id : row.id,
        parentStatus: row.status,
        postDataCount: row.post_data_count,
        postTypeId: 1,
        container: false,
        parentHyperlink: '',
        hyperlink: row.hyperlink,
        postDataCount: row.post_data_count
    }, (posts) => {

         user._get((_user) => {
             const initialState = {
                 model : {
                     ...row,
                     ..._user
                 },
                 children : posts,
                 type : 'posts',
             };

            const content = renderToString(<Index {...initialState }></Index>);

            res.send( Template({
                body: content,
                title: `${_user.first_name} ${_user.last_name} | ${ row.name }`,
                initialState: JSON.stringify( initialState )
            }));
         });
    });

}

router.get('/', (req, res) => {
    post._getPostType((postTypes) => {
        let home = {};

        postTypes.map(postType => {
            if (postType.home == 1) {
                home = postType;
            }
        });

        post.getBlog({
            postTypeId: 1,
            container: false,
            hyperlink: '',
            parentStatus: 'public'
        }, ( posts ) => {

            user._get((_user) => {
                const initialState = {
                    model : {
                        ..._user,
                        hyperlinks: [{
                            name: home.name,
                            hyperlink: ''
                        }]
                    },
                    children: posts ? posts.sort((a,b) => {
                        const date1 = new Date(a.public_date);
                        const date2 = new Date(a.public_date);
                        return date1.getTime() < date2.getTime();
                    }) : [],
                    type: 'home'
                };

                const content = renderToString(<Index {...initialState }></Index>);

                res.send( Template({
                    body : content,
                    title : `${_user.first_name} ${_user.last_name} | Web Developer`,
                    initialState : JSON.stringify(initialState)
                }));
            });
        });
    });
});


router.get('/*', ( req, res ) => {

    const links = req.originalUrl.replace( '//', '/').split('/').filter((e) => { return e !== '' });

    post._getPostType((postTypes) => {
        let home = {};

        postTypes.map(postType => {
            if (postType.home == 1) {
                home = postType;
            }
        });

        post.getPostByHyperlink({
            links: links,
            index: 0,
            postTypeId: home.id,
            parentId: null,
            hyperlinks: [{
                name: home.name,
                hyperlink : ''
            }]

        }, (postByHyperlink) => {

            const _post = Object.assign({ ...postByHyperlink, post_data_count : home.post_data_count, hyperlink : req.originalUrl });



            user._get((_user) => {
                if (!postByHyperlink) {

                    post.getPostTypeByHyperlink({
                        hyperlink : links[0]
                    }, (postType) => {

                        if ( links.length > 1 ) {

                            if (postType) { // Search for post if post type with given hyperlink exists
                                post.getPostByHyperlink({

                                    links : links.splice(1), // exclude hyperlink for post type
                                    index : 0,
                                    postTypeId : postType.id,
                                    parentId : null,
                                    hyperlinks : [{
                                        name : postType.name,
                                        hyperlink : links[ 0 ]
                                    }]

                                }, (post) => {

                                    const _post = Object.assign({ ...post, post_data_count : postType.post_data_count, hyperlink : req.originalUrl });

                                    if (!post) {
                                        res.send('not found');
                                    } else {

                                        if ( post.extension && post.path ) {

                                            const _path = __dirname + '/../src' + post.path + post.filename + '.' + post.extension;

                                            if (post.extension === 'mp4') {

                                                let streamPath = path.resolve(_path);
                                                //Calculate the size of the file
                                                let stat = fs.statSync(streamPath);
                                                let total = stat.size;
                                                let file;
                                                let contentType = "video/mp4";

                                                if (req.headers.range) {
                                                    let range = req.headers.range;
                                                    let parts = range.replace(/bytes=/, "").split("-");
                                                    let partialstart = parts[0];
                                                    let partialend = parts[1];

                                                    let start = parseInt(partialstart, 10);
                                                    let end = partialend ? parseInt(partialend, 10) : total - 1;
                                                    let chunksize = (end - start) + 1;

                                                    file = fs.createReadStream(streamPath, {
                                                        start: start,
                                                        end: end
                                                    });
                                                    res.writeHead(206, {
                                                        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                                                        'Accept-Ranges': 'bytes',
                                                        'Content-Length': chunksize,
                                                        'Content-Type': contentType
                                                    });
                                                    res.openedFile = file;
                                                    file.pipe(res);
                                                } else {
                                                    file = fs.createReadStream(streamPath);
                                                    res.writeHead(200, {
                                                        'Content-Length': total,
                                                        'Content-Type': contentType
                                                    });
                                                    res.openedFile = file;
                                                    file.pipe(res);
                                                }
                                          } else {

                                              let file = fs.readFileSync( _path );

                                              res.writeHead(200, {'Content-Type': mime.lookup(_path)});
                                              res.end(file, 'binary');
                                          }



                                        } else {

                                            if ( post.container == 1 ) {

                                                handleContainer( _post, res );

                                            } else {

                                                const initialState = {
                                                    model : { ...post },
                                                    type  : 'post',
                                                };

                                                const content = renderToString( <Index {...initialState }/> );

                                                res.send( Template({

                                                    body         : content,
                                                    title        : `${_user.first_name} ${_user.last_name} | ${ post.name }`,
                                                    initialState : JSON.stringify(initialState)

                                                }));

                                            }

                                        }

                                    }

                                })

                            } else {
                                post._getPostType((postTypes) => {
                                    let home = {};

                                    postTypes.map(postType => {
                                        if (postType.home == 1) {
                                            home = postType;
                                        }
                                    });

                                    post.getBlog({
                                        postTypeId: 1,
                                        container: false,
                                        hyperlink: ''
                                    }, ( posts ) => {
                                        user._get((_user) => {
                                            const initialState = {
                                                model : {
                                                    ..._user,
                                                    hyperlinks: [{
                                                        name: home.name,
                                                        hyperlink: ''
                                                    }]
                                                },
                                                children: posts,
                                                type: 'four-oh-four',
                                                status: 'private'
                                            };

                                            const content = renderToString(<Index {...initialState }></Index>);

                                            res.send( Template({
                                                body : content,
                                                title: `${_user.first_name } ${_user.last_name } | Oooooooooops`,
                                                initialState : JSON.stringify(initialState)
                                            }));
                                        });
                                    });
                                });
                            }

                        } else {

                            if (!postType) {

                                post._getPostType((postTypes) => {
                                    let home = {};

                                    postTypes.map(postType => {
                                        if (postType.home == 1) {
                                            home = postType;
                                        }
                                    });

                                    post.getBlog({
                                        postTypeId: 1,
                                        container: false,
                                        hyperlink: ''
                                    }, ( posts ) => {
                                        user._get((_user) => {
                                            const initialState = {
                                                model : {
                                                    ..._user,
                                                    hyperlinks: [{
                                                        name: home.name,
                                                        hyperlink: ''
                                                    }],
                                                    status: 'private'
                                                },
                                                children: posts,
                                                type: 'four-oh-four'
                                            };

                                            const content = renderToString(<Index {...initialState }></Index>);

                                            res.send( Template({
                                                body : content,
                                                title: `${_user.first_name } ${_user.last_name } | Oooooooooops`,
                                                initialState : JSON.stringify(initialState)
                                            }));
                                        });
                                    });
                                });

                            } else {

                                if ( postType.home == 1  ) {

                                    res.redirect('/');

                                } else {

                                    post.getBlog({
                                        postTypeId: postType.id,
                                        container: false,
                                        hyperlink: req.originalUrl
                                    }, ( posts ) => {

                                        const initialState = {
                                            model : {
                                                ..._user
                                            },
                                            model : posts,
                                            type : 'home'

                                        };
                                        const content = renderToString(
                                                <Index {...initialState }></Index>
                                         );

                                        res.send( Template({
                                            body: content,
                                            title: `${_user.first_name } ${_user.last_name } | ${postType.name}`,
                                            initialState : JSON.stringify( initialState )
                                        }));

                                    });
                                }

                            }

                        }

                    });

                } else {

                    if ( postByHyperlink.extension && postByHyperlink.path ) {

                        const path = __dirname + '/../src' + postByHyperlink.path + postByHyperlink.filename + '.' + postByHyperlink.extension;

                        let file = fs.readFileSync( path );

                        res.writeHead(200, {'Content-Type': mime.lookup( path ) });
                        res.end(file, 'binary');

                    } else {

                        if ( postByHyperlink.container == 1 ) {

                            handleContainer( _post, res );

                        } else {

                            const initialState = {
                                model : { ...postByHyperlink },
                                type  : 'post',
                            };

                            const content = renderToString( <Index {...initialState }/> );

                            user._get((_user) => {

                                res.send(Template({

                                    body         : content,
                                    title        : `${_user.first_name} ${_user.last_name} | ${postByHyperlink.name}`,
                                    initialState : JSON.stringify(initialState)

                                }));

                            });

                        }

                    }

                }

            });

        })


    });

});


module.exports = router;
