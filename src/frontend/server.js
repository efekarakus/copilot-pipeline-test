'use strict';
const express = require('express');
const AWS = require('aws-sdk');
const { Client } = require('pg');

const client = new AWS.SecretsManager({
    region: process.env.AWS_DEFAULT_REGION,
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/_healthcheck', (req, res) => {
  res.send('OK');
});

app.get('/', (req, res) => {
  console.log(JSON.stringify(process.env));
  res.send('Hi 8');
});

app.get('/genlogs', (req, res) => {
  for (let i = 0; i < 30; i++) {
    console.log(`The number is ${i}`);
  }
});

app.get('/rds', async (req, res) => {
  console.log("received request at rds");
  const dbSecret = await client.getSecretValue({SecretId: process.env.APPRUNNERCLUSTER_SECRET_ARN}).promise();
  const {username, host, dbname, password, port} = JSON.parse(dbSecret.SecretString);
  let response = null;
  try {
    const client = new Client({
      user: username,
      host: host,
      database: dbname,
      password: password,
      port: port,
    });
    client.connect();
    response = await client.query('SELECT NOW() as now');
  } catch (err) {
    res.send(`db error: ${JSON.stringify(err)}`);
  };
  res.send(`Hello results: ${JSON.stringify(response.rows[0])}`);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
