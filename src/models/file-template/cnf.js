const dbConfigCNFTemplate = ( data ) => {
    const cnf = `[client]
user = ${data.user}
password = ${data.password}
host = ${data.host}`;

    return cnf;
};

export default dbConfigCNFTemplate;
