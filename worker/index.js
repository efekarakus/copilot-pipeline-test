const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const client = new SQSClient({ region: "us-west-2" });

const {eventsQueue} = JSON.parse(process.env.COPILOT_QUEUE_URIS);

(async () => {
    console.log(`The queue url created is: ${eventsQueue}`);
    while(true) {
        try {
            const out = await client.send(new ReceiveMessageCommand({
                QueueUrl: eventsQueue,
                WaitTimeSeconds: 10,
            }));
    
            console.log(`results: ${JSON.stringify(out)}`);
    
            if (out.Messages.length === 0) {
                continue;
            }
    
            await client.send( new DeleteMessageCommand({
                QueueUrl: eventsQueue,
                ReceiptHandle: out.Messages[0].ReceiptHandle,
            }));
        } catch (err) {
            console.error(err);
        }
    }
})();
