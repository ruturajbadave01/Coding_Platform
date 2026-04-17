import React, { useState, useEffect } from 'react';
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

  // Set default department from logged-in admin
  useEffect(() => {
    const adminDepartment = localStorage.getItem('adminDepartment');
    if (adminDepartment) {
      setContestData(prev => ({
        ...prev,
        department: adminDepartment
      }));
    }
  }, []);

  const [currentProblem, setCurrentProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    points: 10,
    questionType: 'coding', // 'coding' only
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
  const [attachedPdfUrl, setAttachedPdfUrl] = useState('');

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

  const uploadPdfOnly = async () => {
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') return;
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
      }
      const base64 = btoa(binary);
      const res = await fetch('http://localhost:5000/api/uploads/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: uploadedFile.name, base64 })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setAttachedPdfUrl(data.url);
      } else {
        setParseError(data.error || 'Failed to upload PDF');
      }
    } catch (err) {
      setParseError('Failed to upload PDF');
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
      
      // Load PDF.js library dynamically (align worker with installed version)
      const pdfjsLib = await import('pdfjs-dist');
      try {
        // Prefer bundler-served worker to avoid version mismatch
        const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      } catch (_) {
        // Fallback to CDN using the installed major version (v4)
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
      }
      
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
      if (!result || typeof result.value !== 'string' || result.value.trim().length === 0) {
        throw new Error('Empty text extracted from DOCX');
      }
      return result.value;
    } catch (error) {
      throw new Error('Failed to parse .docx file. Please ensure the document contains selectable text and try again.');
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
          questionType: 'coding',
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

      // Normalize test case inputs: convert commas to spaces for better compatibility
      const normalizedProblem = {
        ...currentProblem,
        testCases: currentProblem.testCases.map(testCase => ({
          ...testCase,
          input: testCase.input ? testCase.input.replace(/,/g, ' ') : testCase.input
        }))
      };

      if (editingProblemIndex >= 0) {
        // Edit existing problem
        const updatedProblems = [...contestData.problems];
        updatedProblems[editingProblemIndex] = normalizedProblem;
        setContestData(prev => ({
          ...prev,
          problems: updatedProblems
        }));
        setEditingProblemIndex(-1);
      } else {
        // Add new problem
        setContestData(prev => ({
          ...prev,
          problems: [...prev.problems, normalizedProblem]
        }));
      }
      setCurrentProblem({
        title: '',
        description: '',
        difficulty: 'Medium',
        points: 10,
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
      const descWithPdf = attachedPdfUrl 
        ? `${contestData.description}\n\nAttached PDF: http://localhost:5000${attachedPdfUrl}`
        : contestData.description;

      const contestPayload = {
        ...contestData,
        description: descWithPdf,
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
            setAttachedPdfUrl('');
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
              <small className="helper-text">E.g., Monthly Coding Challenge</small>
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
              <small className="helper-text">Your department (automatically set)</small>
              <select name="department" value={contestData.department} onChange={handleContestChange} required disabled>
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
              <small className="helper-text">Overall difficulty of the contest</small>
              <select name="difficulty" value={contestData.difficulty} onChange={handleContestChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <small className="helper-text">Date/time when contest opens</small>
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
              <small className="helper-text">Date/time when contest closes</small>
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
              <small className="helper-text">Length of contest window in minutes</small>
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
              <small className="helper-text">Limit registrations (leave blank for no limit)</small>
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
            <small className="helper-text">Include rules, allowed languages, scoring, and instructions</small>
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

        {/* MCQ import and upload section removed as requested */}

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
                    <span className="question-type-badge">💻 Coding</span>
                  </div>
                  <p className="problem-description">{problem.description}</p>
                    <div className="test-cases-count">
                      📝 {problem.testCases.length} test cases
                    </div>
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
                    <small className="field-description">Give your problem a clear, descriptive name</small>
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
                    <label>Difficulty</label>
                    <small className="field-description">Set the difficulty level (Easy, Medium, Hard, Expert)</small>
                    <select name="difficulty" value={currentProblem.difficulty} onChange={handleProblemChange}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Points</label>
                    <small className="field-description">Assign points students earn for solving this problem</small>
                    <input
                      type="number"
                      name="points"
                      value={currentProblem.points}
                      onChange={handleProblemChange}
                      min="1"
                      max="100"
                    />
                  </div>


                </div>

                <div className="form-group full-width">
                  <label>Problem Description *</label>
                  <small className="field-description">Describe the problem, input/output format, and constraints</small>
                  <textarea
                    name="description"
                    value={currentProblem.description}
                    onChange={handleProblemChange}
                    placeholder="Describe the problem, input format, output format, and constraints..."
                    rows="6"
                    required
                  />
                </div>

                <div className="test-cases-section">
                  <h4>🧪 Standard Test Cases</h4>
                  <p className="section-description">Add 2 standard test cases for this coding problem:</p>
                  <div className="input-format-note">
                    <strong>📝 Input Format Note:</strong> Use spaces to separate values (e.g., "5 10 15"), not commas (e.g., "5,10,15"). 
                    The system will automatically convert commas to spaces if needed.
                  </div>
                  
                  <div className="test-cases-list">
                    {currentProblem.testCases.map((testCase, index) => (
                      <div key={index} className="test-case-card">
                        <div className="test-case-header">
                          <h5>Test Case {index + 1}</h5>
                          <button 
                            className="delete-btn small"
                            onClick={() => removeTestCase(index)}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                        <div className="test-case-content">
                          <div className="form-group">
                            <label>Input *</label>
                            <small className="field-description">Enter the test case input data (use spaces to separate values, not commas)</small>
                            <textarea
                              name="input"
                              value={testCase.input}
                              onChange={(e) => {
                                const updatedTestCases = [...currentProblem.testCases];
                                updatedTestCases[index] = { ...updatedTestCases[index], input: e.target.value };
                                setCurrentProblem(prev => ({ ...prev, testCases: updatedTestCases }));
                              }}
                              placeholder="Enter test case input (e.g., 5 10 15) - Use spaces, not commas!"
                              rows="3"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Expected Output *</label>
                            <small className="field-description">Enter the expected output for this input</small>
                            <textarea
                              name="output"
                              value={testCase.output}
                              onChange={(e) => {
                                const updatedTestCases = [...currentProblem.testCases];
                                updatedTestCases[index] = { ...updatedTestCases[index], output: e.target.value };
                                setCurrentProblem(prev => ({ ...prev, testCases: updatedTestCases }));
                              }}
                              placeholder="Enter expected output (e.g., 30)"
                              rows="3"
                              required
                          />
                        </div>
                    </div>
                  </div>
                    ))}
                  </div>

                  {currentProblem.testCases.length < 2 && (
                    <button 
                      className="add-test-case-btn"
                      onClick={() => {
                        const newTestCase = { input: '', output: '', description: '' };
                        setCurrentProblem(prev => ({
                          ...prev,
                          testCases: [...prev.testCases, newTestCase]
                        }));
                      }}
                    >
                      ➕ Add Test Case {currentProblem.testCases.length + 1}
                    </button>
                  )}
                </div>

                {false && (
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