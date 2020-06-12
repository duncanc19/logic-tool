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
function findLeftLeaf(node) {
  //debugger;
  if (node.children.length === 0) {
    return node;
  } else {
    return findLeftLeaf(node.children[0]);
  }
}

function convertTreeToString(rootNode) {
  pushNodeValueIntoArray(rootNode);
  let convertedArray = Array.from(treeChangedToArray);
  treeChangedToArray = [];
  treeToArrayIndex = 0;
  return convertedArray;
}

let treeChangedToArray = [];

function pushNodeValueIntoArray(rootNode) {
  if (rootNode === undefined)
    return;
  pushNodeValueIntoArray(rootNode.children[0]);
  if (isSymbol(rootNode.value) && lowerPrecedence(rootNode.value)) {
      treeChangedToArray.unshift('(');
      treeChangedToArray.push(')');
   }
  treeChangedToArray.push(rootNode.value);
  pushNodeValueIntoArray(rootNode.children[1]);
}

function lowerPrecedence(nodeValue) {
  let inBrackets = 0;
  for (i=0; i<treeChangedToArray.length; i++) {
    if (treeChangedToArray[i] == '(') {
      inBrackets += 1;
    } else if (nodeValue[i] == ')') {
      inBrackets -= 1;
    }
    if ((inBrackets === 0) && isSymbol(treeChangedToArray[i])) {
      if (symbolPrecedenceLookup.indexOf(treeChangedToArray[i])<symbolPrecedenceLookup.indexOf(nodeValue)) {
        return true;
      }
    }
  }
  return false;
}

function isSymbol(value) {
  return symbolPrecedenceLookup.includes(value);
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
    if (formulaSection.toString().length !== 0) {
      let change = prompt(`You selected ${mySelect.value} on ${formulaSection}, please enter what you want to change it to:`, `Your change`);
      let changedFormula = formulaToChange.innerHTML.replace(formulaSection.toString(), change);
      let newTree = buildTreeFromString(changedFormula);
      console.log(newTree);
    } else {
      alert(`Please select part of the formula`);
    }
  });
}
