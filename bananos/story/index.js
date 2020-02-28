'use strict';

const fables = require('./aesop.json');

let descCount = 0;
let fableCount = 0;

fables.forEach((fable) => {
  fableCount ++;
  descCount += fable.description.length;
});

console.log('fableCount', fableCount);
console.log('descCount', descCount);
