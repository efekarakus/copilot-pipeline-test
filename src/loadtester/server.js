const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
const sns = new AWS.SNS();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const {loadtest} = JSON.parse(process.env.COPILOT_SNS_TOPIC_ARNS);
    while(true) {
        try {
            const out = await sns.publishBatch({
                PublishBatchRequestEntries: [
                    {
                        Id: 'id-0',
                        Message: 'hello 0',
                    },
                    {
                        Id: 'id-1',
                        Message: 'hello 1',
                    }
                ],
                TopicArn: loadtest,
            }).promise();
    
            console.log(`results: ${JSON.stringify(out)}`);
      } catch (err) {
          console.error(err);
      }
      await sleep(50);
  }
})();
  
