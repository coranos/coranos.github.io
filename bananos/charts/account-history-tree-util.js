
// Get the data from our JSON file
const genesisAccount = 'ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr';

var rootAccount = genesisAccount;

var url = new URL(window.location);
var accountUrlParam = url.searchParams.get("account");
if (accountUrlParam != undefined) {
  rootAccount = accountUrlParam;
}


const nodeDataMap = {};

function getNodeDataMap(jsonData) {
  if(Object.keys(nodeDataMap).length > 0) {
    return nodeDataMap;
  }
  
  jsonData.forEach(function(d) {
    var child = {};
    child.account = d.account;
    child.balance = parseInt(d.balance);
    child.history = d.history;
    child.children = [];
    child.size = child.balance;
    child.balance_sent = 0;
    for (const [account, balance] of Object.entries(child.history)) {
      if(account != child.account) {
        child.balance_sent += parseInt(balance);
      }
    }
    child.name = [];
    child.name.push(name(child.account) + '=' + formatBytes3(child.balance));
    child.name.push('sent ' + formatBytes3(child.balance_sent));
    // console.log(name(child.account) , formatBytes3(child.size));
    nodeDataMap[d.account] = child;
  });
  return nodeDataMap;
}

function addChildren(nodeDataMap,ancestorSet,parentFrontierSet,depth) {
  console.log("addChildren",depth,parentFrontierSet.size);
//  console.log("addChildren",ancestorSet,parentFrontierSet,depth);
  const childFrontierSet = new Set();
  
  const childDepth = depth + 1;

  if(parentFrontierSet.size == 0 ) {
    return;
  }
  
//  if(childDepth > 6) {
//    return;
//  }
  
  parentFrontierSet.forEach(function(parentAccount) {
      const parent = nodeDataMap[parentAccount];
      for (const [childAccount, balance] of Object.entries(parent.history)) {
        if(nodeDataMap.hasOwnProperty(childAccount)) {
          const child = nodeDataMap[childAccount];          
          if(!ancestorSet.has(childAccount)) {
            if(!parentFrontierSet.has(childAccount)) {
              if(child.childDepth == undefined) {
                parent.children.push(child);
                child.childDepth = childDepth;
                childFrontierSet.add(childAccount);
              }
            }
          }
        }
      }
      ancestorSet.add(parentAccount);
  });

  addChildren(nodeDataMap,ancestorSet,childFrontierSet,childDepth);
}

function getSum(node) {
  let total = 0;
  if(node.size != undefined) {
    total += getSize(node);
  }
  node.children.forEach(function(child) {
    total += getSum(child);
  });
}

function getSize(node) {
  if(node.children.length == 0) {
    return node.balance + node.balance_sent;
  } else {
    return undefined;
  }
}

function copyNode(node,depth) {
  const copy = {};
  copy.name = node.name;
  copy.account = node.account;
  copy.balance = node.balance;
  copy.balance_sent = node.balance_sent;
  copy.size = node.size;
  copy.children = [];
  if(depth == 0) {
    return copy;
  }
  node.children.forEach(function(child) {
    const childCopy = copyNode(child,depth-1);
    childCopy.parent = node;
    copy.children.push(childCopy);
  });
  
  copy.size = getSize(copy);
  
  // copy.name = name(copy.account) + ' ' + formatBytes3(copy.size);
  return copy;
}

function loadDataMap(response) {
  const nodeDataMap = getNodeDataMap(response.results);
  const rootData = nodeDataMap[rootAccount];
  const ancestorSet = new Set();
  const parentFrontierSet = new Set();
  ancestorSet.add(rootAccount);
  parentFrontierSet.add(rootAccount);
  addChildren(nodeDataMap,ancestorSet,parentFrontierSet,0);
}