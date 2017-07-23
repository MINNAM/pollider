import bcrypt from 'bcrypt';

class User {

    constructor (db) {
        this.db = db;
    }

    updateConnection (db) {
        this.db = db;
    }

    get (name, done) {
        this.db.connection.query(
            'SELECT * FROM user WHERE name = ?',
            [name],
            (error, rows, fields) => {
            if (!error) {
                done(rows);
            } else {
                console.log(error);
            }
        });
    }

}

export default User;
