const AWS = require("aws-sdk");
const { Rekognition } = AWS;

/**
 * Class representing a client for AWS Rekognition.
 * @class
 * @implements {IAws}
 */
class AWSClient {
  /**
   * Create a client for AWS Rekognition.
   * @param {string} region - The region for AWS.
   * @param {string} accessKeyId - The access key ID for AWS.
   * @param {string} secretAccessKey - The secret access key for AWS.
   */
  constructor(region, accessKeyId, secretAccessKey) {
    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;

    this.init();
  }

  /**
   * Initialize the AWS configuration.
   */
  init() {
    AWS.config.update({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    });
  }

  /**
   * Analyze an image using AWS Rekognition.
   * @param {String} image - The image to analyze.
   * @param {number} [maxLabels=10] - The maximum number of labels to return.
   * @param {number} [minConfidence=90] - The minimum confidence level for returned labels.
   * @return {Promise<Object>} The detected labels and other analysis data.
   * @throws {Error} Will throw an error if the analysis fails.
   */
  async analyze(image, maxLabels = 10, minConfidence = 90) {
    if (typeof maxLabels !== 'number') {
      throw new TypeError('maxLabels must be a number');
    }
    if (typeof minConfidence !== 'number') {
      throw new TypeError('minConfidence must be a number');
    }
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
      return data
    } catch (err) {
      throw err
    }
  }
}

module.exports = AWSClient;