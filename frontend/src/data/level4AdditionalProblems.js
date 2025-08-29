// Additional Level 4 Problems (421-500)
// Advanced Algorithms & Data Structures

export const level4AdditionalProblems = [
  {
    id: 421,
    title: "Advanced Dynamic Programming - Edit Distance",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 45,
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
    tags: ["Dynamic Programming", "String", "Edit Distance"],
    testCases: [
      { input: "horse ros", output: "3", description: "horse -> rorse -> rose -> ros" },
      { input: "intention execution", output: "5", description: "intention -> inention -> enention -> exention -> exection -> execution" }
    ]
  },
  {
    id: 422,
    title: "Advanced Dynamic Programming - Longest Common Subsequence",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 40,
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    tags: ["Dynamic Programming", "String", "LCS"],
    testCases: [
      { input: "abcde ace", output: "3", description: "LCS is ace" },
      { input: "abc abc", output: "3", description: "LCS is abc" },
      { input: "abc def", output: "0", description: "No common subsequence" }
    ]
  },
  {
    id: 423,
    title: "Advanced Dynamic Programming - Longest Palindromic Subsequence",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 40,
    description: "Given a string s, find the longest palindromic subsequence's length in s. A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.",
    tags: ["Dynamic Programming", "String", "Palindrome"],
    testCases: [
      { input: "bbbab", output: "4", description: "bbbb is the longest palindromic subsequence" },
      { input: "cbbd", output: "2", description: "bb is the longest palindromic subsequence" }
    ]
  },
  {
    id: 424,
    title: "Advanced Dynamic Programming - Word Break",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 35,
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    tags: ["Dynamic Programming", "String", "Hash Set"],
    testCases: [
      { input: "leetcode [\"leet\",\"code\"]", output: "true", description: "leetcode can be segmented as leet code" },
      { input: "applepenapple [\"apple\",\"pen\"]", output: "true", description: "applepenapple can be segmented as apple pen apple" },
      { input: "catsandog [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false", description: "Cannot be segmented" }
    ]
  },
  {
    id: 425,
    title: "Advanced Dynamic Programming - Coin Change",
    difficulty: "Level 4",
    category: "Dynamic Programming",
    points: 35,
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    tags: ["Dynamic Programming", "Greedy", "Coin Change"],
    testCases: [
      { input: "[1,2,5] 11", output: "3", description: "11 = 5 + 5 + 1" },
      { input: "[2] 3", output: "-1", description: "Cannot make amount 3" },
      { input: "[1] 0", output: "0", description: "No coins needed" }
    ]
  },
  {
    id: 426,
    title: "Advanced Graph - Network Delay Time",
    difficulty: "Level 4",
    category: "Graph",
    points: 40,
    description: "You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.",
    tags: ["Graph", "Dijkstra's Algorithm", "Shortest Path"],
    testCases: [
      { input: "[[2,1,1],[2,3,1],[3,4,1]] 4 2", output: "2", description: "Signal reaches all nodes in 2 time units" },
      { input: "[[1,2,1]] 2 1", output: "1", description: "Signal reaches node 2 in 1 time unit" },
      { input: "[[1,2,1]] 2 2", output: "-1", description: "Signal cannot reach node 1" }
    ]
  },
  {
    id: 427,
    title: "Advanced Graph - Cheapest Flights Within K Stops",
    difficulty: "Level 4",
    category: "Graph",
    points: 40,
    description: "There are n cities connected by some number of flights. You are given an array flights where flights[i] = [fromi, toi, pricei] indicates that there is a flight from city fromi to city toi with cost pricei.",
    tags: ["Graph", "Bellman-Ford", "Shortest Path"],
    testCases: [
      { input: "4 [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]] 0 3 1", output: "700", description: "Cheapest path with at most 1 stop" },
      { input: "3 [[0,1,100],[1,2,100],[0,2,500]] 0 2 1", output: "200", description: "Cheapest path with at most 1 stop" },
      { input: "3 [[0,1,100],[1,2,100],[0,2,500]] 0 2 0", output: "500", description: "Direct flight only" }
    ]
  },
  {
    id: 428,
    title: "Advanced Graph - Number of Ways to Arrive at Destination",
    difficulty: "Level 4",
    category: "Graph",
    points: 45,
    description: "You are in a city that consists of n intersections numbered from 0 to n - 1 with bi-directional roads between some intersections. The inputs are generated such that you can reach any intersection from any other intersection and that there is at most one road between any two intersections.",
    tags: ["Graph", "Dijkstra's Algorithm", "Shortest Path"],
    testCases: [
      { input: "7 [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]", output: "4", description: "4 different ways to reach destination" },
      { input: "2 [[1,0,10]]", output: "1", description: "Only one way" }
    ]
  },
  {
    id: 429,
    title: "Advanced Tree - Binary Tree Maximum Path Sum",
    difficulty: "Level 4",
    category: "Tree",
    points: 45,
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[1,2,3]", output: "6", description: "Path 2-1-3" },
      { input: "[-10,9,20,null,null,15,7]", output: "42", description: "Path 15-20-7" }
    ]
  },
  {
    id: 430,
    title: "Advanced Tree - Serialize and Deserialize N-ary Tree",
    difficulty: "Level 4",
    category: "Tree",
    points: 40,
    description: "Design an algorithm to serialize and deserialize an N-ary tree. An N-ary tree is a rooted tree in which each node has no more than N children.",
    tags: ["Tree", "String", "Recursion"],
    testCases: [
      { input: "[1,null,3,2,4,null,5,6]", output: "[1,null,3,2,4,null,5,6]", description: "Serialize and deserialize" },
      { input: "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]", output: "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]", description: "Complex tree" }
    ]
  },
  {
    id: 431,
    title: "Advanced String - Regular Expression Matching",
    difficulty: "Level 4",
    category: "String",
    points: 50,
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
    tags: ["String", "Dynamic Programming", "Regular Expression"],
    testCases: [
      { input: "aa a", output: "false", description: "No match" },
      { input: "aa a*", output: "true", description: "Matches" },
      { input: "ab .*", output: "true", description: "Matches" }
    ]
  },
  {
    id: 432,
    title: "Advanced String - Wildcard Matching",
    difficulty: "Level 4",
    category: "String",
    points: 45,
    description: "Given an input string s and a pattern p, implement wildcard pattern matching with support for '?' and '*' where '?' matches any single character and '*' matches any sequence of characters (including the empty sequence).",
    tags: ["String", "Dynamic Programming", "Wildcard"],
    testCases: [
      { input: "aa a", output: "false", description: "No match" },
      { input: "aa *", output: "true", description: "Matches" },
      { input: "cb ?a", output: "false", description: "No match" }
    ]
  },
  {
    id: 433,
    title: "Advanced String - Minimum Window Substring",
    difficulty: "Level 4",
    category: "String",
    points: 45,
    description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    tags: ["String", "Sliding Window", "Hash Table"],
    testCases: [
      { input: "ADOBECODEBANC ABC", output: "BANC", description: "Minimum window containing all characters" },
      { input: "a a", output: "a", description: "Single character" },
      { input: "a aa", output: "", description: "No valid window" }
    ]
  },
  {
    id: 434,
    title: "Advanced String - Substring with Concatenation of All Words",
    difficulty: "Level 4",
    category: "String",
    points: 50,
    description: "You are given a string s and an array of strings words. All the strings of words are of the same length. A concatenated substring in s is a substring that contains all the strings of any permutation of words concatenated.",
    tags: ["String", "Sliding Window", "Hash Table"],
    testCases: [
      { input: "barfoothefoobarman [\"foo\",\"bar\"]", output: "[0,9]", description: "Substrings starting at index 0 and 9" },
      { input: "wordgoodgoodgoodbestword [\"word\",\"good\",\"best\",\"word\"]", output: "[]", description: "No valid substring" },
      { input: "barfoofoobarthefoobarman [\"bar\",\"foo\",\"the\"]", output: "[6,9,12]", description: "Multiple valid substrings" }
    ]
  },
  {
    id: 435,
    title: "Advanced Array - Trapping Rain Water",
    difficulty: "Level 4",
    category: "Arrays",
    points: 45,
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    tags: ["Array", "Two Pointers", "Dynamic Programming"],
    testCases: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", description: "Can trap 6 units of water" },
      { input: "[4,2,0,3,2,5]", output: "9", description: "Can trap 9 units of water" }
    ]
  },
  {
    id: 436,
    title: "Advanced Array - Largest Rectangle in Histogram",
    difficulty: "Level 4",
    category: "Arrays",
    points: 45,
    description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    tags: ["Array", "Stack", "Monotonic Stack"],
    testCases: [
      { input: "[2,1,5,6,2,3]", output: "10", description: "Largest rectangle has area 10" },
      { input: "[2,4]", output: "4", description: "Largest rectangle has area 4" }
    ]
  },
  {
    id: 437,
    title: "Advanced Array - Maximal Rectangle",
    difficulty: "Level 4",
    category: "Arrays",
    points: 50,
    description: "Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
    tags: ["Array", "Stack", "Dynamic Programming"],
    testCases: [
      { input: "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]", output: "6", description: "Largest rectangle has area 6" },
      { input: "[[\"0\"]]", output: "0", description: "No rectangle with 1's" },
      { input: "[[\"1\"]]", output: "1", description: "Single 1" }
    ]
  },
  {
    id: 438,
    title: "Advanced Array - Sliding Window Maximum",
    difficulty: "Level 4",
    category: "Arrays",
    points: 40,
    description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.",
    tags: ["Array", "Queue", "Monotonic Queue"],
    testCases: [
      { input: "[1,3,-1,-3,5,3,6,7] 3", output: "[3,3,5,5,6,7]", description: "Maximum values in each window" },
      { input: "[1] 1", output: "[1]", description: "Single element" }
    ]
  },
  {
    id: 439,
    title: "Advanced Array - Median of Two Sorted Arrays",
    difficulty: "Level 4",
    category: "Arrays",
    points: 50,
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    testCases: [
      { input: "[1,3] [2]", output: "2.0", description: "Median is 2.0" },
      { input: "[1,2] [3,4]", output: "2.5", description: "Median is 2.5" }
    ]
  },
  {
    id: 440,
    title: "Advanced Array - Merge k Sorted Lists",
    difficulty: "Level 4",
    category: "Arrays",
    points: 45,
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    tags: ["Array", "Linked List", "Heap"],
    testCases: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", description: "Merged sorted list" },
      { input: "[]", output: "[]", description: "Empty list" },
      { input: "[[]]", output: "[]", description: "Empty list" }
    ]
  }
]; 