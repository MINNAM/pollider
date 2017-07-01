const dbConfigJSTemplate = ( data ) => {

    return `{"user": "${data.user}", "password": "${data.password}", "name": "${data.name}", "host": "${data.host}", "table_prefix": "${data.table_prefix}"}`;

};

export default dbConfigJSTemplate;
