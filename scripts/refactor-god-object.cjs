const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('grep -rl "usePokemonContext" src/').toString().split('\n').filter(Boolean);

const hookMapping = {
  // Data
  pokemonList: 'useData',
  loading: 'useData',
  loadPokemon: 'useData',
  allPokemonNames: 'useData',
  searchResults: 'useData',
  searchTerm: 'useData',
  handleSearch: 'useData',
  clearSearch: 'useData',
  // Economy
  coins: 'useEconomy',
  addCoins: 'useEconomy',
  removeCoins: 'useEconomy',
  spendCoins: 'useEconomy',
  inventory: 'useEconomy',
  addItem: 'useEconomy',
  removeItem: 'useEconomy',
  bankBalance: 'useEconomy',
  deposit: 'useEconomy',
  withdraw: 'useEconomy',
  calculateDailyInterest: 'useEconomy',
  interestRate: 'useEconomy',
  // Collection (and Squad aggregated in CollectionProvider)
  ownedIds: 'useDomainCollection',
  setOwnedIds: 'useDomainCollection',
  toggleOwned: 'useDomainCollection',
  squadIds: 'useDomainCollection',
  addToSquad: 'useDomainCollection',
  removeFromSquad: 'useDomainCollection',
  isInSquad: 'useDomainCollection',
  isSquadFull: 'useDomainCollection',
  // Experience
  gainExperience: 'useExperience',
  getPokemonLevel: 'useExperience',
  getExpForNextLevel: 'useExperience',
  getStatsForLevel: 'useExperience',
  // UI
  isConsoleOpen: 'useUI',
  toggleConsole: 'useUI',
  toasts: 'useUI',
  removeToast: 'useUI',
  showSuccess: 'useUI',
  showError: 'useUI',
  showInfo: 'useUI',
  showWarning: 'useUI',
  showQuest: 'useUI',
  showCoins: 'useUI',
  // Progress
  quests: 'useProgress',
  updateQuestProgress: 'useProgress',
  completeQuest: 'useProgress',
  dailyReward: 'useProgress',
  // Town
  townObjects: 'useDomainTown',
  addObject: 'useDomainTown',
  removeObject: 'useDomainTown',
  // Care (Care array returned usually as is? Actually `useCare` returns tools etc)
  careState: 'useCare', // Not directly destructured usually, but let's check
  cleanPokemon: 'useCare',
  feedPokemon: 'useCare',
  playWithPokemon: 'useCare',
  getHappiness: 'useCare',
  getCleanliness: 'useCare',
  healAll: 'useCare',
};

// Handlers for sell/evolve orchestration
const ACTIONS = ['sellPokemon', 'evolvePokemon'];
hookMapping.sellPokemon = 'useGlobalActions';
hookMapping.evolvePokemon = 'useGlobalActions';
hookMapping.getPokemonDetails = 'useData'; // actually getPokemonDetails is in api.js, but exposed or not? Not in provider.

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip the hooks/usePokemonContext.js itself
  if (file.includes('hooks/usePokemonContext.js') || file.includes('contexts/__tests__')) continue;

  const importRegex = /import\s+\{\s*usePokemonContext\s*\}\s+from\s+['"]([^'"]+)['"];?/g;
  const usageRegex = /(?:const|let)\s+\{\s*([^}]+)\s*\}\s*=\s*usePokemonContext\(\)\s*;/g;
  const directUsageRegex = /(?:const|let)\s+(\w+)\s*=\s*usePokemonContext\(\)\s*;/g;

  let hasChanges = false;
  let importsToAdd = new Set();
  
  // Find all destructurings
  let match;
  let replacements = [];
  while ((match = usageRegex.exec(content)) !== null) {
    const destructuredStr = match[1];
    const props = destructuredStr.split(',').map(s => s.trim().split(':')[0].trim()).filter(Boolean);
    
    // Group properties by their ideal hook
    const groups = {};
    for (const prop of props) {
      const hookName = hookMapping[prop];
      if (!hookName) {
        console.warn(`WARNING: Unknown prop '${prop}' in ${file}`);
        continue;
      }
      if (!groups[hookName]) groups[hookName] = [];
      groups[hookName].push(prop);
      importsToAdd.add(hookName);
    }
    
    // Generate new statements
    const newStatements = [];
    for (const hook in groups) {
      newStatements.push(`const { ${groups[hook].join(', ')} } = ${hook}();`);
    }
    
    replacements.push({
      old: match[0],
      new: newStatements.join('\n  ')
    });
  }
  
  // Also check for empty `usePokemonContext();`
  let emptyMatch = content.match(/usePokemonContext\(\)\s*;/g);
  if (emptyMatch && emptyMatch.length > 0) {
     for (const em of emptyMatch) {
        replacements.push({ old: em, new: '' });
     }
  }

  // Replace usages
  for (const r of replacements) {
    content = content.replace(r.old, r.new);
    hasChanges = true;
  }
  
  if (hasChanges && importsToAdd.size > 0) {
    // Generate import logic. We'll import from the root /contexts/DomainContexts or new useGlobalActions
    const hooksArr = Array.from(importsToAdd);
    
    // Find path to src
    const parts = file.split('/');
    const depth = parts.length - 2; // -1 for filename, -1 because src is inside
    const relativePrefix = depth === 0 ? './' : '../'.repeat(depth - 1); // wait, if file is inside src/components/ Navbar, depth=2, want '../'
    
    const relativeToSrc = file.includes('src/') ? file.split('src/')[1] : '';
    const fileDepth = relativeToSrc.split('/').length - 1;
    let importPrefix = fileDepth === 0 ? './' : '../'.repeat(fileDepth);

    const normalHooks = hooksArr.filter(h => h !== 'useGlobalActions');
    const actionHooks = hooksArr.filter(h => h === 'useGlobalActions');

    let newImports = '';
    if (normalHooks.length > 0) {
      newImports += `import { ${normalHooks.join(', ')} } from '${importPrefix}contexts/DomainContexts';\n`;
    }
    if (actionHooks.length > 0) {
      newImports += `import { useGlobalActions } from '${importPrefix}hooks/useGlobalActions';\n`;
    }
    
    // Replace old import
    content = content.replace(importRegex, newImports.trimEnd());
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
