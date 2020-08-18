/* PARSING FORMULAE INTO TREES */
function buildTreeFromString(formula) {
  let array = buildArray(formula);
  let index = buildIndexArray(array);
  // set up tree object to then pass to recursive function buildTree
  let tree = { value: array, children: [], arrayIndex: index };
  buildTree(tree);
  return tree;
}

// convert input string into array
function buildArray(formula) {
  // replace true and false with 0 and 1 for parsing
  formula = formula.replace(/false/g, "0").replace(/true/g, "1");
  // remove spaces and convert to array
  return formula.replace(/\s/g, '').split('');
}

// indexes from array put into index with offset added for true and false
function buildIndexArray(formulaAsArray) {
  let index = [];

  for (let j=0, k=0; j<formulaAsArray.length; j++, k++) {
    index.push(k);
    if (formulaAsArray[j] === '0') {
      k += 4;
    } else if (formulaAsArray[j] === '1') {
      k += 3;
    }
  }
  return index;
}

// take node with long value and convert into single value and children
function buildTree(node) {
  if (node.value.length == 1) {
    node.value = node.value[0];
    node.arrayIndex = node.arrayIndex[0];
  } else if (findHighestSymbol(node.value)) {
    let topNodeSymbol = findHighestSymbol(node.value);
    setNodeAndChildren(node, topNodeSymbol);
    node.children.forEach(child => buildTree(child));
  } else {
    removeBrackets(node);
    buildTree(node);
  }
}

function removeBrackets(node) {
  if (node.value[0] == '(' && node.value[node.value.length-1] == ')') {
    node.value.shift(); //removes opening bracket
    node.value.pop(); //removes closing bracket
    node.arrayIndex.shift() // removes index of opening bracket
    node.arrayIndex.pop() // removes index of closing bracket
  }
}

function findSymbol(nodeValue, symbol) {
  let inBrackets = 0;
  for (i=0; i<nodeValue.length; i++) {
    if (nodeValue[i] == '(') {
      inBrackets += 1;
    } else if (nodeValue[i] == ')') {
      inBrackets -= 1;
    }
    if ((nodeValue[i] === symbol) && (inBrackets === 0)) {
      return true;
    }
  }
  return false;
}

const symbolPrecedenceLookup = ['⇔', '⇒', '∨', '∧', '¬']; //ordering important

function findHighestSymbol(nodeValue) {
  for (let i=0; i<symbolPrecedenceLookup.length; i++) {
    if (findSymbol(nodeValue, symbolPrecedenceLookup[i])) {
      return symbolPrecedenceLookup[i];
    }
  }
  return false;
}

function setNodeAndChildren(node,symbol) {
  let leftChild = { value: [], children: [], arrayIndex: [] };
  let rightChild = { value: [], children: [], arrayIndex: [] };
  let inBrackets = 0;
  // finds symbol, puts left of symbol in leftChild, right of symbol in rightChild
  for (i=0; i<node.value.length; i++) {
    if (node.value[i] == '(') {
      inBrackets += 1;
    } else if (node.value[i] == ')') {
      inBrackets -= 1;
    }
    if ((node.value[i] == symbol) && (inBrackets == 0)) {
      for (j=0; j<i; j++) {
        leftChild.value.push(node.value[j]);
        leftChild.arrayIndex.push(node.arrayIndex[j]);
      }
      for (k=i+1; k<node.value.length; k++) {
        rightChild.value.push(node.value[k]);
        rightChild.arrayIndex.push(node.arrayIndex[k]);
      }
      if (leftChild.value.length != 0) {  //for case when it's negation, only one child
        node.children.push(leftChild);
      }
      node.children.push(rightChild);
      node.value = symbol;
      node.arrayIndex = node.arrayIndex[i];
    }
  }
}


/* CONVERTING TREE BACK TO STRING */
function lowerPrecedence(node, parentNode) {
  if (node === undefined || parentNode === undefined) return false;
  if (isSymbol(node.value)) {
    if (symbolPrecedenceLookup.indexOf(node.value)<=symbolPrecedenceLookup.indexOf(parentNode.value)) {
      return true;
    }
  }
  return false;
}

function isSymbol(value) {
  return symbolPrecedenceLookup.includes(value);
}

