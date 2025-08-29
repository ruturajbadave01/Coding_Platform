import React, { useState } from 'react';
import './CreateContest.css';

export default function CreateContest() {
  const [contestData, setContestData] = useState({
    title: '',
    description: '',
    department: '',
    startDate: '',
    endDate: '',
    duration: '',
    maxParticipants: '',
    difficulty: 'Medium',
    problems: []
  });

  const [currentProblem, setCurrentProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    points: 10,
    timeLimit: 1000,
    memoryLimit: 256,
    questionType: 'coding', // 'coding' or 'mcq'
    mcqOptions: ['', '', '', ''], // 4 MCQ options
    correctAnswer: 0, // Index of correct answer (0-3)
    testCases: []
  });

  const [currentTestCase, setCurrentTestCase] = useState({
    input: '',
    output: '',
    description: ''
  });

  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showTestCaseForm, setShowTestCaseForm] = useState(false);
  const [editingProblemIndex, setEditingProblemIndex] = useState(-1);
  const [editingTestCaseIndex, setEditingTestCaseIndex] = useState(-1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleContestChange = (e) => {
    const { name, value } = e.target;
    setContestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProblemChange = (e) => {
    const { name, value } = e.target;
    setCurrentProblem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMCQOptionChange = (index, value) => {
    setCurrentProblem(prev => ({
      ...prev,
      mcqOptions: prev.mcqOptions.map((option, i) => 
        i === index ? value : option
      )
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    setCurrentProblem(prev => ({
      ...prev,
      correctAnswer: index
    }));
  };

  const handleTestCaseChange = (e) => {
    const { name, value } = e.target;
    setCurrentTestCase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'text/plain',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      
      if (!validTypes.includes(file.type)) {
        setParseError('Please select a valid file type: .txt, .docx, .pdf, or .doc');
        return;
      }
      
      setUploadedFile(file);
      setParseError('');
      setParsedQuestions([]);
    }
  };

  const parseFileContent = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);
    setParseError('');

    try {
      // Show file type specific messages
      let parsingMessage = '';
      if (uploadedFile.type === 'application/pdf') {
        parsingMessage = '📕 Parsing PDF document...';
      } else if (uploadedFile.type.includes('word')) {
        parsingMessage = '📘 Parsing Word document...';
      } else {
        parsingMessage = '📄 Parsing text file...';
      }
      
      const text = await extractTextFromFile(uploadedFile);
      const questions = parseMCQFromText(text);
      
      if (questions.length > 0) {
        setParsedQuestions(questions);
        // Auto-fill contest title if empty
        if (!contestData.title) {
          setContestData(prev => ({
            ...prev,
            title: `${uploadedFile.name.split('.')[0]} MCQ Contest`
          }));
        }
      } else {
        setParseError('No MCQ questions found in the file. Please check the format and ensure the file contains readable text.');
      }
    } catch (error) {
      let errorMessage = error.message;
      
      // Provide more helpful error messages
      if (error.message.includes('PDF')) {
        errorMessage = 'PDF parsing failed. Please ensure the PDF contains selectable text (not scanned images).';
      } else if (error.message.includes('Word')) {
        errorMessage = 'Word document parsing failed. Please ensure the document contains text and try converting to .docx format.';
      } else if (error.message.includes('Failed to read')) {
        errorMessage = 'File reading failed. Please ensure the file is not corrupted and try again.';
      }
      
      setParseError('Error parsing file: ' + errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'application/pdf') {
        // For PDFs, we'll use a PDF.js approach
        extractTextFromPDF(file)
          .then(resolve)
          .catch(reject);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword') {
        // For Word documents (.docx and .doc)
        extractTextFromWord(file)
          .then(resolve)
          .catch(reject);
      } else {
        // For text files
        reader.readAsText(file);
      }
    });
  };

  const extractTextFromPDF = async (file) => {
    try {
      // Create a blob URL for the PDF
      const blobUrl = URL.createObjectURL(file);
      
      // Load PDF.js library dynamically
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(blobUrl);
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      return fullText;
    } catch (error) {
      throw new Error('Failed to parse PDF. Please ensure the PDF contains selectable text and try again.');
    }
  };

  const extractTextFromWord = async (file) => {
    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For .docx files
        return await extractTextFromDocx(file);
      } else {
        // For .doc files
        return await extractTextFromDoc(file);
      }
    } catch (error) {
      throw new Error('Failed to parse Word document. Please ensure the document contains text and try again.');
    }
  };

  const extractTextFromDocx = async (file) => {
    try {
      // Load mammoth.js for .docx parsing
      const mammoth = await import('mammoth');
      
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      return result.value;
    } catch (error) {
      throw new Error('Failed to parse .docx file. Please ensure the document contains text and try again.');
    }
  };

  const extractTextFromDoc = async (file) => {
    try {
      // For .doc files, we'll use a different approach
      // Since .doc parsing is complex, we'll show a message to convert to .docx
      throw new Error('Direct .doc parsing is not supported. Please convert your .doc file to .docx format or use a text file instead.');
    } catch (error) {
      throw error;
    }
  };

  const parseMCQFromText = (text) => {
    const questions = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentQuestion = null;
    let questionNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect question start (lines starting with numbers followed by dot or parenthesis)
      if (/^\d+[\.\)]/.test(line)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        currentQuestion = {
          id: questionNumber++,
          title: line.replace(/^\d+[\.\)]\s*/, ''),
          description: '',
          questionType: 'mcq',
          difficulty: 'Medium',
          points: 10,
          mcqOptions: ['', '', '', ''],
          correctAnswer: 0,
          testCases: []
        };
      }
      // Detect MCQ options (lines starting with A, B, C, D or a, b, c, d)
      else if (/^[A-Da-d][\.\)]/.test(line) && currentQuestion) {
        const optionIndex = line.charAt(0).toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        const optionText = line.replace(/^[A-Da-d][\.\)]\s*/, '');
        
        if (optionIndex >= 0 && optionIndex < 4) {
          currentQuestion.mcqOptions[optionIndex] = optionText;
        }
      }
      // Detect correct answer indicator (lines containing "Answer:" or "Correct:")
      else if (/(?:Answer|Correct):\s*([A-Da-d])/i.test(line) && currentQuestion) {
        const match = line.match(/(?:Answer|Correct):\s*([A-Da-d])/i);
        if (match) {
          const answer = match[1].toUpperCase();
          currentQuestion.correctAnswer = answer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        }
      }
      // Add description if it's not an option or answer
      else if (currentQuestion && !/^[A-Da-d][\.\)]/.test(line) && !/(?:Answer|Correct):/i.test(line)) {
        if (currentQuestion.description) {
          currentQuestion.description += ' ' + line;
        } else {
          currentQuestion.description = line;
        }
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  };

  const importParsedQuestions = () => {
    if (parsedQuestions.length > 0) {
      setContestData(prev => ({
        ...prev,
        problems: [...prev.problems, ...parsedQuestions]
      }));
      setParsedQuestions([]);
      setUploadedFile(null);
      alert(`Successfully imported ${parsedQuestions.length} MCQ questions!`);
    }
  };

  const addTestCase = () => {
    if (currentTestCase.input.trim() && currentTestCase.output.trim()) {
      if (editingTestCaseIndex >= 0) {
        // Edit existing test case
        const updatedProblem = { ...currentProblem };
        updatedProblem.testCases[editingTestCaseIndex] = { ...currentTestCase };
        setCurrentProblem(updatedProblem);
        setEditingTestCaseIndex(-1);
      } else {
        // Add new test case
        setCurrentProblem(prev => ({
          ...prev,
          testCases: [...prev.testCases, { ...currentTestCase }]
        }));
      }
      setCurrentTestCase({ input: '', output: '', description: '' });
      setShowTestCaseForm(false);
    }
  };

  const removeTestCase = (index) => {
    setCurrentProblem(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const editTestCase = (index) => {
    setCurrentTestCase({ ...currentProblem.testCases[index] });
    setEditingTestCaseIndex(index);
    setShowTestCaseForm(true);
  };

  const addProblem = () => {
    if (currentProblem.title.trim() && currentProblem.description.trim()) {
      // Validate MCQ options if it's an MCQ question
      if (currentProblem.questionType === 'mcq') {
        const validOptions = currentProblem.mcqOptions.filter(option => option.trim() !== '');
        if (validOptions.length < 2) {
          alert('Please provide at least 2 MCQ options.');
          return;
        }
        if (currentProblem.correctAnswer >= validOptions.length) {
          alert('Please select a valid correct answer.');
          return;
        }
      }

      if (editingProblemIndex >= 0) {
        // Edit existing problem
        const updatedProblems = [...contestData.problems];
        updatedProblems[editingProblemIndex] = { ...currentProblem };
        setContestData(prev => ({
          ...prev,
          problems: updatedProblems
        }));
        setEditingProblemIndex(-1);
      } else {
        // Add new problem
        setContestData(prev => ({
          ...prev,
          problems: [...prev.problems, { ...currentProblem }]
        }));
      }
      setCurrentProblem({
        title: '',
        description: '',
        difficulty: 'Medium',
        points: 10,
        timeLimit: 1000,
        memoryLimit: 256,
        questionType: 'coding',
        mcqOptions: ['', '', '', ''],
        correctAnswer: 0,
        testCases: []
      });
      setShowProblemForm(false);
    }
  };

  const removeProblem = (index) => {
    setContestData(prev => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index)
    }));
  };

  const editProblem = (index) => {
    setCurrentProblem({ ...contestData.problems[index] });
    setEditingProblemIndex(index);
    setShowProblemForm(true);
  };

  const createContest = () => {
    if (contestData.title.trim() && contestData.description.trim() && contestData.problems.length > 0) {
      // Get the current user (admin/TPO) who is creating the contest
      const currentUser = localStorage.getItem('userEmail') || localStorage.getItem('tpoUsername') || 'admin';
      
      // Prepare contest data for API
      const contestPayload = {
        ...contestData,
        createdBy: currentUser,
        // Ensure department is set (you might want to get this from user context)
        department: contestData.department || 'CSE' // Default to CSE, adjust as needed
      };

      // Send contest data to backend
      fetch('http://localhost:5000/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contestPayload),
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert('Contest created successfully!');
            
            // Reset form
            setContestData({
              title: '',
              description: '',
              department: '',
              startDate: '',
              endDate: '',
              duration: '',
              maxParticipants: '',
              difficulty: 'Medium',
              problems: []
            });
          } else {
            alert('Error creating contest: ' + (data.error || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Error creating contest:', error);
          alert('Error creating contest. Please try again.');
        });
    } else {
      alert('Please fill in all required fields and add at least one problem.');
    }
  };

  return (
    <div className="create-contest-container">
      <div className="contest-header">
        <h2>🏆 Create New Contest</h2>
        <p>Design and configure a coding contest for your students</p>
      </div>

      <div className="contest-form">
        <div className="form-section">
          <h3>📋 Contest Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Contest Title *</label>
              <input
                type="text"
                name="title"
                value={contestData.title}
                onChange={handleContestChange}
                placeholder="Enter contest title"
                required
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={contestData.department} onChange={handleContestChange} required>
                <option value="">Select Department</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="AI/ML">Artificial Intelligence & Machine Learning</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select name="difficulty" value={contestData.difficulty} onChange={handleContestChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={contestData.startDate}
                onChange={handleContestChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="datetime-local"
                name="endDate"
                value={contestData.endDate}
                onChange={handleContestChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={contestData.duration}
                onChange={handleContestChange}
                placeholder="120"
                min="30"
              />
            </div>

            <div className="form-group">
              <label>Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={contestData.maxParticipants}
                onChange={handleContestChange}
                placeholder="100"
                min="1"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Contest Description *</label>
            <textarea
              name="description"
              value={contestData.description}
              onChange={handleContestChange}
              placeholder="Describe the contest, rules, and objectives..."
              rows="4"
              required
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="form-section">
          <h3>📁 Bulk Import MCQ Questions</h3>
          <p className="section-description">
            Upload a file with MCQ questions to automatically create problems. 
            Supported formats: <strong>.txt</strong>, <strong>.docx</strong>, <strong>.pdf</strong> (with selectable text).
            <br />
            <span className="format-note">
              💡 <strong>Note:</strong> PDF files must contain selectable text (not scanned images). 
              For .doc files, please convert to .docx format for best compatibility.
            </span>
            <br />
            Each question should follow this format:
          </p>
          
          <div className="format-example">
            <div className="format-header">
              <h4>📝 Expected Format:</h4>
              <a 
                href="/mcq-template.txt" 
                download 
                className="download-template-btn"
              >
                📥 Download Template
              </a>
            </div>
            <pre>{`1. What is the capital of France?
A. London
B. Paris
C. Berlin
D. Madrid
Answer: B

2. Which programming language is this?
A. Python
B. Java
C. JavaScript
D. C++
Answer: A`}</pre>
          </div>

          <div className="file-upload-section">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                id="file-upload"
                className="file-input"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                📁 Choose File
              </label>
              <span className="file-name">
                {uploadedFile ? (
                  <div className="file-info">
                    <span className="file-name-text">{uploadedFile.name}</span>
                    <span className="file-type-badge">
                      {uploadedFile.type === 'text/plain' && '📄 Text'}
                      {uploadedFile.type === 'application/pdf' && '📕 PDF'}
                      {uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && '📘 Word (.docx)'}
                      {uploadedFile.type === 'application/msword' && '📗 Word (.doc)'}
                    </span>
                  </div>
                ) : 'No file chosen'}
              </span>
            </div>
            
            {uploadedFile && (
              <div className="file-actions">
                <button 
                  className="parse-btn"
                  onClick={parseFileContent}
                  disabled={isParsing}
                >
                  {isParsing ? (
                    <span>
                      🔄 Parsing {uploadedFile.type === 'application/pdf' ? 'PDF' : 
                                   uploadedFile.type.includes('word') ? 'Word' : 'Text'}...
                    </span>
                  ) : (
                    <span>
                      🔍 Parse Questions
                      {uploadedFile.type === 'application/pdf' && ' (PDF)'}
                      {uploadedFile.type.includes('word') && ' (Word)'}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {parseError && (
            <div className="error-message">
              ❌ {parseError}
            </div>
          )}

          {parsedQuestions.length > 0 && (
            <div className="parsed-questions-section">
              <div className="section-header">
                <h4>📋 Parsed Questions ({parsedQuestions.length})</h4>
                <button 
                  className="import-btn"
                  onClick={importParsedQuestions}
                >
                  ➕ Import All Questions
                </button>
              </div>
              
              <div className="parsed-questions-list">
                {parsedQuestions.map((question, index) => (
                  <div key={index} className="parsed-question-card">
                    <div className="question-header">
                      <h5>Question {question.id}</h5>
                      <span className="question-type-badge">MCQ</span>
                    </div>
                    <p className="question-title">{question.title}</p>
                    {question.description && (
                      <p className="question-description">{question.description}</p>
                    )}
                    <div className="mcq-options-preview">
                      {question.mcqOptions.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`option-preview ${optIndex === question.correctAnswer ? 'correct' : ''}`}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + optIndex)}.</span>
                          <span className="option-text">{option}</span>
                          {optIndex === question.correctAnswer && <span className="correct-indicator">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>💻 Contest Problems</h3>
            <button 
              className="add-btn"
              onClick={() => setShowProblemForm(true)}
            >
              ➕ Add Problem
            </button>
          </div>

          {contestData.problems.length > 0 && (
            <div className="problems-list">
              {contestData.problems.map((problem, index) => (
                <div key={index} className="problem-card">
                  <div className="problem-header">
                    <h4>Problem {index + 1}: {problem.title}</h4>
                    <div className="problem-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => editProblem(index)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => removeProblem(index)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className="problem-details">
                    <span className="difficulty-badge">{problem.difficulty}</span>
                    <span className="points-badge">{problem.points} points</span>
                    <span className="question-type-badge">{problem.questionType === 'mcq' ? '📝 MCQ' : '💻 Coding'}</span>
                    {problem.questionType === 'coding' && (
                      <>
                        <span className="time-badge">{problem.timeLimit}ms</span>
                        <span className="memory-badge">{problem.memoryLimit}MB</span>
                      </>
                    )}
                  </div>
                  <p className="problem-description">{problem.description}</p>
                  {problem.questionType === 'mcq' ? (
                    <div className="mcq-info">
                      <div className="mcq-options-display">
                        {problem.mcqOptions.map((option, index) => (
                          <div key={index} className={`mcq-option-display ${index === problem.correctAnswer ? 'correct' : ''}`}>
                            <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                            <span className="option-text">{option}</span>
                            {index === problem.correctAnswer && <span className="correct-indicator">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="test-cases-count">
                      📝 {problem.testCases.length} test cases
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {showProblemForm && (
            <div className="problem-form-overlay">
              <div className="problem-form">
                <div className="form-header">
                  <h3>{editingProblemIndex >= 0 ? 'Edit Problem' : 'Add New Problem'}</h3>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      setShowProblemForm(false);
                      setEditingProblemIndex(-1);
                      setCurrentProblem({
                        title: '',
                        description: '',
                        difficulty: 'Medium',
                        points: 10,
                        timeLimit: 1000,
                        memoryLimit: 256,
                        questionType: 'coding',
                        mcqOptions: ['', '', '', ''],
                        correctAnswer: 0,
                        testCases: []
                      });
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Problem Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={currentProblem.title}
                      onChange={handleProblemChange}
                      placeholder="Enter problem title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Question Type *</label>
                    <select name="questionType" value={currentProblem.questionType} onChange={handleProblemChange}>
                      <option value="coding">Coding Problem</option>
                      <option value="mcq">Multiple Choice Question</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <select name="difficulty" value={currentProblem.difficulty} onChange={handleProblemChange}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Points</label>
                    <input
                      type="number"
                      name="points"
                      value={currentProblem.points}
                      onChange={handleProblemChange}
                      min="1"
                      max="100"
                    />
                  </div>

                  {currentProblem.questionType === 'coding' && (
                    <>
                      <div className="form-group">
                        <label>Time Limit (ms)</label>
                        <input
                          type="number"
                          name="timeLimit"
                          value={currentProblem.timeLimit}
                          onChange={handleProblemChange}
                          min="100"
                          max="10000"
                        />
                      </div>

                      <div className="form-group">
                        <label>Memory Limit (MB)</label>
                        <input
                          type="number"
                          name="memoryLimit"
                          value={currentProblem.memoryLimit}
                          onChange={handleProblemChange}
                          min="16"
                          max="512"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group full-width">
                  <label>Problem Description *</label>
                  <textarea
                    name="description"
                    value={currentProblem.description}
                    onChange={handleProblemChange}
                    placeholder={currentProblem.questionType === 'mcq' ? 
                      "Describe the question, provide context, and explain what students need to answer..." : 
                      "Describe the problem, input format, output format, and constraints..."}
                    rows="6"
                    required
                  />
                </div>

                {currentProblem.questionType === 'mcq' && (
                  <div className="mcq-section">
                    <h4>📝 Multiple Choice Options</h4>
                    <div className="mcq-options">
                      {currentProblem.mcqOptions.map((option, index) => (
                        <div key={index} className="mcq-option">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={currentProblem.correctAnswer === index}
                            onChange={() => handleCorrectAnswerChange(index)}
                            id={`option-${index}`}
                          />
                          <label htmlFor={`option-${index}`} className="correct-answer-label">
                            Correct Answer
                          </label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleMCQOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="mcq-option-input"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentProblem.questionType === 'coding' && (
                  <div className="test-cases-section">
                    <div className="section-header">
                      <h4>🧪 Test Cases</h4>
                      <button 
                        className="add-btn small"
                        onClick={() => setShowTestCaseForm(true)}
                      >
                        ➕ Add Test Case
                      </button>
                    </div>

                    {currentProblem.testCases.length > 0 && (
                      <div className="test-cases-list">
                        {currentProblem.testCases.map((testCase, index) => (
                          <div key={index} className="test-case-card">
                            <div className="test-case-header">
                              <span className="test-case-number">Test Case {index + 1}</span>
                              <div className="test-case-actions">
                                <button 
                                  className="edit-btn small"
                                  onClick={() => editTestCase(index)}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="delete-btn small"
                                  onClick={() => removeTestCase(index)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <div className="test-case-content">
                              <div className="test-case-input">
                                <strong>Input:</strong>
                                <pre>{testCase.input}</pre>
                              </div>
                              <div className="test-case-output">
                                <strong>Output:</strong>
                                <pre>{testCase.output}</pre>
                              </div>
                              {testCase.description && (
                                <div className="test-case-description">
                                  <strong>Description:</strong> {testCase.description}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showTestCaseForm && (
                      <div className="test-case-form">
                        <div className="form-header">
                          <h4>{editingTestCaseIndex >= 0 ? 'Edit Test Case' : 'Add Test Case'}</h4>
                          <button 
                            className="close-btn"
                            onClick={() => {
                              setShowTestCaseForm(false);
                              setEditingTestCaseIndex(-1);
                              setCurrentTestCase({ input: '', output: '', description: '' });
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        <div className="form-group">
                          <label>Input *</label>
                          <textarea
                            name="input"
                            value={currentTestCase.input}
                            onChange={handleTestCaseChange}
                            placeholder="Enter test case input"
                            rows="3"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Expected Output *</label>
                          <textarea
                            name="output"
                            value={currentTestCase.output}
                            onChange={handleTestCaseChange}
                            placeholder="Enter expected output"
                            rows="3"
                            required
                          />
                        </div>

                        <div className="test-case-description">
                          <label>Description (Optional)</label>
                          <input
                            type="text"
                            name="description"
                            value={currentTestCase.description}
                            onChange={handleTestCaseChange}
                            placeholder="Brief description of this test case"
                          />
                        </div>

                        <div className="form-actions">
                          <button 
                            className="cancel-btn"
                            onClick={() => {
                              setShowTestCaseForm(false);
                              setEditingTestCaseIndex(-1);
                              setCurrentTestCase({ input: '', output: '', description: '' });
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            className="save-btn"
                            onClick={addTestCase}
                          >
                            {editingTestCaseIndex >= 0 ? 'Update' : 'Add'} Test Case
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setShowProblemForm(false);
                      setEditingProblemIndex(-1);
                      setCurrentProblem({
                        title: '',
                        description: '',
                        difficulty: 'Medium',
                        points: 10,
                        timeLimit: 1000,
                        memoryLimit: 256,
                        questionType: 'coding',
                        mcqOptions: ['', '', '', ''],
                        correctAnswer: 0,
                        testCases: []
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="save-btn"
                    onClick={addProblem}
                  >
                    {editingProblemIndex >= 0 ? 'Update' : 'Add'} Problem
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions main-actions">
          <button 
            className="create-contest-btn"
            onClick={createContest}
            disabled={!contestData.title || !contestData.description || contestData.problems.length === 0}
          >
            🏆 Create Contest
          </button>
        </div>
      </div>
    </div>
  );
} 