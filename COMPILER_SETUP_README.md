# 🚀 Code Compiler Setup Guide

Your coding platform now includes a powerful code execution system that can compile and run code in multiple programming languages!

## ✨ Features

- **Multi-language Support**: Python, JavaScript, Java, C++, C
- **Secure Execution**: Docker-based isolation (recommended) or local execution
- **Test Case Validation**: Automatic testing against predefined test cases
- **Real-time Output**: See execution results immediately
- **Contest Integration**: Submit solutions directly from contests

## 🛠️ Setup Instructions

### Option 1: Docker Setup (Recommended - More Secure)

1. **Install Docker Desktop**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Install and start Docker Desktop

2. **Pull Required Images**
   ```bash
   docker pull python:3.9-slim
   docker pull node:18-slim
   docker pull openjdk:11-jre-slim
   docker pull gcc:11
   ```

3. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

### Option 2: Local Setup (Easier for Development)

1. **Install Programming Languages**
   - **Python**: Download from [python.org](https://python.org) or use `winget install Python.Python.3.9`
   - **Node.js**: Download from [nodejs.org](https://nodejs.org)
   - **Java**: Download OpenJDK from [adoptium.net](https://adoptium.net)
   - **GCC**: Install MinGW-w64 for Windows

2. **Verify Installation**
   ```bash
   python --version
   node --version
   java --version
   gcc --version
   ```

3. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

## 🔧 API Endpoints

### Execute Code (Docker)
```
POST /api/execute
{
  "language": "python",
  "code": "print('Hello World!')",
  "testCases": [],
  "timeLimit": 5000,
  "memoryLimit": 512
}
```

### Execute Code (Local)
```
POST /api/execute-simple
{
  "language": "python",
  "code": "print('Hello World!')",
  "testCases": []
}
```

### Submit Contest Solution
```
POST /api/contests/:contestId/problems/:problemId/submit
{
  "studentEmail": "student@example.com",
  "language": "python",
  "code": "def solve(): return 42"
}
```

## 🎯 Usage Examples

### 1. Basic Code Execution
```javascript
// Test your code before submitting
const response = await fetch('http://localhost:5000/api/execute-simple', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    language: 'python',
    code: 'print("Hello World!")'
  })
});

const result = await response.json();
console.log(result.output); // "Hello World!"
```

### 2. With Test Cases
```javascript
const testCases = [
  { input: "5", output: "25" },
  { input: "10", output: "100" }
];

const response = await fetch('http://localhost:5000/api/execute-simple', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    language: 'python',
    code: `
n = int(input())
print(n * n)
`,
    testCases: testCases
  })
});
```

### 3. Contest Submission
```javascript
const response = await fetch(`http://localhost:5000/api/contests/${contestId}/problems/${problemId}/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentEmail: 'student@example.com',
    language: 'python',
    code: 'def solve(): return 42'
  })
});
```

## 🎨 Frontend Integration

The `CodeEditor` component is ready to use in your React components:

```jsx
import CodeEditor from './components/CodeEditor';

function ContestProblem({ problem, contestId }) {
  const handleSubmission = (result) => {
    if (result.allTestsPassed) {
      alert('🎉 All test cases passed!');
    } else {
      alert('❌ Some test cases failed. Check the output for details.');
    }
  };

  return (
    <div>
      <h2>{problem.title}</h2>
      <p>{problem.description}</p>
      
      <CodeEditor 
        problem={problem}
        contestId={contestId}
        onSubmission={handleSubmission}
      />
    </div>
  );
}
```

## 🗄️ Database Setup

Run this SQL to create the submissions table:

```sql
-- Create contest_submissions table
CREATE TABLE IF NOT EXISTS contest_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  problem_id INT NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  language VARCHAR(20) NOT NULL,
  code TEXT NOT NULL,
  output TEXT,
  passed BOOLEAN DEFAULT FALSE,
  execution_time INT DEFAULT 0,
  memory_used INT DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_id) REFERENCES contest_problems(id) ON DELETE CASCADE,
  FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE
);
```

## 🔒 Security Features

- **Docker Isolation**: Code runs in isolated containers
- **Network Disabled**: No internet access for running code
- **Read-only Filesystem**: Prevents file system tampering
- **Memory Limits**: Configurable memory constraints
- **Time Limits**: Prevents infinite loops
- **Privilege Escalation Prevention**: Security options enabled

## 🚨 Troubleshooting

### Common Issues

1. **"Language not supported"**
   - Ensure the language is installed on your system
   - Check the language name matches exactly (python, javascript, java, cpp, c)

2. **"Execution timeout"**
   - Code is taking too long to run
   - Check for infinite loops
   - Increase timeLimit if needed

3. **"Memory limit exceeded"**
   - Code is using too much memory
   - Check for memory leaks
   - Increase memoryLimit if needed

4. **Docker errors**
   - Ensure Docker Desktop is running
   - Check if required images are pulled
   - Verify Docker has sufficient resources

### Testing the System

Run the test file to verify everything works:

```bash
cd backend
node test_code_execution.js
```

## 🎉 What's Next?

1. **Integrate CodeEditor** into your contest components
2. **Add more programming languages** as needed
3. **Enhance test case validation** for complex problems
4. **Add code highlighting** and auto-completion
5. **Implement leaderboards** based on submission results

## 📚 Supported Languages

| Language | File Extension | Docker Image | Local Command |
|----------|----------------|--------------|---------------|
| Python   | .py           | python:3.9-slim | python |
| JavaScript | .js          | node:18-slim | node |
| Java     | .java         | openjdk:11-jre-slim | java |
| C++      | .cpp          | gcc:11       | g++ |
| C        | .c            | gcc:11       | gcc |

Your coding platform is now ready to handle real programming contests with live code execution! 🚀
