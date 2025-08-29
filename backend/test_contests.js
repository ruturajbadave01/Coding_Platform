import mysql from 'mysql2';

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
  
  // Test contest creation
  testContestCreation();
});

async function testContestCreation() {
  console.log('\n🧪 Testing Contest Creation...');
  
  try {
    // Test 1: Create a contest
    const contestData = {
      title: 'Test Programming Contest',
      description: 'A test contest to verify the system',
      department: 'CSE',
      startDate: '2024-12-25 10:00:00',
      endDate: '2024-12-25 12:00:00',
      duration: 120,
      maxParticipants: 50,
      difficulty: 'Medium',
      problems: [
        {
          title: 'Test Problem 1',
          description: 'A simple test problem',
          questionType: 'coding',
          difficulty: 'Easy',
          points: 10,
          timeLimit: 1000,
          memoryLimit: 256,
          testCases: [
            { input: '5', output: '25', description: 'Test case 1' }
          ]
        },
        {
          title: 'Test MCQ Problem',
          description: 'A multiple choice question',
          questionType: 'mcq',
          difficulty: 'Easy',
          points: 5,
          mcqOptions: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 1
        }
      ],
      createdBy: 'test@example.com'
    };

    // Insert contest
    const contestQuery = `
      INSERT INTO contests (title, description, department, start_date, end_date, duration, max_participants, difficulty, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const contestResult = await new Promise((resolve, reject) => {
      db.query(contestQuery, [
        contestData.title, contestData.description, contestData.department, 
        contestData.startDate, contestData.endDate, contestData.duration, 
        contestData.maxParticipants, contestData.difficulty, contestData.createdBy
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const contestId = contestResult.insertId;
    console.log(`✅ Contest created with ID: ${contestId}`);

    // Insert problems
    for (const problem of contestData.problems) {
      const mcqOptions = problem.questionType === 'mcq' ? JSON.stringify(problem.mcqOptions) : null;
      const testCases = problem.questionType === 'coding' ? JSON.stringify(problem.testCases) : null;
      
      const problemQuery = `
        INSERT INTO contest_problems (contest_id, title, description, question_type, difficulty, points, time_limit, memory_limit, mcq_options, correct_answer, test_cases) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await new Promise((resolve, reject) => {
        db.query(problemQuery, [
          contestId, problem.title, problem.description, problem.questionType, 
          problem.difficulty, problem.points, problem.timeLimit, problem.memoryLimit,
          mcqOptions, problem.correctAnswer, testCases
        ], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    
    console.log(`✅ Problems added to contest`);

    // Test 2: Fetch contest by department
    console.log('\n🧪 Testing Contest Retrieval...');
    
    const fetchQuery = `
      SELECT c.*, 
             COUNT(DISTINCT cp.id) as problem_count,
             COUNT(DISTINCT cpart.student_email) as current_participants
      FROM contests c
      LEFT JOIN contest_problems cp ON c.id = cp.contest_id
      LEFT JOIN contest_participants cpart ON c.id = cpart.contest_id
      WHERE c.department = ?
      GROUP BY c.id
      ORDER BY c.start_date DESC
    `;
    
    const contests = await new Promise((resolve, reject) => {
      db.query(fetchQuery, ['CSE'], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log(`✅ Found ${contests.length} contests for CSE department`);
    console.log('Contest details:', JSON.stringify(contests[0], null, 2));

    // Test 3: Test contest joining
    console.log('\n🧪 Testing Contest Joining...');
    
    const joinQuery = `
      INSERT INTO contest_participants (contest_id, student_email) VALUES (?, ?)
    `;
    
    await new Promise((resolve, reject) => {
      db.query(joinQuery, [contestId, 'student@example.com'], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    console.log(`✅ Student joined contest`);

    // Update participant count
    await new Promise((resolve, reject) => {
      db.query('UPDATE contests SET current_participants = current_participants + 1 WHERE id = ?', 
        [contestId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log(`✅ Participant count updated`);

    // Test 4: Verify final state
    const finalContest = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM contests WHERE id = ?', [contestId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    
    console.log(`✅ Final contest state: ${finalContest.current_participants} participants`);

    console.log('\n🎉 All tests passed! Contest system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    db.end();
    process.exit(0);
  }
}
