import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ruturaj@2003',
  database: 'coding_platform'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database!');
  
  // Read and execute the SQL file
  const sqlFile = path.join(process.cwd(), 'create_contests_table.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  // Split SQL statements and execute them
  const statements = sqlContent.split(';').filter(stmt => stmt.trim());
  
  let completed = 0;
  let errors = 0;
  
  statements.forEach((statement, index) => {
    if (statement.trim()) {
      db.query(statement, (err, result) => {
        if (err) {
          console.error(`Error executing statement ${index + 1}:`, err);
          errors++;
        } else {
          console.log(`Statement ${index + 1} executed successfully`);
          completed++;
        }
        
        // Check if all statements are processed
        if (completed + errors === statements.length) {
          console.log(`\nDatabase setup completed!`);
          console.log(`✅ Successful: ${completed}`);
          console.log(`❌ Errors: ${errors}`);
          
          if (errors === 0) {
            console.log('\n🎉 Contest tables created successfully!');
            console.log('You can now create and manage contests.');
          }
          
          db.end();
          process.exit(errors > 0 ? 1 : 0);
        }
      });
    }
  });
});
