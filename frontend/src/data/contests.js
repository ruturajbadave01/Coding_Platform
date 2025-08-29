export const contests = [
  {
    id: 1,
    title: "CSE Programming Challenge 2024",
    description: "A comprehensive programming contest covering data structures, algorithms, and problem-solving skills. Open to all CSE students.",
    department: "CSE",
    startDate: "2024-12-20T10:00:00",
    endDate: "2024-12-20T14:00:00",
    duration: 240, // minutes
    maxParticipants: 100,
    difficulty: "Medium",
    currentParticipants: 45,
    status: "upcoming", // upcoming, ongoing, completed
    problems: [
      {
        id: 1,
        title: "Array Rotation",
        questionType: "coding",
        difficulty: "Easy",
        points: 10,
        timeLimit: 1000,
        memoryLimit: 256
      },
      {
        id: 2,
        title: "Binary Search Implementation",
        questionType: "coding",
        difficulty: "Medium",
        points: 20,
        timeLimit: 2000,
        memoryLimit: 512
      },
      {
        id: 3,
        title: "Data Structure Fundamentals",
        questionType: "mcq",
        difficulty: "Easy",
        points: 15,
        mcqOptions: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 2,
    title: "IT Code Sprint",
    description: "Fast-paced coding competition focusing on quick problem-solving and efficient algorithms.",
    department: "IT",
    startDate: "2024-12-22T09:00:00",
    endDate: "2024-12-22T12:00:00",
    duration: 180,
    maxParticipants: 80,
    difficulty: "Hard",
    currentParticipants: 32,
    status: "upcoming",
    problems: [
      {
        id: 4,
        title: "Dynamic Programming Basics",
        questionType: "coding",
        difficulty: "Medium",
        points: 25,
        timeLimit: 3000,
        memoryLimit: 512
      },
      {
        id: 5,
        title: "Graph Traversal",
        questionType: "mcq",
        difficulty: "Hard",
        points: 30,
        mcqOptions: ["DFS", "BFS", "Both", "Neither"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 3,
    title: "AI/ML Coding Contest",
    description: "Specialized contest focusing on machine learning algorithms and data science problems.",
    department: "AI/ML",
    startDate: "2024-12-25T14:00:00",
    endDate: "2024-12-25T17:00:00",
    duration: 180,
    maxParticipants: 60,
    difficulty: "Expert",
    currentParticipants: 28,
    status: "upcoming",
    problems: [
      {
        id: 6,
        title: "Neural Network Basics",
        questionType: "mcq",
        difficulty: "Medium",
        points: 20,
        mcqOptions: ["Perceptron", "CNN", "RNN", "All of above"],
        correctAnswer: 3
      },
      {
        id: 7,
        title: "Data Preprocessing",
        questionType: "coding",
        difficulty: "Hard",
        points: 35,
        timeLimit: 5000,
        memoryLimit: 1024
      }
    ]
  },
  {
    id: 4,
    title: "CSE Algorithm Mastery",
    description: "Advanced algorithm contest for experienced programmers. Test your skills with complex problem-solving.",
    department: "CSE",
    startDate: "2024-12-18T15:00:00",
    endDate: "2024-12-18T18:00:00",
    duration: 180,
    maxParticipants: 50,
    difficulty: "Expert",
    currentParticipants: 23,
    status: "ongoing",
    problems: [
      {
        id: 8,
        title: "Advanced Graph Algorithms",
        questionType: "coding",
        difficulty: "Expert",
        points: 50,
        timeLimit: 8000,
        memoryLimit: 1024
      },
      {
        id: 9,
        title: "Competitive Programming",
        questionType: "mcq",
        difficulty: "Hard",
        points: 25,
        mcqOptions: ["Greedy", "DP", "Divide & Conquer", "All"],
        correctAnswer: 3
      }
    ]
  }
];

export const getContestsByDepartment = (department) => {
  return contests.filter(contest => contest.department === department);
};

export const getContestById = (id) => {
  return contests.find(contest => contest.id === id);
};

export const getContestsByStatus = (status) => {
  return contests.filter(contest => contest.status === status);
}; 