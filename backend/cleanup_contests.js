import mysql from 'mysql2';

// This script deletes all contest-related data from the database.
// Tables are truncated in safe dependency order to respect FK constraints.

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sakshi@123',
  database: 'coding_platform',
  multipleStatements: true
});

function runCleanup() {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        return reject(err);
      }

      // Disable FK checks to allow truncates in any order
      const sql = `
        SET FOREIGN_KEY_CHECKS = 0;
        TRUNCATE TABLE contest_submissions;
        TRUNCATE TABLE contest_completions;
        TRUNCATE TABLE contest_participants;
        TRUNCATE TABLE contest_problems;
        TRUNCATE TABLE contests;
        SET FOREIGN_KEY_CHECKS = 1;
      `;

      db.query(sql, (qErr) => {
        if (qErr) return reject(qErr);
        resolve();
      });
    });
  });
}

runCleanup()
  .then(() => {
    console.log('All contest data has been deleted successfully.');
    db.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to delete contest data:', error);
    db.end();
    process.exit(1);
  });



