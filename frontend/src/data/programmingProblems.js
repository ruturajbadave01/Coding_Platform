// Programming Problems Database - 500 Problems Organized by Difficulty
// Level 1: Basic Fundamentals (1-50)
// Level 2: Intermediate Concepts (51-200) 
// Level 3: Data Structures and Algorithms (201-400)
// Level 4: Advanced Algorithms & Data Structures (401-500)

export const programmingProblems = [
  // LEVEL 1: Basic Fundamentals (1-50)
  {
    id: 1,
    title: "Hello World",
    difficulty: "Level 1",
    category: "Basic Output",
    points: 5,
    description: "Write a program that prints 'Hello, World!' to the console.",
    tags: ["Basic", "Output", "Console"],
    testCases: [
      { input: "", output: "Hello, World!", description: "Basic hello world output" }
    ]
  },
  {
    id: 2,
    title: "Basic Addition",
    difficulty: "Level 1",
    category: "Arithmetic",
    points: 5,
    description: "Write a program that adds two numbers and prints the result.",
    tags: ["Basic", "Arithmetic", "Addition"],
    testCases: [
      { input: "5 3", output: "8", description: "Adding two positive numbers" },
      { input: "-2 7", output: "5", description: "Adding negative and positive numbers" }
    ]
  },
  {
    id: 3,
    title: "Simple Calculator",
    difficulty: "Level 1",
    category: "Arithmetic",
    points: 10,
    description: "Create a calculator that can perform addition, subtraction, multiplication, and division on two numbers.",
    tags: ["Basic", "Arithmetic", "Calculator"],
    testCases: [
      { input: "10 + 5", output: "15", description: "Addition" },
      { input: "10 - 3", output: "7", description: "Subtraction" },
      { input: "4 * 6", output: "24", description: "Multiplication" },
      { input: "15 / 3", output: "5", description: "Division" }
    ]
  },
  {
    id: 4,
    title: "Variable Swapping",
    difficulty: "Level 1",
    category: "Variables",
    points: 8,
    description: "Write a program to swap the values of two variables without using a temporary variable.",
    tags: ["Basic", "Variables", "Swapping"],
    testCases: [
      { input: "5 10", output: "10 5", description: "Swapping two numbers" },
      { input: "hello world", output: "world hello", description: "Swapping two strings" }
    ]
  },
  {
    id: 5,
    title: "Data Type Conversion",
    difficulty: "Level 1",
    category: "Data Types",
    points: 8,
    description: "Write a program that converts an integer to a double and a string to an integer.",
    tags: ["Basic", "Data Types", "Conversion"],
    testCases: [
      { input: "42", output: "42.0", description: "Integer to double" },
      { input: "123", output: "123", description: "String to integer" }
    ]
  },
  {
    id: 6,
    title: "Positive, Negative, or Zero",
    difficulty: "Level 1",
    category: "Conditionals",
    points: 8,
    description: "Write a program that checks if a number is positive, negative, or zero and prints the result.",
    tags: ["Basic", "Conditionals", "Number Check"],
    testCases: [
      { input: "5", output: "Positive", description: "Positive number" },
      { input: "-3", output: "Negative", description: "Negative number" },
      { input: "0", output: "Zero", description: "Zero" }
    ]
  },
  {
    id: 7,
    title: "Largest of Three",
    difficulty: "Level 1",
    category: "Conditionals",
    points: 10,
    description: "Write a program that finds and prints the largest among three numbers.",
    tags: ["Basic", "Conditionals", "Comparison"],
    testCases: [
      { input: "5 10 3", output: "10", description: "Middle number is largest" },
      { input: "15 8 12", output: "15", description: "First number is largest" },
      { input: "7 4 20", output: "20", description: "Last number is largest" }
    ]
  },
  {
    id: 8,
    title: "Count from 1 to 10",
    difficulty: "Level 1",
    category: "Loops",
    points: 8,
    description: "Write a program that prints numbers from 1 to 10 using a loop.",
    tags: ["Basic", "Loops", "Counting"],
    testCases: [
      { input: "", output: "1 2 3 4 5 6 7 8 9 10", description: "Count from 1 to 10" }
    ]
  },
  {
    id: 9,
    title: "Multiplication Table",
    difficulty: "Level 1",
    category: "Loops",
    points: 12,
    description: "Write a program that prints the multiplication table for a given number from 1 to 10.",
    tags: ["Basic", "Loops", "Multiplication"],
    testCases: [
      { input: "5", output: "5 10 15 20 25 30 35 40 45 50", description: "Table of 5" },
      { input: "7", output: "7 14 21 28 35 42 49 56 63 70", description: "Table of 7" }
    ]
  },
  {
    id: 10,
    title: "String Length",
    difficulty: "Level 1",
    category: "Strings",
    points: 8,
    description: "Write a program that finds and prints the length of a given string.",
    tags: ["Basic", "Strings", "Length"],
    testCases: [
      { input: "hello", output: "5", description: "Length of 'hello'" },
      { input: "programming", output: "11", description: "Length of 'programming'" }
    ]
  },
  {
    id: 11,
    title: "String Case Conversion",
    difficulty: "Level 1",
    category: "Strings",
    points: 10,
    description: "Write a program that converts a string to uppercase and lowercase.",
    tags: ["Basic", "Strings", "Case Conversion"],
    testCases: [
      { input: "Hello World", output: "HELLO WORLD hello world", description: "Case conversion" },
      { input: "Programming", output: "PROGRAMMING programming", description: "Mixed case conversion" }
    ]
  },
  {
    id: 12,
    title: "Array Sum",
    difficulty: "Level 1",
    category: "Arrays",
    points: 10,
    description: "Write a program that finds the sum of all elements in an array.",
    tags: ["Basic", "Arrays", "Sum"],
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "15", description: "Sum of consecutive numbers" },
      { input: "[10, 20, 30]", output: "60", description: "Sum of multiples of 10" }
    ]
  },
  {
    id: 13,
    title: "Array Average",
    difficulty: "Level 1",
    category: "Arrays",
    points: 10,
    description: "Write a program that calculates the average of all elements in an array.",
    tags: ["Basic", "Arrays", "Average"],
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "3.0", description: "Average of consecutive numbers" },
      { input: "[10, 20, 30, 40]", output: "25.0", description: "Average of multiples of 10" }
    ]
  },
  {
    id: 14,
    title: "Find Maximum in Array",
    difficulty: "Level 1",
    category: "Arrays",
    points: 10,
    description: "Write a program that finds the maximum element in an array.",
    tags: ["Basic", "Arrays", "Maximum"],
    testCases: [
      { input: "[3, 7, 2, 9, 1]", output: "9", description: "Maximum in mixed array" },
      { input: "[1, 1, 1, 1]", output: "1", description: "All elements same" }
    ]
  },
  {
    id: 15,
    title: "Find Minimum in Array",
    difficulty: "Level 1",
    category: "Arrays",
    points: 10,
    description: "Write a program that finds the minimum element in an array.",
    tags: ["Basic", "Arrays", "Minimum"],
    testCases: [
      { input: "[5, 2, 8, 1, 9]", output: "1", description: "Minimum in mixed array" },
      { input: "[10, 10, 10]", output: "10", description: "All elements same" }
    ]
  },
  {
    id: 16,
    title: "Even or Odd",
    difficulty: "Level 1",
    category: "Conditionals",
    points: 8,
    description: "Write a program that checks if a number is even or odd.",
    tags: ["Basic", "Conditionals", "Even Odd"],
    testCases: [
      { input: "4", output: "Even", description: "Even number" },
      { input: "7", output: "Odd", description: "Odd number" },
      { input: "0", output: "Even", description: "Zero is even" }
    ]
  },
  {
    id: 17,
    title: "Factorial",
    difficulty: "Level 1",
    category: "Loops",
    points: 12,
    description: "Write a program that calculates the factorial of a given number.",
    tags: ["Basic", "Loops", "Factorial"],
    testCases: [
      { input: "5", output: "120", description: "Factorial of 5" },
      { input: "0", output: "1", description: "Factorial of 0" },
      { input: "3", output: "6", description: "Factorial of 3" }
    ]
  },
  {
    id: 18,
    title: "Prime Number Check",
    difficulty: "Level 1",
    category: "Conditionals",
    points: 12,
    description: "Write a program that checks if a given number is prime.",
    tags: ["Basic", "Conditionals", "Prime"],
    testCases: [
      { input: "7", output: "Prime", description: "Prime number" },
      { input: "4", output: "Not Prime", description: "Not prime" },
      { input: "1", output: "Not Prime", description: "1 is not prime" }
    ]
  },
  {
    id: 19,
    title: "Reverse String",
    difficulty: "Level 1",
    category: "Strings",
    points: 10,
    description: "Write a program that reverses a given string.",
    tags: ["Basic", "Strings", "Reverse"],
    testCases: [
      { input: "hello", output: "olleh", description: "Reverse simple string" },
      { input: "world", output: "dlrow", description: "Reverse another string" }
    ]
  },
  {
    id: 20,
    title: "Palindrome Check",
    difficulty: "Level 1",
    category: "Strings",
    points: 12,
    description: "Write a program that checks if a string is a palindrome.",
    tags: ["Basic", "Strings", "Palindrome"],
    testCases: [
      { input: "racecar", output: "Palindrome", description: "Palindrome string" },
      { input: "hello", output: "Not Palindrome", description: "Not palindrome" },
      { input: "anna", output: "Palindrome", description: "Another palindrome" }
    ]
  },
  {
    id: 21,
    title: "Count Vowels",
    difficulty: "Level 1",
    category: "Strings",
    points: 10,
    description: "Write a program that counts the number of vowels in a string.",
    tags: ["Basic", "Strings", "Vowels"],
    testCases: [
      { input: "hello", output: "2", description: "Count vowels in hello" },
      { input: "programming", output: "3", description: "Count vowels in programming" }
    ]
  },
  {
    id: 22,
    title: "Count Words",
    difficulty: "Level 1",
    category: "Strings",
    points: 10,
    description: "Write a program that counts the number of words in a sentence.",
    tags: ["Basic", "Strings", "Word Count"],
    testCases: [
      { input: "Hello world", output: "2", description: "Two words" },
      { input: "This is a test sentence", output: "5", description: "Five words" }
    ]
  },
  {
    id: 23,
    title: "Remove Duplicates",
    difficulty: "Level 1",
    category: "Arrays",
    points: 12,
    description: "Write a program that removes duplicate elements from an array.",
    tags: ["Basic", "Arrays", "Duplicates"],
    testCases: [
      { input: "[1, 2, 2, 3, 4, 4, 5]", output: "[1, 2, 3, 4, 5]", description: "Remove duplicates" },
      { input: "[1, 1, 1, 1]", output: "[1]", description: "All duplicates" }
    ]
  },
  {
    id: 24,
    title: "Linear Search",
    difficulty: "Level 1",
    category: "Arrays",
    points: 10,
    description: "Write a program that performs linear search to find an element in an array.",
    tags: ["Basic", "Arrays", "Search"],
    testCases: [
      { input: "[1, 2, 3, 4, 5] 3", output: "Found at index 2", description: "Element found" },
      { input: "[1, 2, 3, 4, 5] 6", output: "Not found", description: "Element not found" }
    ]
  },
  {
    id: 25,
    title: "Bubble Sort",
    difficulty: "Level 1",
    category: "Sorting",
    points: 15,
    description: "Write a program that implements bubble sort to sort an array.",
    tags: ["Basic", "Sorting", "Bubble Sort"],
    testCases: [
      { input: "[5, 2, 8, 1, 9]", output: "[1, 2, 5, 8, 9]", description: "Sort mixed array" },
      { input: "[3, 1, 4, 1, 5]", output: "[1, 1, 3, 4, 5]", description: "Sort with duplicates" }
    ]
  },
  {
    id: 26,
    title: "Selection Sort",
    difficulty: "Level 1",
    category: "Sorting",
    points: 15,
    description: "Write a program that implements selection sort to sort an array.",
    tags: ["Basic", "Sorting", "Selection Sort"],
    testCases: [
      { input: "[64, 25, 12, 22, 11]", output: "[11, 12, 22, 25, 64]", description: "Sort mixed array" },
      { input: "[5, 2, 4, 6, 1]", output: "[1, 2, 4, 5, 6]", description: "Sort small array" }
    ]
  },
  {
    id: 27,
    title: "Insertion Sort",
    difficulty: "Level 1",
    category: "Sorting",
    points: 15,
    description: "Write a program that implements insertion sort to sort an array.",
    tags: ["Basic", "Sorting", "Insertion Sort"],
    testCases: [
      { input: "[12, 11, 13, 5, 6]", output: "[5, 6, 11, 12, 13]", description: "Sort mixed array" },
      { input: "[3, 1, 4, 1, 5]", output: "[1, 1, 3, 4, 5]", description: "Sort with duplicates" }
    ]
  },
  {
    id: 28,
    title: "Sum of Digits",
    difficulty: "Level 1",
    category: "Numbers",
    points: 10,
    description: "Write a program that calculates the sum of digits of a given number.",
    tags: ["Basic", "Numbers", "Digit Sum"],
    testCases: [
      { input: "123", output: "6", description: "Sum of digits of 123" },
      { input: "456", output: "15", description: "Sum of digits of 456" }
    ]
  },
  {
    id: 29,
    title: "Armstrong Number",
    difficulty: "Level 1",
    category: "Numbers",
    points: 12,
    description: "Write a program that checks if a number is an Armstrong number.",
    tags: ["Basic", "Numbers", "Armstrong"],
    testCases: [
      { input: "153", output: "Armstrong", description: "153 is Armstrong" },
      { input: "123", output: "Not Armstrong", description: "123 is not Armstrong" }
    ]
  },
  {
    id: 30,
    title: "Fibonacci Series",
    difficulty: "Level 1",
    category: "Loops",
    points: 12,
    description: "Write a program that prints the Fibonacci series up to n terms.",
    tags: ["Basic", "Loops", "Fibonacci"],
    testCases: [
      { input: "8", output: "0 1 1 2 3 5 8 13", description: "First 8 Fibonacci numbers" },
      { input: "5", output: "0 1 1 2 3", description: "First 5 Fibonacci numbers" }
    ]
  },
  {
    id: 31,
    title: "GCD of Two Numbers",
    difficulty: "Level 1",
    category: "Numbers",
    points: 12,
    description: "Write a program that finds the Greatest Common Divisor (GCD) of two numbers.",
    tags: ["Basic", "Numbers", "GCD"],
    testCases: [
      { input: "48 18", output: "6", description: "GCD of 48 and 18" },
      { input: "12 8", output: "4", description: "GCD of 12 and 8" }
    ]
  },
  {
    id: 32,
    title: "LCM of Two Numbers",
    difficulty: "Level 1",
    category: "Numbers",
    points: 12,
    description: "Write a program that finds the Least Common Multiple (LCM) of two numbers.",
    tags: ["Basic", "Numbers", "LCM"],
    testCases: [
      { input: "12 18", output: "36", description: "LCM of 12 and 18" },
      { input: "8 12", output: "24", description: "LCM of 8 and 12" }
    ]
  },
  {
    id: 33,
    title: "Power of Number",
    difficulty: "Level 1",
    category: "Numbers",
    points: 10,
    description: "Write a program that calculates the power of a number.",
    tags: ["Basic", "Numbers", "Power"],
    testCases: [
      { input: "2 3", output: "8", description: "2 to the power 3" },
      { input: "5 2", output: "25", description: "5 to the power 2" }
    ]
  },
  {
    id: 34,
    title: "Square Root",
    difficulty: "Level 1",
    category: "Numbers",
    points: 10,
    description: "Write a program that calculates the square root of a number.",
    tags: ["Basic", "Numbers", "Square Root"],
    testCases: [
      { input: "16", output: "4.0", description: "Square root of 16" },
      { input: "25", output: "5.0", description: "Square root of 25" }
    ]
  },
  {
    id: 35,
    title: "Perfect Number",
    difficulty: "Level 1",
    category: "Numbers",
    points: 12,
    description: "Write a program that checks if a number is a perfect number.",
    tags: ["Basic", "Numbers", "Perfect Number"],
    testCases: [
      { input: "6", output: "Perfect", description: "6 is perfect (1+2+3=6)" },
      { input: "8", output: "Not Perfect", description: "8 is not perfect" }
    ]
  },
  {
    id: 36,
    title: "Pattern Printing - Triangle",
    difficulty: "Level 1",
    category: "Patterns",
    points: 10,
    description: "Write a program that prints a triangle pattern using asterisks.",
    tags: ["Basic", "Patterns", "Triangle"],
    testCases: [
      { input: "3", output: "*\n**\n***", description: "Triangle with 3 rows" },
      { input: "4", output: "*\n**\n***\n****", description: "Triangle with 4 rows" }
    ]
  },
  {
    id: 37,
    title: "Pattern Printing - Pyramid",
    difficulty: "Level 1",
    category: "Patterns",
    points: 12,
    description: "Write a program that prints a pyramid pattern using asterisks.",
    tags: ["Basic", "Patterns", "Pyramid"],
    testCases: [
      { input: "3", output: "  *\n ***\n*****", description: "Pyramid with 3 rows" },
      { input: "4", output: "   *\n  ***\n *****\n*******", description: "Pyramid with 4 rows" }
    ]
  },
  {
    id: 38,
    title: "Number Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 10,
    description: "Write a program that prints a number pattern.",
    tags: ["Basic", "Patterns", "Numbers"],
    testCases: [
      { input: "4", output: "1\n12\n123\n1234", description: "Number pattern" },
      { input: "3", output: "1\n12\n123", description: "Smaller number pattern" }
    ]
  },
  {
    id: 39,
    title: "Character Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 10,
    description: "Write a program that prints a character pattern.",
    tags: ["Basic", "Patterns", "Characters"],
    testCases: [
      { input: "3", output: "A\nAB\nABC", description: "Character pattern" },
      { input: "4", output: "A\nAB\nABC\nABCD", description: "Larger character pattern" }
    ]
  },
  {
    id: 40,
    title: "Diamond Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 15,
    description: "Write a program that prints a diamond pattern using asterisks.",
    tags: ["Basic", "Patterns", "Diamond"],
    testCases: [
      { input: "3", output: " *\n***\n *", description: "Diamond with 3 rows" },
      { input: "5", output: "  *\n ***\n*****\n ***\n  *", description: "Diamond with 5 rows" }
    ]
  },
  {
    id: 41,
    title: "Floyd's Triangle",
    difficulty: "Level 1",
    category: "Patterns",
    points: 12,
    description: "Write a program that prints Floyd's triangle.",
    tags: ["Basic", "Patterns", "Floyd"],
    testCases: [
      { input: "4", output: "1\n2 3\n4 5 6\n7 8 9 10", description: "Floyd's triangle with 4 rows" },
      { input: "3", output: "1\n2 3\n4 5 6", description: "Floyd's triangle with 3 rows" }
    ]
  },
  {
    id: 42,
    title: "Pascal's Triangle",
    difficulty: "Level 1",
    category: "Patterns",
    points: 15,
    description: "Write a program that prints Pascal's triangle.",
    tags: ["Basic", "Patterns", "Pascal"],
    testCases: [
      { input: "4", output: "1\n1 1\n1 2 1\n1 3 3 1", description: "Pascal's triangle with 4 rows" },
      { input: "5", output: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1", description: "Pascal's triangle with 5 rows" }
    ]
  },
  {
    id: 43,
    title: "Hollow Square",
    difficulty: "Level 1",
    category: "Patterns",
    points: 12,
    description: "Write a program that prints a hollow square pattern.",
    tags: ["Basic", "Patterns", "Hollow Square"],
    testCases: [
      { input: "4", output: "****\n*  *\n*  *\n****", description: "Hollow square 4x4" },
      { input: "3", output: "***\n* *\n***", description: "Hollow square 3x3" }
    ]
  },
  {
    id: 44,
    title: "Right Triangle",
    difficulty: "Level 1",
    category: "Patterns",
    points: 10,
    description: "Write a program that prints a right triangle pattern.",
    tags: ["Basic", "Patterns", "Right Triangle"],
    testCases: [
      { input: "4", output: "*\n**\n***\n****", description: "Right triangle with 4 rows" },
      { input: "5", output: "*\n**\n***\n****\n*****", description: "Right triangle with 5 rows" }
    ]
  },
  {
    id: 45,
    title: "Inverted Triangle",
    difficulty: "Level 1",
    category: "Patterns",
    points: 10,
    description: "Write a program that prints an inverted triangle pattern.",
    tags: ["Basic", "Patterns", "Inverted Triangle"],
    testCases: [
      { input: "4", output: "****\n***\n**\n*", description: "Inverted triangle with 4 rows" },
      { input: "3", output: "***\n**\n*", description: "Inverted triangle with 3 rows" }
    ]
  },
  {
    id: 46,
    title: "Number Pyramid",
    difficulty: "Level 1",
    category: "Patterns",
    points: 12,
    description: "Write a program that prints a number pyramid pattern.",
    tags: ["Basic", "Patterns", "Number Pyramid"],
    testCases: [
      { input: "4", output: "   1\n  121\n 12321\n1234321", description: "Number pyramid with 4 rows" },
      { input: "3", output: "  1\n 121\n12321", description: "Number pyramid with 3 rows" }
    ]
  },
  {
    id: 47,
    title: "Alphabet Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 12,
    description: "Write a program that prints an alphabet pattern.",
    tags: ["Basic", "Patterns", "Alphabet"],
    testCases: [
      { input: "4", output: "A\nAB\nABC\nABCD", description: "Alphabet pattern" },
      { input: "3", output: "A\nAB\nABC", description: "Smaller alphabet pattern" }
    ]
  },
  {
    id: 48,
    title: "Reverse Alphabet Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 12,
    description: "Write a program that prints a reverse alphabet pattern.",
    tags: ["Basic", "Patterns", "Reverse Alphabet"],
    testCases: [
      { input: "4", output: "ABCD\nABC\nAB\nA", description: "Reverse alphabet pattern" },
      { input: "3", output: "ABC\nAB\nA", description: "Smaller reverse alphabet pattern" }
    ]
  },
  {
    id: 49,
    title: "Butterfly Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 15,
    description: "Write a program that prints a butterfly pattern.",
    tags: ["Basic", "Patterns", "Butterfly"],
    testCases: [
      { input: "4", output: "*      *\n**    **\n***  ***\n********\n***  ***\n**    **\n*      *", description: "Butterfly pattern" },
      { input: "3", output: "*    *\n**  **\n******\n**  **\n*    *", description: "Smaller butterfly pattern" }
    ]
  },
  {
    id: 50,
    title: "Spiral Pattern",
    difficulty: "Level 1",
    category: "Patterns",
    points: 20,
    description: "Write a program that prints a spiral pattern of numbers.",
    tags: ["Basic", "Patterns", "Spiral"],
    testCases: [
      { input: "3", output: "1 2 3\n8 9 4\n7 6 5", description: "3x3 spiral" },
      { input: "4", output: "1  2  3  4\n12 13 14 5\n11 16 15 6\n10 9  8  7", description: "4x4 spiral" }
    ]
  }
]; 