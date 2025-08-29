import CodeExecutor from './codeExecutor.js';

const codeExecutor = new CodeExecutor();

const testCases = [
  {
    input: '',
    output: 'Hello, World!'
  }
];

const testLanguages = [
  {
    name: 'javascript',
    code: 'console.log("Hello, World!");'
  },
  {
    name: 'python',
    code: 'print("Hello, World!")'
  },
  {
    name: 'java',
    code: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  {
    name: 'cpp',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
  },
  {
    name: 'c',
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
  }
];

async function testAllLanguages() {
  console.log('Testing all languages...\n');
  
  for (const lang of testLanguages) {
    console.log(`Testing ${lang.name}...`);
    try {
      const result = await codeExecutor.executeCodeSimple(lang.name, lang.code, testCases);
      console.log(`✅ ${lang.name}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      } else {
        console.log(`   Output: ${result.output.trim()}`);
      }
    } catch (error) {
      console.log(`❌ ${lang.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }
}

testAllLanguages();
