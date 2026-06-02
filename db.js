// Gjør databasen tilgjengelig slik at den kan importeres inn i ruter-filer.
const Database = require('better-sqlite3');
const db = new Database('vaerapp.db');

module.exports = db;