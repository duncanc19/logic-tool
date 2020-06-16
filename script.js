const andButton = document.getElementById("andButton");
const orButton = document.getElementById("orButton");
const ifButton = document.getElementById("ifButton");
const onlyIfButton = document.getElementById("onlyIfButton");
const notButton = document.getElementById("notButton");
const startProof = document.getElementById("startProof");

const formulaInput = document.getElementById("formula");
const transformedFormula = document.getElementById("transformedFormula");

const mainBody = document.getElementById("mainBody");

let currentTextBox;


andButton.addEventListener("click", function() { addSymbol(0) });
orButton.addEventListener("click", function() { addSymbol(1) });
ifButton.addEventListener("click", function() { addSymbol(2) });
onlyIfButton.addEventListener("click", function() { addSymbol(3) });
notButton.addEventListener("click", function() { addSymbol(4) });
startProof.addEventListener("click", setupProof);


/* FORMULA INPUT */

/* Keyboard shortcuts */

function keyboardSymbols(textbox, e) {
  let key = e.which || e.keyCode;
  if (key>=49 && key<=53) {
    e.preventDefault();
    currentTextBox = textbox;
    // converting key codes of numbers 1-5 to switch numbers in addSymbol
    addSymbol(key-49);
  }
}

formulaInput.onkeypress = function(e) {
  keyboardSymbols(this, e);
}

transformedFormula.onkeypress = function(e) {
  keyboardSymbols(this, e);
}

/* Symbol buttons */
const symbolButtonLookup = ["∧", "∨", "⇒", "⇔", "¬"]; //ordering important, don't change

function addSymbol(whichButton)
{
  if (currentTextBox) {
    currentTextBox.value += symbolButtonLookup[whichButton];
    currentTextBox.focus();
  } else {
    alert("Please select a text box!");
  }
}

function selectTextBox(textBox) {
    currentTextBox = document.getElementById(textBox);
}


/* PARSING FORMULAE INTO TREES */
function buildTreeFromString(formula) {
  let array = buildArray(formula);
  let index = [];
  for (let i=0; i<array.length; i++) {
    index.push(i);
  }
  let tree = { value: array, children: [], arrayIndex: index };
  buildTree(tree);
  return tree;
}

// convert input string into array
function buildArray(formula) {
  let array = [];

  for (i=0; i<formula.length; i++) {
    if (formula[i] == " ") { // do nothing
    } else {
      array.push(formula[i]);
    }
  }
  return array;
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
function lowerPrecedence(nodeValue, parentNodeValue) {
    if (isSymbol(nodeValue)) {
      if (symbolPrecedenceLookup.indexOf(nodeValue)<=symbolPrecedenceLookup.indexOf(parentNodeValue)) {
        return true;
      }
    }
  return false;
}

function addNegation() {
  let brackets = 0;
  for (let i=treeChangedToString.length-1; i>=0; i--) {
    if (treeChangedToString[i] === ')') {
      brackets += 1;
    } else
     if (treeChangedToString[i] === '(' && brackets === 1) {
      treeChangedToString = treeChangedToString.slice(0, i) + '¬' + treeChangedToString.slice(i);
      break;
    } else if (treeChangedToString[i] === '(') {
      brackets -= 1;
    }
  }
}

function isSymbol(value) {
  return symbolPrecedenceLookup.includes(value);
}

function convertTreeToString(rootNode) {
  addNodeToString(rootNode);
  let convertedString = treeChangedToString;
  treeChangedToString = '';
  return convertedString;
}

let treeChangedToString = '';

function addNodeToString(node, parentNode) {
  if (node === undefined)
    return; //base case to stop recursion when you reach leaf node
  addNodeToString(node.children[0], node);
  let nodeString;
  if (node.value === '¬') {
   if (!isSymbol(node.children[0].value)) {
    nodeString = `${node.value}${node.children[0].value}`;
    if (parentNode !== undefined) {
      if (lowerPrecedence(node.value, parentNode.value)) {
        nodeString = `(${nodeString})`;
      }
    }
    treeChangedToString = treeChangedToString.concat(nodeString);
   } else {
     addNegation();
    }
  }
  else if (isSymbol(node.value)) {
    if (isSymbol(node.children[1].value) && isSymbol(node.children[0].value)) {
      //if children are both symbols
      nodeString = `${node.value}`;
    } else if (isSymbol(node.children[1].value)) {
      //if right child is symbol
      nodeString = `${node.children[0].value}${node.value}`;
    } else if (isSymbol(node.children[0].value)) {
      //if left child is symbol
      nodeString = `${node.value}${node.children[1].value}`;
    } else {
      //case where both children are not symbols
      nodeString = `${node.children[0].value}${node.value}${node.children[1].value}`;
    }
    if (parentNode !== undefined) {
      if (lowerPrecedence(node.value, parentNode.value)) {
        nodeString = `(${nodeString})`;
      }
    }
    treeChangedToString = treeChangedToString.concat(nodeString);
    addNodeToString(node.children[1], node);
  }
}

/* SETTING UP PROBLEM SOLUTION FEATURES */

let ruleSelect = '<form>Select rule:' + '<select id="mySelect">' +
    '<option value="idempotence">Idempotence</option>' +
    '<option value="commutativity">Commutativity</option>' +
    '<option value="associativity">Associativity</option>'+
    '<option value="absorption">Absorption</option>' +
    '<option value="distributivity">Distributivity</option>' +
    '<option value="negation">Negation</option>' +
    '<option value="doubleNegation">Double Negation</option>' +
    '<option value="deMorgan">de Morgan</option>' +
    '<option value="implication">Implication</option>' +
    '<option value="biImplication">Bi-Implication</option>' +
    '</select>' + '<input type="button" id="applyRule" value="Apply Rule">' +
    '</form>';

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
    case 'doubleNegation':
      return doubleNegationRule(node);
      break;
    case 'deMorgan':
      return deMorganRule(node);
      break;
    case 'implication':
      return implicationRule(node);
    case 'biImplication':
      return biImplicationRule(node);
      break;
  }
}

