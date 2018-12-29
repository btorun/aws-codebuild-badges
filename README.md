# aws-codebuild-badges
[![Build Status](https://api.travis-ci.org/btorun/aws-codebuild-badges.svg?branch=master)](https://travis-ci.org/btorun/aws-codebuild-badges)
## Introduction
AWS CodeBuild already has badges for builds however this sample code is helpful to learn the basics of AWS Lambda, CodeBuild & CloudWatch.
Adapted from [jSherz's code](https://github.com/jSherz/codebuild-codepipeline-badges)

## Setup AWS
1. Create S3 bucket
   * Make sure bucket has public access 
   * e.g. bucket name: `my-codebuild-badges`
1. Create Lambda function
   * Pick _Author from scratch_
   * Name _update-build-badges_
   * Runtime _Node.js 8.10_
   * Role _Create a custom role_
   * On new page, _View Policy Document_ > _Edit_
   ```json
   {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": "arn:aws:logs:*:*:*"
            },
            {
                "Sid": "AllowBadges",
                "Effect": "Allow",
                "Action": [
                    "s3:PutObject",
                    "s3:PutObjectAcl"
                ],
                "Resource": [
                    "arn:aws:s3:::my-codebuild-badges/*"
                ]
            }
        ]
    }
   ```
   * Go back to previous page after saving your custom role and click _Create Function_
   * If you would like to modify the code, check _development_ section below otherwise download the latest version [here](https://github.com/btorun/aws-codebuild-badges/releases)
   * Upload code to your function and set environment variable `BUCKET=my-codebuild-badges`
1. Create CloudWatch event/trigger
   * _Events_ > _Rules_ > _Create Rule_
   * Service Name _CodeBuild_
   * Event Type _CodeBuild Build State Change_
   * Add target > _Lambda function_ and select your lambda function
1. Trigger your build and you will see a new svg file under `s3://my-codebuild-badges` with your CodeBuild project name.

## Development
Modify the code as you wish and create a zip bundle:

```bash
$ npm install
// modify the code
$ npm run zip
```
`index.zip` will be generated in project's root. This file can be uploaded to AWS Lambda.