import mysql from 'mysql';

import config from '../../config';

let shortConfig = config.database;

const connection = mysql.createConnection({
    host: shortConfig.host,
    database: shortConfig.schema,
    user: shortConfig.username,
    password: shortConfig.password
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Database connected!");
});
module.exports = connection;


