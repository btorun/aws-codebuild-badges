const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const fs = require("fs");

exports.handler = (event, context, callback) => {
    const bucket = process.env.BUCKET;
    if (!bucket || bucket == '') {
        callback('"BUCKET" env variable is not set.', null);
        return;
    }
    console.log(event);
    console.log(`Using s3 bucket=${bucket}`);
    const project = event.detail['project-name'];
    const status = event.detail['build-status'].toLowerCase();
    const image = `badges/${status}.svg`;
    const key = `${project}.svg`;

    console.log(`${project}'s build status changed to ${status}. ` +
        `Uploading ${image} to s3://${bucket}/${key}`);

    const params = {
        Bucket: bucket,
        Key: key,
        Body: fs.readFileSync(image),
        ACL: 'public-read',
        ContentType: 'image/svg+xml'
    };

    s3.putObject(params, (err, data) => {
        if (err) {
            const message = `Failed to upload image to S3: ${err}`;
            console.error(message);
            callback(message, null);
        } else {
            const message = 'Upload complete!';
            console.log(message);
            callback(null, message);
        }
    });
};