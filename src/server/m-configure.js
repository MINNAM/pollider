import M from './models/m.js';

function main ( connection, req, res ) {

    const m = new M( connection, req, res );

    m.registerPost({

        name          : 'Blog',
        name_singular : 'Post',
        name_plural   : 'Posts',
        uploadable    : false,
        support      : {
            audio    : false,
            document : false,
            image    : false,
            other    : false,
            post     : true,
            video    : false
        },
        meta         : [

            {
                field     : 'Description',
                data_type : 'text',
                display   : 1
            },
            {
                field     : 'Content',
                data_type : 'project',
                display   : 1,
                main      : true
            }

        ]

    });

    m.registerPost({

        name          : 'Photo Work',
        name_singular : 'File',
        name_plural   : 'Files',
        uploadable    : true,
        support      : {
            audio    : true,
            document : true,
            image    : true,
            other    : true,
            post     : false,
            video    : true
        },
        meta         : [

            {
                field     : 'Description',
                data_type : 'text',
                display   : 1
            },
            {
                field     : 'Alt Text',
                data_type : 'text',
                display   : 1
            },
            {
                field     : 'Detail',
                data_type : 'text',
                display   : 1
            }

        ]

    });

    m.registerPost({

        name          : 'Upload',
        name_singular : 'File',
        name_plural   : 'Files',
        uploadable    : true,
        support      : {
            audio    : true,
            document : true,
            image    : true,
            other    : true,
            post     : false,
            video    : true
        },
        meta         : [

            {
                field     : 'Description',
                data_type : 'text',
                display   : 1
            },
            {
                field     : 'Alt Text',
                data_type : 'text',
                display   : 1
            }

        ]

    });


}

export default main;
