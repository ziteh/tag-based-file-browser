const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password: 'root',
  database: 'hie_tag'
});

module.exports = connection;
