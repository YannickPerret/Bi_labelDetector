const AWS = require("aws-sdk");
const { Rekognition, SharedIniFileCredentials } = AWS;

class AWSClient {
  constructor(region, profile) {
    this.profile = profile;
    this.region = region;
    this.credentials = null;

    this.init();
  }

  init() {
    this.credentials = new SharedIniFileCredentials({ profile: this.profile });
    AWS.config.credentials = this.credentials;
    AWS.config.update({ region: this.region });
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