function findNodeWithIndex(index, rootNode) {
  debugger;
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

function setupProof() {
  // take inputs and convert them into trees
  let originalTree = buildTreeFromString(formulaInput.value);
  let finalTree = buildTreeFromString(transformedFormula.value);
  // present the problem to solve with Apply Rule button
  mainBody.innerHTML = "<h3>Prove that " + formulaInput.value + " ≡ " + transformedFormula.value +
  "</h3><p>Highlight the part of the formula you want to change, select the rule and click Apply Rule.</p>" +
  "<table id=workings><tr><td id='formulaToChange'>" + formulaInput.value + "</td><td>" + ruleSelect + "</td></tr></table>";
  console.log(originalTree);
  console.log(finalTree);
  // when Apply Rule button is clicked
  const applyRuleButton = document.getElementById('applyRule');
  const formulaToChange = document.getElementById('formulaToChange');
  applyRuleButton.addEventListener("click", function() {
    let formulaSection = window.getSelection();
    let node = buildTreeFromString(formulaSection.toString());
    let rootNodeIndex = formulaSection.anchorOffset + node.arrayIndex;
    console.log(findNodeWithIndex(rootNodeIndex, originalTree));
    if (formulaSection.toString().length !== 0) {
      // let nodeToChange = buildTreeFromString(formulaSection.toString());
      console.log(applyRule(node, mySelect.value)); /*
      let change = prompt(`You selected ${mySelect.value} on ${formulaSection}, please enter what you want to change it to:`, `Your change`);
      let changedFormula = formulaToChange.innerHTML.replace(formulaSection.toString(), change);
      let newTree = buildTreeFromString(changedFormula);
      console.log(newTree); */
    } else {
      alert(`Please select part of the formula`);
    }
  });
}

/* RULES */
function idempotenceRule(node) {
  if (node.value === '∧' || node.value === '∨') {
    if (nodesEqual(node.children[0], node.children[1])) {
      node = node.children[0];
      return node;
    }
  }
}

function nodesEqual(firstNode, secondNode) {
  let firstNodeClone = Object.assign({}, firstNode);
  let secondNodeClone = Object.assign({}, secondNode);
  delete firstNodeClone.arrayIndex;
  delete secondNodeClone.arrayIndex;
  return (JSON.stringify(firstNodeClone) === JSON.stringify(secondNodeClone));
}

function commutativityRule(node) {
  try {
    if (node.value === '∧' || node.value === '∨') {
      let newSecondChild = Object.assign({}, node.children[0]);
      node.children[0] = node.children[1];
      node.children[1] = newSecondChild;
      return node;
    }
  } catch {
    alert('The commutativity rule cannot be applied to the section you selected.');
  }
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
  if (node.value === '∧' && node.children[1].value === '¬') {
    if (node.children[0].value === node.children[1].children[0].value) {
      node.value = false;
      node.children = [];
    }
    return node;
  } else if (node.value === '∨' && node.children[1].value === '¬')  {
    if (node.children[0].value === node.children[1].children[0].value) {
      node.value = true;
      node.children = [];
    }
    return node;
  }
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
}

function deMorganRule(node) {
  if (node.value === '¬') {
    let firstChild = Object.assign({}, node.children[0].children[0]);
    let secondChild = Object.assign({}, node.children[0].children[1]);
    if (node.children[0].value === '∧') {
      node.value = '∨';
    } else if (node.children[0].value === '∨') {
      node.value = '∧';
    }
      node.children = [{value: '¬',children: [firstChild]}, {value: '¬',children: [secondChild]}];
      return node;
  } else if (node.value === '∨' && node.children[0].value === '¬' && node.children[1].value === '¬') {
    node = deMorganReverseRule(node, '∧');
    return node;
  } else if (node.value === '∧' && node.children[0].value === '¬' && node.children[1].value === '¬') {
    node = deMorganReverseRule(node, '∨');
    return node;
  }
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
}

function absorptionRule(node) {
  if (node.value === '∧' && node.children[1].value === '∨' && nodesEqual(node.children[0], node.children[1].children[0])) {
    node = node.children[0];
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∧' && node.children[0].value === node.children[1].children[0].value) {
    node = node.children[0];
    return node;
  }
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
  if (node.value === '∧' && node.children[1].value === '∨') {
    node = distributivityForwardRule(node, '∧', '∨');
    return node;
  } else if (node.value === '∨' && node.children[1].value === '∧') {
    node = distributivityForwardRule(node, '∨', '∧');
    return node;
  } else if (node.value === '∨' && node.children[0].value === '∧' && node.children[1].value === '∧') {
    node = distributivityReverseRule(node, '∨', '∧');
    return node;
  } else if (node.value === '∧' && node.children[0].value === '∨' && node.children[1].value === '∨') {
    node = distributivityReverseRule(node, '∧', '∨');
    return node;
  }
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
