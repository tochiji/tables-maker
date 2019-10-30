const process = require('process'); // Allow env variable mocking
const mysql = require('mysql');

const connectionName =
  process.env.INSTANCE_CONNECTION_NAME;
const dbUser = process.env.SQL_USER;
const dbPassword = process.env.SQL_PASSWORD;
const dbName = process.env.DB_NAME;

const mysqlConfig = {
  connectionLimit: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
};

if (process.env.NODE_ENV === 'production') {
  mysqlConfig.socketPath = `/cloudsql/${connectionName}`;
}

let mysqlPool;

exports.mysqlDemo = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig);
  }

  mysqlPool.query('select * from users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.status(200).send(JSON.stringify(results));
    }
  });
};