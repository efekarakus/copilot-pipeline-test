'use strict';

const express = require('express');
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

console.log(`COPILOT_SNS_TOPIC_ARNS: ${process.env.COPILOT_SNS_TOPIC_ARNS}`);


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const client = new SNSClient({ region: "us-west-2" });


// App
const app = express();
app.get('/', (req, res) => {
  console.log("received request at root 1");
  res.send('Hello from root');
  //res.status(400).send({error: 'boom'});
});

app.get('/hello', (req, res) => {
  console.log("received request 41");
  res.send('Hello World From Prod');
});

app.post('/send', async (req, res) => {
  const {customers} = JSON.parse(process.env.COPILOT_SNS_TOPIC_ARNS);
  const out = await client.send(new PublishCommand({
    Message: "hello",
    TopicArn: customers,
  }));
  res.send(out);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
