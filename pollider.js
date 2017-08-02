var fs = require('fs');
var readline = require('readline');
var prompt = require('prompt');
var mysql = require('mysql');
var fileTemplate = require('./src/models/file-template.js');
var bcrypt = require('bcrypt');

var Loading = function (param) {
    var Loading = Object.assign({
        chars: {
            loading: '▏▎▍▌▋▊▉█',
            finished: '█'
        }
    }, param, {
        stream: process.stdout,
        index: 0
    });

    Loading.init = function () {
        return Loading;
    };

    Loading.write = function (data) {
        if (data.index)
            this.stream.write(this.chars.loading[data.index] + ' ' + data.message);
        else
            this.stream.write(data.message);
    };

    Loading.clear = function (data) {
        readline.clearLine(this.stream, 0);
        readline.cursorTo(this.stream, 0);
    };

    Loading.start = function (message) {

        if (this.interval)
            clearInterval(this.interval);

        this.interval = setInterval(function() {
            this.clear();
            this.write({
                index: this.index,
                message: message
            });
            this.index = (this.index + 1) % this.chars.loading.length;
        }.bind(this), 500);

    };

    Loading.stop = function(message) {

        this.clear();
        clearInterval(this.interval);
        this.write({
            message: message
        });
        this.write({
            message: '\n'
        });
        this.index = 0;

    };

    return Loading.init();
};

var loading = new Loading();

prompt.message = '';
prompt.delimiter = '';
prompt.start();

var schema = {
    properties: {
        site_address: {
            description: 'Site Address:',
            default: 'http://localhost',
            required: true
        },
        site_port: {
            description: 'Site Port:',
            default: '3000',
            required: true
        },
        database_host: {
            description: 'Database Host:',
            default: 'localhost',
            required: true
        },
        database_name: {
            description: 'Database Naame:',
            default: 'pollider',
            required: true
        },
        database_user: {
            description: 'Database User:',
            default: 'root',
            required: true
        },
        database_password: {
            description: 'Database Password:',
            required: true,
            hidden: 'true',
        },
        database_table_prefix: {
            description: 'Database Table Prefix:',
            default: '',
        },
        user_first_name: {
            description: 'First Name:',
            required: true,
        },
        user_last_name: {
            description: 'Last Name:',
            required: true,
        },
        user_email: {
            description: 'User Email:',
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Provide valid email',
            required: true,
        },
        user_password: {
            description: 'User Password:',
            required: true,
            hidden: 'true',
        },
        user_repassword: {
            description: 'Re-password:',
            message: 'Password does not match',
            required: true,
            hidden: 'true',            
            conform: function (value) {
                return prompt.history('user_password').value == value;
            }
        }
    }
};

function getInitialQueries (config, pollider_config) {
    const queries = {
        postContentTypes: [
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 1, 'text', 'text' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 2, 'long-text', 'long-text' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 3, 'project', 'project' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 4, 'post-container', 'post-container' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_content_type ( \`id\`, \`name\`, \`component_name\` ) VALUES ( 5, 'select', 'select' );`
        ],
        postDateTypes: [
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 1, 'folder' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 2, 'image' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 3, 'text' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 4, 'audio' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 5, 'video' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 6, 'post' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 7, 'application' );`,
            `INSERT INTO ${ config ? (config.table_prefix ? config.table_prefix + '_' : '') : '' }post_data_type ( \`id\`, \`name\` ) VALUES ( 8, 'other' );`,
        ],
    };

    let queriesSummed = '';

    for (let key in queries) {
        queries[ key ].map((query) => {
            queriesSummed += query;
        });
    }

    return queriesSummed;
}

function registerPost(connection, config, data) {

    connection.query (
        `SELECT name FROM ${config.table_prefix ? config.table_prefix + '_' : ''}post_type WHERE name LIKE '${data.name}'`,
        [],
        (err, row) => {
            connection.query (
                `INSERT INTO ${config.table_prefix ? config.table_prefix + '_' : ''}post_type ( \`name\`, \`name_singular\`, \`name_plural\`, \`home\`, \`hyperlink\`, \`uploadable\`, \`support_audio\`, \`support_document\`, \`support_image\`, \`support_other\`, \`support_post\`, \`support_video\` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );`,
                [
                    data.name,
                    data.name_singular,
                    data.name_plural,
                    data.home ? true : false,
                    data.hyperlink,
                    data.uploadable,
                    data.support.audio,
                    data.support.document,
                    data.support.image,
                    data.support.other,
                    data.support.post,
                    data.support.video
                ],

                (error, row) => {
                    if( !error ) {
                        var meta = [];

                        data.meta.map( function( element ) {
                            meta.push ([
                                row.insertId,
                                element.field,
                                element.data_type,
                                element.display,
                                element.main,
                                element.data ? JSON.stringify( element.data ) : null
                            ]);
                        });

                        connection.query (
                            `INSERT INTO ${config.table_prefix ? config.table_prefix + '_' : ''}post_meta ( \`post_type_id\`, \`field\`, \`data_type\`, \`display\`, \`main\`, \`data\` ) VALUES ?;`,
                            [ meta ],
                            (error, row) => {

                            }
                        );
                    }

                }
            );
        }
    );
}

function installDatabase (config, pollider_config, user) {

    var platform = process.platform;

    var mysqlDir = 'mysql';

    if (/^darwin/.test(platform)) {
        mysqlDir = '/usr/local/mysql/bin/mysql';
    }

    var queries = getInitialQueries(config, pollider_config);
    var installCmd = `${mysqlDir} --defaults-extra-file=${__dirname}/src/db-config.cnf ${config['name']} < ${__dirname}/src/sql/install.sql`;
    var exec = require("child_process").exec;

    exec(installCmd, (error, stdout, stderr) => {

        if (stderr) {
            // res.send({ error : stderr, from : 'installCmd' });
            return;
        }

        loading.start('Populating Database...');

        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.name,
            table_prefix: config.table_prefix,
            multipleStatements : true,
        });

        connection.query(queries, [], (error,row) => {

            if (error) {
                console.log( error );
                loading.stop('');
            } else {

                try {

                    loading.start('Populating Post Types...')

                    pollider_config.postTypes.map(function ( postType ) {

                        registerPost(connection, config, postType);
                        installUser(connection, config, user);

                    });

                    loading.stop('Done!');

                } catch ( error ) {

                }

            }
        });
    });

}

