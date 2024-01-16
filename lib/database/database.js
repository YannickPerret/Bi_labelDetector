const r = require('rethinkdb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class Database {
    constructor({ host, port, db }) {
        this.host = host;
        this.port = port;
        this.db = db;
        this.connection = null;

        this.initConnection();
    }

    async initConnection() {
        if (!this.connection) {
            try {
                this.connection = await r.connect({ host: this.host, port: this.port, db: this.db });
                this.connection.use(this.db);
            } catch (err) {
                console.error('Erreur lors de la connexion à la base de données:', err);
                throw err;
            }
        }
    }

    async getStatus() {
        if (!this.connection) {
            return false
        }
    }


    async createDatabase(dbName) {
        if (!this.connection) {
            await this.initConnection();
        }

        try {
            const exists = await r.dbList().contains(dbName).run(this.connection);
            if (!exists) {
                const result = await r.dbCreate(dbName).run(this.connection);
                console.log('Base de données créée avec succès');
                return result;
            } else {
                console.log('La base de données existe déjà');
                return 'La base de données existe déjà';
            }
        } catch (err) {
            console.error('Erreur lors de la vérification ou de la création de la base de données:', err);
            throw err;
        }
    }

    async updateVersion(version) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table('system')
            .get("1")
            .update({ version, lastUpdate: new Date() })
            .run(this.connection)
            .then(result => {
                console.log('Version de la base de données mise à jour avec succès');
                return result;
            })
            .catch(err => {
                console.error("Erreur lors de la mise à jour de la version de la base de données:", err);
                throw err;
            });
    }




    async createTable(tableName) {
        if (!this.connection) {
            await this.initConnection();
        }

        try {
            const list = await r.tableList().run(this.connection);
            if (!list.includes(tableName)) {
                const result = await r.tableCreate(tableName).run(this.connection);
                console.log('Table créée avec succès');
                return result;
            } else {
                console.log('La table existe déjà')
                return false;
            }
        } catch (err) {
            console.error('Erreur lors de la création de la table:', err);
            throw err;
        }
    }

    async insert(table, data) {
        if (!this.connection) {
            await this.initConnection();
        }

        try {
            const result = await r.table(table).insert(data).run(this.connection);
            return result;
        } catch (err) {
            console.error("Erreur lors de l'insertion du document:", err);
            throw err;
        }
    }

    async get(table, field, value) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .filter(r.row(field).eq(value))
            .run(this.connection)
            .then(cursor => cursor.toArray())
            .then(results => results.length > 0 ? results[0] : null)
            .catch(err => {
                console.error('Erreur lors de la récupération du document:', err);
                throw err;
            });
    }


    async getById(table, id) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .get(id)
            .run(this.connection)
            .then(result => result)
            .catch(err => {
                console.error('Erreur lors de la récupération du document:', err);
                throw err;
            });
    }

    async getAll(table) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .run(this.connection)
            .then(cursor => cursor.toArray())
            .then(results => results.length > 0 ? results : [])
            .catch(err => {
                console.error('Erreur lors de la recherche des documents:', err);
                throw err;
            });
    }

    async getByWithFilter(table, filters) {
        if (!this.connection) {
            await this.initConnection();
        }

        let query = r.table(table);
        if (filters && Object.keys(filters).length > 0) {
            query = query.filter(doc => {
                return Object.keys(filters).map(key => {
                    if (key.includes('.')) {
                        // Gestion des champs imbriqués
                        const path = key.split('.');
                        let ref = doc;
                        path.forEach(p => {
                            ref = ref(p);
                        });
                        return ref.eq(filters[key]);
                    } else {
                        // Gestion des champs de premier niveau
                        return doc(key).eq(filters[key]);
                    }
                }).reduce((left, right) => left.and(right));
            });
        }

        return query.run(this.connection)
            .then(cursor => cursor.toArray())
            .then(results => results.length > 0 ? results : [])
            .catch(err => {
                console.error('Erreur lors de la recherche des documents:', err);
                throw err;
            });
    }

    async getFieldValues(table, field) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .map(doc => doc(field))
            .run(this.connection)
            .then(cursor => cursor.toArray())
            .catch(err => {
                console.error(`Erreur lors de la récupération des valeurs du champ ${field}:`, err);
                throw err;
            });
    }

    async update(table, data) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .get(data.id)
            .update(data, { nonAtomic: true })
            .run(this.connection)
            .then(result => result)
            .catch(err => {
                console.error('Erreur lors de la mise à jour du document:', err);
                throw err;
            });
    }

    async remove(table, id) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .get(id)
            .delete()
            .run(this.connection)
            .then(result => result)
            .catch(err => {
                console.error('Erreur lors de la suppression du document:', err);
                throw err;
            });
    }

    async createIndex(table, indexName) {
        if (!this.connection) {
            await this.initConnection();
        }

        return r.table(table)
            .indexCreate(indexName)
            .run(this.connection)
            .then(result => result)
            .catch(err => {
                console.error(`Erreur lors de la création de l'index ${indexName}:`, err);
                throw err;
            });
    }

    async close() {
        if (this.connection) {
            try {
                await this.connection.close();
                this.connection = null;
            } catch (err) {
                console.error('Erreur lors de la fermeture de la connexion:', err);
                throw err;
            }
        }
    }

}


const db = new Database({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT, db: process.env.RETHINK_DB });

module.exports = { db, r };
