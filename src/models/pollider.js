// import this.db.config  from '../../db-config.js';

class Pollider {

    constructor ( db, req, res ) {

        this.db = db;
        this.req = req;
        this.res = res;

    }

    registerPost ( data ) {

        this.db.connection.query (

            `SELECT name FROM ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post_type WHERE name LIKE '${data.name }'`,

            [],

            ( err, row ) => {

                this.db.connection.query (

                    `INSERT INTO ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post_type ( \`name\`, \`name_singular\`, \`name_plural\`, \`home\`, \`hyperlink\`, \`uploadable\`, \`support_audio\`, \`support_document\`, \`support_image\`, \`support_other\`, \`support_post\`, \`support_video\` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );`,

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

                    ( err, row ) => {

                        if( !err ) {

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


                            this.db.connection.query (

                                `INSERT INTO ${this.db.config.table_prefix ? this.db.config.table_prefix + '_' : ''}post_meta ( \`post_type_id\`, \`field\`, \`data_type\`, \`display\`, \`main\`, \`data\` ) VALUES ?;`,

                                [ meta ],

                                ( err, row ) => {

                                    console.log( err, row );


                                }

                            );


                        }

                    }

                );

            }



        );

    }

}

export default Pollider;
