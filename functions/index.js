const process = require('process') // Allow env variable mocking
const mysql = require('mysql')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

const connectionName = process.env.INSTANCE_CONNECTION_NAME
const dbUser = process.env.SQL_USER
const dbPassword = process.env.SQL_PASSWORD
const dbName = process.env.DB_NAME

const mysqlConfig = {
  connectionLimit: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
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
  const name = req.body.name
  const tables = JSON.stringify(req.body.tables)
  const query = `INSERT INTO projects (name, tables)
                  VALUES (
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

app.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send({ message: 'testです' })
})

module.exports = { api: app }
