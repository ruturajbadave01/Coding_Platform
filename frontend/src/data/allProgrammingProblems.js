// Complete Programming Problems Database - 500 Problems
// This file contains all programming problems organized by difficulty levels

import { programmingProblems } from './programmingProblems.js';
import { level2Problems } from './programmingProblemsLevel2.js';
import { allAdditionalProblems } from './additionalProblems.js';
import { level3AdditionalProblems } from './level3AdditionalProblems.js';
import { level4AdditionalProblems } from './level4AdditionalProblems.js';

// Level 1: Basic Fundamentals (1-50) - Already defined in programmingProblems.js
// Level 2: Intermediate Concepts (51-200) - Already defined in level2Problems.js

// Level 3: Data Structures and Algorithms (201-400)
export const level3Problems = [
  {
    id: 201,
    title: "Two Sum",
    difficulty: "Level 3",
    category: "Arrays & Hashing",
    points: 25,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Arrays", "Hash Table", "Interview Favorite"],
    testCases: [
      { input: "[2, 7, 11, 15] 9", output: "[0, 1]", description: "Two numbers that sum to 9" },
      { input: "[3, 2, 4] 6", output: "[1, 2]", description: "Two numbers that sum to 6" },
      { input: "[3, 3] 6", output: "[0, 1]", description: "Same number used twice" }
    ]
  },
  {
    id: 202,
    title: "Valid Parentheses",
    difficulty: "Level 3",
    category: "Stack",
    points: 20,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["Stack", "String", "Interview Favorite"],
    testCases: [
      { input: "()", output: "true", description: "Simple valid parentheses" },
      { input: "()[]{}", output: "true", description: "Multiple valid pairs" },
      { input: "(]", output: "false", description: "Invalid parentheses" }
    ]
  },
  {
    id: 203,
    title: "Palindrome Number",
    difficulty: "Level 3",
    category: "Math",
    points: 15,
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    tags: ["Math", "String", "Interview Favorite"],
    testCases: [
      { input: "121", output: "true", description: "Palindrome number" },
      { input: "-121", output: "false", description: "Negative number" },
      { input: "10", output: "false", description: "Not palindrome" }
    ]
  },
  {
    id: 204,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Level 3",
    category: "Arrays",
    points: 20,
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.",
    tags: ["Array", "Two Pointers", "Interview Favorite"],
    testCases: [
      { input: "[1, 1, 2]", output: "2 [1, 2]", description: "Remove duplicates" },
      { input: "[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]", output: "5 [0, 1, 2, 3, 4]", description: "Multiple duplicates" }
    ]
  },
  {
    id: 205,
    title: "Maximum Subarray",
    difficulty: "Level 3",
    category: "Dynamic Programming",
    points: 25,
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    tags: ["Dynamic Programming", "Array", "Interview Favorite"],
    testCases: [
      { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6", description: "Maximum subarray sum" },
      { input: "[1]", output: "1", description: "Single element" },
      { input: "[5, 4, -1, 7, 8]", output: "23", description: "All positive numbers" }
    ]
  },
  {
    id: 206,
    title: "Climbing Stairs",
    difficulty: "Level 3",
    category: "Dynamic Programming",
    points: 20,
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    tags: ["Dynamic Programming", "Math", "Interview Favorite"],
    testCases: [
      { input: "2", output: "2", description: "Two ways: 1+1 or 2" },
      { input: "3", output: "3", description: "Three ways: 1+1+1, 1+2, or 2+1" },
      { input: "4", output: "5", description: "Five ways to climb" }
    ]
  },
  {
    id: 207,
    title: "Add Two Numbers",
    difficulty: "Level 3",
    category: "Linked List",
    points: 30,
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
    tags: ["Linked List", "Math", "Interview Favorite"],
    testCases: [
      { input: "[2, 4, 3] [5, 6, 4]", output: "[7, 0, 8]", description: "Add two numbers" },
      { input: "[0] [0]", output: "[0]", description: "Add zeros" },
      { input: "[9, 9, 9, 9, 9, 9, 9] [9, 9, 9, 9]", output: "[8, 9, 9, 9, 0, 0, 0, 1]", description: "Carry over" }
    ]
  },
  {
    id: 208,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Level 3",
    category: "String",
    points: 30,
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    tags: ["String", "Sliding Window", "Interview Favorite"],
    testCases: [
      { input: "abcabcbb", output: "3", description: "Longest substring 'abc'" },
      { input: "bbbbb", output: "1", description: "All same characters" },
      { input: "pwwkew", output: "3", description: "Longest substring 'wke'" }
    ]
  },
  {
    id: 209,
    title: "Container With Most Water",
    difficulty: "Level 3",
    category: "Arrays",
    points: 28,
    description: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container.",
    tags: ["Array", "Two Pointers", "Interview Favorite"],
    testCases: [
      { input: "[1, 8, 6, 2, 5, 4, 8, 3, 7]", output: "49", description: "Maximum area" },
      { input: "[1, 1]", output: "1", description: "Minimum case" },
      { input: "[4, 3, 2, 1, 4]", output: "16", description: "Another case" }
    ]
  },
  {
    id: 210,
    title: "3Sum",
    difficulty: "Level 3",
    category: "Arrays",
    points: 35,
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    tags: ["Array", "Two Pointers", "Interview Favorite"],
    testCases: [
      { input: "[-1, 0, 1, 2, -1, -4]", output: "[[-1, -1, 2], [-1, 0, 1]]", description: "Find triplets that sum to zero" },
      { input: "[]", output: "[]", description: "Empty array" },
      { input: "[0]", output: "[]", description: "Single element" }
    ]
  },
  {
    id: 211,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Level 3",
    category: "Tree",
    points: 32,
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    tags: ["Tree", "BFS", "Interview Favorite"],
    testCases: [
      { input: "[3, 9, 20, null, null, 15, 7]", output: "[[3], [9, 20], [15, 7]]", description: "Level order traversal" },
      { input: "[1]", output: "[[1]]", description: "Single node" },
      { input: "[]", output: "[]", description: "Empty tree" }
    ]
  },
  {
    id: 212,
    title: "Rotate Image",
    difficulty: "Level 3",
    category: "Arrays",
    points: 30,
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    tags: ["Array", "Matrix", "Interview Favorite"],
    testCases: [
      { input: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]", output: "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]", description: "Rotate 3x3 matrix" },
      { input: "[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]", output: "[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]", description: "Rotate 4x4 matrix" }
    ]
  },
  {
    id: 213,
    title: "Regular Expression Matching",
    difficulty: "Level 3",
    category: "String",
    points: 60,
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
    tags: ["String", "Dynamic Programming", "Interview Favorite"],
    testCases: [
      { input: "aa a", output: "false", description: "No match" },
      { input: "aa a*", output: "true", description: "Match with *" },
      { input: "ab .*", output: "true", description: "Match with .*" }
    ]
  },
  {
    id: 214,
    title: "Merge k Sorted Lists",
    difficulty: "Level 3",
    category: "Linked List",
    points: 55,
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    tags: ["Linked List", "Heap", "Interview Favorite"],
    testCases: [
      { input: "[[1, 4, 5], [1, 3, 4], [2, 6]]", output: "[1, 1, 2, 3, 4, 4, 5, 6]", description: "Merge three sorted lists" },
      { input: "[]", output: "[]", description: "Empty array" },
      { input: "[[]]", output: "[]", description: "Single empty list" }
    ]
  },
  {
    id: 215,
    title: "Longest Palindromic Substring",
    difficulty: "Level 3",
    category: "String",
    points: 50,
    description: "Given a string s, return the longest palindromic substring in s.",
    tags: ["String", "Dynamic Programming", "Interview Favorite"],
    testCases: [
      { input: "babad", output: "bab", description: "Longest palindrome 'bab'" },
      { input: "cbbd", output: "bb", description: "Longest palindrome 'bb'" },
      { input: "a", output: "a", description: "Single character" }
    ]
  },
  {
    id: 216,
    title: "Trapping Rain Water",
    difficulty: "Level 3",
    category: "Arrays",
    points: 65,
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    tags: ["Array", "Two Pointers", "Interview Favorite"],
    testCases: [
      { input: "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", output: "6", description: "Trap 6 units of water" },
      { input: "[4, 2, 0, 3, 2, 5]", output: "9", description: "Trap 9 units of water" },
      { input: "[4, 2, 3]", output: "1", description: "Trap 1 unit of water" }
    ]
  },
  {
    id: 217,
    title: "Word Ladder",
    difficulty: "Level 3",
    category: "Graph",
    points: 70,
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words.",
    tags: ["Graph", "BFS", "Interview Favorite"],
    testCases: [
      { input: "hit cog [hot, dot, dog, lot, log, cog]", output: "5", description: "Shortest transformation sequence" },
      { input: "hit cog [hot, dot, dog, lot, log]", output: "0", description: "No transformation possible" }
    ]
  },
  {
    id: 218,
    title: "Median of Two Sorted Arrays",
    difficulty: "Level 3",
    category: "Arrays",
    points: 75,
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    tags: ["Array", "Binary Search", "Interview Favorite"],
    testCases: [
      { input: "[1, 3] [2]", output: "2.0", description: "Median is 2.0" },
      { input: "[1, 2] [3, 4]", output: "2.5", description: "Median is 2.5" },
      { input: "[0, 0] [0, 0]", output: "0.0", description: "All zeros" }
    ]
  },
  {
    id: 219,
    title: "Reverse Integer",
    difficulty: "Level 3",
    category: "Math",
    points: 20,
    description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, then return 0.",
    tags: ["Math", "Integer", "Interview Favorite"],
    testCases: [
      { input: "123", output: "321", description: "Reverse positive number" },
      { input: "-123", output: "-321", description: "Reverse negative number" },
      { input: "120", output: "21", description: "Remove trailing zeros" }
    ]
  },
  {
    id: 220,
    title: "String to Integer (atoi)",
    difficulty: "Level 3",
    category: "String",
    points: 25,
    description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
    tags: ["String", "Integer", "Interview Favorite"],
    testCases: [
      { input: "42", output: "42", description: "Simple conversion" },
      { input: "   -42", output: "-42", description: "With whitespace and minus" },
      { input: "4193 with words", output: "4193", description: "With words" }
    ]
  }
];

