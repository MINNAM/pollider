import fs from 'fs';
import bcrypt from 'bcrypt';

/* Pollider */
import main from '../configure.js';

import CONFIG     from '../../client/models/m-config.js';
// import config  from '../../db-config.js';

import installSQLTemplate from './file-template/sql.js';
import dbConfigCNFTemplate from './file-template/cnf.js';
import dbConfigJSTemplate from './file-template/javascript.js';


class Install {

    constructor ( connection ) {



    }

    updateConnection ( db ) {

        this.db = db;

    }

    installUser ( req, res, config ) {

        const user = {};

        req.body.user.map( ( element, key ) => {

            user[ element.name ] = element.value;

        });

        bcrypt.hash( user.password, 5, ( err, encryptedPassword ) => {

            this.db.connection.query(

                `INSERT INTO ${config.table_prefix == '' ? '' : config.table_prefix + '_'}user( \`username\`, \`password\`, \`first_name\`, \`last_name\`, \`permission\` ) VALUES( ?, ?, ?, ?, 2  )`,
                [ user.email, encryptedPassword, user.first_name, user.last_name ],
                ( error, row ) => {

                    console.log( 'user', row );

                    if( error ) {

                        console.log( error );

                        // res.send({ error });
                        return;

                    }

                    console.log( row );

                    return;

                }

            );

        });





    }

    createConfig ( req, res, done ) {

        const database = {};

        req.body.database.map( ( element, key ) => {

            database[ element.name ] = element.value;

        });

        fs.writeFile( __dirname + "/../../db-config.js", dbConfigJSTemplate({ name : database.name, user : database.user, password : database.password, host : database.host, table_prefix : database.table_prefix ? database.table_prefix : '' }), function( error ) {

            if ( error ) {

                res.send({ error });
                return;

            }

            fs.writeFile( __dirname + "/../../db-config.cnf", dbConfigCNFTemplate({ user : database.user, password : database.password, host : database.host }), function( error ) {

                if ( error ) {

                    res.send({ error });
                    return;

                }

                fs.writeFile( __dirname + "/../sql/install.sql", installSQLTemplate({ name : database.name, table_prefix : database.table_prefix ? database.table_prefix + '_' : '' }), function( error ) {

                    if ( error ) {

                        res.send({ error });
                        return;

                    }

                    done();

                    return;

                });

            });

        });






    }

    getInitialQueries ( config ) {

        const QUERIES = {

            postContentTypes : [

                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 1, 'text', 'text' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 2, 'long-text', 'long-text' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 3, 'project', 'project' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 4, 'post-container', 'post-container' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 5, 'select', 'select' );`

            ],
            postDateTypes : [

                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 1, 'folder' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 2, 'image' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 3, 'text' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 4, 'audio' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 5, 'video' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 6, 'post' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 7, 'application' );`,
                `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 8, 'other' );`,

            ]

        };

        let queries = '';

        for( var key in QUERIES ) {

            QUERIES[ key ].map(( element ) => {

                queries += element;

            });

        }

        return queries;

    }

    installDatabase ( req, res, config, done ) {

        const platform = process.platform;

        let mysqlDir = 'mysql';

        if ( /^darwin/.test( platform ) ) {

            mysqlDir = '/usr/local/mysql/bin/mysql';

        }

        let queries = this.getInitialQueries( config );

        const installCmd = `${mysqlDir} --defaults-extra-file=${__dirname}/../../db-config.cnf ${config['name']} < ${__dirname}/../sql/install.sql`;
        const exec       = require("child_process").exec;

        exec( installCmd, ( error, stdout, stderr ) => {

            if ( stderr ) {
                // res.send({ error : stderr, from : 'installCmd' });
                return;

            }

            this.db.connection.query(

                queries,
                [],
                ( error, row ) => {

                    if ( error ) {

                        // res.send({ error });
                        console.log( error );
                        return;

                    }

                    try {

                        console.log( 'done' );
                        main( this.db, req, res );
                        done();


                        return;

                    } catch ( error ) {

                        console.log( error );
                        // res.send({ error : stderr, from : 'main' });
                        return;


                    }


                }

            );

        });

    }

}

export default Install;
