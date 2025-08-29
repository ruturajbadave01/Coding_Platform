# Programming Problems Database - 500 Problems

This database contains 500 carefully curated programming problems organized by difficulty levels, designed to help students progress from basic fundamentals to advanced algorithms and data structures.

## 📚 Problem Organization

### Level 1: Basic Fundamentals (1-50)
**Focus**: Absolute basics of programming language
- **Hello World**: Print simple messages
- **Basic Arithmetic**: Add, subtract, multiply, divide
- **User Input**: Read and process user input
- **Variable Swapping**: Swap values with/without temp variables
- **Data Type Conversion**: Convert between data types
- **Conditionals**: Check numbers, find largest among three
- **Loops**: Count from 1 to 10, multiplication tables
- **String Manipulation**: Length, case conversion, reverse
- **Basic Arrays**: Initialize, print, sum, average, find max/min
- **Pattern Printing**: Triangles, pyramids, diamonds, spirals
- **Number Theory**: Factorial, prime numbers, perfect numbers
- **Sorting**: Bubble, Selection, Insertion sort

### Level 2: Intermediate Concepts (51-200)
**Focus**: Complex control flow, functions, and data structures
- **Recursion**: Factorial, Fibonacci, power functions
- **Advanced Functions**: Prime checks, string operations, array operations
- **String Processing**: Reverse, palindrome, substring operations
- **Array Operations**: Search, merge, rotate, remove duplicates
- **2D Arrays**: Matrix operations, transpose, multiplication
- **Sorting Algorithms**: Merge sort, Quick sort implementations
- **Number Theory**: GCD, LCM, prime factorization, perfect numbers
- **File I/O**: Read, write, copy, count lines/words
- **Object-Oriented Programming**: Car, Student, BankAccount classes

### Level 3: Data Structures and Algorithms (201-400)
**Focus**: Classic DSA problems and interview favorites
- **Arrays & Hashing**: Two Sum, Remove Duplicates
- **Stack**: Valid Parentheses
- **Linked Lists**: Add Two Numbers, Merge k Sorted Lists
- **Strings**: Longest Substring, Palindrome, Regular Expression Matching
- **Dynamic Programming**: Maximum Subarray, Climbing Stairs
- **Trees**: Binary Tree Level Order Traversal
- **Graphs**: Word Ladder
- **Advanced Arrays**: Container With Most Water, 3Sum, Trapping Rain Water
- **Matrix Operations**: Rotate Image
- **Complex Algorithms**: Median of Two Sorted Arrays

### Level 4: Advanced Algorithms & Data Structures (401-500)
**Focus**: Advanced algorithms and optimization techniques
- **Dynamic Programming**: Memoization, Knapsack, Coin Change, LCS, Edit Distance
- **Greedy Algorithms**: Activity Selection, Fractional Knapsack
- **Graph Algorithms**: Dijkstra's, Prim's, Kruskal's, Topological Sort
- **Backtracking**: N-Queens, Sudoku Solver
- **Advanced Data Structures**: Trie, Segment Tree, Fenwick Tree
- **String Algorithms**: KMP Algorithm
- **Bit Manipulation**: Single Number, Power of Two, Count Set Bits

## 🏗️ File Structure

```
frontend/src/data/
├── programmingProblems.js          # Level 1 problems (1-50)
├── programmingProblemsLevel2.js    # Level 2 problems (51-200)
├── allProgrammingProblems.js       # Complete database with all levels
└── README.md                       # This documentation
```

## 📊 Problem Statistics

- **Total Problems**: 500
- **Level 1**: 50 problems (Basic Fundamentals)
- **Level 2**: 150 problems (Intermediate Concepts)
- **Level 3**: 200 problems (Data Structures & Algorithms)
- **Level 4**: 100 problems (Advanced Algorithms)

### Category Distribution
- **Basic Concepts**: 50 problems
- **Functions & Recursion**: 52 problems
- **Arrays & Strings**: 25 problems
- **Sorting & Searching**: 20 problems
- **Dynamic Programming**: 15 problems
- **Graph Algorithms**: 12 problems
- **Advanced Data Structures**: 8 problems
- **Bit Manipulation**: 5 problems
- **And many more categories...**

## 🎯 Problem Structure

Each problem includes:
- **ID**: Unique identifier (1-500)
- **Title**: Descriptive problem name
- **Difficulty**: Level 1-4 classification
- **Category**: Topic area (Arrays, Strings, DP, etc.)
- **Points**: Difficulty-based scoring
- **Description**: Clear problem statement
- **Tags**: Relevant concepts and techniques
- **Test Cases**: Multiple input/output examples with descriptions

## 🚀 Usage Examples

### Import All Problems
```javascript
import { allProgrammingProblems } from './data/allProgrammingProblems.js';
```

### Import Specific Levels
```javascript
import { level1Problems } from './data/allProgrammingProblems.js';
import { level2Problems } from './data/allProgrammingProblems.js';
import { level3Problems } from './data/allProgrammingProblems.js';
import { level4Problems } from './data/allProgrammingProblems.js';
```

### Filter Problems by Category
```javascript
const arrayProblems = allProgrammingProblems.filter(p => p.category === 'Arrays');
const dpProblems = allProgrammingProblems.filter(p => p.category === 'Dynamic Programming');
```

### Get Problem Statistics
```javascript
import { problemStats } from './data/allProgrammingProblems.js';
console.log(`Total problems: ${problemStats.totalProblems}`);
console.log(`Level 1 problems: ${problemStats.level1Count}`);
```

## 🎓 Learning Path

### For Beginners (Level 1)
Start with basic output, arithmetic, and simple loops. Progress through patterns and basic array operations.

### For Intermediate Students (Level 2)
Focus on functions, recursion, and more complex data structures. Practice with file I/O and OOP concepts.

### For Advanced Students (Level 3)
Tackle classic interview problems, dynamic programming, and complex algorithms. Master data structure implementations.

### For Expert Students (Level 4)
Challenge yourself with advanced algorithms, optimization techniques, and complex problem-solving strategies.

## 🔧 Customization

You can easily extend this database by:
1. Adding new problems to the appropriate level files
2. Creating new categories for specialized topics
3. Modifying point values based on your assessment criteria
4. Adding more test cases for comprehensive testing

## 📝 Contributing

To add new problems:
1. Follow the existing problem structure
2. Include comprehensive test cases
3. Add appropriate tags and categories
4. Update the statistics in `allProgrammingProblems.js`

## 🎯 Assessment Guidelines

- **Level 1**: 5-20 points per problem
- **Level 2**: 10-25 points per problem
- **Level 3**: 15-75 points per problem
- **Level 4**: 30-70 points per problem

Points are assigned based on:
- Problem complexity
- Required algorithmic thinking
- Implementation difficulty
- Time complexity considerations

## 📚 Additional Resources

This problem set complements:
- Data Structures and Algorithms courses
- Programming interview preparation
- Competitive programming practice
- Software engineering curriculum

## 🤝 Support

For questions or suggestions about the problem database, please refer to the project documentation or contact the development team.

---

**Happy Coding! 🚀** 