function convertTreeToString(rootNode) {
  let treeChangedToString = '';
  if (rootNode.children === undefined || rootNode.children.length === 0) {
    treeChangedToString = rootNode.value;
  } else {
    buildString(rootNode);
  }
  // return any parsed 0s and 1s back to true and false
  treeChangedToString = treeChangedToString.replace(/0/g, "false").replace(/1/g, "true");
  return treeChangedToString;

  // recursive function to add nodes to treeChangedToString
  function buildString(node, parentNode) {
    if (node === undefined)
      return; //base case to stop recursion when you reach leaf node

    let nodeString;
    if (node.value === '¬') {
      addToString(node.value);
      if (isSymbol(node.children[0].value)) {
        buildString(node.children[0], node);
      } else {
        addToString(node.children[0].value);
      }
    } else if (isSymbol(node.value)) {
      if (isSymbol(node.children[1].value) && isSymbol(node.children[0].value)) {
        //if children are both symbols - add bracket to string before calling children
        if (lowerPrecedence(node, parentNode)) {
          addToString('(');
        }
        buildString(node.children[0], node);
        nodeString = `${node.value}`;
        addToString(nodeString);
        buildString(node.children[1], node);
        if (lowerPrecedence(node, parentNode))
          addToString(')');
      } else if (isSymbol(node.children[1].value)) {
        //if right child is symbol
        if (lowerPrecedence(node, parentNode))
          addToString('(');
        nodeString = `${node.children[0].value}${node.value}`;
        addToString(nodeString);
        buildString(node.children[1], node);
        if (lowerPrecedence(node, parentNode))
          addToString(')');
      } else if (isSymbol(node.children[0].value)) {
        //if left child is symbol
        if (lowerPrecedence(node, parentNode))
          addToString('(');
        buildString(node.children[0], node);
        nodeString = `${node.value}${node.children[1].value}`;
        addToString(nodeString);
        if (lowerPrecedence(node, parentNode))
          addToString(')');
      } else {
        //case where both children are not symbols
        if (lowerPrecedence(node, parentNode))
          addToString('(');
        nodeString = `${node.children[0].value}${node.value}${node.children[1].value}`;
        addToString(nodeString);
        if (lowerPrecedence(node, parentNode))
          addToString(')');
      }
    }
  }

  function addToString(value) {
    treeChangedToString = treeChangedToString.concat(value);
  }
}

/* RULES */
function idempotenceRule(node) {
  if (node.value === '∧' || node.value === '∨') {
    if (nodesEqual(node.children[0], node.children[1])) {
      return node.children[0];
    }
  }
  return false;
}

function nodesEqual(firstNode, secondNode) {
  let firstNodeClone = Object.assign({}, firstNode);
  let secondNodeClone = Object.assign({}, secondNode);
  removeArrayIndexes(firstNodeClone);
  removeArrayIndexes(secondNodeClone);
  return (JSON.stringify(firstNodeClone) === JSON.stringify(secondNodeClone));
}

function removeArrayIndexes(node) {
  delete node.arrayIndex;
    node.children.forEach(child => {
      removeArrayIndexes(child);
    })
}

function commutativityRule(node) {
  if (node.value === '∧' || node.value === '∨') {
    let newSecondChild = Object.assign({}, node.children[0]);
    node.children[0] = node.children[1];
    node.children[1] = newSecondChild;
    return node;
  }
  return false;
}

function doubleNegationRule(node) {
  if (node.value === '¬' && node.children[0].value === '¬') {
    node = node.children[0].children[0];
    return node;
  } else {
    let originalNode = Object.assign({}, node);
    node.value = '¬';
    node.children = [{value: '¬',children: [originalNode]}];
    return node;
  }
}

function negationRule(node) {
  if (node.value === '∧' && node.children[1].value === '¬' && nodesEqual(node.children[0], node.children[1].children[0])) {
    node.value = '0';
    node.children = [];
    return node;
  } else if (node.value === '∨' && node.children[1].value === '¬' && nodesEqual(node.children[0], node.children[1].children[0])) {
    node.value = '1';
    node.children = [];
    return node;
  }
  return false;
}

function implicationRule(node) {
  if (node.value === '⇒') {
    let originalFirstChild = Object.assign({}, node.children[0]);
    node.value = '∨';
    node.children[0].value = '¬';
    node.children[0].children = [originalFirstChild];
    return node;
  } else if (node.value === '∨' && node.children[0].value === '¬') {
    node.children[0] = node.children[0].children[0]; // removes ¬ node
    node.value = '⇒';
    return node;
  }
  return false;
}

function deMorganRule(node) {
  if (node.value === '¬') {
    if (node.children[0].value === '∧') {
      return deMorganForwardRule(node, '∧', '∨');
    } else if (node.children[0].value === '∨') {
      return deMorganForwardRule(node, '∨', '∧');
    }
  } else if (node.value === '∨' && node.children[0].value === '¬' && node.children[1].value === '¬') {
    return deMorganReverseRule(node, '∧');
  } else if (node.value === '∧' && node.children[0].value === '¬' && node.children[1].value === '¬') {
    return deMorganReverseRule(node, '∨');
  }
  return false;
}

function deMorganForwardRule(node, symbol1, symbol2) {
    if (node.children[0].value === symbol1) {
      let firstChild = Object.assign({}, node.children[0].children[0]);
      let secondChild = Object.assign({}, node.children[0].children[1]);

      node.value = symbol2;
      node.children = [{value: '¬',children: [firstChild]}, {value: '¬',children: [secondChild]}];
      return node;
    }
    return false;
}

function deMorganReverseRule(node, symbol) {
  let firstChild = Object.assign({}, node.children[0].children[0]);
  let secondChild = Object.assign({}, node.children[1].children[0]);
  let newNode = {value: symbol, children: [firstChild, secondChild]};
  node.value = '¬';
  node.children = [newNode];
  return node;
}