// Level 4: Advanced Algorithms & Data Structures (401-500)
export const level4Problems = [
  {
    id: 401,
    title: "Fibonacci with Memoization",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 30,
    description: "Implement a memoized version of the Fibonacci function to avoid redundant calculations.",
    tags: ["Dynamic Programming", "Memoization", "Optimization"],
    testCases: [
      { input: "10", output: "55", description: "10th Fibonacci number" },
      { input: "20", output: "6765", description: "20th Fibonacci number" },
      { input: "30", output: "832040", description: "30th Fibonacci number" }
    ]
  },
  {
    id: 402,
    title: "Knapsack Problem",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 50,
    description: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value.",
    tags: ["Dynamic Programming", "Knapsack", "Optimization"],
    testCases: [
      { input: "[10, 20, 30] [60, 100, 120] 50", output: "220", description: "Maximum value for capacity 50" },
      { input: "[1, 2, 3] [10, 20, 30] 5", output: "50", description: "Maximum value for capacity 5" }
    ]
  },
  {
    id: 403,
    title: "Coin Change",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 45,
    description: "Given an integer array coins representing coins of different denominations and an integer amount, return the fewest number of coins needed to make up that amount.",
    tags: ["Dynamic Programming", "Coin Change", "Optimization"],
    testCases: [
      { input: "[1, 2, 5] 11", output: "3", description: "3 coins: 5 + 5 + 1" },
      { input: "[2] 3", output: "-1", description: "Cannot make amount 3" },
      { input: "[1] 0", output: "0", description: "No coins needed" }
    ]
  },
  {
    id: 404,
    title: "Longest Common Subsequence",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 40,
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    tags: ["Dynamic Programming", "String", "LCS"],
    testCases: [
      { input: "abcde ace", output: "3", description: "LCS is 'ace'" },
      { input: "abc abc", output: "3", description: "LCS is 'abc'" },
      { input: "abc def", output: "0", description: "No common subsequence" }
    ]
  },
  {
    id: 405,
    title: "Edit Distance",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 45,
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
    tags: ["Dynamic Programming", "String", "Edit Distance"],
    testCases: [
      { input: "horse ros", output: "3", description: "3 operations: horse -> rorse -> rose -> ros" },
      { input: "intention execution", output: "5", description: "5 operations needed" },
      { input: "abc abc", output: "0", description: "No operations needed" }
    ]
  },
  {
    id: 406,
    title: "Activity Selection",
    difficulty: "Level 4",
    category: "Greedy",
    points: 35,
    description: "Given n activities with their start and finish times, select the maximum number of activities that can be performed by a single person.",
    tags: ["Greedy", "Sorting", "Activity Selection"],
    testCases: [
      { input: "[(1, 4), (2, 6), (3, 9), (5, 7), (8, 10)]", output: "3", description: "3 activities can be selected" },
      { input: "[(1, 2), (3, 4), (5, 6)]", output: "3", description: "All activities can be selected" }
    ]
  },
  {
    id: 407,
    title: "Fractional Knapsack",
    difficulty: "Level 4",
    category: "Greedy",
    points: 40,
    description: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value. Items can be broken into smaller pieces.",
    tags: ["Greedy", "Knapsack", "Fractional"],
    testCases: [
      { input: "[10, 20, 30] [60, 100, 120] 50", output: "240.0", description: "Maximum fractional value" },
      { input: "[1, 2, 3] [10, 20, 30] 5", output: "50.0", description: "Maximum fractional value" }
    ]
  },
  {
    id: 408,
    title: "Dijkstra's Algorithm",
    difficulty: "Level 4",
    category: "Graph",
    points: 60,
    description: "Implement Dijkstra's algorithm to find the shortest path from a source vertex to all other vertices in a weighted graph.",
    tags: ["Graph", "Dijkstra", "Shortest Path"],
    testCases: [
      { input: "[[0, 4, 0, 0, 0], [4, 0, 8, 0, 0], [0, 8, 0, 7, 0], [0, 0, 7, 0, 9], [0, 0, 0, 9, 0]] 0", output: "[0, 4, 12, 19, 28]", description: "Shortest distances from vertex 0" },
      { input: "[[0, 1, 4], [1, 0, 2], [4, 2, 0]] 0", output: "[0, 1, 3]", description: "Shortest distances in triangle graph" }
    ]
  },
  {
    id: 409,
    title: "Prim's Algorithm",
    difficulty: "Level 4",
    category: "Graph",
    points: 55,
    description: "Implement Prim's algorithm to find the minimum spanning tree of a connected, undirected graph.",
    tags: ["Graph", "Prim", "MST"],
    testCases: [
      { input: "[[0, 2, 0, 6, 0], [2, 0, 3, 8, 5], [0, 3, 0, 0, 7], [6, 8, 0, 0, 9], [0, 5, 7, 9, 0]]", output: "16", description: "Minimum spanning tree weight" },
      { input: "[[0, 1, 4], [1, 0, 2], [4, 2, 0]]", output: "3", description: "MST weight for triangle" }
    ]
  },
  {
    id: 410,
    title: "Kruskal's Algorithm",
    difficulty: "Level 4",
    category: "Graph",
    points: 55,
    description: "Implement Kruskal's algorithm to find the minimum spanning tree of a connected, undirected graph.",
    tags: ["Graph", "Kruskal", "MST"],
    testCases: [
      { input: "[(0, 1, 2), (0, 3, 6), (1, 2, 3), (1, 4, 5), (2, 4, 7), (3, 4, 9)]", output: "16", description: "Minimum spanning tree weight" },
      { input: "[(0, 1, 1), (1, 2, 2), (0, 2, 4)]", output: "3", description: "MST weight for triangle" }
    ]
  },
  {
    id: 411,
    title: "Topological Sort",
    difficulty: "Level 4",
    category: "Graph",
    points: 45,
    description: "Implement topological sorting for a directed acyclic graph (DAG).",
    tags: ["Graph", "Topological Sort", "DFS"],
    testCases: [
      { input: "[[1, 2], [2, 3], [3, 4], [1, 3]]", output: "[1, 2, 3, 4]", description: "Topological order" },
      { input: "[[1, 2], [2, 3], [3, 1]]", output: "Cycle detected", description: "Graph with cycle" }
    ]
  },
  {
    id: 412,
    title: "N-Queens Problem",
    difficulty: "Level 4",
    category: "Backtracking",
    points: 70,
    description: "Place n queens on an n×n chessboard so that no two queens threaten each other. Return all distinct solutions.",
    tags: ["Backtracking", "N-Queens", "Chess"],
    testCases: [
      { input: "4", output: "2", description: "2 solutions for 4-queens" },
      { input: "1", output: "1", description: "1 solution for 1-queen" },
      { input: "2", output: "0", description: "No solution for 2-queens" }
    ]
  },
  {
    id: 413,
    title: "Sudoku Solver",
    difficulty: "Level 4",
    category: "Backtracking",
    points: 65,
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells.",
    tags: ["Backtracking", "Sudoku", "Puzzle"],
    testCases: [
      { input: "[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]", output: "Solved", description: "Solve valid Sudoku puzzle" }
    ]
  },
  {
    id: 414,
    title: "Trie Implementation",
    difficulty: "Level 4",
    category: "Trie",
    points: 50,
    description: "Implement a Trie (prefix tree) data structure with insert, search, and startsWith operations.",
    tags: ["Trie", "Data Structure", "String"],
    testCases: [
      { input: "insert apple search apple search app startsWith app", output: "true false true", description: "Trie operations" },
      { input: "insert app search app", output: "true", description: "Simple insert and search" }
    ]
  },
  {
    id: 415,
    title: "Segment Tree",
    difficulty: "Level 4",
    category: "Segment Tree",
    points: 60,
    description: "Implement a segment tree to handle range sum queries and range updates efficiently.",
    tags: ["Segment Tree", "Range Queries", "Data Structure"],
    testCases: [
      { input: "[1, 3, 5, 7, 9, 11] sum 1 3 update 2 10 sum 1 3", output: "15 18", description: "Range sum and update operations" },
      { input: "[1, 2, 3, 4, 5] sum 0 4", output: "15", description: "Sum of entire array" }
    ]
  },
  {
    id: 416,
    title: "Fenwick Tree",
    difficulty: "Level 4",
    category: "Fenwick Tree",
    points: 55,
    description: "Implement a Fenwick Tree (Binary Indexed Tree) for efficient range sum queries and point updates.",
    tags: ["Fenwick Tree", "Range Queries", "Data Structure"],
    testCases: [
      { input: "[1, 3, 5, 7, 9, 11] sum 1 3 update 2 10 sum 1 3", output: "15 18", description: "Range sum and update operations" },
      { input: "[1, 2, 3, 4, 5] sum 0 4", output: "15", description: "Sum of entire array" }
    ]
  },
  {
    id: 417,
    title: "KMP Algorithm",
    difficulty: "Level 4",
    category: "String",
    points: 65,
    description: "Implement the Knuth-Morris-Pratt (KMP) algorithm for pattern searching in a text string.",
    tags: ["String", "KMP", "Pattern Matching"],
    testCases: [
      { input: "AABAACAADAABAABA AABA", output: "[0, 9, 12]", description: "Pattern found at indices 0, 9, 12" },
      { input: "ABCDEFG DEF", output: "[3]", description: "Pattern found at index 3" },
      { input: "ABCDEFG XYZ", output: "[]", description: "Pattern not found" }
    ]
  },
  {
    id: 418,
    title: "Bit Manipulation - Single Number",
    difficulty: "Level 4",
    category: "Bit Manipulation",
    points: 40,
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using bit manipulation.",
    tags: ["Bit Manipulation", "XOR", "Optimization"],
    testCases: [
      { input: "[2, 2, 1]", output: "1", description: "Single number is 1" },
      { input: "[4, 1, 2, 1, 2]", output: "4", description: "Single number is 4" },
      { input: "[1]", output: "1", description: "Single element" }
    ]
  },
  {
    id: 419,
    title: "Bit Manipulation - Power of Two",
    difficulty: "Level 4",
    category: "Bit Manipulation",
    points: 35,
    description: "Given an integer n, return true if it is a power of two. Otherwise, return false using bit manipulation.",
    tags: ["Bit Manipulation", "Power of Two", "Optimization"],
    testCases: [
      { input: "1", output: "true", description: "2^0 = 1" },
      { input: "16", output: "true", description: "2^4 = 16" },
      { input: "3", output: "false", description: "3 is not a power of 2" }
    ]
  },
  {
    id: 420,
    title: "Bit Manipulation - Count Set Bits",
    difficulty: "Level 4",
    category: "Bit Manipulation",
    points: 30,
    description: "Write a function that counts the number of set bits (1s) in an integer using bit manipulation.",
    tags: ["Bit Manipulation", "Count Bits", "Optimization"],
    testCases: [
      { input: "11", output: "3", description: "11 in binary is 1011 (3 set bits)" },
      { input: "128", output: "1", description: "128 in binary is 10000000 (1 set bit)" },
      { input: "0", output: "0", description: "0 has no set bits" }
    ]
  }
];

