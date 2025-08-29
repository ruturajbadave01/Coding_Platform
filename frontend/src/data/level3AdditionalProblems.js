// Additional Level 3 Problems (221-400)
// Data Structures and Algorithms

export const level3AdditionalProblems = [
  {
    id: 221,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Level 3",
    category: "Tree",
    points: 25,
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[1,null,2,3]", output: "[1,3,2]", description: "Basic inorder traversal" },
      { input: "[]", output: "[]", description: "Empty tree" },
      { input: "[1]", output: "[1]", description: "Single node" }
    ]
  },
  {
    id: 222,
    title: "Symmetric Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[1,2,2,3,4,4,3]", output: "true", description: "Symmetric tree" },
      { input: "[1,2,2,null,3,null,3]", output: "false", description: "Not symmetric" }
    ]
  },
  {
    id: 223,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 15,
    description: "Given the root of a binary tree, return its maximum depth.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", output: "3", description: "Maximum depth is 3" },
      { input: "[1,null,2]", output: "2", description: "Maximum depth is 2" }
    ]
  },
  {
    id: 224,
    title: "Convert Sorted Array to Binary Search Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 25,
    description: "Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.",
    tags: ["Tree", "Binary Search", "Recursion"],
    testCases: [
      { input: "[-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]", description: "Height-balanced BST" },
      { input: "[1,3]", output: "[3,1]", description: "Two elements" }
    ]
  },
  {
    id: 225,
    title: "Balanced Binary Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given a binary tree, determine if it is height-balanced.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", output: "true", description: "Height-balanced" },
      { input: "[1,2,2,3,3,null,null,4,4]", output: "false", description: "Not height-balanced" }
    ]
  },
  {
    id: 226,
    title: "Minimum Depth of Binary Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given a binary tree, find its minimum depth.",
    tags: ["Tree", "BFS", "Queue"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", output: "2", description: "Minimum depth is 2" },
      { input: "[2,null,3,null,4,null,5,null,6]", output: "5", description: "Minimum depth is 5" }
    ]
  },
  {
    id: 227,
    title: "Path Sum",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[5,4,8,11,null,13,4,7,2,null,null,null,1] 22", output: "true", description: "Path exists" },
      { input: "[1,2,3] 5", output: "false", description: "No path exists" }
    ]
  },
  {
    id: 228,
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Level 3",
    category: "Tree",
    points: 30,
    description: "Given the root of a binary tree, flatten the tree into a 'linked list' using the same TreeNode class.",
    tags: ["Tree", "Linked List", "Recursion"],
    testCases: [
      { input: "[1,2,5,3,4,null,6]", output: "[1,null,2,null,3,null,4,null,5,null,6]", description: "Flattened tree" },
      { input: "[]", output: "[]", description: "Empty tree" }
    ]
  },
  {
    id: 229,
    title: "Populating Next Right Pointers in Each Node",
    difficulty: "Level 3",
    category: "Tree",
    points: 25,
    description: "You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node.",
    tags: ["Tree", "BFS", "Level Order"],
    testCases: [
      { input: "[1,2,3,4,5,6,7]", output: "[1,#,2,3,#,4,5,6,7,#]", description: "Perfect binary tree" },
      { input: "[]", output: "[]", description: "Empty tree" }
    ]
  },
  {
    id: 230,
    title: "Binary Tree Level Order Traversal II",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given the root of a binary tree, return the bottom-up level order traversal of its nodes' values.",
    tags: ["Tree", "BFS", "Level Order"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", output: "[[15,7],[9,20],[3]]", description: "Bottom-up traversal" },
      { input: "[1]", output: "[[1]]", description: "Single node" }
    ]
  },
  {
    id: 231,
    title: "Construct Binary Tree from Inorder and Postorder Traversal",
    difficulty: "Level 3",
    category: "Tree",
    points: 35,
    description: "Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree.",
    tags: ["Tree", "Recursion", "Array"],
    testCases: [
      { input: "[9,3,15,20,7] [9,15,7,20,3]", output: "[3,9,20,null,null,15,7]", description: "Construct tree" },
      { input: "[-1] [-1]", output: "[-1]", description: "Single node" }
    ]
  },
  {
    id: 232,
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Level 3",
    category: "Tree",
    points: 35,
    description: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
    tags: ["Tree", "Recursion", "Array"],
    testCases: [
      { input: "[3,9,20,15,7] [9,3,15,20,7]", output: "[3,9,20,null,null,15,7]", description: "Construct tree" },
      { input: "[-1] [-1]", output: "[-1]", description: "Single node" }
    ]
  },
  {
    id: 233,
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Level 3",
    category: "Tree",
    points: 25,
    description: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values.",
    tags: ["Tree", "BFS", "Level Order"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]", description: "Zigzag traversal" },
      { input: "[1]", output: "[[1]]", description: "Single node" }
    ]
  },
  {
    id: 234,
    title: "Binary Tree Right Side View",
    difficulty: "Level 3",
    category: "Tree",
    points: 25,
    description: "Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
    tags: ["Tree", "BFS", "Level Order"],
    testCases: [
      { input: "[1,2,3,null,5,null,4]", output: "[1,3,4]", description: "Right side view" },
      { input: "[1,null,3]", output: "[1,3]", description: "Right side only" }
    ]
  },
  {
    id: 235,
    title: "Count Complete Tree Nodes",
    difficulty: "Level 3",
    category: "Tree",
    points: 30,
    description: "Given the root of a complete binary tree, return the number of the nodes in the tree.",
    tags: ["Tree", "Binary Search", "Optimization"],
    testCases: [
      { input: "[1,2,3,4,5,6]", output: "6", description: "Complete tree with 6 nodes" },
      { input: "[]", output: "0", description: "Empty tree" }
    ]
  },
  {
    id: 236,
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 35,
    description: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[3,5,1,6,2,0,8,null,null,7,4] 5 1", output: "3", description: "LCA is root" },
      { input: "[3,5,1,6,2,0,8,null,null,7,4] 5 4", output: "5", description: "LCA is 5" }
    ]
  },
  {
    id: 237,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 40,
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    tags: ["Tree", "String", "Recursion"],
    testCases: [
      { input: "[1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]", description: "Serialize and deserialize" },
      { input: "[]", output: "[]", description: "Empty tree" }
    ]
  },
  {
    id: 238,
    title: "Binary Tree Paths",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given the root of a binary tree, return all root-to-leaf paths in any order.",
    tags: ["Tree", "DFS", "String"],
    testCases: [
      { input: "[1,2,3,null,5]", output: "[\"1->2->5\",\"1->3\"]", description: "All paths" },
      { input: "[1]", output: "[\"1\"]", description: "Single node" }
    ]
  },
  {
    id: 239,
    title: "Sum of Left Leaves",
    difficulty: "Level 3",
    category: "Tree",
    points: 20,
    description: "Given the root of a binary tree, return the sum of all left leaves.",
    tags: ["Tree", "DFS", "Recursion"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", output: "24", description: "Sum of left leaves" },
      { input: "[1]", output: "0", description: "No left leaves" }
    ]
  },
  {
    id: 240,
    title: "Find Mode in Binary Search Tree",
    difficulty: "Level 3",
    category: "Tree",
    points: 25,
    description: "Given the root of a binary search tree (BST) with duplicates, return all the mode(s) (i.e., the most frequently occurred element) in it.",
    tags: ["Tree", "BST", "Inorder"],
    testCases: [
      { input: "[1,null,2,2]", output: "[2]", description: "Mode is 2" },
      { input: "[0]", output: "[0]", description: "Single node" }
    ]
  },
  {
    id: 241,
    title: "Number of Islands",
    difficulty: "Level 3",
    category: "Graph",
    points: 30,
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    tags: ["Graph", "DFS", "BFS"],
    testCases: [
      { input: "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", output: "1", description: "One island" },
      { input: "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3", description: "Three islands" }
    ]
  },
  {
    id: 242,
    title: "Course Schedule",
    difficulty: "Level 3",
    category: "Graph",
    points: 35,
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
    tags: ["Graph", "Topological Sort", "DFS"],
    testCases: [
      { input: "2 [[1,0]]", output: "true", description: "Can complete courses" },
      { input: "2 [[1,0],[0,1]]", output: "false", description: "Circular dependency" }
    ]
  },
  {
    id: 243,
    title: "Redundant Connection",
    difficulty: "Level 3",
    category: "Graph",
    points: 30,
    description: "In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added.",
    tags: ["Graph", "Union Find", "Disjoint Set"],
    testCases: [
      { input: "[[1,2],[1,3],[2,3]]", output: "[2,3]", description: "Redundant edge" },
      { input: "[[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]", description: "Redundant edge" }
    ]
  },
  {
    id: 244,
    title: "Graph Valid Tree",
    difficulty: "Level 3",
    category: "Graph",
    points: 30,
    description: "Given n nodes labeled from 0 to n-1 and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a valid tree.",
    tags: ["Graph", "Union Find", "DFS"],
    testCases: [
      { input: "5 [[0,1],[0,2],[0,3],[1,4]]", output: "true", description: "Valid tree" },
      { input: "5 [[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false", description: "Has cycle" }
    ]
  },
  {
    id: 245,
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "Level 3",
    category: "Graph",
    points: 25,
    description: "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the graph.",
    tags: ["Graph", "Union Find", "DFS"],
    testCases: [
      { input: "5 [[0,1],[1,2],[3,4]]", output: "2", description: "Two components" },
      { input: "5 [[0,1],[1,2],[2,3],[3,4]]", output: "1", description: "One component" }
    ]
  },
  {
    id: 246,
    title: "Clone Graph",
    difficulty: "Level 3",
    category: "Graph",
    points: 35,
    description: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
    tags: ["Graph", "DFS", "BFS"],
    testCases: [
      { input: "[[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", description: "Clone graph" },
      { input: "[[]]", output: "[[]]", description: "Single node" }
    ]
  },
  {
    id: 247,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Level 3",
    category: "Graph",
    points: 40,
    description: "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.",
    tags: ["Graph", "DFS", "BFS"],
    testCases: [
      { input: "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]", description: "Water flow points" },
      { input: "[[2,1],[1,2]]", output: "[[0,0],[0,1],[1,0],[1,1]]", description: "All points" }
    ]
  },
  {
    id: 248,
    title: "All Paths From Source to Target",
    difficulty: "Level 3",
    category: "Graph",
    points: 30,
    description: "Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n - 1, find all possible paths from node 0 to node n - 1 and return them in any order.",
    tags: ["Graph", "DFS", "Backtracking"],
    testCases: [
      { input: "[[1,2],[3],[3],[]]", output: "[[0,1,3],[0,2,3]]", description: "Two paths" },
      { input: "[[4,3,1],[3,2,4],[3],[4],[]]", output: "[[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]", description: "Multiple paths" }
    ]
  },
  {
    id: 249,
    title: "Reconstruct Itinerary",
    difficulty: "Level 3",
    category: "Graph",
    points: 35,
    description: "You are given a list of airline tickets where tickets[i] = [fromi, toi] represent the departure and arrival airports of one flight. Reconstruct the itinerary in order and return it.",
    tags: ["Graph", "DFS", "Eulerian Path"],
    testCases: [
      { input: "[[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]", output: "[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]", description: "Valid itinerary" },
      { input: "[[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]", output: "[\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]", description: "Valid itinerary" }
    ]
  },
  {
    id: 250,
    title: "Min Cost to Connect All Points",
    difficulty: "Level 3",
    category: "Graph",
    points: 35,
    description: "You are given an array points representing integer coordinates of some points on a 2D-plane, where points[i] = [xi, yi]. The cost of connecting two points [xi, yi] and [xj, yj] is the manhattan distance between them.",
    tags: ["Graph", "Minimum Spanning Tree", "Prim's Algorithm"],
    testCases: [
      { input: "[[0,0],[2,2],[3,10],[5,2],[7,0]]", output: "20", description: "Minimum cost" },
      { input: "[[3,12],[-2,5],[-4,1]]", output: "18", description: "Minimum cost" }
    ]
  }
]; 