function biImplicationRule(node) {
  if (node.value === '⇔') {
    let firstChild = Object.assign({}, node.children[0]);
    let secondChild = Object.assign({}, node.children[1]);
    node.value = '∧';
    node.children = [{value: '⇒',children: [firstChild, secondChild]}, {value: '⇒',children: [secondChild, firstChild]}];
    return node;
  } else if (node.value === '∧' && node.children[0].value === '⇒' && node.children[1].value === '⇒') {
    if (nodesEqual(node.children[0].children[0], node.children[1].children[1]) &&
        nodesEqual(node.children[0].children[1], node.children[1].children[0])) {
      node.value = '⇔';
      node.children = [node.children[0].children[0], node.children[0].children[1]];
      return node;
    }
  }
  return false;
}

function absorptionRule(node) {
  if (node.value === '∧' && node.children[1].value === '∨' && nodesEqual(node.children[0], node.children[1].children[0])) {
    return node.children[0];
  } else if (node.value === '∨' && node.children[1].value === '∧' && node.children[0].value === node.children[1].children[0].value) {
    return node.children[0];
  }
  return false;
}

function associativityRule(node) {
  if (node.value === '∧' && node.children[1].value === '∧') {
    node = associativityForwardRule(node, '∧');
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∨') {
    node = associativityForwardRule(node, '∨');
    return node;
  } else if (node.value === '∧' && node.children[0].value === '∧') {
    node = associativityReverseRule(node, '∧');
    return node;
  } else if (node.value === '∨' && node.children[0].value === '∨') {
    node = associativityReverseRule(node, '∨');
    return node;
  }
  return false;
}

function associativityForwardRule(node, symbol) {
  let switchedChild = Object.assign({}, node.children[1].children[0]);
  let addedToChild = Object.assign({}, node.children[0]);
  node.children[0] = {value: symbol, children: [addedToChild, switchedChild] };
  node.children[1] = node.children[1].children[1];
  return node;
}

function associativityReverseRule(node, symbol) {
  let switchedChild = Object.assign({}, node.children[0].children[1]);
  let addedToChild = Object.assign({}, node.children[1]);
  node.children[1] = {value: symbol, children: [switchedChild, addedToChild] };
  node.children[0] = node.children[0].children[0];
  return node;
}

function distributivityRule(node) {
  if (node.value === '∨' && node.children[0].value === '∧' && node.children[1].value === '∧') {
    node = distributivityReverseRule(node, '∨', '∧');
    return node;
  } else if (node.value === '∧' && node.children[0].value === '∨' && node.children[1].value === '∨') {
    node = distributivityReverseRule(node, '∧', '∨');
    return node;
  } else if (node.value === '∧' && node.children[1].value === '∨') {
    node = distributivityForwardRule(node, '∧', '∨');
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∧') {
    node = distributivityForwardRule(node, '∨', '∧');
    return node;
  }
  return false;
}

function distributivityForwardRule(node, symbol1, symbol2) {
  let firstPart = Object.assign({}, node.children[0]);
  let addedToFirstChild = Object.assign({}, node.children[1].children[0]);
  let secondChildSecondPart = Object.assign({}, node.children[1].children[1]);
  node.value = symbol2;
  node.children[0] = { value: symbol1, children: [firstPart, addedToFirstChild] };
  node.children[1] = { value: symbol1, children: [firstPart, secondChildSecondPart] };
  return node;
}

function distributivityReverseRule(node, symbol1, symbol2) {
  if (node.children[0].children[0].value === node.children[1].children[0].value) {
    newChildNode = { value: symbol1, children: [node.children[0].children[1], node.children[1].children[1]] };
    node.value = symbol2;
    node.children = [node.children[0].children[0], newChildNode];
    return node;
  }
}

/* SETTING UP PROBLEM SOLUTION FEATURES */

function applyRule(node, rule) {
  switch(rule) {
    case 'idempotence':
      return idempotenceRule(node);
      break;
    case 'commutativity':
      return commutativityRule(node);
      break;
    case 'associativity':
      return associativityRule(node);
      break;
    case 'absorption':
      return absorptionRule(node);
      break;
    case 'distributivity':
      return distributivityRule(node);
      break;
    case 'negation':
      return negationRule(node);
      break;
    case 'double negation':
      return doubleNegationRule(node);
      break;
    case 'de Morgan':
      return deMorganRule(node);
      break;
    case 'implication':
      return implicationRule(node);
    case 'bi-implication':
      return biImplicationRule(node);
      break;
  }
}

function findNodeWithIndex(index, rootNode) {
  let foundNode;
  function recursionThroughNodes(node) {
    if (node.arrayIndex === index) {
      foundNode = node;
    } else node.children.forEach(child => {
      recursionThroughNodes(child);
    });
  }
  recursionThroughNodes(rootNode);
  return foundNode;
}


module.exports = { applyRule: applyRule, buildTreeFromString: buildTreeFromString, convertTreeToString: convertTreeToString };
