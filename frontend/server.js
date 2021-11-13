'use strict';
const express = require('express');
const AWS = require('aws-sdk');
const { Client } = require('pg');

const client = new AWS.SecretsManager({
    region: 'us-west-2',
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', async (req, res) => {
  console.log("received request at root");
  const dbSecret = await client.getSecretValue({SecretId: process.env.WWWCLUSTER_SECRET_ARN}).promise();
  const {username, host, dbname, password, port} = JSON.parse(dbSecret.SecretString);

  console.log(`region: ${process.env.AWS_DEFAULT_REGION}, secret arn: ${process.env.WWWCLUSTER_SECRET_ARN}`);
  console.log(`secret: ${dbSecret.SecretString}`);
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

app.get('/hello', (req, res) => {
  console.log("received request 41");
  res.send('Hello World From Prod');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
