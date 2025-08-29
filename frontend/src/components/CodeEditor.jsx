import React, { useState, useEffect, useMemo } from 'react';
import './CodeEditor.css';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { indentOnInput, indentUnit } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

const CodeEditor = ({ problem, contestId, onSubmission, onClose }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript'); // Default to JavaScript since it's available
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [proctorMode, setProctorMode] = useState(true);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [violationCount, setViolationCount] = useState(0);
  const [secureModeExited, setSecureModeExited] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [availableLanguages, setAvailableLanguages] = useState({
    javascript: true,
    java: true,
    python: false,
    cpp: false,
    c: false
  });
  const [isLangLoading, setIsLangLoading] = useState(true);

  // Derive sample input/output from first test case for display
  const sampleInput = useMemo(() => {
    if (problem && Array.isArray(problem.testCases) && problem.testCases.length > 0) {
      return problem.testCases[0].input ?? '';
    }
    return '';
  }, [problem]);

  const sampleOutput = useMemo(() => {
    if (problem && Array.isArray(problem.testCases) && problem.testCases.length > 0) {
      return problem.testCases[0].output ?? '';
    }
    return '';
  }, [problem]);

  useEffect(() => {
    // Get current user from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setCurrentUser(userEmail);
    }

    // Set default code based on language
    setDefaultCode(language);
  }, [language]);

  // Check language availability only once when component mounts
  useEffect(() => {
    // Delay the language check to avoid overwhelming the server on startup
    const timer = setTimeout(() => {
      checkLanguageAvailability();
    }, 2000); // Wait 2 seconds before checking

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once

  // Secure proctoring: enforce fullscreen, block certain actions, track violations
  useEffect(() => {
    if (!proctorMode) return;

    let lastViolationTs = 0;

    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) {
        // If user left fullscreen, count as a violation and show overlay
        const now = Date.now();
        if (now - lastViolationTs > 1000) {
          setViolationCount(v => v + 1);
          lastViolationTs = now;
        }
        setShowStartOverlay(true);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        const now = Date.now();
        if (now - lastViolationTs > 1000) {
          setViolationCount(v => v + 1);
          lastViolationTs = now;
        }
      }
    };

    const handleBlur = () => {
      const now = Date.now();
      if (now - lastViolationTs > 1000) {
        setViolationCount(v => v + 1);
        lastViolationTs = now;
      }
    };

    const blockShortcuts = (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      // Block common dev/cheat/navigation shortcuts
      if (
        key === 'f11' ||
        (ctrl && (key === 'c' || key === 'x' || key === 'v' || key === 's' || key === 'p' || key === 'r' || key === 'u')) ||
        (ctrl && shift && (key === 'i' || key === 'j' || key === 'c')) ||
        (key === 'tab' && (e.altKey || ctrl))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const blockContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', blockShortcuts, true);
    document.addEventListener('contextmenu', blockContextMenu);

    document.body.style.overflow = isFullscreen ? 'hidden' : '';

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', blockShortcuts, true);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.body.style.overflow = '';
    };
  }, [proctorMode, isFullscreen]);

  const enterSecureFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      }
      setShowStartOverlay(false);
    } catch (err) {
      // If request fails, keep overlay visible
      console.warn('Failed to enter fullscreen:', err);
    }
  };

  const checkLanguageAvailability = async () => {
    setIsLangLoading(true);
    // Set default availability - we'll check all languages now
    const availability = {
      javascript: false,
      java: false,
      python: false,
      cpp: false,
      c: false
    };
    
    // Check all supported languages
    const languagesToCheck = ['javascript', 'java', 'python', 'cpp', 'c'];
    
    for (const lang of languagesToCheck) {
      try {
        const response = await fetch('http://localhost:5000/api/execute-simple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
                  body: JSON.stringify({
          language: lang,
          code: lang === 'javascript' ? 'console.log("test");' : 
                 lang === 'java' ? 'public class Test { public static void main(String[] args) { System.out.println("test"); } }' :
                 lang === 'python' ? 'print("test")' :
                 lang === 'cpp' ? '#include <iostream>\nint main() { std::cout << "test" << std::endl; return 0; }' :
                 lang === 'c' ? '#include <stdio.h>\nint main() { printf("test\\n"); return 0; }' :
                 'console.log("test");',
          testCases: []
        }),
        });
        
        if (response.ok) {
          const result = await response.json();
          availability[lang] = result.success || !result.error?.includes('not installed');
        } else {
          availability[lang] = false;
        }
      } catch (error) {
        console.log(`Language check failed for ${lang}:`, error.message);
        availability[lang] = false;
      }
    }
    
    setAvailableLanguages(availability);
    setIsLangLoading(false);
  };

  const setDefaultCode = (lang) => {
    const defaultCodes = {
      python: `def solve():
    pass`,
      javascript: `function solve() {
}`,
      java: `public class Solution {
    public static void main(String[] args) {
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    return 0;
}`
    };
    
    setCode(defaultCodes[lang] || defaultCodes.python);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setOutput('');
    setExecutionResult(null);
  };

  const executeCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    setIsExecuting(true);
    setOutput('Executing code...');

    try {
      const response = await fetch('http://localhost:5000/api/execute-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          testCases: problem?.testCases || []
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.output || 'Code executed successfully!');
        setExecutionResult(result);
      } else {
        setOutput(`Error: ${result.error || 'Execution failed'}`);
        setExecutionResult(result);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExecutionResult({ success: false, error: error.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const submitSolution = async () => {
    if (!currentUser) {
      alert('Please log in to submit your solution.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    if (!contestId || !problem?.id) {
      alert('Problem information not available.');
      return;
    }

    if (secureModeExited) {
      const confirmSubmit = window.confirm('⚠️ WARNING: You have exited secure mode. Points will NOT be calculated for this submission. Do you want to continue?');
      if (!confirmSubmit) return;
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
          code
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.message);
        setExecutionResult(result.result);
        
        // Call the parent component's submission handler
        if (onSubmission) {
          onSubmission(result);
        }
      } else {
        setOutput(`Submission failed: ${result.error || 'Unknown error'}`);
        setExecutionResult(result);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExecutionResult({ success: false, error: error.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const submitPracticeSolution = async () => {
    if (!currentUser) {
      alert('Please log in to submit your solution for points.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    if (!problem?.id) {
      alert('Problem information not available.');
      return;
    }

    if (secureModeExited) {
      const confirmSubmit = window.confirm('⚠️ WARNING: You have exited secure mode. Points will NOT be calculated for this submission. Do you want to continue?');
      if (!confirmSubmit) return;
    }

    setIsExecuting(true);
    setOutput('Submitting solution for points...');

    try {
      const response = await fetch(`http://localhost:5000/api/problems/${problem.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail: currentUser,
          language,
          code,
          problemData: problem
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.message);
        setExecutionResult(result.result);
        // Signal dashboard to refresh stats immediately
        try {
          localStorage.setItem('statsUpdated', Date.now().toString());
        } catch (_) {}
        
        // Call the parent component's submission handler
        if (onSubmission) {
          onSubmission(result);
        }
      } else {
        setOutput(`Submission failed: ${result.error || 'Unknown error'}`);
        setExecutionResult(result);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExecutionResult({ success: false, error: error.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setExecutionResult(null);
  };

  const toggleFullscreen = () => {
    if (proctorMode) return; // disabled in proctor mode
    setIsFullscreen(prev => !prev);
  };

  const exitSecureMode = async () => {
    const confirmExit = window.confirm('Exit secure mode? This will leave fullscreen and disable proctoring. NOTE: Points will not be calculated for solutions submitted after exiting secure mode.');
    if (!confirmExit) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      // ignore
    }
    setProctorMode(false);
    setShowStartOverlay(false);
    setIsFullscreen(false);
    setSecureModeExited(true);
  };

  return (
    <div className={`code-editor-container${isFullscreen ? ' fullscreen' : ''}`}>
      {isLangLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading languages…</div>
        </div>
      )}
      {proctorMode && (
        <div className="secure-banner">
          <span>🔒 Secure Proctoring Mode</span>
          <div className="secure-actions">
            <span className="violations">Violations: {violationCount}</span>
            <button className="btn btn-exit" onClick={exitSecureMode}>Exit Secure Mode</button>
          </div>
        </div>
      )}
      
      {secureModeExited && (
        <div className="secure-exit-warning">
          <span>⚠️ Secure Mode Disabled</span>
          <div className="warning-message">
            Points will not be calculated for solutions submitted after exiting secure mode.
          </div>
        </div>
      )}
      <div className="editor-header">
        <h3>💻 Code Editor</h3>
        <div className="editor-controls">
          <div className="language-section">
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-selector"
            >
              <option value="javascript" disabled={!availableLanguages.javascript}>
                JavaScript {availableLanguages.javascript ? '✅' : '❌'}
              </option>
              <option value="java" disabled={!availableLanguages.java}>
                Java {availableLanguages.java ? '✅' : '❌'}
              </option>
              <option value="python" disabled={!availableLanguages.python}>
                Python {availableLanguages.python ? '✅' : '❌'}
              </option>
              <option value="cpp" disabled={!availableLanguages.cpp}>
                C++ {availableLanguages.cpp ? '✅' : '❌'}
              </option>
              <option value="c" disabled={!availableLanguages.c}>
                C {availableLanguages.c ? '✅' : '❌'}
              </option>
            </select>
            {!availableLanguages[language] && (
              <div className="language-warning">
                ⚠️ {language.charAt(0).toUpperCase() + language.slice(1)} is not installed on this system. 
                Please install {language === 'python' ? 'Python' : 
                              language === 'cpp' ? 'a C++ compiler (like g++)' : 
                              language === 'c' ? 'a C compiler (like gcc)' : language} to use this language.
              </div>
            )}
          </div>
          
          <button 
            onClick={executeCode} 
            disabled={isExecuting}
            className="btn btn-run"
          >
            {isExecuting ? 'Running...' : '▶️ Run Code'}
          </button>
          
          {contestId && problem && (
            <button 
              onClick={submitSolution} 
              disabled={isExecuting}
              className="btn btn-submit"
              title={secureModeExited ? "⚠️ Points will not be calculated (Secure mode disabled)" : ""}
            >
              {isExecuting ? 'Submitting...' : '📤 Submit Solution'}
            </button>
          )}
          
          {!contestId && problem && (
            <button 
              onClick={submitPracticeSolution} 
              disabled={isExecuting}
              className="btn btn-submit-practice"
              title={secureModeExited ? "⚠️ Points will not be calculated (Secure mode disabled)" : ""}
            >
              {isExecuting ? 'Submitting...' : '🏆 Submit for Points'}
            </button>
          )}
          
          <button onClick={clearOutput} className="btn btn-clear">
            🗑️ Clear Output
          </button>
          {!proctorMode && (
            <button onClick={toggleFullscreen} className="btn btn-fullscreen">
              {isFullscreen ? '🗗 Exit Full Screen' : '⛶ Full Screen'}
            </button>
          )}
        </div>
      </div>

      <div className="editor-content two-column">
        {/* Left - Problem Statement (25%) */}
        <div className="problem-statement-section">
            <div className="problem-header">
              <h4>📋 Problem Statement</h4>
              {secureModeExited && (
                <div className="points-warning-inline">
                  <span>⚠️ Points will not be calculated</span>
                </div>
              )}
            </div>
            
            {problem && (
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
                  <h4>Example:</h4>
                  <div className="example">
                    <div className="example-input">
                      <strong>Input:</strong>
                      <pre>{sampleInput || problem.exampleInput || 'Sample input will be shown here'}</pre>
                    </div>
                    <div className="example-output">
                      <strong>Expected Output:</strong>
                      <pre>{sampleOutput || problem.exampleOutput || 'Sample output will be shown here'}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
        
        {/* Right - Code Editor (75%) with bottom 20% for tests */}
        <div className="code-section">
            <div className="code-header">
              <span>📝 Your Code ({language})</span>
              <div className="code-controls">
                <button 
                  className="zoom-btn zoom-out" 
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                  title="Zoom Out"
                >
                  🔍-
                </button>
                <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                <button 
                  className="zoom-btn zoom-in" 
                  onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.1))}
                  title="Zoom In"
                >
                  🔍+
                </button>
              </div>
            </div>
            {/* Code panel split: editor (80%) + tests (20%) */}
            <div className="code-panel">
              <div className="editor-top" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
                <CodeMirror
                  value={code}
                  height="100%"
                  theme={oneDark}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                    bracketMatching: true,
                    autocompletion: true
                  }}
                  extensions={[
                    oneDark,
                    EditorView.lineWrapping,
                    indentOnInput(),
                    indentUnit.of('  '),
                    autocompletion(),
                    closeBrackets(),
                    ...(language === 'javascript' ? [javascript({ typescript: false })] : []),
                    ...(language === 'python' ? [python()] : []),
                    ...(language === 'java' ? [java()] : []),
                    ...(language === 'cpp' ? [cpp()] : []),
                    ...(language === 'c' ? [cpp()] : [])
                  ]}
                  onChange={(val) => setCode(val)}
                />
              </div>
              <div className="editor-bottom-tests">
                <div className="test-cases-header">
                  <h4>🧪 Test Cases</h4>
                  <button className="run-tests-btn" onClick={executeCode}>
                    {isExecuting ? 'Running...' : '▶️ Run Tests'}
                  </button>
                  {executionResult && (
                    <span className={`status ${executionResult.success ? 'success' : 'error'}`}>
                      {executionResult.success ? '✅ Success' : '❌ Error'}
                    </span>
                  )}
                </div>
                {secureModeExited && (
                  <div className="output-warning">
                    <span>⚠️ Secure mode disabled - Points will not be calculated</span>
                  </div>
                )}
                <div className="output-content compact">
                  <pre>{output || 'Output will appear here...'}</pre>
                </div>
                {executionResult && executionResult.testResults && executionResult.testResults.length > 0 ? (
                  <div className="test-results scrollable">
                    {executionResult.testResults.map((test, index) => (
                      <div key={index} className={`test-case ${test.passed ? 'passed' : 'failed'}`}>
                        <div className="test-header">
                          <span className="test-number">Test Case {index + 1}</span>
                          <span className={`test-status ${test.passed ? 'passed' : 'failed'}`}>
                            {test.passed ? '✅ PASSED' : '❌ FAILED'}
                          </span>
                        </div>
                        {!test.passed && (
                          <div className="test-details">
                            <div className="test-input">
                              <strong>Input:</strong>
                              <pre>{test.input || 'N/A'}</pre>
                            </div>
                            <div className="test-expected">
                              <strong>Expected:</strong>
                              <pre>{test.expectedOutput}</pre>
                            </div>
                            <div className="test-actual">
                              <strong>Actual:</strong>
                              <pre>{test.actualOutput}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : problem && Array.isArray(problem.testCases) && problem.testCases.length > 0 ? (
                  <div className="test-results scrollable">
                    {problem.testCases.map((tc, index) => (
                      <div key={`sample-${index}`} className="test-case">
                        <div className="test-header">
                          <span className="test-number">Sample Test {index + 1}</span>
                          <span className="test-status">Preview</span>
                        </div>
                        <div className="test-details">
                          <div className="test-input">
                            <strong>Input:</strong>
                            <pre>{tc.input || 'N/A'}</pre>
                          </div>
                          <div className="test-expected">
                            <strong>Expected:</strong>
                            <pre>{tc.output || ''}</pre>
                          </div>
                          <div className="test-actual">
                            <strong>Actual:</strong>
                            <pre>-</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
        </div>
      </div>


      {proctorMode && showStartOverlay && (
        <div className="secure-overlay">
          <div className="secure-card">
            <button className="secure-close" onClick={() => { if (onClose) onClose(); }} aria-label="Close">×</button>
            <h3>Enter Secure Fullscreen</h3>
            <p>To start the test, we require fullscreen. Leaving fullscreen or switching tabs/windows will be recorded as a violation.</p>
            <div style={{ margin: '12px 0' }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Choose Language</label>
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-selector"
              >
                <option value="javascript" disabled={!availableLanguages.javascript}>
                  JavaScript {availableLanguages.javascript ? '✅' : '❌'}
                </option>
                <option value="java" disabled={!availableLanguages.java}>
                  Java {availableLanguages.java ? '✅' : '❌'}
                </option>
                <option value="python" disabled={!availableLanguages.python}>
                  Python {availableLanguages.python ? '✅' : '❌'}
                </option>
                <option value="cpp" disabled={!availableLanguages.cpp}>
                  C++ {availableLanguages.cpp ? '✅' : '❌'}
                </option>
                <option value="c" disabled={!availableLanguages.c}>
                  C {availableLanguages.c ? '✅' : '❌'}
                </option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-fullscreen" onClick={enterSecureFullscreen}>Start Secure Test</button>
              <button className="btn btn-exit" onClick={exitSecureMode}>Skip Secure Mode</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;