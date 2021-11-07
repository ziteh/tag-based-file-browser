const mysql = require('mysql');
const config = require('./config');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password: 'root',
  database : config.database || 'tag_system',
});

module.exports = connection;
