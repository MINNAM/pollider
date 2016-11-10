import http       from 'http';
import express    from 'express';
import mysql      from 'mysql';
import bodyParser from 'body-parser';

/* Pollider */
import main       from './m-configure.js';
import install    from './m-install.js';
import Post       from './models/post';

let app = express();

// app.use( bodyParser.json() );
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use( express.static( __dirname ));

app.all( '*',  function( req, res, next ) {

    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
    next();

});

let connection = mysql.createConnection({

    host               : 'localhost',
    user               : 'root',
    password           : '1111',
    database           : 'm',
    multipleStatements : true,

});

function handleDisconnect() {

    let connection = mysql.createConnection({

        host               : 'localhost',
        user               : 'root',
        password           : '1111',
        database           : 'm',
        multipleStatements : true,

    });
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();



let post = new Post( connection );

app.get( '/install', ( req, res ) => { install( connection, req, res ); res.send('Installed'); });
app.get( '/configure', ( req, res ) => { main( connection, req, res ); });


app.get( '/get-posts?', ( req, res ) => { post.getPosts( req, res ); });
app.get( '/get-post?', ( req, res ) => { post.getPost( req, res ); });
app.get( '/get-post-meta?', ( req, res ) => { post.getPost( req, res ); });
app.get( '/get-post-type?', ( req, res ) => { post.getPostType( req, res ); });
app.get( '/get-post-type-meta?', ( req, res ) => { post.getPostTypeMeta( req, res ); });
app.get( '/get-post-data', ( req, res ) => { post.getPostData( req, res ); });
app.get( '/get-post-data-types', ( req, res ) => { post.getPostDataTypes( req, res ); });
app.get( '/check-post-exist', ( req, res ) => { post.checkPostExist( req, res ); });

app.post( '/insert-post', ( req, res ) => { post.insertPost( req, res ); } );
app.post( '/update-post', ( req, res ) => {
    console.log( 'yes', req.body );
    post.updatePost( req, res );

} );
app.post( '/delete-post', ( req, res ) => { post.deletePost( req, res ); } );
app.post( '/upload-file', ( req, res ) => { post.uploadFile( req, res ); } );

let server = app.listen( 30000, '0.0.0.0', function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log( "Listening at http://%s:%s", host, port );

});
