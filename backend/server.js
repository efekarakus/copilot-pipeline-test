'use strict';

console.log(`region is: ${process.env.AWS_DEFAULT_REGION}`);

const aws = require('aws-sdk');
aws.config.update({region: process.env.AWS_DEFAULT_REGION});
const sns = new aws.SNS();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {
  const {loadtest} = JSON.parse(process.env.COPILOT_SNS_TOPIC_ARNS);
  while(true) {
      try {
          const out = await sns.publish({
            Message: 'test',
            TopicArn: loadtest,
          }).promise();
  
          console.log(`results: ${JSON.stringify(out)}`);
      } catch (err) {
          console.error(err);
      }
      await sleep(50);
  }
})();