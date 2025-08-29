// Level 2: Intermediate Concepts (51-200)
// This level introduces more complex control flow, functions, and data structures.

export const level2Problems = [
  {
    id: 51,
    title: "Recursive Factorial",
    difficulty: "Level 2",
    category: "Recursion",
    points: 15,
    description: "Write a recursive function to calculate the factorial of a number.",
    tags: ["Intermediate", "Recursion", "Functions"],
    testCases: [
      { input: "5", output: "120", description: "Factorial of 5" },
      { input: "0", output: "1", description: "Factorial of 0" },
      { input: "3", output: "6", description: "Factorial of 3" }
    ]
  },
  {
    id: 52,
    title: "Recursive Fibonacci",
    difficulty: "Level 2",
    category: "Recursion",
    points: 15,
    description: "Write a recursive function to find the nth Fibonacci number.",
    tags: ["Intermediate", "Recursion", "Fibonacci"],
    testCases: [
      { input: "8", output: "21", description: "8th Fibonacci number" },
      { input: "5", output: "5", description: "5th Fibonacci number" },
      { input: "10", output: "55", description: "10th Fibonacci number" }
    ]
  },
  {
    id: 53,
    title: "Prime Number Function",
    difficulty: "Level 2",
    category: "Functions",
    points: 12,
    description: "Write a function that checks if a number is prime and returns true/false.",
    tags: ["Intermediate", "Functions", "Prime"],
    testCases: [
      { input: "7", output: "true", description: "7 is prime" },
      { input: "4", output: "false", description: "4 is not prime" },
      { input: "1", output: "false", description: "1 is not prime" }
    ]
  },
  {
    id: 54,
    title: "String Reverse Function",
    difficulty: "Level 2",
    category: "Strings",
    points: 10,
    description: "Write a function that reverses a string and returns the reversed string.",
    tags: ["Intermediate", "Functions", "Strings"],
    testCases: [
      { input: "hello", output: "olleh", description: "Reverse hello" },
      { input: "world", output: "dlrow", description: "Reverse world" },
      { input: "racecar", output: "racecar", description: "Palindrome remains same" }
    ]
  },
  {
    id: 55,
    title: "Palindrome Function",
    difficulty: "Level 2",
    category: "Strings",
    points: 12,
    description: "Write a function that checks if a string is a palindrome and returns true/false.",
    tags: ["Intermediate", "Functions", "Palindrome"],
    testCases: [
      { input: "racecar", output: "true", description: "Palindrome" },
      { input: "hello", output: "false", description: "Not palindrome" },
      { input: "anna", output: "true", description: "Another palindrome" }
    ]
  },
  {
    id: 56,
    title: "Count Character Occurrences",
    difficulty: "Level 2",
    category: "Strings",
    points: 12,
    description: "Write a function that counts the occurrences of a specific character in a string.",
    tags: ["Intermediate", "Functions", "Strings"],
    testCases: [
      { input: "hello l", output: "2", description: "Count 'l' in hello" },
      { input: "programming m", output: "2", description: "Count 'm' in programming" },
      { input: "test t", output: "2", description: "Count 't' in test" }
    ]
  },
  {
    id: 57,
    title: "Find Substring",
    difficulty: "Level 2",
    category: "Strings",
    points: 15,
    description: "Write a function that finds the first occurrence of a substring in a string and returns its index.",
    tags: ["Intermediate", "Functions", "Strings"],
    testCases: [
      { input: "hello world world", output: "6", description: "First occurrence of 'world'" },
      { input: "programming", output: "-1", description: "Substring not found" },
      { input: "test string test", output: "0", description: "Substring at beginning" }
    ]
  },
  {
    id: 58,
    title: "Replace Substring",
    difficulty: "Level 2",
    category: "Strings",
    points: 15,
    description: "Write a function that replaces all occurrences of a substring with another substring.",
    tags: ["Intermediate", "Functions", "Strings"],
    testCases: [
      { input: "hello world world bye world", output: "hello bye bye bye bye", description: "Replace 'world' with 'bye'" },
      { input: "test string", output: "test string", description: "No replacement needed" }
    ]
  },
  {
    id: 59,
    title: "String to Title Case",
    difficulty: "Level 2",
    category: "Strings",
    points: 12,
    description: "Write a function that converts a string to title case (first letter of each word capitalized).",
    tags: ["Intermediate", "Functions", "Strings"],
    testCases: [
      { input: "hello world", output: "Hello World", description: "Title case conversion" },
      { input: "programming is fun", output: "Programming Is Fun", description: "Multiple words" }
    ]
  },
  {
    id: 60,
    title: "Remove Extra Spaces",
    difficulty: "Level 2",
    category: "Strings",
    points: 12,
    description: "Write a function that removes extra spaces from a string (multiple spaces become single space).",
    tags: ["Intermediate", "Functions", "Strings"],
    testCases: [
      { input: "hello   world", output: "hello world", description: "Remove extra spaces" },
      { input: "  test  string  ", output: "test string", description: "Remove leading/trailing spaces too" }
    ]
  },
  {
    id: 61,
    title: "Array Maximum Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 10,
    description: "Write a function that finds and returns the maximum element in an array.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[3, 7, 2, 9, 1]", output: "9", description: "Maximum in mixed array" },
      { input: "[1, 1, 1, 1]", output: "1", description: "All elements same" }
    ]
  },
  {
    id: 62,
    title: "Array Minimum Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 10,
    description: "Write a function that finds and returns the minimum element in an array.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[5, 2, 8, 1, 9]", output: "1", description: "Minimum in mixed array" },
      { input: "[10, 10, 10]", output: "10", description: "All elements same" }
    ]
  },
  {
    id: 63,
    title: "Array Sum Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 10,
    description: "Write a function that calculates and returns the sum of all elements in an array.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "15", description: "Sum of consecutive numbers" },
      { input: "[10, 20, 30]", output: "60", description: "Sum of multiples of 10" }
    ]
  },
  {
    id: 64,
    title: "Array Average Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 10,
    description: "Write a function that calculates and returns the average of all elements in an array.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "3.0", description: "Average of consecutive numbers" },
      { input: "[10, 20, 30, 40]", output: "25.0", description: "Average of multiples of 10" }
    ]
  },
  {
    id: 65,
    title: "Linear Search Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 12,
    description: "Write a function that performs linear search and returns the index of the element if found, -1 otherwise.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 2, 3, 4, 5] 3", output: "2", description: "Element found at index 2" },
      { input: "[1, 2, 3, 4, 5] 6", output: "-1", description: "Element not found" }
    ]
  },
  {
    id: 66,
    title: "Binary Search Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 15,
    description: "Write a function that performs binary search on a sorted array and returns the index of the element if found, -1 otherwise.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 7", output: "6", description: "Element found at index 6" },
      { input: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 11", output: "-1", description: "Element not found" }
    ]
  },
  {
    id: 67,
    title: "Remove Duplicates Function",
    difficulty: "Level 2",
    category: "Arrays",
    points: 15,
    description: "Write a function that removes duplicate elements from an array and returns the new array.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 2, 2, 3, 4, 4, 5]", output: "[1, 2, 3, 4, 5]", description: "Remove duplicates" },
      { input: "[1, 1, 1, 1]", output: "[1]", description: "All duplicates" }
    ]
  },
  {
    id: 68,
    title: "Merge Sorted Arrays",
    difficulty: "Level 2",
    category: "Arrays",
    points: 18,
    description: "Write a function that merges two sorted arrays into a single sorted array.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 3, 5] [2, 4, 6]", output: "[1, 2, 3, 4, 5, 6]", description: "Merge two sorted arrays" },
      { input: "[1, 2, 3] [4, 5, 6]", output: "[1, 2, 3, 4, 5, 6]", description: "Sequential arrays" }
    ]
  },
  {
    id: 69,
    title: "Array Rotation",
    difficulty: "Level 2",
    category: "Arrays",
    points: 15,
    description: "Write a function that rotates an array by a given number of positions to the right.",
    tags: ["Intermediate", "Functions", "Arrays"],
    testCases: [
      { input: "[1, 2, 3, 4, 5] 2", output: "[4, 5, 1, 2, 3]", description: "Rotate by 2 positions" },
      { input: "[1, 2, 3, 4, 5] 1", output: "[5, 1, 2, 3, 4]", description: "Rotate by 1 position" }
    ]
  },
  {
    id: 70,
    title: "Matrix Transpose",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 18,
    description: "Write a function that finds the transpose of a given matrix.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2, 3], [4, 5, 6]]", output: "[[1, 4], [2, 5], [3, 6]]", description: "Transpose 2x3 matrix" },
      { input: "[[1, 2], [3, 4]]", output: "[[1, 3], [2, 4]]", description: "Transpose 2x2 matrix" }
    ]
  },
  {
    id: 71,
    title: "Matrix Addition",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 15,
    description: "Write a function that adds two matrices of the same size.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2], [3, 4]] [[5, 6], [7, 8]]", output: "[[6, 8], [10, 12]]", description: "Add 2x2 matrices" },
      { input: "[[1, 2, 3], [4, 5, 6]] [[7, 8, 9], [10, 11, 12]]", output: "[[8, 10, 12], [14, 16, 18]]", description: "Add 2x3 matrices" }
    ]
  },
  {
    id: 72,
    title: "Matrix Multiplication",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 20,
    description: "Write a function that multiplies two matrices.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2], [3, 4]] [[5, 6], [7, 8]]", output: "[[19, 22], [43, 50]]", description: "Multiply 2x2 matrices" },
      { input: "[[1, 2], [3, 4], [5, 6]] [[7, 8, 9], [10, 11, 12]]", output: "[[27, 30, 33], [61, 68, 75], [95, 106, 117]]", description: "Multiply 3x2 and 2x3 matrices" }
    ]
  },
  {
    id: 73,
    title: "Matrix Sum of Elements",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 12,
    description: "Write a function that calculates the sum of all elements in a matrix.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]", output: "45", description: "Sum of 3x3 matrix" },
      { input: "[[1, 2], [3, 4]]", output: "10", description: "Sum of 2x2 matrix" }
    ]
  },
  {
    id: 74,
    title: "Matrix Diagonal Sum",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 15,
    description: "Write a function that calculates the sum of elements on the main diagonal of a square matrix.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]", output: "15", description: "Sum of main diagonal (1+5+9)" },
      { input: "[[1, 2], [3, 4]]", output: "5", description: "Sum of main diagonal (1+4)" }
    ]
  },
  {
    id: 75,
    title: "Matrix Row Sum",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 12,
    description: "Write a function that calculates the sum of elements in each row of a matrix and returns an array of row sums.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]", output: "[6, 15, 24]", description: "Sum of each row" },
      { input: "[[1, 2], [3, 4]]", output: "[3, 7]", description: "Sum of each row in 2x2 matrix" }
    ]
  },
  {
    id: 76,
    title: "Matrix Column Sum",
    difficulty: "Level 2",
    category: "2D Arrays",
    points: 12,
    description: "Write a function that calculates the sum of elements in each column of a matrix and returns an array of column sums.",
    tags: ["Intermediate", "Functions", "2D Arrays"],
    testCases: [
      { input: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]", output: "[12, 15, 18]", description: "Sum of each column" },
      { input: "[[1, 2], [3, 4]]", output: "[4, 6]", description: "Sum of each column in 2x2 matrix" }
    ]
  },
  {
    id: 77,
    title: "Bubble Sort Function",
    difficulty: "Level 2",
    category: "Sorting",
    points: 15,
    description: "Write a function that implements bubble sort to sort an array.",
    tags: ["Intermediate", "Functions", "Sorting"],
    testCases: [
      { input: "[5, 2, 8, 1, 9]", output: "[1, 2, 5, 8, 9]", description: "Sort mixed array" },
      { input: "[3, 1, 4, 1, 5]", output: "[1, 1, 3, 4, 5]", description: "Sort with duplicates" }
    ]
  },
  {
    id: 78,
    title: "Selection Sort Function",
    difficulty: "Level 2",
    category: "Sorting",
    points: 15,
    description: "Write a function that implements selection sort to sort an array.",
    tags: ["Intermediate", "Functions", "Sorting"],
    testCases: [
      { input: "[64, 25, 12, 22, 11]", output: "[11, 12, 22, 25, 64]", description: "Sort mixed array" },
      { input: "[5, 2, 4, 6, 1]", output: "[1, 2, 4, 5, 6]", description: "Sort small array" }
    ]
  },
  {
    id: 79,
    title: "Insertion Sort Function",
    difficulty: "Level 2",
    category: "Sorting",
    points: 15,
    description: "Write a function that implements insertion sort to sort an array.",
    tags: ["Intermediate", "Functions", "Sorting"],
    testCases: [
      { input: "[12, 11, 13, 5, 6]", output: "[5, 6, 11, 12, 13]", description: "Sort mixed array" },
      { input: "[3, 1, 4, 1, 5]", output: "[1, 1, 3, 4, 5]", description: "Sort with duplicates" }
    ]
  },
  {
    id: 80,
    title: "Merge Sort Function",
    difficulty: "Level 2",
    category: "Sorting",
    points: 20,
    description: "Write a function that implements merge sort to sort an array.",
    tags: ["Intermediate", "Functions", "Sorting"],
    testCases: [
      { input: "[38, 27, 43, 3, 9, 82, 10]", output: "[3, 9, 10, 27, 38, 43, 82]", description: "Sort mixed array" },
      { input: "[5, 2, 4, 6, 1, 3]", output: "[1, 2, 3, 4, 5, 6]", description: "Sort small array" }
    ]
  },
  {
    id: 81,
    title: "Quick Sort Function",
    difficulty: "Level 2",
    category: "Sorting",
    points: 20,
    description: "Write a function that implements quick sort to sort an array.",
    tags: ["Intermediate", "Functions", "Sorting"],
    testCases: [
      { input: "[64, 34, 25, 12, 22, 11, 90]", output: "[11, 12, 22, 25, 34, 64, 90]", description: "Sort mixed array" },
      { input: "[5, 2, 4, 6, 1, 3]", output: "[1, 2, 3, 4, 5, 6]", description: "Sort small array" }
    ]
  },
  {
    id: 82,
    title: "GCD Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 12,
    description: "Write a function that finds the Greatest Common Divisor (GCD) of two numbers using Euclidean algorithm.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "48 18", output: "6", description: "GCD of 48 and 18" },
      { input: "12 8", output: "4", description: "GCD of 12 and 8" },
      { input: "54 24", output: "6", description: "GCD of 54 and 24" }
    ]
  },
  {
    id: 83,
    title: "LCM Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 12,
    description: "Write a function that finds the Least Common Multiple (LCM) of two numbers.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "12 18", output: "36", description: "LCM of 12 and 18" },
      { input: "8 12", output: "24", description: "LCM of 8 and 12" },
      { input: "15 20", output: "60", description: "LCM of 15 and 20" }
    ]
  },
  {
    id: 84,
    title: "Power Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 12,
    description: "Write a function that calculates the power of a number using recursion.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "2 3", output: "8", description: "2 to the power 3" },
      { input: "5 2", output: "25", description: "5 to the power 2" },
      { input: "3 4", output: "81", description: "3 to the power 4" }
    ]
  },
  {
    id: 85,
    title: "Square Root Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 15,
    description: "Write a function that calculates the square root of a number using Newton's method.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "16", output: "4.0", description: "Square root of 16" },
      { input: "25", output: "5.0", description: "Square root of 25" },
      { input: "9", output: "3.0", description: "Square root of 9" }
    ]
  },
  {
    id: 86,
    title: "Prime Factorization",
    difficulty: "Level 2",
    category: "Numbers",
    points: 18,
    description: "Write a function that finds the prime factorization of a number and returns the factors as an array.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "12", output: "[2, 2, 3]", description: "Prime factors of 12" },
      { input: "15", output: "[3, 5]", description: "Prime factors of 15" },
      { input: "28", output: "[2, 2, 7]", description: "Prime factors of 28" }
    ]
  },
  {
    id: 87,
    title: "Count Prime Numbers",
    difficulty: "Level 2",
    category: "Numbers",
    points: 15,
    description: "Write a function that counts the number of prime numbers less than or equal to a given number.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "10", output: "4", description: "Primes up to 10: 2, 3, 5, 7" },
      { input: "20", output: "8", description: "Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19" },
      { input: "5", output: "3", description: "Primes up to 5: 2, 3, 5" }
    ]
  },
  {
    id: 88,
    title: "Perfect Number Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 12,
    description: "Write a function that checks if a number is a perfect number and returns true/false.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "6", output: "true", description: "6 is perfect (1+2+3=6)" },
      { input: "8", output: "false", description: "8 is not perfect" },
      { input: "28", output: "true", description: "28 is perfect (1+2+4+7+14=28)" }
    ]
  },
  {
    id: 89,
    title: "Armstrong Number Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 12,
    description: "Write a function that checks if a number is an Armstrong number and returns true/false.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "153", output: "true", description: "153 is Armstrong (1³+5³+3³=153)" },
      { input: "123", output: "false", description: "123 is not Armstrong" },
      { input: "370", output: "true", description: "370 is Armstrong (3³+7³+0³=370)" }
    ]
  },
  {
    id: 90,
    title: "Sum of Digits Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 10,
    description: "Write a function that calculates the sum of digits of a given number.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "123", output: "6", description: "Sum of digits of 123" },
      { input: "456", output: "15", description: "Sum of digits of 456" },
      { input: "789", output: "24", description: "Sum of digits of 789" }
    ]
  },
  {
    id: 91,
    title: "Reverse Number Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 10,
    description: "Write a function that reverses a given number.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "123", output: "321", description: "Reverse 123" },
      { input: "456", output: "654", description: "Reverse 456" },
      { input: "1000", output: "1", description: "Reverse 1000 (leading zeros ignored)" }
    ]
  },
  {
    id: 92,
    title: "Palindrome Number Function",
    difficulty: "Level 2",
    category: "Numbers",
    points: 10,
    description: "Write a function that checks if a number is a palindrome and returns true/false.",
    tags: ["Intermediate", "Functions", "Numbers"],
    testCases: [
      { input: "121", output: "true", description: "121 is palindrome" },
      { input: "123", output: "false", description: "123 is not palindrome" },
      { input: "1221", output: "true", description: "1221 is palindrome" }
    ]
  },
  {
    id: 93,
    title: "File Read Function",
    difficulty: "Level 2",
    category: "File I/O",
    points: 15,
    description: "Write a function that reads the contents of a text file and returns the content as a string.",
    tags: ["Intermediate", "Functions", "File I/O"],
    testCases: [
      { input: "test.txt", output: "Hello World", description: "Read file content" },
      { input: "empty.txt", output: "", description: "Read empty file" }
    ]
  },
  {
    id: 94,
    title: "File Write Function",
    difficulty: "Level 2",
    category: "File I/O",
    points: 15,
    description: "Write a function that writes a string to a text file.",
    tags: ["Intermediate", "Functions", "File I/O"],
    testCases: [
      { input: "output.txt Hello World", output: "File written successfully", description: "Write to file" },
      { input: "data.txt Programming is fun", output: "File written successfully", description: "Write another string" }
    ]
  },
  {
    id: 95,
    title: "File Copy Function",
    difficulty: "Level 2",
    category: "File I/O",
    points: 18,
    description: "Write a function that copies the contents of one file to another file.",
    tags: ["Intermediate", "Functions", "File I/O"],
    testCases: [
      { input: "source.txt destination.txt", output: "File copied successfully", description: "Copy file content" },
      { input: "input.txt output.txt", output: "File copied successfully", description: "Copy another file" }
    ]
  },
  {
    id: 96,
    title: "File Line Count Function",
    difficulty: "Level 2",
    category: "File I/O",
    points: 12,
    description: "Write a function that counts the number of lines in a text file.",
    tags: ["Intermediate", "Functions", "File I/O"],
    testCases: [
      { input: "test.txt", output: "5", description: "Count lines in file" },
      { input: "empty.txt", output: "0", description: "Empty file has 0 lines" }
    ]
  },
  {
    id: 97,
    title: "File Word Count Function",
    difficulty: "Level 2",
    category: "File I/O",
    points: 15,
    description: "Write a function that counts the number of words in a text file.",
    tags: ["Intermediate", "Functions", "File I/O"],
    testCases: [
      { input: "test.txt", output: "25", description: "Count words in file" },
      { input: "empty.txt", output: "0", description: "Empty file has 0 words" }
    ]
  },
  {
    id: 98,
    title: "Simple Car Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 20,
    description: "Create a Car class with attributes (brand, model, year) and methods (start, stop, getInfo).",
    tags: ["Intermediate", "OOP", "Classes"],
    testCases: [
      { input: "Toyota Camry 2020", output: "Car: Toyota Camry 2020\nStarting engine...\nStopping engine...", description: "Car class functionality" },
      { input: "Honda Civic 2019", output: "Car: Honda Civic 2019\nStarting engine...\nStopping engine...", description: "Another car instance" }
    ]
  },
  {
    id: 99,
    title: "Student Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 20,
    description: "Create a Student class with attributes (name, id, grades) and methods (addGrade, getAverage, getInfo).",
    tags: ["Intermediate", "OOP", "Classes"],
    testCases: [
      { input: "John 101 85 90 78", output: "Student: John (ID: 101)\nAverage: 84.33\nGrades: [85, 90, 78]", description: "Student class functionality" },
      { input: "Alice 102 92 88 95", output: "Student: Alice (ID: 102)\nAverage: 91.67\nGrades: [92, 88, 95]", description: "Another student instance" }
    ]
  },
  {
    id: 100,
    title: "Bank Account Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 25,
    description: "Create a BankAccount class with attributes (accountNumber, balance) and methods (deposit, withdraw, getBalance).",
    tags: ["Intermediate", "OOP", "Classes"],
    testCases: [
      { input: "12345 1000 deposit 500 withdraw 200", output: "Account: 12345\nBalance: $1300.00\nWithdrawn: $200.00\nFinal Balance: $1100.00", description: "Bank account operations" },
      { input: "67890 500 deposit 1000 withdraw 300", output: "Account: 67890\nBalance: $1500.00\nWithdrawn: $300.00\nFinal Balance: $1200.00", description: "Another account operations" }
    ]
  },
  {
    id: 101,
    title: "Rectangle Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 15,
    description: "Create a Rectangle class with width and height attributes, and methods to calculate area and perimeter.",
    tags: ["Intermediate", "OOP", "Geometry"],
    testCases: [
      { input: "5 3", output: "Area: 15\nPerimeter: 16", description: "Rectangle calculations" },
      { input: "10 7", output: "Area: 70\nPerimeter: 34", description: "Another rectangle" }
    ]
  },
  {
    id: 102,
    title: "Circle Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 15,
    description: "Create a Circle class with radius attribute, and methods to calculate area and circumference.",
    tags: ["Intermediate", "OOP", "Geometry"],
    testCases: [
      { input: "5", output: "Area: 78.54\nCircumference: 31.42", description: "Circle calculations" },
      { input: "3", output: "Area: 28.27\nCircumference: 18.85", description: "Another circle" }
    ]
  },
  {
    id: 103,
    title: "Temperature Converter Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 18,
    description: "Create a Temperature class that can convert between Celsius, Fahrenheit, and Kelvin.",
    tags: ["Intermediate", "OOP", "Conversion"],
    testCases: [
      { input: "25", output: "Celsius: 25°C\nFahrenheit: 77°F\nKelvin: 298.15K", description: "Temperature conversions" },
      { input: "100", output: "Celsius: 100°C\nFahrenheit: 212°F\nKelvin: 373.15K", description: "Boiling point" }
    ]
  },
  {
    id: 104,
    title: "Time Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 20,
    description: "Create a Time class with hours, minutes, and seconds, and methods to add time and format output.",
    tags: ["Intermediate", "OOP", "Time"],
    testCases: [
      { input: "2 30 45 add 1 15 20", output: "3:46:05", description: "Add time" },
      { input: "23 59 59 add 0 0 1", output: "0:0:0", description: "Rollover to next day" }
    ]
  },
  {
    id: 105,
    title: "Date Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 22,
    description: "Create a Date class with day, month, year, and methods to add days and check if it's a leap year.",
    tags: ["Intermediate", "OOP", "Date"],
    testCases: [
      { input: "15 3 2024 add 10", output: "25/3/2024", description: "Add days" },
      { input: "28 2 2024 add 1", output: "29/2/2024", description: "Leap year" }
    ]
  },
  {
    id: 106,
    title: "Complex Number Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 25,
    description: "Create a Complex class for complex numbers with real and imaginary parts, and methods for arithmetic operations.",
    tags: ["Intermediate", "OOP", "Mathematics"],
    testCases: [
      { input: "3 4 add 1 2", output: "4 + 6i", description: "Add complex numbers" },
      { input: "5 3 multiply 2 1", output: "7 + 11i", description: "Multiply complex numbers" }
    ]
  },
  {
    id: 107,
    title: "Fraction Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 20,
    description: "Create a Fraction class with numerator and denominator, and methods for arithmetic operations and simplification.",
    tags: ["Intermediate", "OOP", "Mathematics"],
    testCases: [
      { input: "1 2 add 1 3", output: "5/6", description: "Add fractions" },
      { input: "3 4 multiply 2 5", output: "3/10", description: "Multiply fractions" }
    ]
  },
  {
    id: 108,
    title: "Vector Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 22,
    description: "Create a Vector class for 2D vectors with x and y components, and methods for vector operations.",
    tags: ["Intermediate", "OOP", "Mathematics"],
    testCases: [
      { input: "3 4 add 1 2", output: "4 6", description: "Add vectors" },
      { input: "3 4 magnitude", output: "5.0", description: "Calculate magnitude" }
    ]
  },
  {
    id: 109,
    title: "Matrix Class",
    difficulty: "Level 2",
    category: "OOP",
    points: 30,
    description: "Create a Matrix class for 2x2 matrices with methods for addition, multiplication, and determinant calculation.",
    tags: ["Intermediate", "OOP", "Mathematics"],
    testCases: [
      { input: "1 2 3 4 add 5 6 7 8", output: "6 8\n10 12", description: "Add matrices" },
      { input: "1 2 3 4 determinant", output: "-2", description: "Calculate determinant" }
    ]
  },
  {
    id: 110,
    title: "Stack Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 20,
    description: "Implement a Stack class with push, pop, peek, and isEmpty methods using an array.",
    tags: ["Intermediate", "Data Structures", "Stack"],
    testCases: [
      { input: "push 1 push 2 push 3 pop peek", output: "3\n2", description: "Stack operations" },
      { input: "push 10 push 20 pop pop isEmpty", output: "20\n10\ntrue", description: "Stack operations" }
    ]
  },
  {
    id: 111,
    title: "Queue Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 20,
    description: "Implement a Queue class with enqueue, dequeue, front, and isEmpty methods using an array.",
    tags: ["Intermediate", "Data Structures", "Queue"],
    testCases: [
      { input: "enqueue 1 enqueue 2 enqueue 3 dequeue front", output: "1\n2", description: "Queue operations" },
      { input: "enqueue 10 enqueue 20 dequeue dequeue isEmpty", output: "10\n20\ntrue", description: "Queue operations" }
    ]
  },
  {
    id: 112,
    title: "LinkedList Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a LinkedList class with insert, delete, search, and display methods.",
    tags: ["Intermediate", "Data Structures", "Linked List"],
    testCases: [
      { input: "insert 1 insert 2 insert 3 display", output: "1 -> 2 -> 3 -> null", description: "LinkedList operations" },
      { input: "insert 10 insert 20 delete 10 display", output: "20 -> null", description: "Delete operation" }
    ]
  },
  {
    id: 113,
    title: "Binary Tree Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 28,
    description: "Implement a BinaryTree class with insert, search, and inorder traversal methods.",
    tags: ["Intermediate", "Data Structures", "Tree"],
    testCases: [
      { input: "insert 5 insert 3 insert 7 inorder", output: "3 5 7", description: "Binary tree operations" },
      { input: "insert 10 insert 5 insert 15 search 5", output: "Found", description: "Search operation" }
    ]
  },
  {
    id: 114,
    title: "Hash Table Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a HashTable class with put, get, and remove methods using a simple hash function.",
    tags: ["Intermediate", "Data Structures", "Hash Table"],
    testCases: [
      { input: "put name John put age 25 get name", output: "John", description: "Hash table operations" },
      { input: "put city London put country UK remove city get city", output: "null", description: "Remove operation" }
    ]
  },
  {
    id: 115,
    title: "Graph Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 32,
    description: "Implement a Graph class with addVertex, addEdge, and depth-first search methods.",
    tags: ["Intermediate", "Data Structures", "Graph"],
    testCases: [
      { input: "addVertex A addVertex B addEdge A B dfs A", output: "A B", description: "Graph operations" },
      { input: "addVertex 1 addVertex 2 addVertex 3 addEdge 1 2 addEdge 2 3 dfs 1", output: "1 2 3", description: "DFS traversal" }
    ]
  },
  {
    id: 116,
    title: "Priority Queue Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a PriorityQueue class with insert, remove, and peek methods using a heap structure.",
    tags: ["Intermediate", "Data Structures", "Priority Queue"],
    testCases: [
      { input: "insert 5 insert 3 insert 7 remove", output: "7", description: "Priority queue operations" },
      { input: "insert 10 insert 20 insert 15 peek", output: "20", description: "Peek highest priority" }
    ]
  },
  {
    id: 117,
    title: "Set Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 20,
    description: "Implement a Set class with add, remove, contains, and union methods.",
    tags: ["Intermediate", "Data Structures", "Set"],
    testCases: [
      { input: "add 1 add 2 add 3 contains 2", output: "true", description: "Set operations" },
      { input: "add 5 add 10 union 3 7", output: "5 10 3 7", description: "Union operation" }
    ]
  },
  {
    id: 118,
    title: "Map Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 22,
    description: "Implement a Map class with put, get, remove, and containsKey methods.",
    tags: ["Intermediate", "Data Structures", "Map"],
    testCases: [
      { input: "put key1 value1 put key2 value2 get key1", output: "value1", description: "Map operations" },
      { input: "put name John put age 25 containsKey name", output: "true", description: "Contains key check" }
    ]
  },
  {
    id: 119,
    title: "TreeMap Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 28,
    description: "Implement a TreeMap class that maintains keys in sorted order with put, get, and firstKey methods.",
    tags: ["Intermediate", "Data Structures", "Tree Map"],
    testCases: [
      { input: "put 3 three put 1 one put 2 two firstKey", output: "1", description: "TreeMap operations" },
      { input: "put 10 ten put 5 five put 15 fifteen get 5", output: "five", description: "Get operation" }
    ]
  },
  {
    id: 120,
    title: "Heap Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a MaxHeap class with insert, extractMax, and heapify methods.",
    tags: ["Intermediate", "Data Structures", "Heap"],
    testCases: [
      { input: "insert 10 insert 5 insert 15 extractMax", output: "15", description: "Heap operations" },
      { input: "insert 20 insert 30 insert 10 peek", output: "30", description: "Peek maximum" }
    ]
  },
  {
    id: 121,
    title: "Trie Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a Trie class with insert, search, and startsWith methods for string operations.",
    tags: ["Intermediate", "Data Structures", "Trie"],
    testCases: [
      { input: "insert apple search apple", output: "true", description: "Trie operations" },
      { input: "insert cat insert car startsWith ca", output: "true", description: "StartsWith operation" }
    ]
  },
  {
    id: 122,
    title: "Disjoint Set Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a DisjointSet class with makeSet, find, and union methods for set operations.",
    tags: ["Intermediate", "Data Structures", "Disjoint Set"],
    testCases: [
      { input: "makeSet 1 makeSet 2 makeSet 3 union 1 2 find 1", output: "2", description: "Disjoint set operations" },
      { input: "makeSet 5 makeSet 6 union 5 6 find 5", output: "6", description: "Union and find" }
    ]
  },
  {
    id: 123,
    title: "Sparse Matrix Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a SparseMatrix class for efficient storage and operations on sparse matrices.",
    tags: ["Intermediate", "Data Structures", "Matrix"],
    testCases: [
      { input: "set 0 0 5 set 1 1 10 get 0 0", output: "5", description: "Sparse matrix operations" },
      { input: "set 2 3 15 set 0 1 7 get 2 3", output: "15", description: "Get operation" }
    ]
  },
  {
    id: 124,
    title: "Circular Buffer Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a CircularBuffer class with enqueue, dequeue, and isFull methods.",
    tags: ["Intermediate", "Data Structures", "Circular Buffer"],
    testCases: [
      { input: "enqueue 1 enqueue 2 enqueue 3 dequeue", output: "1", description: "Circular buffer operations" },
      { input: "enqueue 10 enqueue 20 enqueue 30 isFull", output: "false", description: "Check if full" }
    ]
  },
  {
    id: 125,
    title: "Skip List Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a SkipList class with insert, search, and delete methods for efficient searching.",
    tags: ["Intermediate", "Data Structures", "Skip List"],
    testCases: [
      { input: "insert 5 insert 10 insert 3 search 10", output: "true", description: "Skip list operations" },
      { input: "insert 15 insert 7 delete 7 search 7", output: "false", description: "Delete operation" }
    ]
  },
  {
    id: 126,
    title: "Bloom Filter Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a BloomFilter class with add and contains methods for probabilistic set membership.",
    tags: ["Intermediate", "Data Structures", "Bloom Filter"],
    testCases: [
      { input: "add apple add banana contains apple", output: "true", description: "Bloom filter operations" },
      { input: "add cat add dog contains fish", output: "false", description: "Check non-existent item" }
    ]
  },
  {
    id: 127,
    title: "LRU Cache Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement an LRUCache class with get and put methods that evict least recently used items.",
    tags: ["Intermediate", "Data Structures", "Cache"],
    testCases: [
      { input: "put 1 1 put 2 2 get 1", output: "1", description: "LRU cache operations" },
      { input: "put 3 3 put 4 4 get 2", output: "-1", description: "Key not found" }
    ]
  },
  {
    id: 128,
    title: "Red-Black Tree Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 40,
    description: "Implement a RedBlackTree class with insert, search, and delete methods maintaining tree properties.",
    tags: ["Intermediate", "Data Structures", "Red-Black Tree"],
    testCases: [
      { input: "insert 10 insert 20 insert 5 search 10", output: "true", description: "Red-black tree operations" },
      { input: "insert 15 insert 25 delete 15 search 15", output: "false", description: "Delete operation" }
    ]
  },
  {
    id: 129,
    title: "AVL Tree Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 38,
    description: "Implement an AVLTree class with insert, search, and delete methods maintaining balance.",
    tags: ["Intermediate", "Data Structures", "AVL Tree"],
    testCases: [
      { input: "insert 10 insert 20 insert 30 search 20", output: "true", description: "AVL tree operations" },
      { input: "insert 5 insert 15 delete 10 search 10", output: "false", description: "Delete operation" }
    ]
  },
  {
    id: 130,
    title: "B-Tree Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 45,
    description: "Implement a BTree class with insert, search, and delete methods for disk-based storage simulation.",
    tags: ["Intermediate", "Data Structures", "B-Tree"],
    testCases: [
      { input: "insert 10 insert 20 insert 5 search 10", output: "true", description: "B-tree operations" },
      { input: "insert 15 insert 25 delete 15 search 15", output: "false", description: "Delete operation" }
    ]
  },
  {
    id: 131,
    title: "Segment Tree Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a SegmentTree class with build, query, and update methods for range operations.",
    tags: ["Intermediate", "Data Structures", "Segment Tree"],
    testCases: [
      { input: "build 1 3 5 7 9 query 1 3", output: "15", description: "Segment tree operations" },
      { input: "build 2 4 6 8 update 2 10 query 1 3", output: "16", description: "Update and query" }
    ]
  },
  {
    id: 132,
    title: "Fenwick Tree Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 32,
    description: "Implement a FenwickTree class with update and query methods for prefix sum operations.",
    tags: ["Intermediate", "Data Structures", "Fenwick Tree"],
    testCases: [
      { input: "update 1 5 update 2 3 query 2", output: "8", description: "Fenwick tree operations" },
      { input: "update 3 10 update 4 7 query 4", output: "25", description: "Range query" }
    ]
  },
  {
    id: 133,
    title: "Suffix Array Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 40,
    description: "Implement a SuffixArray class with build and search methods for string pattern matching.",
    tags: ["Intermediate", "Data Structures", "Suffix Array"],
    testCases: [
      { input: "banana search ana", output: "1 3", description: "Suffix array operations" },
      { input: "mississippi search iss", output: "1 4", description: "Pattern search" }
    ]
  },
  {
    id: 134,
    title: "Trie with Wildcard Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a WildcardTrie class that supports wildcard characters (*) in search operations.",
    tags: ["Intermediate", "Data Structures", "Trie"],
    testCases: [
      { input: "insert cat insert car search c*t", output: "cat", description: "Wildcard search" },
      { input: "insert dog insert dig search d*g", output: "dog dig", description: "Multiple matches" }
    ]
  },
  {
    id: 135,
    title: "Circular Queue Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a CircularQueue class with enqueue, dequeue, and isFull methods using fixed-size array.",
    tags: ["Intermediate", "Data Structures", "Queue"],
    testCases: [
      { input: "enqueue 1 enqueue 2 enqueue 3 dequeue", output: "1", description: "Circular queue operations" },
      { input: "enqueue 10 enqueue 20 isFull", output: "false", description: "Check if full" }
    ]
  },
  {
    id: 136,
    title: "Deque Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 28,
    description: "Implement a Deque class with addFirst, addLast, removeFirst, and removeLast methods.",
    tags: ["Intermediate", "Data Structures", "Deque"],
    testCases: [
      { input: "addFirst 1 addLast 2 addFirst 3 removeFirst", output: "3", description: "Deque operations" },
      { input: "addLast 10 addLast 20 removeLast", output: "20", description: "Remove from end" }
    ]
  },
  {
    id: 137,
    title: "Priority Queue with Custom Comparator",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a CustomPriorityQueue class that accepts a custom comparator function.",
    tags: ["Intermediate", "Data Structures", "Priority Queue"],
    testCases: [
      { input: "insert 5 insert 3 insert 7 remove", output: "3", description: "Min priority queue" },
      { input: "insert 10 insert 20 insert 15 peek", output: "10", description: "Peek minimum" }
    ]
  },
  {
    id: 138,
    title: "MultiMap Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a MultiMap class that allows multiple values for the same key.",
    tags: ["Intermediate", "Data Structures", "MultiMap"],
    testCases: [
      { input: "put key1 value1 put key1 value2 get key1", output: "value1 value2", description: "MultiMap operations" },
      { input: "put name John put name Jane put age 25 get name", output: "John Jane", description: "Multiple values" }
    ]
  },
  {
    id: 139,
    title: "Ordered Set Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement an OrderedSet class that maintains elements in sorted order with no duplicates.",
    tags: ["Intermediate", "Data Structures", "Ordered Set"],
    testCases: [
      { input: "add 5 add 3 add 7 add 3 display", output: "3 5 7", description: "Ordered set operations" },
      { input: "add 10 add 5 add 15 contains 5", output: "true", description: "Contains check" }
    ]
  },
  {
    id: 140,
    title: "Concurrent Queue Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a ConcurrentQueue class with thread-safe enqueue and dequeue operations.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "enqueue 1 enqueue 2 enqueue 3 dequeue", output: "1", description: "Concurrent queue operations" },
      { input: "enqueue 10 enqueue 20 dequeue dequeue", output: "10 20", description: "Multiple dequeues" }
    ]
  },
  {
    id: 141,
    title: "Lock-Free Stack Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 40,
    description: "Implement a LockFreeStack class using atomic operations for thread-safe stack operations.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "push 1 push 2 push 3 pop", output: "3", description: "Lock-free stack operations" },
      { input: "push 10 push 20 pop pop", output: "20 10", description: "Multiple pops" }
    ]
  },
  {
    id: 142,
    title: "Read-Write Lock Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a ReadWriteLock class that allows multiple readers or a single writer.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "readLock readLock writeLock", output: "Reader 1 acquired\nReader 2 acquired\nWriter waiting", description: "Read-write lock operations" },
      { input: "writeLock readLock", output: "Writer acquired\nReader waiting", description: "Writer priority" }
    ]
  },
  {
    id: 143,
    title: "Barrier Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a Barrier class that blocks until a specified number of threads reach the barrier.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "await await await", output: "All threads reached barrier", description: "Barrier synchronization" },
      { input: "await await", output: "Waiting for more threads", description: "Incomplete barrier" }
    ]
  },
  {
    id: 144,
    title: "Semaphore Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 25,
    description: "Implement a Semaphore class with acquire and release methods for resource management.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "acquire acquire release", output: "Permit acquired\nPermit acquired\nPermit released", description: "Semaphore operations" },
      { input: "acquire acquire acquire", output: "Permit acquired\nPermit acquired\nBlocked", description: "Resource exhaustion" }
    ]
  },
  {
    id: 145,
    title: "CountDownLatch Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 28,
    description: "Implement a CountDownLatch class that blocks until a count reaches zero.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "countDown countDown await", output: "Count: 1\nCount: 0\nLatch opened", description: "CountDownLatch operations" },
      { input: "countDown await", output: "Count: 0\nLatch opened", description: "Single countdown" }
    ]
  },
  {
    id: 146,
    title: "CyclicBarrier Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 32,
    description: "Implement a CyclicBarrier class that resets after each use for repeated synchronization.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "await await await reset", output: "Barrier reached\nBarrier reached\nBarrier reached\nBarrier reset", description: "CyclicBarrier operations" },
      { input: "await await", output: "Barrier reached\nBarrier reached", description: "Repeated use" }
    ]
  },
  {
    id: 147,
    title: "Future Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 30,
    description: "Implement a Future class that represents the result of an asynchronous computation.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "submit task1 get", output: "Task completed\nResult: 42", description: "Future operations" },
      { input: "submit task2 cancel", output: "Task cancelled", description: "Cancel operation" }
    ]
  },
  {
    id: 148,
    title: "CompletableFuture Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a CompletableFuture class with thenApply and thenAccept methods for chaining operations.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "complete 10 thenApply x2 get", output: "20", description: "CompletableFuture operations" },
      { input: "complete 5 thenAccept print", output: "5", description: "Accept operation" }
    ]
  },
  {
    id: 149,
    title: "ThreadPool Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 40,
    description: "Implement a ThreadPool class that manages a pool of worker threads for task execution.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "submit task1 submit task2 shutdown", output: "Task 1 executed\nTask 2 executed\nPool shutdown", description: "ThreadPool operations" },
      { input: "submit task3 execute", output: "Task 3 executed", description: "Task execution" }
    ]
  },
  {
    id: 150,
    title: "BlockingQueue Class",
    difficulty: "Level 2",
    category: "Data Structures",
    points: 35,
    description: "Implement a BlockingQueue class with blocking put and take methods for producer-consumer scenarios.",
    tags: ["Intermediate", "Data Structures", "Concurrency"],
    testCases: [
      { input: "put 1 put 2 take", output: "1", description: "BlockingQueue operations" },
      { input: "put 10 take take", output: "10\nBlocked", description: "Blocking take" }
    ]
  }
]; 