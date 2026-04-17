import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sakshi@123',
  database: 'coding_platform'
});

console.log('Testing solved status for all problems for sakshi@gmail.com...');

// Get all problems from the database
db.query('SELECT id, title FROM programming_problems LIMIT 10', (err, problems) => {
  if (err) {
    console.error('Error getting problems:', err);
    return;
  }
  
  console.log('\nTesting solved status for each problem:');
  console.log('='.repeat(50));
  
  let completed = 0;
  problems.forEach((problem, index) => {
    db.query(
      'SELECT id FROM solved_problems WHERE student_email = ? AND problem_id = ? AND source = "practice"',
      ['sakshi@gmail.com', problem.id],
      (err2, results) => {
        const isSolved = results.length > 0;
        console.log(`Problem ${problem.id}: "${problem.title}" - ${isSolved ? '✅ SOLVED' : '❌ NOT SOLVED'}`);
        
        completed++;
        if (completed === problems.length) {
          console.log('\n' + '='.repeat(50));
          console.log('Test completed for all problems!');
          db.end();
        }
      }
    );
  });
});

