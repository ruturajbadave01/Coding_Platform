// Additional Programming Problems to complete 500 total
// This file contains additional problems for Level 3 (221-400) and Level 4 (421-500)

// Additional Level 3 Problems (221-400)
export const additionalLevel3Problems = [
  {
    id: 221,
    title: "Roman to Integer",
    difficulty: "Level 3",
    category: "String",
    points: 20,
    description: "Given a roman numeral, convert it to an integer.",
    tags: ["String", "Roman Numerals", "Interview Favorite"],
    testCases: [
      { input: "III", output: "3", description: "Simple roman numeral" },
      { input: "LVIII", output: "58", description: "Complex roman numeral" },
      { input: "MCMXCIV", output: "1994", description: "Modern roman numeral" }
    ]
  },
  {
    id: 222,
    title: "Integer to Roman",
    difficulty: "Level 3",
    category: "String",
    points: 25,
    description: "Given an integer, convert it to a roman numeral.",
    tags: ["String", "Roman Numerals", "Interview Favorite"],
    testCases: [
      { input: "3", output: "III", description: "Simple integer" },
      { input: "58", output: "LVIII", description: "Complex integer" },
      { input: "1994", output: "MCMXCIV", description: "Modern integer" }
    ]
  },
  {
    id: 223,
    title: "Longest Common Prefix",
    difficulty: "Level 3",
    category: "String",
    points: 20,
    description: "Write a function to find the longest common prefix string amongst an array of strings.",
    tags: ["String", "Array", "Interview Favorite"],
    testCases: [
      { input: "[\"flower\",\"flow\",\"flight\"]", output: "fl", description: "Common prefix" },
      { input: "[\"dog\",\"racecar\",\"car\"]", output: "", description: "No common prefix" }
    ]
  },
  {
    id: 224,
    title: "Valid Phone Number",
    difficulty: "Level 3",
    category: "String",
    points: 15,
    description: "Given a phone number, determine if it's in a valid format (XXX-XXX-XXXX).",
    tags: ["String", "Validation", "Regex"],
    testCases: [
      { input: "123-456-7890", output: "true", description: "Valid format" },
      { input: "123-456-789", output: "false", description: "Invalid format" }
    ]
  },
  {
    id: 225,
    title: "Email Validation",
    difficulty: "Level 3",
    category: "String",
    points: 15,
    description: "Write a function to validate if a string is a valid email address.",
    tags: ["String", "Validation", "Regex"],
    testCases: [
      { input: "test@example.com", output: "true", description: "Valid email" },
      { input: "invalid-email", output: "false", description: "Invalid email" }
    ]
  }
];

// Additional Level 4 Problems (421-500)
export const additionalLevel4Problems = [
  {
    id: 421,
    title: "Advanced Dynamic Programming - Longest Increasing Subsequence",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 45,
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    tags: ["Dynamic Programming", "LIS", "Optimization"],
    testCases: [
      { input: "[10,9,2,5,3,7,101,18]", output: "4", description: "LIS length is 4" },
      { input: "[0,1,0,3,2,3]", output: "4", description: "LIS length is 4" }
    ]
  },
  {
    id: 422,
    title: "Advanced Graph - Minimum Spanning Tree",
    difficulty: "Level 4",
    category: "Graph",
    points: 50,
    description: "Find the minimum spanning tree of a weighted, undirected graph using Kruskal's algorithm.",
    tags: ["Graph", "MST", "Kruskal"],
    testCases: [
      { input: "[(0,1,4),(0,2,3),(1,2,1),(1,3,2),(2,3,4)]", output: "7", description: "MST weight" },
      { input: "[(0,1,10),(0,2,6),(1,2,5),(1,3,15),(2,3,4)]", output: "15", description: "Another MST" }
    ]
  },
  {
    id: 423,
    title: "Advanced String - KMP Pattern Matching",
    difficulty: "Level 4",
    category: "String",
    points: 40,
    description: "Implement the Knuth-Morris-Pratt algorithm for efficient string pattern matching.",
    tags: ["String", "KMP", "Pattern Matching"],
    testCases: [
      { input: "AABAACAADAABAABA AABA", output: "[0,9,12]", description: "Pattern found at indices" },
      { input: "ABCDEFG DEF", output: "[3]", description: "Pattern found at index 3" }
    ]
  },
  {
    id: 424,
    title: "Advanced Bit Manipulation - Bit Count",
    difficulty: "Level 4",
    category: "Bit Manipulation",
    points: 35,
    description: "Write a function that counts the number of set bits in an integer using Brian Kernighan's algorithm.",
    tags: ["Bit Manipulation", "Count Bits", "Optimization"],
    testCases: [
      { input: "11", output: "3", description: "11 in binary is 1011" },
      { input: "128", output: "1", description: "128 in binary is 10000000" }
    ]
  },
  {
    id: 425,
    title: "Advanced Algorithm - Fast Fourier Transform",
    difficulty: "Level 4",
    category: "Algorithms",
    points: 60,
    description: "Implement the Fast Fourier Transform algorithm for polynomial multiplication.",
    tags: ["Algorithms", "FFT", "Polynomial"],
    testCases: [
      { input: "[1,2,3] [4,5,6]", output: "[4,13,28,27,18]", description: "Polynomial multiplication" },
      { input: "[1,1] [1,1]", output: "[1,2,1]", description: "Simple multiplication" }
    ]
  }
];

// Export all additional problems
export const allAdditionalProblems = [
  ...additionalLevel3Problems,
  ...additionalLevel4Problems
]; 