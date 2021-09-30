const maxLevel = 20;

const xpToNextLevels  = [
  300,
  900,
  2700,
  6500,
  14000,
  23000,
  34000,
  48000,
  64000,
  85000,
  100000,
  120000,
  140000,
  165000,
  195000,
  225000,
  265000,
  305000,
  355000
];

const xpFromChallengeRatings = [
  50,
  200,
  450,
  700,
  1100,
  1800,
  2300,
  2900,
  3900,
  5000,
  5900
];

const xpPerDays = [
  300,
  600,
  1200,
  1700,
  3500,
  4000,
  5000,
  6000,
  7500,
  9000,
  10500,
  11500,
  13500,
  15000,
  18000,
  20000,
  25000,
  27000,
  30000,
  40000
];

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomInt = (min, max) => {
  return Math.floor(getRandom(Math.floor(min), Math.floor(max)));
};

const onLoad = () => {
  loadXpTable();
  // const table = document.querySelector('#fight_table');
  // const headerRow = addChildElement(table, 'tr');
  // addChildElement(headerRow,'td','person number');
  // for(let personIx = 0; personIx < populationCap; personIx++) {
  //   const row = addChildElement(table, 'tr');
  //   row.setAttribute('id', 'person' + personIx);
  //   addChildElement(row,'td',personIx);
  // }
  // for(let fightIx = 0; fightIx < numFights; fightIx++) {
  //   let personAIx = getRandomInt(0, populationCap);
  //   let personBIx = getRandomInt(0, populationCap);
  //   if(personAIx == personBIx) {
  //     personBIx = (personBIx + 1) % populationCap;
  //   }
  //   const personA = document.querySelector('#person' + personAIx);
  //   const personB = document.querySelector('#person' + personBIx);
  // }
}

const loadXpTable = () => {
  const table = document.querySelector('#xp_table');
  const headerRow = addChildElement(table, 'tr');
  addChildElement(headerRow,'td','level');
  addChildElement(headerRow,'td','xpToNextLevel');
  addChildElement(headerRow,'td','xpFromChallengeRating');
  addChildElement(headerRow,'td','xpPerDay');
  addChildElement(headerRow,'td','fightsPerDay');
  addChildElement(headerRow,'td','fightsPerLevel');
  addChildElement(headerRow,'td','daysPerLevel');
  addChildElement(headerRow,'td','fightsPerPersonTotal');
  addChildElement(headerRow,'td','daysTotal');
  addChildElement(headerRow,'td','fightsBelowLevelTotal');
  let fightsPerPersonTotal = 0;
  let fightsBelowLevelTotal = 1;
  let daysTotal = 0;
  for(let level = 1; level <= maxLevel; level++) {
    const xpToNextLevel = xpToNextLevels[level-1];
    const xpFromChallengeRating = xpFromChallengeRatings[Math.floor((level-1)/2)];
    const xpPerDay = xpPerDays[level-1];
    const fightsPerDay = Math.floor(xpPerDay / xpFromChallengeRating);
    const fightsPerLevel = Math.ceil(xpToNextLevel/xpFromChallengeRating);
    const daysPerLevel = Math.ceil(fightsPerLevel/fightsPerDay);
    fightsBelowLevelTotal *= fightsPerLevel;
    fightsPerPersonTotal += fightsPerLevel;
    daysTotal += daysPerLevel;
    const row = addChildElement(table, 'tr');
    addChildElement(row,'td',level);
    addChildElement(row,'td',xpToNextLevel);
    addChildElement(row,'td',xpFromChallengeRating);
    addChildElement(row,'td',xpPerDay);
    addChildElement(row,'td',fightsPerDay);
    addChildElement(row,'td',fightsPerLevel);
    addChildElement(row,'td',daysPerLevel);
    addChildElement(row,'td',fightsPerPersonTotal);
    addChildElement(row,'td',daysTotal);
    addChildElement(row,'td',fightsBelowLevelTotal);
  }
};
