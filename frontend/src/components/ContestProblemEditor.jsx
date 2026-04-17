import React, { useState, useEffect } from 'react';
import './ContestProblemEditor.css';

const ContestProblemEditor = ({ problem, contestId, onClose, onSubmission }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setCurrentUser(userEmail);
  }, []);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first!');
      return;
    }

    setIsExecuting(true);
    setOutput('Running code...');

    try {
      const response = await fetch('http://localhost:5000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          testCases: problem.testCases || []
        }),
      });

      const result = await response.json();
      setExecutionResult(result);
      
      if (result.success) {
        setOutput(result.output || 'Code executed successfully!');
      } else {
        setOutput(result.error || 'Execution failed');
      }
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    setIsExecuting(true);
    setOutput('Submitting solution...');

    try {
      const response = await fetch(`http://localhost:5000/api/contests/${contestId}/problems/${problem.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail: currentUser,
          language,
          code,
          testCases: problem.testCases || []
        }),
      });

      const result = await response.json();
      setExecutionResult(result);
      
      if (result.success) {
        setOutput('✅ Solution submitted successfully!');
        if (onSubmission) {
          onSubmission(result);
        }
      } else {
        setOutput('❌ Submission failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setOutput('Error submitting code: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setExecutionResult(null);
  };

  return (
    <div className="contest-problem-editor">
      <div className="problem-editor-header">
        <button onClick={onClose} className="back-button">
          ← Back to Contest
        </button>
        <h2 className="section-title">💻 {problem.title}</h2>
        <p className="challenges-subtitle">
          {problem.difficulty} • {problem.points} points • Contest Problem
        </p>
      </div>

      <div className="problem-content-container">
        {/* Left Side - Problem Statement */}
        <div className="problem-statement-section">
          <div className="problem-header">
            <h4>📋 Problem Statement</h4>
          </div>
          
          <div className="problem-content">
            <div className="problem-title">
              <h3>{problem.title}</h3>
              <div className="problem-meta">
                <span className="difficulty">Difficulty: {problem.difficulty}</span>
                <span className="points">Points: {problem.points}</span>
              </div>
            </div>
            
            <div className="problem-description">
              <h4>Description:</h4>
              <p>{problem.description}</p>
            </div>
            
            <div className="problem-constraints">
              <h4>Constraints:</h4>
              <ul>
                <li>Input format: Standard input</li>
                <li>Output format: Standard output</li>
              </ul>
            </div>
            
            <div className="problem-examples">
              <h4>Test Cases:</h4>
              {problem.testCases && problem.testCases.length > 0 ? (
                <div className="test-cases-list">
                  {problem.testCases.map((testCase, index) => (
                    <div key={index} className="test-case-preview">
                      <div className="test-case-header">
                        <strong>Test Case {index + 1}</strong>
                      </div>
                      <div className="test-case-content">
                        <div className="test-input">
                          <strong>Input:</strong>
                          <pre>{(testCase.input || 'N/A').replace(/,/g, ' ')}</pre>
                        </div>
                        <div className="test-output">
                          <strong>Expected Output:</strong>
                          <pre>{testCase.output || 'N/A'}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="example">
                  <div className="example-input">
                    <strong>Input:</strong>
                    <pre>Sample input will be shown here</pre>
                  </div>
                  <div className="example-output">
                    <strong>Expected Output:</strong>
                    <pre>Sample output will be shown here</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Side - Code Editor */}
        <div className="code-section">
          <div className="editor-header">
            <h4>💻 Code Editor</h4>
            <div className="editor-controls">
              <div className="language-section">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-selector"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="code-editor-area">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Write your ${language} code here...`}
              className="code-textarea"
              rows={15}
            />
          </div>
          
          <div className="editor-actions">
            <button 
              onClick={handleRunCode}
              disabled={isExecuting}
              className="btn btn-run"
            >
              {isExecuting ? 'Running...' : '▶️ Run Code'}
            </button>
            
            <button 
              onClick={handleSubmitCode}
              disabled={isExecuting}
              className="btn btn-submit"
            >
              {isExecuting ? 'Submitting...' : '🏆 Submit Solution'}
            </button>
            
            <button onClick={clearOutput} className="btn btn-clear">
              🗑️ Clear Output
            </button>
          </div>
          
          <div className="output-section">
            <h4>Output:</h4>
            <div className="output-area">
              <pre>{output || 'Output will appear here...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestProblemEditor;
