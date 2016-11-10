/* Pollider */
import main       from './m-configure.js';

let exec = require("child_process").exec;

let queryUser = "INSERT INTO m_user( `username`, `password`, `first_name`, `last_name`, `permission` ) VALUES( 'admin', '1234', '', '', 2  );";

let queryPostContentTypes = "INSERT INTO m_post_content_type ( `id`, `name`, `component_name` ) VALUES ( 1, 'text', 'text' );" +
"INSERT INTO m_post_content_type ( `id`, `name`, `component_name` ) VALUES ( 2, 'long-text', 'long-text' );" +
"INSERT INTO m_post_content_type ( `id`, `name`, `component_name` ) VALUES ( 3, 'project', 'project' );";

let queryPostDataTypes = "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 1, 'root_folder' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 2, 'folder' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 3, 'image' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 4, 'text' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 5, 'audio' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 6, 'video' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 7, 'post' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 8, 'application' );" +
    "INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 9, 'other' );";


function install ( connection, req, res ) {

    exec( '/usr/local/mysql/bin/mysql --user=root --password=1111 m < ' + __dirname + "/sql/install.sql", ( error, stdout, stderr ) => {

        connection.query(

            queryUser + queryPostContentTypes + queryPostDataTypes,
            [],
            ( err, row ) => {

                main( connection, req, res );
            }

        );

    });

}

export default install;
