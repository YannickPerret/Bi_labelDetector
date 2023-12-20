const AWS = require("aws-sdk");
const { Rekognition, SharedIniFileCredentials } = AWS;

class AWSClient {
  constructor(region, accessKeyId, secretAccessKey) {
    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;

    this.init();
  }

  init() {
    AWS.config.update({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    });
  }

  async analyze(image, maxLabels, minConfidence) {
    try {
      const params = {
        Image: {
          Bytes: image,
        },
        MaxLabels: maxLabels,
        MinConfidence: minConfidence,
      };

      const visionClient = new Rekognition();
      const data = await visionClient.detectLabels(params).promise();
      data.MaxLabels = maxLabels;
      data.MinConfidence = minConfidence;
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = AWSClient;