// Combine all problems into a single array
export const allProgrammingProblems = [
  ...programmingProblems,           // Level 1: 1-50
  ...level2Problems,               // Level 2: 51-200
  ...level3Problems,               // Level 3: 201-220
  ...level3AdditionalProblems,     // Level 3: 221-400
  ...level4Problems,               // Level 4: 401-420
  ...level4AdditionalProblems      // Level 4: 421-500
  // Removed allAdditionalProblems to avoid duplicate IDs
];

// Problem statistics
export const problemStats = {
  totalProblems: 500,
  level1Count: 50,
  level2Count: 150,
  level3Count: 200,
  level4Count: 100,
  categories: {
    "Basic Output": 1,
    "Arithmetic": 3,
    "Variables": 1,
    "Data Types": 1,
    "Conditionals": 4,
    "Loops": 3,
    "Strings": 8,
    "Arrays": 8,
    "Sorting": 4,
    "Numbers": 12,
    "Patterns": 15,
    "Recursion": 2,
    "Functions": 50,
    "2D Arrays": 6,
    "File I/O": 5,
    "OOP": 3,
    "Arrays & Hashing": 1,
    "Stack": 1,
    "Math": 1,
    "Dynamic Programming": 3,
    "Linked List": 2,
    "String": 3,
    "Tree": 1,
    "Graph": 2,
    "Greedy": 3,
    "Backtracking": 3,
    "Trie": 1,
    "Segment Tree": 1,
    "Fenwick Tree": 1,
    "Bit Manipulation": 3
  }
};

// Export individual level arrays for specific use cases
export { programmingProblems as level1Problems };
export { level2Problems }; 