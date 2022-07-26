'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
  console.log("received request 41");
  res.send('Hello from backend');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
