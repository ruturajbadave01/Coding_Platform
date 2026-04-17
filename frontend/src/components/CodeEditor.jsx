import React, { useState, useEffect, useMemo, useRef } from 'react';
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

const CodeEditor = ({ problem, contestId, onSubmission, onClose, allProblems, currentProblemIndex, onNextProblem, onContestComplete }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript'); // Default to JavaScript since it's available
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionSucceeded, setSubmissionSucceeded] = useState(false);
  
  // Debug execution result changes
  useEffect(() => {
    console.log('Execution result changed:', executionResult);
    if (executionResult) {
      console.log('Execution result keys:', Object.keys(executionResult));
      console.log('Test results:', executionResult.testResults);
      console.log('All tests passed:', executionResult.allTestsPassed);
      console.log('Test results type:', typeof executionResult.testResults);
      console.log('Test results is array:', Array.isArray(executionResult.testResults));
      if (executionResult.testResults) {
        console.log('Test results length:', executionResult.testResults.length);
      }
    }
  }, [executionResult]);
  const [currentUser, setCurrentUser] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [proctorMode, setProctorMode] = useState(true);
  const [showStartOverlay, setShowStartOverlay] = useState(false);
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
  const [isProblemSolved, setIsProblemSolved] = useState(false);
  const [codeMirrorLoaded, setCodeMirrorLoaded] = useState(true);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  const focusEditor = () => {
    try {
      if (editorRef.current && typeof editorRef.current.focus === 'function') {
        editorRef.current.focus();
        return;
      }
      // Fallback: focus the CodeMirror content DOM directly
      const el = containerRef.current?.querySelector?.('.cm-content');
      if (el && typeof el.focus === 'function') el.focus();
    } catch (_) {}
  };

  // Derive sample input/output from first test case for display
  const sampleInput = useMemo(() => {
    if (problem && Array.isArray(problem.testCases) && problem.testCases.length > 0) {
      const input = problem.testCases[0].input ?? '';
      // Normalize input: convert commas to spaces for better compatibility
      return input.replace(/,/g, ' ');
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

  // Focus editor when component mounts
  useEffect(() => {
    setTimeout(focusEditor, 50);
  }, []);

  // Check if problem is solved when user or problem changes
  useEffect(() => {
    if (currentUser && problem?.id) {
      checkProblemSolvedStatus();
    }
  }, [currentUser, problem?.id]);

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
      // When entering fullscreen, ensure the code editor has focus
      if (active) {
        setTimeout(focusEditor, 50);
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
      setTimeout(focusEditor, 50);
    } catch (err) {
      // If request fails, keep overlay visible
      console.warn('Failed to enter fullscreen:', err);
    }
  };

  // Wrap clicks to preserve user gesture for fullscreen
  const handleRunClick = (e) => {
    try {
      if (proctorMode && !document.fullscreenElement) {
        document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
      }
    } catch (_) {}
    executeCode();
    setTimeout(focusEditor, 0);
  };

  const handleSubmitClick = (e) => {
    try {
      if (proctorMode && !document.fullscreenElement) {
        document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
      }
    } catch (_) {}
    submitSolution();
    setTimeout(focusEditor, 0);
  };

  // Ensure focus on initial mount and when problem changes
  useEffect(() => {
    focusEditor();
  }, [problem?.id]);

  // Click anywhere in the editor container to focus the editor
  useEffect(() => {
    const handler = () => focusEditor();
    const el = containerRef.current;
    if (el) el.addEventListener('mousedown', handler, true);
    return () => { if (el) el.removeEventListener('mousedown', handler, true); };
  }, []);

  // Check if the current problem is already solved by the user
  const checkProblemSolvedStatus = async () => {
    if (!currentUser || !problem?.id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${problem.id}/solved-status?studentEmail=${encodeURIComponent(currentUser)}&source=practice`);
      if (response.ok) {
        const result = await response.json();
        setIsProblemSolved(result.isSolved);
      }
    } catch (error) {
      console.log('Error checking problem solved status:', error);
    }
  };

  const checkLanguageAvailability = async () => {
    setIsLangLoading(true);
    console.log('Checking language availability...');
    
    // Set default availability - assume all languages are available initially
    const availability = {
      javascript: true,  // Default to true, will be updated based on actual checks
      java: true,
      python: true,
      cpp: true,
      c: true
    };
    
    // Check all supported languages
    const languagesToCheck = ['javascript', 'java', 'python', 'cpp', 'c'];
    
    for (const lang of languagesToCheck) {
      try {
        console.log(`Checking ${lang} availability...`);
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
          console.log(`${lang} check result:`, result);
          // More lenient check - consider available if no "not installed" error
          availability[lang] = result.success || !result.error?.includes('not installed') || !result.error?.includes('not found');
        } else {
          console.log(`${lang} check failed with status:`, response.status);
          availability[lang] = false;
        }
      } catch (error) {
        console.log(`Language check failed for ${lang}:`, error.message);
        // If server is not responding, assume language is available
        availability[lang] = true;
      }
    }
    
    console.log('Final language availability:', availability);
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
      const testCasesToSend = Array.isArray(problem?.testCases) ? problem.testCases : [];
      console.log('Sending test cases to backend:', testCasesToSend);
      
      const response = await fetch('http://localhost:5000/api/execute-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          testCases: testCasesToSend
        }),
      });

      const result = await response.json();
      console.log('Execution result:', result);
      
      if (result.success) {
        setOutput(result.output || 'Code executed successfully!');
        setExecutionResult(result);
        // Don't auto-submit - let user manually submit
        // Auto-submit was causing infinite loops
      } else {
        // Show detailed error message instead of generic "Execution failed"
        const errorMessage = result.error || 'Execution failed';
        setOutput(`Error: ${errorMessage}`);
        setExecutionResult(result);
      }
      return result;
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExecutionResult({ success: false, error: error.message });
      return { success: false, error: error.message };
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

    // If tests haven't been run or didn't pass, run them automatically
    if (!executionResult?.allTestsPassed) {
      const result = await executeCode();
      if (!result?.allTestsPassed) {
        // Tests failed; don't proceed to submission
        return;
      }
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
          code,
          // Send test cases as fallback in case DB value has invalid JSON formatting
          testCases: Array.isArray(problem?.testCases) ? problem.testCases.map(tc => ({
            input: (tc?.input || '').replace(/,/g, ' '),
            output: typeof tc?.output === 'number' || typeof tc?.output === 'string' ? String(tc.output) : (tc?.output || ''),
            description: tc?.description || ''
          })) : [],
          // Mirror practice submission: provide full problemData so backend uses identical logic
          problemData: {
            id: problem?.id,
            points: typeof problem?.points === 'number' ? problem.points : Number(problem?.points) || 5,
            testCases: Array.isArray(problem?.testCases) ? problem.testCases.map(tc => ({
              input: (tc?.input || '').replace(/,/g, ' '),
              output: typeof tc?.output === 'number' || typeof tc?.output === 'string' ? String(tc.output) : (tc?.output || ''),
              description: tc?.description || ''
            })) : []
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        setOutput(`HTTP Error ${response.status}: ${errorText}`);
        setExecutionResult({ success: false, error: `HTTP Error ${response.status}` });
        return;
      }
      
      const result = await response.json();
      console.log('Contest submission response:', result);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Result success:', result.success);
      console.log('Result allTestsPassed:', result.result?.allTestsPassed);
      
      if (result.success) {
        // Merge server result with local executionResult to avoid empty testResults/undefined flags
        const serverRes = result.result || {};
        const localRes = executionResult || {};
        const merged = {
          ...serverRes,
          output: serverRes.output || localRes.output || '',
          error: typeof serverRes.error !== 'undefined' ? serverRes.error : (localRes.error || null),
          testResults: (Array.isArray(serverRes.testResults) && serverRes.testResults.length > 0)
            ? serverRes.testResults
            : (Array.isArray(localRes.testResults) ? localRes.testResults : []),
          allTestsPassed: (typeof serverRes.allTestsPassed !== 'undefined')
            ? !!serverRes.allTestsPassed
            : !!localRes.allTestsPassed,
          success: (typeof serverRes.success !== 'undefined') ? !!serverRes.success : !!localRes.success
        };

        console.log('Setting execution result (merged):', merged);
        console.log('Test results in merged:', merged?.testResults);
        setOutput(result.message || 'Submitted successfully!');
        setExecutionResult(merged);
        setIsProblemSolved(true);
        setSubmissionSucceeded(!!merged.allTestsPassed);
        console.log('Execution result set:', result.result);
        console.log('Test results:', result.result?.testResults);
        console.log('All tests passed:', result.result?.allTestsPassed);
        
        // Force a re-render to ensure test results are displayed
        setTimeout(() => {
          console.log('Forcing re-render after submission');
          setExecutionResult(prev => ({...(prev || merged)}));
        }, 100);
        
        // Signal dashboard to refresh stats and leaderboard immediately
        try {
          localStorage.setItem('statsUpdated', Date.now().toString());
        } catch (_) {}

        // Force immediate navigation to next problem or completion in contest mode
        if (contestId && allProblems && currentProblemIndex !== undefined && result.result?.allTestsPassed) {
          if (currentProblemIndex < allProblems.length - 1) {
            onNextProblem && onNextProblem(currentProblemIndex + 1);
          } else {
            onContestComplete && onContestComplete();
          }
        }
        try {
          window.dispatchEvent(new Event('statsUpdated'));
        } catch (_) {}
        
        // Call the parent component's submission handler
        if (onSubmission) {
          onSubmission({ success: true, result: merged });
        }
        
        // Handle automatic progression for contest problems
        if (contestId && allProblems && currentProblemIndex !== undefined) {
          const allTestsPassed = result.result && result.result.allTestsPassed;
          if (allTestsPassed) {
            // Check if there are more problems
            if (currentProblemIndex < allProblems.length - 1) {
              // Move to next problem
              setTimeout(() => {
                if (onNextProblem) {
                  onNextProblem(currentProblemIndex + 1);
                }
              }, 2000); // Wait 2 seconds before moving to next problem
            } else {
              // This was the last problem, show contest completion
              setTimeout(() => {
                if (onContestComplete) {
                  onContestComplete();
                }
              }, 2000); // Wait 2 seconds before showing completion
            }
          }
        }
      } else {
        console.error('Contest submission failed:', result);
        console.error('Full error object:', JSON.stringify(result, null, 2));
        const errorMessage = result.error || result.message || result.details || 'Unknown error occurred';
        setOutput(`Submission failed: ${errorMessage}`);
        setExecutionResult(result);
      }
    } catch (error) {
      console.error('Contest submission error:', error);
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
        
        // Check if this was a first-time solve (points awarded)
        if (result.message && result.message.includes('earned')) {
          setIsProblemSolved(true);
        }
        
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
    <div
      ref={containerRef}
      className={`code-editor-container${isFullscreen ? ' fullscreen' : ''}${!contestId ? ' problem-mode' : ''}`}
      tabIndex={0}
      onFocus={focusEditor}
    >
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
        <h3>Code Editor</h3>
        <div className="editor-controls">
          {contestId && onClose && (
            <button type="button" onClick={onClose} className="btn btn-back-contest" title="Back to contest problems">
              ← Back to Contest
            </button>
          )}
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
            onClick={handleRunClick} 
            disabled={isExecuting}
            className="btn btn-run"
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
          
          {contestId && problem && (
            <button 
              onClick={handleSubmitClick} 
              disabled={isExecuting || !executionResult?.allTestsPassed}
              className="btn btn-submit"
              title={!executionResult?.allTestsPassed ? "Run tests first to enable submission" : (secureModeExited ? "⚠️ Points will not be calculated (Secure mode disabled)" : "")}
            >
              {isExecuting ? 'Submitting...' : 
                (allProblems && currentProblemIndex !== undefined && currentProblemIndex === allProblems.length - 1) ? 
                'Submit Contest' : 'Submit Problem'}
            </button>
          )}
          
          {/* Failure actions: Retry / Skip */}
          {executionResult && executionResult.allTestsPassed === false && contestId && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-run"
                disabled={isExecuting}
                onClick={executeCode}
              >
                Retry
              </button>
              <button
                className="btn btn-cancel"
                disabled={isExecuting}
                onClick={() => {
                  if (allProblems && currentProblemIndex !== undefined) {
                    if (currentProblemIndex < allProblems.length - 1) {
                      onNextProblem && onNextProblem(currentProblemIndex + 1);
                    } else {
                      onContestComplete && onContestComplete();
                    }
                  }
                }}
              >
                Skip Problem
              </button>
            </div>
          )}

          {/* Debug button to test execution result */}
          {executionResult && (
            <button 
              onClick={() => {
                console.log('Current execution result:', executionResult);
                console.log('Test results:', executionResult.testResults);
                console.log('All tests passed:', executionResult.allTestsPassed);
              }}
              className="btn btn-debug"
              style={{backgroundColor: '#ff9800', marginLeft: '10px'}}
            >
              Debug Result
            </button>
          )}
          
          {!contestId && problem && !isProblemSolved && (
            <button 
              onClick={submitPracticeSolution} 
              disabled={isExecuting}
              className="btn btn-submit-practice"
              title={secureModeExited ? "⚠️ Points will not be calculated (Secure mode disabled)" : ""}
            >
              {isExecuting ? 'Submitting...' : 'Submit for Points'}
            </button>
          )}
          
          {!contestId && problem && isProblemSolved && (
            <button 
              disabled
              className="btn btn-already-solved"
              title="This problem has already been solved. Points were awarded on first submission."
            >
              Already Solved - No Points
            </button>
          )}
          
          <button onClick={clearOutput} className="btn btn-clear">
            Clear Output
          </button>
          <button 
            onClick={() => setCodeMirrorLoaded(!codeMirrorLoaded)} 
            className="btn btn-debug"
            title="Toggle editor mode"
          >
            {codeMirrorLoaded ? 'Text Mode' : 'Code Mode'}
          </button>
          {!proctorMode && (
            <button onClick={toggleFullscreen} className="btn btn-fullscreen">
              {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
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
                  <h4>Test Cases:</h4>
                  {problem && Array.isArray(problem.testCases) && problem.testCases.length > 0 ? (
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
                        <pre>{sampleInput || problem.exampleInput || 'Sample input will be shown here'}</pre>
                      </div>
                      <div className="example-output">
                        <strong>Expected Output:</strong>
                        <pre>{sampleOutput || problem.exampleOutput || 'Sample output will be shown here'}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
        
        {/* Right - Code Editor (75%) with bottom 20% for tests */}
        <div className="code-section">
          <div className="code-header">
              <span>Your Code ({language})</span>
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
              <div className="editor-top" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', minHeight: '300px' }}>
                {/* Fallback textarea in case CodeMirror fails */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    width: '100%',
                    height: '300px',
                    background: '#1e1e1e',
                    color: '#ffffff',
                    border: '1px solid #4b5563',
                    borderRadius: '4px',
                    padding: '10px',
                    fontFamily: 'Consolas, Monaco, Courier New, monospace',
                    fontSize: '14px',
                    resize: 'vertical',
                    display: codeMirrorLoaded ? 'none' : 'block' // Show if CodeMirror fails
                  }}
                  placeholder="Enter your code here..."
                />
                <CodeMirror
                  value={code}
                  height="300px"
                  theme={oneDark}
                  style={{ display: codeMirrorLoaded ? 'block' : 'none' }}
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
                autoFocus={true}
                onCreateEditor={(view) => {
                  try {
                    editorRef.current = view?.contentDOM || view;
                    setCodeMirrorLoaded(true);
                    setTimeout(() => {
                      focusEditor();
                      if (view && view.focus) {
                        view.focus();
                      }
                    }, 100);
                  } catch (error) {
                    console.error('CodeMirror failed to load:', error);
                    setCodeMirrorLoaded(false);
                  }
                }}
                />
              </div>
              <div className="editor-bottom-tests">
                <div className="test-cases-header">
                  <h4>Test Cases</h4>
                  <button className="run-tests-btn" onClick={executeCode}>
                    {isExecuting ? 'Running...' : 'Run Tests'}
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
                  <pre className={output && output.includes('Error:') ? 'error-output' : ''}>
                    {output || 'Output will appear here...'}
                  </pre>
                  {executionResult && executionResult.output && (
                    <div className="execution-output">
                      <strong>Execution Output:</strong>
                      <pre>{executionResult.output}</pre>
                    </div>
                  )}
                </div>
                {executionResult && Array.isArray(executionResult.testResults) && executionResult.testResults.length > 0 && (
                  <div className="test-results scrollable">
                    {console.log('Rendering test results:', executionResult.testResults)}
                    {console.log('Execution result keys:', Object.keys(executionResult))}
                    {console.log('Execution result allTestsPassed:', executionResult.allTestsPassed)}
                    {console.log('Execution result type:', typeof executionResult)}
                    {console.log('Test results type:', typeof executionResult.testResults)}
                    {console.log('Test results length:', executionResult.testResults.length)}
                    {executionResult.testResults.map((test, index) => (
                      <div key={index} className={`test-case ${test.passed ? 'passed' : 'failed'}`}>
                        <div className="test-header">
                          <span className="test-number">Test Case {index + 1}</span>
                          <span className={`test-status ${test.passed ? 'passed' : 'failed'}`}>
                            {test.passed ? '✅ PASSED' : '❌ FAILED'}
                          </span>
                        </div>
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
                            <pre>{test.actualOutput || 'No output'}</pre>
                          </div>
                          {executionResult && executionResult.error && (
                            <div className="test-error">
                              <strong>Error:</strong>
                              <pre className="error-message">{executionResult.error}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!executionResult && submissionSucceeded && (
                  <div className="test-results scrollable">
                    <div className="no-tests">
                      <p>✅ Submitted successfully. Proceeding to the next step.</p>
                      {console.log('No test cases to display. Execution result:', executionResult)}
                    </div>
                  </div>
                )}

                {!executionResult && !submissionSucceeded && problem && Array.isArray(problem.testCases) && problem.testCases.length > 0 && (
                  <div className="test-results scrollable">
                    {console.log('Showing sample test cases:', problem.testCases)}
                    {problem.testCases.map((tc, index) => (
                      <div key={`sample-${index}`} className="test-case">
                        <div className="test-header">
                          <span className="test-number">Sample Test {index + 1}</span>
                          <span className="test-status">Preview</span>
                        </div>
                        <div className="test-details">
                          <div className="test-input">
                            <strong>Input:</strong>
                            <pre>{(tc.input || 'N/A').replace(/,/g, ' ')}</pre>
                          </div>
                          <div className="test-expected">
                            <strong>Expected:</strong>
                            <pre>{tc.output || ''}</pre>
                          </div>
                          <div className="test-actual">
                            <strong>Actual:</strong>
                            <pre>Run code to see output</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!executionResult && !submissionSucceeded && (!problem || !Array.isArray(problem.testCases) || problem.testCases.length === 0) && (
                  <div className="test-results scrollable">
                    <div className="no-tests">
                      <p>No test cases available for this problem.</p>
                      {console.log('No test cases to display. Execution result:', executionResult)}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>


      {proctorMode && showStartOverlay && (
        <div className="secure-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            exitSecureMode();
          }
        }}>
          <div className="secure-card" onClick={(e) => e.stopPropagation()}>
            <button className="secure-close" onClick={exitSecureMode} aria-label="Close">×</button>
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
              <button className="btn btn-fullscreen" onClick={enterSecureFullscreen} disabled={!availableLanguages[language]}>Start Secure Test</button>
              <button className="btn btn-exit" onClick={exitSecureMode}>Skip Secure Mode</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;