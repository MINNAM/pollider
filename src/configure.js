import Pollider from './models/pollider.js';

function main ( db, req, res ) {

    const pollider = new Pollider( db, req, res );

    pollider.registerPost({

        name          : 'Projects',
        name_singular : 'Project',
        name_plural   : 'Projects',
        hyperlink     : 'projects',
        uploadable    : false,
        home          : true,
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
                field     : 'Type',
                data_type : 'select',
                display   : 1,
                data      : [
                    {
                        name : 'Full Width',
                        value : 0
                    },
                    {
                        name : 'Half Width',
                        value : 1
                    },
                ]
            },
            {
                field      : 'Description',
                data_type : 'text',
                display   : 1
            },
            {
                field      : 'Thumbnail',
                data_type : 'post-container',
                display   : 1,
            },
            {
                field      : 'Content',
                data_type : 'project',
                display   : 1,
                main      : true
            }

        ]

    });

    pollider.registerPost({

        name          : 'Upload',
        name_singular : 'File',
        name_plural   : 'Files',
        hyperlink     : 'uploads',
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
                field     : 'Note',
                data_type : 'text',
                display   : 1
            }
        ]

    });

}

export default main;