function installUser (connection, config, user) {
    bcrypt.hash(user.password, 5, (error, encryptedPassword) => {
        connection.query(
            `INSERT INTO ${config.table_prefix == '' ? '' : config.table_prefix + '_'}user(\`username\`, \`password\`, \`first_name\`, \`last_name\`, \`permission\`) VALUES(?, ?, ?, ?, 0)`,
            [
                user.email,
                encryptedPassword,
                user.first_name,
                user.last_name
            ],
            ( error, row ) => {
                if (error)
                    throw error;
            }
        );
    });

}


function crateSiteJS (data) {
    return (
`
const address = '${data.address}';
const port = ${data.port};

const SITE = {
    address,
    port,
    url: '${data.address}:${data.port}'
};

export default SITE;`
    );
}

prompt.get(schema, (err, result) => {

    if (result) {

        fs.readFile(__dirname + '/.pollider.json', 'utf8', (err, data) => {
            try {

                const pollider_config = JSON.parse(data);

                loading.start('Creating Config Files...');

                const {
                    site_address,
                    site_port,
                    database_host,
                    database_name,
                    database_user,
                    database_password,
                    database_table_prefix,
                    user_first_name,
                    user_last_name,
                    user_email,
                    user_password
                } = result;

                fs.writeFile(__dirname + "/client/site.js",
                    crateSiteJS({
                        address: site_address,
                        port: site_port
                    }), function (error) {

                        fs.writeFile(__dirname + "/src/db-config.json",
                            fileTemplate.createJS({
                                name: database_name,
                                user: database_user,
                                password: database_password,
                                host: database_host,
                                table_prefix: database_table_prefix
                            }), function (error) {
                                fs.writeFile(__dirname + "/src/db-config.cnf",
                                    fileTemplate.createCNF({
                                        user: database_user,
                                        password: database_password,
                                        host: database_host,
                                    }), function (error) {

                                        fs.writeFile(__dirname + "/src/sql/install.sql",
                                            fileTemplate.createSQL({
                                                name: database_name,
                                                table_prefix: database_table_prefix
                                            }), function (error) {

                                                fs.readFile(__dirname + '/src/db-config.json', 'utf8', (err, data) =>  {
                                                    loading.stop('Config File Created!');
                                                    const db_config = JSON.parse(data);

                                                    installDatabase(
                                                        db_config,
                                                        Object.assign(pollider_config),
                                                        {
                                                            first_name: user_first_name,
                                                            last_name: user_last_name,
                                                            email: user_email,
                                                            password: user_password
                                                        }
                                                    );
                                                });

                                            }
                                        );
                                    }
                                );
                            }
                        );

                    }
                );

            } catch ( e ) {
                console.log( e );
            }
        });
    } else {
        console.log("Cancelled");
    }
});
