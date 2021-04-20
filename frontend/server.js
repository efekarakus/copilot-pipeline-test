'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/hello', (req, res) => {
  console.log("received request 25");
  console.log(process.env.DB_USERNAME);
  res.send('Hello World');
  //res.status(400).send({error: 'boom'});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
