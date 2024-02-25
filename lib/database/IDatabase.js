/**
 * Interface for database operations.
 * @interface IDatabase
 */

/**
 * Initializes the connection to the database.
 * @function
 * @name IDatabase#initConnection
 * @returns {Promise<void>}
 */

/**
 * Gets the status of the database connection.
 * @function
 * @name IDatabase#getStatus
 * @returns {Promise<boolean>}
 */

/**
 * Creates a new database if it doesn't already exist.
 * @function
 * @name IDatabase#createDatabase
 * @param {string} dbName - The name of the database to create.
 * @returns {Promise<Object|string>}
 */

/**
 * Updates the version information in the database.
 * @function
 * @name IDatabase#updateVersion
 * @param {string} version - The new version string.
 * @returns {Promise<Object>}
 */

/**
 * Creates a new table in the database if it doesn't already exist.
 * @function
 * @name IDatabase#createTable
 * @param {string} tableName - The name of the table to create.
 * @returns {Promise<Object|boolean>}
 */

/**
 * Inserts a new document into a specified table.
 * @function
 * @name IDatabase#insert
 * @param {string} table - The name of the table.
 * @param {Object} data - The document data to insert.
 * @returns {Promise<Object>}
 */

/**
 * Retrieves a document from a specified table by matching a field value.
 * @function
 * @name IDatabase#get
 * @param {string} table - The name of the table.
 * @param {string} field - The field name to match.
 * @param {*} value - The value to match.
 * @returns {Promise<Object|null>}
 */

/**
 * Retrieves a document by its ID from a specified table.
 * @function
 * @name IDatabase#getById
 * @param {string} table - The name of the table.
 * @param {string} id - The document's ID.
 * @returns {Promise<Object>}
 */

/**
 * Retrieves all documents from a specified table.
 * @function
 * @name IDatabase#getAll
 * @param {string} table - The name of the table.
 * @returns {Promise<Array>}
 */

/**
 * Retrieves documents from a specified table that match a set of filters.
 * @function
 * @name IDatabase#getByWithFilter
 * @param {string} table - The name of the table.
 * @param {Object} filters - The filters to apply.
 * @returns {Promise<Array>}
 */

/**
 * Retrieves distinct values of a specified field from all documents in a table.
 * @function
 * @name IDatabase#getFieldValues
 * @param {string} table - The name of the table.
 * @param {string} field - The field name.
 * @returns {Promise<Array>}
 */

/**
 * Updates a document in a specified table.
 * @function
 * @name IDatabase#update
 * @param {string} table - The name of the table.
 * @param {Object} data - The document data to update, must include an 'id' field.
 * @returns {Promise<Object>}
 */

/**
 * Removes a document from a specified table by its ID.
 * @function
 * @name IDatabase#remove
 * @param {string} table - The name of the table.
 * @param {string} id - The document's ID to remove.
 * @returns {Promise<Object>}
 */

/**
 * Creates an index for a specified table.
 * @function
 * @name IDatabase#createIndex
 * @param {string} table - The name of the table.
 * @param {string} indexName - The name of the index to create.
 * @returns {Promise<Object>}
 */

/**
 * Closes the database connection.
 * @function
 * @name IDatabase#close
 * @returns {Promise<void>}
 */
