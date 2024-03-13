/**
 * Interface for an AWS Rekognition client.
 * @interface IAWSClient
 */

/**
 * Initializes the AWS configuration.
 * @function
 * @name IAWSClient#init
 * @returns {void}
 */

/**
 * Analyzes an image using AWS Rekognition.
 * @function
 * @name IAWSClient#analyze
 * @param {Buffer|string} image - The image to analyze.
 * @param {number} [maxLabels=10] - The maximum number of labels to return.
 * @param {number} [minConfidence=90] - The minimum confidence level for the returned labels.
 * @return {Promise<Object>} The detected labels and other analysis data.
 * @throws {Error} Will throw an error if the analysis fails.
 */
