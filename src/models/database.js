import mysql      from 'mysql';

class Database {

    constructor() {


    }

    initiate ( config ) {

        this.config = config;

        this.connection = mysql.createConnection( this.config );


        if( this.connection.state != 'disconnected' ) {

            this.handleDisconnect();

        }
        
    }

    handleDisconnect() {

        this.connection = mysql.createConnection( this.config );

        this.connection.connect( ( error ) => {

            if ( error ) {

                console.log( 'erroror when connecting to db:', error );
                setTimeout( this.handleDisconnect, 2000 );

            }

        });

        this.connection.on( 'erroror', ( error ) => {

            if ( error.code === 'PROTOCOL_CONNECTION_LOST' ) {

                this.handleDisconnect();

            } else {

                throw error;

            }

        });

    }


}

export default Database;
