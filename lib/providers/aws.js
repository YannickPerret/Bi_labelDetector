const AWS = require("aws-sdk");
const { Rekognition } = AWS;

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
        MaxLabels: Number(maxLabels),
        MinConfidence: Number(minConfidence),
      };

      const visionClient = new Rekognition();
      const data = await visionClient.detectLabels(params).promise();
      data.numberOfLabel = data.Labels.length;
      data.MinConfidence = minConfidence;
      data.averageConfidence = data.Labels.reduce((acc, label) => acc + label.Confidence, 0) / data.Labels.length;
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = AWSClient;
