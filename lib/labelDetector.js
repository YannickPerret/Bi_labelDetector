const AWSClient = require("./providers/aws");
const GoogleClient = require("./providers/gcloud"); // Hypothétique

class LabelDetector {
  static createClient({
    cloud,
    region = "default-region",
    accessKeyId = "default-access-key-id",
    secretAccessKey = "",
  }) {
    switch (cloud.toUpperCase()) {
      case "AWS":
        return new AWSClient(region, accessKeyId, secretAccessKey);
      case "GOOGLE":
        return new GoogleClient(region, accessKeyId, secretAccessKey);
      default:
        throw new Error("Invalid cloud provider");
    }
  }
}

module.exports = LabelDetector;
