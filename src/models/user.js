import bcrypt from 'bcrypt';

class User {

    constructor ( db ) {

        this.db = db;

    }

    updateConnection ( db ) {

        this.db = db;

    }

    getDetail (req, res) {

        const sess = req.session;

        res.send(sess);

    }

    login ( req, res ) {

        this.db.connection.query(

            `SELECT * FROM user WHERE username = ?`,
            [ req.body.username.value  ],

            ( err, rows, fields ) => {

                if( !err ) {

                    var hash = rows[ 0 ].password;

                    bcrypt.compare( req.body.password.value, hash, ( err, doesMatch ) => {

                        if ( doesMatch ) {

                            req.session.username = req.body.username.value;
                            req.session.first_name = rows[ 0 ].first_name;
                            req.session.last_name = rows[ 0 ].last_name;
                            req.session.permission = rows[ 0 ].permission;

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

    get (req,res) {
        this.db.connection.query('SELECT * FROM user',  (error, rows, fields) => {
            if (!error) {
                res.send(rows[0]);
            } else {
                console.log(error);
            }
        });
    }

    _get (done) {
        this.db.connection.query('SELECT first_name, last_name FROM user',  (error, rows, fields) => {
            if (!error) {
                done(rows[0]);
            } else {
                console.log(error);
            }
        });

    }

    getUserByPost (userId, done) {
        this.db.connection.query(
            'SELECT first_name, last_name, FROM user WHERE id = ?',
            [userId],
            (err, rows, fields ) => {
                done( rows[ 0 ] );
            }
        );
    }

}

export default User;
