import Docker from 'dockerode';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CodeExecutor {
  constructor() {
    this.docker = new Docker();
    this.tempDir = path.join(__dirname, 'temp');
    this.ensureTempDir();
    
    // External API configurations
    this.judge0ApiUrl = 'https://judge0-ce.p.rapidapi.com';
    this.judge0ApiKey = process.env.JUDGE0_API_KEY || '';
    
    // Language mappings for Judge0 API
    this.languageMappings = {
      'python': 71,      // Python 3.8.13
      'javascript': 63,  // JavaScript (Node.js 12.14.0)
      'java': 62,        // Java (OpenJDK 13.0.1)
      'cpp': 54,         // C++ (GCC 9.2.0)
      'c': 50            // C (GCC 9.2.0)
    };
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  // New method: Execute code using external Judge0 API
  async executeCodeExternal(language, code, testCases) {
    try {
      const languageId = this.languageMappings[language];
      if (!languageId) {
        return {
          success: false,
          error: `Language ${language} not supported by external compiler`,
          output: '',
          testResults: []
        };
      }

      // Submit code to Judge0
      const submissionResponse = await fetch(`${this.judge0ApiUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.judge0ApiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
          stdin: testCases.length > 0 ? testCases[0].input : ''
        })
      });

      if (!submissionResponse.ok) {
        throw new Error(`Judge0 API error: ${submissionResponse.status}`);
      }

      const submission = await submissionResponse.json();
      const token = submission.token;

      // Poll for results
      let result;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (attempts < maxAttempts) {
        const resultResponse = await fetch(`${this.judge0ApiUrl}/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Key': this.judge0ApiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });

        if (!resultResponse.ok) {
          throw new Error(`Judge0 API error: ${resultResponse.status}`);
        }

        result = await resultResponse.json();

        if (result.status.id > 2) { // Status > 2 means processing is complete
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      }

      if (attempts >= maxAttempts) {
        return {
          success: false,
          error: 'Execution timeout',
          output: '',
          testResults: []
        };
      }

      // Parse the result
      const output = result.stdout || '';
      const error = result.stderr || '';
      const success = result.status.id === 3; // Status 3 = Accepted

      // Test case validation
      const testResults = [];
      let allPassed = true;

      if (testCases && testCases.length > 0) {
        testResults.push({
          testCase: 1,
          input: testCases[0].input,
          expectedOutput: testCases[0].output,
          actualOutput: output,
          passed: this.checkTestCase(output, testCases[0])
        });

        if (!testResults[0].passed) {
          allPassed = false;
        }
      }

      return {
        success: success && allPassed,
        exitCode: result.status.id,
        output: output,
        error: error || null,
        testResults: testResults,
        allTestsPassed: allPassed
      };

    } catch (error) {
      console.error('External execution error:', error);
      return {
        success: false,
        error: `External execution failed: ${error.message}`,
        output: '',
        testResults: []
      };
    }
  }

  // Alternative: Use CodeX API (another option)
  async executeCodeCodeX(language, code, testCases) {
    try {
      console.log('Making request to CodeX API...');
      
      // CodeX language mappings
      const codexLanguageMappings = {
        'python': 'python',
        'javascript': 'javascript',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c'
      };
      
      const mappedLanguage = codexLanguageMappings[language];
      if (!mappedLanguage) {
        return {
          success: false,
          error: `Language ${language} not supported by CodeX API`,
          output: '',
          testResults: []
        };
      }
      
      const requestBody = {
        code: code,
        language: mappedLanguage,
        input: testCases.length > 0 ? testCases[0].input : ''
      };
      
      console.log('CodeX request body:', requestBody);
      
      const response = await fetch('https://api.codex.jaagrav.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('CodeX API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('CodeX API error response:', errorText);
        throw new Error(`CodeX API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('CodeX API raw result:', result);
      
      if (result.error) {
        console.log('CodeX API returned error:', result.error);
        return {
          success: false,
          error: result.error,
          output: '',
          testResults: []
        };
      }

      const output = result.output || '';
      console.log('CodeX API output:', output);
      
      const testResults = [];
      let allPassed = true;

      if (testCases && testCases.length > 0) {
        testResults.push({
          testCase: 1,
          input: testCases[0].input,
          expectedOutput: testCases[0].output,
          actualOutput: output,
          passed: this.checkTestCase(output, testCases[0])
        });

        if (!testResults[0].passed) {
          allPassed = false;
        }
      }

      const finalResult = {
        success: allPassed,
        exitCode: 0,
        output: output,
        error: null,
        testResults: testResults,
        allTestsPassed: allPassed
      };
      
      console.log('CodeX API final result:', finalResult);
      return finalResult;

    } catch (error) {
      console.error('CodeX execution error:', error);
      return {
        success: false,
        error: `CodeX execution failed: ${error.message}`,
        output: '',
        testResults: []
      };
    }
  }

  // Updated executeCodeSimple to prefer CodeX, then fall back to Judge0, then local
  async executeCodeSimple(language, code, testCases) {
    console.log(`Attempting to execute ${language} code using external APIs...`);
    
    try {
      // Try CodeX first
      console.log('Trying CodeX API...');
      const codexResult = await this.executeCodeCodeX(language, code, testCases);
      console.log('CodeX API result:', codexResult);
      if (codexResult.success) {
        console.log('CodeX API successful, returning result');
        return codexResult;
      }
    } catch (error) {
      console.error('CodeX error:', error);
    }

    try {
      // Try Judge0 if key is present
      if (this.judge0ApiKey) {
        console.log('Trying Judge0 API...');
        const judge0Result = await this.executeCodeExternal(language, code, testCases);
        console.log('Judge0 API result:', judge0Result);
        if (judge0Result.success) {
          console.log('Judge0 API successful, returning result');
          return judge0Result;
        }
      } else {
        console.log('Judge0 API key not configured; skipping Judge0');
      }
    } catch (error) {
      console.error('Judge0 error:', error);
    }

    console.log('All external APIs failed, falling back to local execution...');
    return await this.executeCodeLocal(language, code, testCases);
  }

  // Local execution (fallback)
  async executeCodeLocal(language, code, testCases) {
    const { spawn } = await import('child_process');
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');
    
    return new Promise(async (resolve) => {
      let output = '';
      let errorOutput = '';
      let tempDir = null;
      let tempFile = null;
      
      try {
        let cmd, args;
        
        switch (language) {
          case 'python':
            // Try python3 first, then python
            try {
              await new Promise((resolveCheck) => {
                const check = spawn('python3', ['--version']);
                check.on('close', (code) => {
                  if (code === 0) {
                    cmd = 'python3';
                    args = ['-c', code];
                    resolveCheck();
                  } else {
                    // Try python
                    const check2 = spawn('python', ['--version']);
                    check2.on('close', (code2) => {
                      if (code2 === 0) {
                        cmd = 'python';
                        args = ['-c', code];
                        resolveCheck();
                      } else {
                        resolve({
                          success: false,
                          error: 'Python is not installed. Please install Python to run Python code.',
                          output: '',
                          testResults: []
                        });
                        return;
                      }
                    });
                    check2.on('error', (error) => {
                      resolve({
                        success: false,
                        error: 'Python is not installed. Please install Python to run Python code.',
                        output: '',
                        testResults: []
                      });
                      return;
                    });
                  }
                });
                check.on('error', (error) => {
                  // Try python if python3 fails
                  const check2 = spawn('python', ['--version']);
                  check2.on('close', (code2) => {
                    if (code2 === 0) {
                      cmd = 'python';
                      args = ['-c', code];
                      resolveCheck();
                    } else {
                      resolve({
                        success: false,
                        error: 'Python is not installed. Please install Python to run Python code.',
                        output: '',
                        testResults: []
                      });
                      return;
                    }
                  });
                  check2.on('error', (error) => {
                    resolve({
                      success: false,
                      error: 'Python is not installed. Please install Python to run Python code.',
                      output: '',
                      testResults: []
                    });
                    return;
                  });
                });
              });
            } catch (error) {
              resolve({
                success: false,
                error: 'Python is not installed. Please install Python to run Python code.',
                output: '',
                testResults: []
              });
              return;
            }
            break;
          case 'javascript':
            cmd = 'node';
            args = ['-e', code];
            break;
          case 'java':
            // Create temporary directory and file for Java
            tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'java-exec-'));
            tempFile = path.join(tempDir, 'Solution.java');
            await fs.promises.writeFile(tempFile, code);
            
            // Compile Java code
            const compileResult = await new Promise((compileResolve) => {
              const javac = spawn('javac', [tempFile], { cwd: tempDir });
              let compileError = '';
              
              javac.stderr.on('data', (data) => {
                compileError += data.toString();
              });
              
              javac.on('close', (code) => {
                compileResolve({ success: code === 0, error: compileError });
              });
            });
            
            if (!compileResult.success) {
              resolve({
                success: false,
                error: `Java compilation failed: ${compileResult.error}`,
                output: '',
                testResults: []
              });
              return;
            }
            
            cmd = 'java';
            args = ['-cp', tempDir, 'Solution'];
            break;
          case 'cpp':
            // Check if g++ is available
            try {
              await new Promise((resolveCheck, rejectCheck) => {
                const check = spawn('g++', ['--version']);
                check.on('close', (code) => {
                  if (code === 0) {
                    resolveCheck();
                  } else {
                    resolve({
                      success: false,
                      error: 'C++ compiler (g++) is not installed. Please install a C++ compiler to run C++ code.',
                      output: '',
                      testResults: []
                    });
                    return;
                  }
                });
                check.on('error', (error) => {
                  resolve({
                    success: false,
                    error: 'C++ compiler (g++) is not installed. Please install a C++ compiler to run C++ code.',
                    output: '',
                    testResults: []
                  });
                  return;
                });
              });
            } catch (error) {
              resolve({
                success: false,
                error: 'C++ compiler (g++) is not installed. Please install a C++ compiler to run C++ code.',
                output: '',
                testResults: []
              });
              return;
            }
            
            // Create temporary directory and file for C++
            tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'cpp-exec-'));
            tempFile = path.join(tempDir, 'solution.cpp');
            await fs.promises.writeFile(tempFile, code);
            
            // Compile C++ code
            const cppCompileResult = await new Promise((compileResolve) => {
              const gpp = spawn('g++', [tempFile, '-o', path.join(tempDir, 'solution')], { cwd: tempDir });
              let compileError = '';
              
              gpp.stderr.on('data', (data) => {
                compileError += data.toString();
              });
              
              gpp.on('close', (code) => {
                compileResolve({ success: code === 0, error: compileError });
              });
            });
            
            if (!cppCompileResult.success) {
              resolve({
                success: false,
                error: `C++ compilation failed: ${cppCompileResult.error}`,
                output: '',
                testResults: []
              });
              return;
            }
            
            cmd = path.join(tempDir, 'solution');
            args = [];
            break;
          case 'c':
            // Check if gcc is available
            try {
              await new Promise((resolveCheck, rejectCheck) => {
                const check = spawn('gcc', ['--version']);
                check.on('close', (code) => {
                  if (code === 0) {
                    resolveCheck();
                  } else {
                    resolve({
                      success: false,
                      error: 'C compiler (gcc) is not installed. Please install a C compiler to run C code.',
                      output: '',
                      testResults: []
                    });
                    return;
                  }
                });
                check.on('error', (error) => {
                  resolve({
                    success: false,
                    error: 'C compiler (gcc) is not installed. Please install a C compiler to run C code.',
                    output: '',
                    testResults: []
                  });
                  return;
                });
              });
            } catch (error) {
              resolve({
                success: false,
                error: 'C compiler (gcc) is not installed. Please install a C compiler to run C code.',
                output: '',
                testResults: []
              });
              return;
            }
            
            // Create temporary directory and file for C
            tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'c-exec-'));
            tempFile = path.join(tempDir, 'solution.c');
            await fs.promises.writeFile(tempFile, code);
            
            // Compile C code
            const cCompileResult = await new Promise((compileResolve) => {
              const gcc = spawn('gcc', [tempFile, '-o', path.join(tempDir, 'solution')], { cwd: tempDir });
              let compileError = '';
              
              gcc.stderr.on('data', (data) => {
                compileError += data.toString();
              });
              
              gcc.on('close', (code) => {
                compileResolve({ success: code === 0, error: compileError });
              });
            });
            
            if (!cCompileResult.success) {
              resolve({
                success: false,
                error: `C compilation failed: ${cCompileResult.error}`,
                output: '',
                testResults: []
              });
              return;
            }
            
            cmd = path.join(tempDir, 'solution');
            args = [];
            break;
          default:
            resolve({
              success: false,
              error: `Language '${language}' not supported. Supported languages: python, javascript, java, cpp, c`,
              output: '',
              testResults: []
            });
            return;
        }
      
        const child = spawn(cmd, args);

        // Feed stdin from first test case input if available
        try {
          const inputData = (testCases && testCases.length > 0 && typeof testCases[0].input !== 'undefined')
            ? String(testCases[0].input)
            : '';
          if (child.stdin) {
            child.stdin.write(inputData);
            child.stdin.end();
          }
        } catch (_) {}

        child.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        
        child.on('close', async (code) => {
          // Clean up temporary files
          if (tempDir) {
            try {
              await fs.promises.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }
          }
          
          const result = {
            success: code === 0,
            exitCode: code,
            output: output,
            error: errorOutput || null,
            testResults: []
          };
          
          // Add test case validation
          if (testCases && testCases.length > 0) {
            result.testResults = testCases.map((testCase, index) => ({
              testCase: index + 1,
              input: testCase.input,
              expectedOutput: testCase.output,
              actualOutput: output,
              passed: this.checkTestCase(output, testCase)
            }));
            result.allTestsPassed = result.testResults.every(t => t.passed);
          }
          
          resolve(result);
        });
        
        // Set timeout
        setTimeout(async () => {
          try { child.kill(); } catch (_) {}
          
          // Clean up temporary files on timeout
          if (tempDir) {
            try {
              await fs.promises.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }
          }
          
          resolve({
            success: false,
            error: 'Execution timeout',
            output: output,
            testResults: []
          });
        }, 8000);
      } catch (error) {
        // Clean up temporary files on error
        if (tempDir) {
          try {
            await fs.promises.rm(tempDir, { recursive: true, force: true });
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
        }
        
        resolve({
          success: false,
          error: `Execution error: ${error.message}`,
          output: '',
          testResults: []
        });
      }
    });
  }

  // Keep existing methods for Docker execution
  async executeCode(language, code, testCases, timeLimit = 5000, memoryLimit = 512) {
    const executionId = uuidv4();
    const workDir = path.join(this.tempDir, executionId);
    
    try {
      // Create working directory
      await fs.mkdir(workDir);
      
      // Write code to file
      const fileName = this.getFileName(language);
      const filePath = path.join(workDir, fileName);
      await fs.writeFile(filePath, code);
      
      // Prepare Docker container configuration
      const containerConfig = this.getContainerConfig(language, workDir, fileName, timeLimit, memoryLimit);
      
      // Create and start container
      const container = await this.docker.createContainer(containerConfig);
      await container.start();
      
      // Wait for execution to complete
      const result = await container.wait();
      
      // Get output
      const logs = await container.logs({ stdout: true, stderr: true });
      const output = logs.toString('utf8');
      
      // Clean up
      await container.remove();
      await fs.remove(workDir);
      
      // Parse results
      return this.parseResults(result, output, testCases);
      
    } catch (error) {
      // Clean up on error
      try {
        await fs.remove(workDir);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      
      return {
        success: false,
        error: error.message,
        output: '',
        testResults: []
      };
    }
  }

  getFileName(language) {
    const extensions = {
      'python': 'solution.py',
      'javascript': 'solution.js',
      'java': 'Solution.java',
      'cpp': 'solution.cpp',
      'c': 'solution.c'
    };
    return extensions[language] || 'solution.txt';
  }

  getContainerConfig(language, workDir, fileName, timeLimit, memoryLimit) {
    const baseConfig = {
      Image: this.getDockerImage(language),
      Cmd: this.getExecutionCommand(language, fileName),
      WorkingDir: '/workspace',
      HostConfig: {
        Binds: [`${workDir}:/workspace`],
        Memory: memoryLimit * 1024 * 1024, // Convert MB to bytes
        MemorySwap: memoryLimit * 1024 * 1024,
        NetworkMode: 'none', // Disable network access for security
        ReadonlyRootfs: true, // Read-only filesystem
        SecurityOpt: ['no-new-privileges:true']
      },
      Env: ['PYTHONUNBUFFERED=1'],
      OpenStdin: false,
      StdinOnce: false,
      Tty: false
    };

    // Add timeout using timeout command
    if (language === 'python') {
      baseConfig.Cmd = ['timeout', `${timeLimit / 1000}s`, 'python3', fileName];
    } else if (language === 'javascript') {
      baseConfig.Cmd = ['timeout', `${timeLimit / 1000}s`, 'node', fileName];
    } else if (language === 'java') {
      baseConfig.Cmd = ['timeout', `${timeLimit / 1000}s`, 'sh', '-c', `javac ${fileName} && java Solution`];
    } else if (language === 'cpp') {
      baseConfig.Cmd = ['timeout', `${timeLimit / 1000}s`, 'sh', '-c', `g++ -o solution ${fileName} && ./solution`];
    } else if (language === 'c') {
      baseConfig.Cmd = ['timeout', `${timeLimit / 1000}s`, 'sh', '-c', `gcc -o solution ${fileName} && ./solution`];
    }

    return baseConfig;
  }

  getDockerImage(language) {
    const images = {
      'python': 'python:3.9-slim',
      'javascript': 'node:18-slim',
      'java': 'openjdk:11-jre-slim',
      'cpp': 'gcc:11',
      'c': 'gcc:11'
    };
    return images[language] || 'ubuntu:20.04';
  }

  getExecutionCommand(language, fileName) {
    const commands = {
      'python': ['python3', fileName],
      'javascript': ['node', fileName],
      'java': ['sh', '-c', `javac ${fileName} && java Solution`],
      'cpp': ['sh', '-c', `g++ -o solution ${fileName} && ./solution`],
      'c': ['sh', '-c', `gcc -o solution ${fileName} && ./solution`]
    };
    return commands[language] || ['echo', 'Unsupported language'];
  }

  parseResults(result, output, testCases) {
    const testResults = [];
    let allPassed = true;
    
    if (testCases && testCases.length > 0) {
      // Simple test case parsing - you might want to enhance this
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const passed = this.checkTestCase(output, testCase);
        testResults.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: output,
          passed: passed
        });
        if (!passed) allPassed = false;
      }
    }

    return {
      success: result.StatusCode === 0,
      exitCode: result.StatusCode,
      output: output,
      testResults: testResults,
      allTestsPassed: allPassed
    };
  }

  checkTestCase(output, testCase) {
    // Robust comparison: normalize whitespace and line endings
    const normalize = (text) => {
      if (text == null) return '';
      return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.replace(/\s+$/g, '')) // trim right spaces per line
        .join('\n')
        .trim()
        .replace(/[\t ]+/g, ' '); // collapse multiple spaces/tabs
    };

    const cleanOutput = normalize(output);
    const expectedOutput = normalize(testCase.output);

    if (cleanOutput === expectedOutput) return true;
    // Allow expected to be contained in output (handles extra trailing newlines/logs)
    return cleanOutput.includes(expectedOutput);
  }
}

export default CodeExecutor;
