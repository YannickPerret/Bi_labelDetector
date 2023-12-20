const AWSClient = require("./providers/aws");
const GoogleClient = require("./providers/gcloud"); // Hypothétique

class LabelDetector {
  static createClient({
    cloud,
    region = "default-region",
    profile = "default-profile",
  }) {
    switch (cloud.toUpperCase()) {
      case "AWS":
        return new AWSClient(region, profile);
      case "GOOGLE":
        return new GoogleClient(region, profile);
      default:
        throw new Error("Invalid cloud provider");
    }
  }
}

module.exports = LabelDetector;
