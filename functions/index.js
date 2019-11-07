const process = require('process') // Allow env variable mocking
const mysql = require('mysql')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

const connectionName = process.env.INSTANCE_CONNECTION_NAME
const dbUser = process.env.SQL_USER
const dbPassword = process.env.SQL_PASSWORD
const dbName = process.env.DB_NAME

const mysqlConfig = {
  connectionLimit: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0
}

if (process.env.NODE_ENV === 'production') {
  mysqlConfig.socketPath = `/cloudsql/${connectionName}`
}

const mysqlPool = mysql.createPool(mysqlConfig)

app.get('/users', (req, res) => {
  const query = 'select * from users'
  mysqlPool.query(query, (err, results) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(JSON.stringify(results))
    }
  })
})

app.post('/check/user', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const name = req.body.name

  if (name === undefined || name == null || name === '') {
    const result = { error: 'name error' }
    res.status(500).send(JSON.stringify(result))
  } else if (name.length <= 3) {
    const result = { error: 'too short name' }
    res.status(500).send(JSON.stringify(result))
  }

  const query = `select CASE WHEN count(id) > 0 
                    THEN "true"
                    ELSE "false"
                    END as UserExists
                from users
                where name = '${name}';`

  mysqlPool.query(query, (err, results) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(JSON.stringify(results))
    }
  })
})

app.post('/input/user', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const name = req.body.name
  const query = `INSERT INTO users (name) VALUES('${name}');`

  mysqlPool.query(query, (err, results) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(JSON.stringify(results))
    }
  })
})

app.post('/input/project', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const id = req.body.id
  const name = req.body.name
  const tables = JSON.stringify(req.body.tables)
  const query = `INSERT INTO projects (id, name, tables)
                  VALUES (
                    '${id}',
                    '${name}',
                    '${tables}'
                  );`

  mysqlPool.query(query, (err, results) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(JSON.stringify(results))
    }
  })
})

app.get('/projects', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const query = `select t1.row,t1.id,t1.name,t2.tables
                 from (SELECT id,name,max(row) as row
                 FROM projects
                 GROUP BY id,name) as t1
                 JOIN projects as t2
                  ON t1.row = t2.row
                 ORDER BY row desc;
                 `

  mysqlPool.query(query, (err, results) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(JSON.stringify(results))
    }
  })
})

module.exports = { api: app }
