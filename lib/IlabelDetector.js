/**
 * Interface for a label detection service.
 * @interface ILabelDetector
 */

/**
 * Creates a client for a specific cloud provider.
 * @function
 * @name ILabelDetector.createClient
 * @param {Object} options - The configuration options.
 * @param {string} options.cloud - The cloud provider. Can be either 'AWS' or 'GOOGLE'.
 * @param {string} [options.region='default-region'] - The region for the cloud provider.
 * @param {string} [options.accessKeyId='default-access-key-id'] - The access key ID for the cloud provider.
 * @param {string} [options.secretAccessKey=''] - The secret access key for the cloud provider.
 * @throws {Error} Will throw an error if the cloud provider is not supported.
 * @return {AWSClient|GoogleClient} The client for the specified cloud provider.
 */
