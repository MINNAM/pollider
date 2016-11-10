import { jsdom } from 'jsdom';

class M {

    constructor ( connection, req, res ) {

        this.connection = connection;
        this.req = req;
        this.res = res;

    }

    html ( content ) {

        return '<html><head><style>@import "https://fonts.googleapis.com/css?family=Cutive+Mono|Roboto"; *{ font-family: Cutive Mono; }</style></head><body>' + content + '</body></html>';

    }

    error ( text ) {

        return '<div>' + text + '</div>';

    }

    registerPost ( data ) {

        var output = '<h2>Registering Post "' + data.name + '"</h2>';

        this.connection.query (

            "SELECT name FROM m_post_type WHERE name LIKE '" + data.name + "'",

            [],

            function ( err, row ) {

                if ( err ) {

                    output += this.error( err );

                } else {



                    if ( row.length != 0 ) {

                        output += '<h3>Table exists</h3>';

                    } else {


                        this.connection.query (

                            "INSERT INTO m_post_type ( `name`, `name_singular`, `name_plural`, `uploadable`, `support_audio`, `support_document`, `support_image`, `support_other`, `support_post`, `support_video` ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  );",

                            [
                                data.name,
                                data.name_singular,
                                data.name_plural,
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
                                            element.display

                                        ]);

                                    });


                                    this.connection.query (

                                        "INSERT INTO m_post_meta ( `post_type_id`, `field`, `data_type`, `display` ) VALUES ?;",

                                        [ meta ],

                                        ( err, row ) => {

                                            console.log( 'post_data_types', err );
                                            console.log( 'post_data_types', row );

                                        }

                                    );


                                }

                            }

                        );

                        output += '<h3>Table registered</h3>';

                    }

                }



            }.bind( this )

        );

    }

}

export default M;
