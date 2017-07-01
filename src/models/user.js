import bcrypt from 'bcrypt';

class User {

    constructor ( db ) {

        this.db = db;

    }

    updateConnection ( db ) {

        this.db = db;

    }

    login ( req, res ) {

        this.db.connection.query(

            `SELECT * FROM user WHERE username = ?`,
            [ req.body.loginData[ 0 ].value  ],

            ( err, rows, fields ) => {

                if( !err ) {

                    var hash = rows[ 0 ].password;

                    bcrypt.compare( req.body.loginData[ 1 ].value, hash, ( err, doesMatch ) => {

                        if ( doesMatch ) {

                            req.session.username = req.body.loginData[ 0 ].value;

                            console.log( 'login', req.session );

                            res.send( true );

                        } else {

                            res.send( false );

                        }

                    });


                } else {

                    res.send( false );

                }

            }
        );

    }

    logout ( req, res ) {

        req.session.destroy( ( err ) => {

            res.send( true );

        });

    }

    getInfo () {


        this.db.connection.query('SELECT * FROM user',  (err, rows, fields) => {
            if(!err) {
                res.send(rows);
                console.log('is : ', rows);
            } else
            console.log('error query');
        });

    }

    getUserByPost ( userId, done ) {

        this.db.connection.query(
            'SELECT first_name, last_name, FROM user WHERE id = ?',
            [ userId ],

            ( err, rows, fields ) => {

                console.log( 'user' , userId, rows );

                done( rows[ 0 ] );

            }

        )


    }

}

export default User;
