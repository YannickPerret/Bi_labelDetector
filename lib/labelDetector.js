const AWSClient = require("./providers/aws");
const GoogleClient = require("./providers/gcloud");

/**
 * Class representing a label detector.
 * @class
 * @implements {ILabelDetector}
 */
class LabelDetector {
  /**
   * Create a client for a specific cloud provider.
   * @param {Object} options - The configuration options.
   * @param {string} options.cloud - The cloud provider. Can be either 'AWS' or 'GOOGLE'.
   * @param {string} [options.region='default-region'] - The region for the cloud provider.
   * @param {string} [options.accessKeyId='default-access-key-id'] - The access key ID for the cloud provider.
   * @param {string} [options.secretAccessKey=''] - The secret access key for the cloud provider.
   * @throws {string} Will throw an error if the cloud provider is not 'AWS' or 'GOOGLE'.
   * @return {AWSClient|GoogleClient} The client for the specified cloud provider.
   */
  static createClient({
    cloud,
    region = "default-region",
    accessKeyId = "default-access-key-id",
    secretAccessKey = "",
  }) {
    if (typeof cloud !== 'string' || typeof region !== 'string' || typeof accessKeyId !== 'string' || typeof secretAccessKey !== 'string') {
      throw new TypeError('All parameters must be of type string');
    }
    switch (cloud.toUpperCase()) {
      case "AWS":
        return new AWSClient(region, accessKeyId, secretAccessKey);
      case "GOOGLE":
        return new GoogleClient(region, accessKeyId, secretAccessKey);
      default:
        throw "Invalid cloud provider"
    }
  }
}

module.exports = LabelDetector;
