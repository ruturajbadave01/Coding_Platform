// Easy Problems (200 problems)
export const easyChallenges = [
  // Arrays & Strings (50 problems)
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", points: 10, successRate: 85, submissions: 1250, description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", tags: ["Array", "Hash Table", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 2, title: "Valid Parentheses", difficulty: "Easy", category: "Stack", points: 15, successRate: 78, submissions: 980, description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", tags: ["Stack", "String", "Interview Favorite"], companies: ["Facebook", "Google", "Amazon", "Microsoft"] },
  { id: 3, title: "Palindrome Number", difficulty: "Easy", category: "Math", points: 12, successRate: 82, submissions: 1100, description: "Given an integer x, return true if x is a palindrome, and false otherwise.", tags: ["Math", "String", "Interview Favorite"], companies: ["Apple", "Google", "Microsoft"] },
  { id: 4, title: "Remove Duplicates from Sorted Array", difficulty: "Easy", category: "Arrays", points: 15, successRate: 75, submissions: 950, description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 5, title: "Maximum Subarray", difficulty: "Easy", category: "Dynamic Programming", points: 20, successRate: 70, submissions: 800, description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.", tags: ["Dynamic Programming", "Array", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 6, title: "Climbing Stairs", difficulty: "Easy", category: "Dynamic Programming", points: 18, successRate: 88, submissions: 1200, description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", tags: ["Dynamic Programming", "Math", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 7, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", category: "Arrays", points: 15, successRate: 80, submissions: 1050, description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.", tags: ["Array", "Greedy", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Apple"] },
  { id: 8, title: "Valid Anagram", difficulty: "Easy", category: "String", points: 12, successRate: 85, submissions: 1150, description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.", tags: ["String", "Hash Table", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 9, title: "Contains Duplicate", difficulty: "Easy", category: "Arrays", points: 10, successRate: 90, submissions: 1300, description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.", tags: ["Array", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 10, title: "Missing Number", difficulty: "Easy", category: "Arrays", points: 15, successRate: 75, submissions: 900, description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.", tags: ["Array", "Math", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 11, title: "Move Zeroes", difficulty: "Easy", category: "Arrays", points: 12, successRate: 78, submissions: 950, description: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 12, title: "Reverse String", difficulty: "Easy", category: "String", points: 10, successRate: 95, submissions: 1400, description: "Write a function that reverses a string. The input string is given as an array of characters s.", tags: ["String", "Two Pointers", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 13, title: "Intersection of Two Arrays", difficulty: "Easy", category: "Arrays", points: 15, successRate: 72, submissions: 850, description: "Given two integer arrays nums1 and nums2, return an array of their intersection.", tags: ["Array", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 14, title: "Single Number", difficulty: "Easy", category: "Arrays", points: 15, successRate: 80, submissions: 1000, description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.", tags: ["Array", "Bit Manipulation", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 15, title: "Happy Number", difficulty: "Easy", category: "Math", points: 18, successRate: 65, submissions: 750, description: "Write an algorithm to determine if a number n is happy.", tags: ["Math", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 16, title: "Count Primes", difficulty: "Easy", category: "Math", points: 20, successRate: 60, submissions: 600, description: "Count the number of prime numbers less than a non-negative number, n.", tags: ["Math", "Sieve", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft"] },
  { id: 17, title: "Power of Three", difficulty: "Easy", category: "Math", points: 15, successRate: 70, submissions: 800, description: "Given an integer n, return true if it is a power of three. Otherwise, return false.", tags: ["Math", "Recursion", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 18, title: "Roman to Integer", difficulty: "Easy", category: "String", points: 18, successRate: 68, submissions: 850, description: "Given a roman numeral, convert it to an integer.", tags: ["String", "Hash Table", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 19, title: "Integer to Roman", difficulty: "Easy", category: "String", points: 18, successRate: 65, submissions: 700, description: "Given an integer, convert it to a roman numeral.", tags: ["String", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 20, title: "First Bad Version", difficulty: "Easy", category: "Binary Search", points: 20, successRate: 75, submissions: 900, description: "You are a product manager and currently leading a team to develop a new product.", tags: ["Binary Search", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  // Continue with more easy problems...
  { id: 21, title: "Merge Sorted Array", difficulty: "Easy", category: "Arrays", points: 15, successRate: 78, submissions: 950, description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 22, title: "First Unique Character in a String", difficulty: "Easy", category: "String", points: 15, successRate: 80, submissions: 1000, description: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.", tags: ["String", "Hash Table", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 23, title: "Ransom Note", difficulty: "Easy", category: "String", points: 12, successRate: 85, submissions: 1100, description: "Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.", tags: ["String", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 24, title: "Valid Palindrome", difficulty: "Easy", category: "String", points: 15, successRate: 75, submissions: 900, description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", tags: ["String", "Two Pointers", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 25, title: "Implement strStr()", difficulty: "Easy", category: "String", points: 18, successRate: 70, submissions: 800, description: "Implement strStr(). Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.", tags: ["String", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  // Add more easy problems to reach 200...
  { id: 200, title: "Excel Sheet Column Title", difficulty: "Easy", category: "Math", points: 15, successRate: 65, submissions: 600, description: "Given an integer columnNumber, return its corresponding column title as it appears in an Excel sheet.", tags: ["Math", "String", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft"] }
];

// Medium Problems (100 problems)
export const mediumChallenges = [
  { id: 201, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", points: 25, successRate: 65, submissions: 650, description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.", tags: ["Linked List", "Math", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Apple"] },
  { id: 202, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String", points: 30, successRate: 58, submissions: 520, description: "Given a string s, find the length of the longest substring without repeating characters.", tags: ["String", "Sliding Window", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 203, title: "Container With Most Water", difficulty: "Medium", category: "Arrays", points: 28, successRate: 62, submissions: 480, description: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft"] },
  { id: 204, title: "3Sum", difficulty: "Medium", category: "Arrays", points: 35, successRate: 55, submissions: 420, description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 205, title: "Binary Tree Level Order Traversal", difficulty: "Medium", category: "Tree", points: 32, successRate: 68, submissions: 580, description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).", tags: ["Tree", "BFS", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Apple"] },
  { id: 206, title: "Rotate Image", difficulty: "Medium", category: "Arrays", points: 30, successRate: 60, submissions: 450, description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).", tags: ["Array", "Matrix", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 207, title: "Group Anagrams", difficulty: "Medium", category: "String", points: 28, successRate: 65, submissions: 500, description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.", tags: ["String", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 208, title: "Permutations", difficulty: "Medium", category: "Backtracking", points: 35, successRate: 50, submissions: 400, description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.", tags: ["Backtracking", "Array", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 209, title: "Subsets", difficulty: "Medium", category: "Backtracking", points: 32, successRate: 55, submissions: 450, description: "Given an integer array nums of unique elements, return all possible subsets (the power set).", tags: ["Backtracking", "Array", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 210, title: "Word Search", difficulty: "Medium", category: "Backtracking", points: 38, successRate: 45, submissions: 350, description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.", tags: ["Backtracking", "DFS", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  // Continue with more medium problems...
  { id: 300, title: "Sort Colors", difficulty: "Medium", category: "Arrays", points: 25, successRate: 70, submissions: 600, description: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] }
];

// Hard Problems (50 problems)
export const hardChallenges = [
  { id: 301, title: "Regular Expression Matching", difficulty: "Hard", category: "String", points: 60, successRate: 35, submissions: 95, description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.", tags: ["String", "Dynamic Programming", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 302, title: "Merge k Sorted Lists", difficulty: "Hard", category: "Linked List", points: 55, successRate: 42, submissions: 120, description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.", tags: ["Linked List", "Heap", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Apple"] },
  { id: 303, title: "Longest Palindromic Substring", difficulty: "Hard", category: "String", points: 50, successRate: 38, submissions: 180, description: "Given a string s, return the longest palindromic substring in s.", tags: ["String", "Dynamic Programming", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 304, title: "Trapping Rain Water", difficulty: "Hard", category: "Arrays", points: 65, successRate: 45, submissions: 150, description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.", tags: ["Array", "Two Pointers", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Apple"] },
  { id: 305, title: "Word Ladder", difficulty: "Hard", category: "Graph", points: 70, successRate: 32, submissions: 85, description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words.", tags: ["Graph", "BFS", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 306, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Arrays", points: 75, successRate: 28, submissions: 75, description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.", tags: ["Array", "Binary Search", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 307, title: "Longest Valid Parentheses", difficulty: "Hard", category: "String", points: 60, successRate: 40, submissions: 100, description: "Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.", tags: ["String", "Dynamic Programming", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  { id: 308, title: "Sudoku Solver", difficulty: "Hard", category: "Backtracking", points: 65, successRate: 35, submissions: 80, description: "Write a program to solve a Sudoku puzzle by filling the empty cells.", tags: ["Backtracking", "Hash Table", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Apple"] },
  { id: 309, title: "First Missing Positive", difficulty: "Hard", category: "Arrays", points: 70, successRate: 30, submissions: 60, description: "Given an unsorted integer array nums, return the smallest missing positive integer.", tags: ["Array", "Hash Table", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] },
  { id: 310, title: "Wildcard Matching", difficulty: "Hard", category: "String", points: 65, successRate: 25, submissions: 50, description: "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where '?' matches any single character.", tags: ["String", "Dynamic Programming", "Interview Favorite"], companies: ["Google", "Amazon", "Microsoft", "Facebook"] },
  // Continue with more hard problems...
  { id: 350, title: "Sliding Window Maximum", difficulty: "Hard", category: "Arrays", points: 60, successRate: 38, submissions: 90, description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.", tags: ["Array", "Sliding Window", "Interview Favorite"], companies: ["Amazon", "Google", "Microsoft", "Facebook"] }
];

// Generate additional problems to reach the target counts
const generateEasyProblems = () => {
  const easyTemplates = [
    { title: "Two Sum II", category: "Arrays", description: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number." },
    { title: "Valid Palindrome II", category: "String", description: "Given a string s, return true if the s can be palindrome after deleting at most one character from it." },
    { title: "Remove Element", category: "Arrays", description: "Given an integer array nums and an integer val, remove all occurrences of val in nums in-place." },
    { title: "Length of Last Word", category: "String", description: "Given a string s consisting of words and spaces, return the length of the last word in the string." },
    { title: "Plus One", category: "Arrays", description: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer." },
    { title: "Sqrt(x)", category: "Math", description: "Given a non-negative integer x, compute and return the square root of x." },
    { title: "Climbing Stairs II", category: "Dynamic Programming", description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1, 2, or 3 steps." },
    { title: "Valid Perfect Square", category: "Math", description: "Given a positive integer num, write a function which returns True if num is a perfect square else False." },
    { title: "Find the Difference", category: "String", description: "You are given two strings s and t. String t is generated by random shuffling string s and then add one more letter at a random position." },
    { title: "Sum of Two Integers", category: "Math", description: "Given two integers a and b, return the sum of the two integers without using the operators + and -." }
  ];

  const problems = [];
  for (let i = 26; i <= 200; i++) {
    const template = easyTemplates[i % easyTemplates.length];
    problems.push({
      id: i,
      title: `${template.title} ${Math.floor(i / 10) + 1}`,
      difficulty: "Easy",
      category: template.category,
      points: 10 + (i % 10),
      successRate: 70 + (i % 20),
      submissions: 800 + (i * 10),
      description: template.description,
      tags: ["Interview Favorite"],
      companies: ["Google", "Amazon", "Microsoft", "Apple"]
    });
  }
  return problems;
};

const generateMediumProblems = () => {
  const mediumTemplates = [
    { title: "Add Two Numbers II", category: "Linked List", description: "You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first." },
    { title: "Longest Substring Without Repeating Characters II", category: "String", description: "Given a string s, find the length of the longest substring without repeating characters, but with a twist." },
    { title: "Container With Most Water II", category: "Arrays", description: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines." },
    { title: "3Sum Closest", category: "Arrays", description: "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target." },
    { title: "Binary Tree Level Order Traversal II", category: "Tree", description: "Given the root of a binary tree, return the bottom-up level order traversal of its nodes' values." },
    { title: "Rotate Image II", category: "Arrays", description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (counter-clockwise)." },
    { title: "Group Anagrams II", category: "String", description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order." },
    { title: "Permutations II", category: "Backtracking", description: "Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations." },
    { title: "Subsets II", category: "Backtracking", description: "Given an integer array nums that may contain duplicates, return all possible subsets (the power set)." },
    { title: "Word Search II", category: "Backtracking", description: "Given an m x n grid of characters board and a list of strings words, return all words on the board." }
  ];

  const problems = [];
  for (let i = 211; i <= 300; i++) {
    const template = mediumTemplates[i % mediumTemplates.length];
    problems.push({
      id: i,
      title: `${template.title} ${Math.floor(i / 10) + 1}`,
      difficulty: "Medium",
      category: template.category,
      points: 25 + (i % 15),
      successRate: 50 + (i % 20),
      submissions: 400 + (i * 5),
      description: template.description,
      tags: ["Interview Favorite"],
      companies: ["Google", "Amazon", "Microsoft", "Apple"]
    });
  }
  return problems;
};

const generateHardProblems = () => {
  const hardTemplates = [
    { title: "Regular Expression Matching II", category: "String", description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'." },
    { title: "Merge k Sorted Lists II", category: "Linked List", description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order." },
    { title: "Longest Palindromic Substring II", category: "String", description: "Given a string s, return the longest palindromic substring in s with additional constraints." },
    { title: "Trapping Rain Water II", category: "Arrays", description: "Given n non-negative integers representing an elevation map where the width of each bar is 1." },
    { title: "Word Ladder II", category: "Graph", description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList." },
    { title: "Median of Two Sorted Arrays II", category: "Arrays", description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median." },
    { title: "Longest Valid Parentheses II", category: "String", description: "Given a string containing just the characters '(' and ')', find the length of the longest valid." },
    { title: "Sudoku Solver II", category: "Backtracking", description: "Write a program to solve a Sudoku puzzle by filling the empty cells with additional constraints." },
    { title: "First Missing Positive II", category: "Arrays", description: "Given an unsorted integer array nums, return the smallest missing positive integer with O(1) space." },
    { title: "Wildcard Matching II", category: "String", description: "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*'." }
  ];

  const problems = [];
  for (let i = 311; i <= 350; i++) {
    const template = hardTemplates[i % hardTemplates.length];
    problems.push({
      id: i,
      title: `${template.title} ${Math.floor(i / 10) + 1}`,
      difficulty: "Hard",
      category: template.category,
      points: 50 + (i % 20),
      successRate: 25 + (i % 15),
      submissions: 50 + (i * 2),
      description: template.description,
      tags: ["Interview Favorite"],
      companies: ["Google", "Amazon", "Microsoft", "Apple"]
    });
  }
  return problems;
};

// Combine all problems
export const allChallenges = [
  ...easyChallenges,
  ...generateEasyProblems(),
  ...mediumChallenges,
  ...generateMediumProblems(),
  ...hardChallenges,
  ...generateHardProblems()
]; 