// src/database/connection.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = path.resolve(process.env.DB_PATH || './nahora.db');

let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar ao SQLite:', err.message);
        process.exit(1);
      }
      console.log(`✅ SQLite conectado em: ${DB_PATH}`);
    });
    // Enable WAL mode for better performance
    db.run('PRAGMA journal_mode=WAL;');
    db.run('PRAGMA foreign_keys=ON;');
  }
  return db;
}

// Helper: promisify db.run
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Helper: promisify db.all
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Helper: promisify db.get
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { getDb, dbRun, dbAll, dbGet };
