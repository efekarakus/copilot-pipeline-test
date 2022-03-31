'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  console.log("received request at root 2");
  res.send('Hello from root');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
