// Utility function to validate programming problem data
import { allProgrammingProblems } from '../data/allProgrammingProblems.js';

export function validateProgrammingProblems() {
  const ids = allProgrammingProblems.map(problem => problem.id);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    // Find duplicates
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const duplicateIds = [...new Set(duplicates)];
    
    console.error('❌ Duplicate IDs found:', duplicateIds);
    console.error('Total problems:', ids.length);
    console.error('Unique IDs:', uniqueIds.size);
    
    // Show which problems have duplicate IDs
    duplicateIds.forEach(duplicateId => {
      const problemsWithId = allProgrammingProblems.filter(p => p.id === duplicateId);
      console.error(`ID ${duplicateId} appears ${problemsWithId.length} times:`);
      problemsWithId.forEach((problem, index) => {
        console.error(`  ${index + 1}. ${problem.title} (${problem.difficulty})`);
      });
    });
    
    return false;
  }
  
  console.log('✅ All programming problem IDs are unique!');
  console.log(`Total problems: ${ids.length}`);
  return true;
}

export function getProblemStats() {
  const stats = {
    total: allProgrammingProblems.length,
    byDifficulty: {},
    byCategory: {},
    idRange: {
      min: Math.min(...allProgrammingProblems.map(p => p.id)),
      max: Math.max(...allProgrammingProblems.map(p => p.id))
    }
  };
  
  allProgrammingProblems.forEach(problem => {
    // Count by difficulty
    stats.byDifficulty[problem.difficulty] = (stats.byDifficulty[problem.difficulty] || 0) + 1;
    
    // Count by category
    stats.byCategory[problem.category] = (stats.byCategory[problem.category] || 0) + 1;
  });
  
  return stats;
}
