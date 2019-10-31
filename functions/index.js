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

let mysqlPool

app.get('/users', (req, res) => {
  if (!mysqlPool) mysqlPool = mysql.createPool(mysqlConfig)

  mysqlPool.query('select * from users', (err, results) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(JSON.stringify(results))
    }
  })
})

app.post('/user', (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (!mysqlPool) mysqlPool = mysql.createPool(mysqlConfig)

  const name = req.body.name
  mysqlPool.query(`INSERT INTO users (name) VALUES('${name}');`, (err, results) => {
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
