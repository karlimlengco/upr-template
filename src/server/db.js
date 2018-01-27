const path = require('path')
// const filepath = path.resolve('src/server/appData.db')
const filepath = path.join(process.resourcesPath, "src/server/appData.db");
var sqlite3 = require('sqlite3').verbose();
export const db = new sqlite3.Database(filepath, sqlite3.OPEN_READWRITE)

db.run( 'PRAGMA journal_mode = WAL;' );