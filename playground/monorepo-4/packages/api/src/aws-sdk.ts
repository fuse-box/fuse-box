import aws = require('aws-sdk');

const CodeEnvironment = process.env.CODE_ENVIRONMENT || 'DEVELOPMENT';
const IsDevelopment = CodeEnvironment === 'DEVELOPMENT';

const awsxray: typeof aws = (() => {
    if (IsDevelopment) {
        return aws;
    } else {
        // tslint:disable-next-line:no-var-requires
        const AWSXRay = require('aws-xray-sdk');
        return AWSXRay.captureAWS(aws);
    }
})();

export default awsxray;
