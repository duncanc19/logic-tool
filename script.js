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
function addSymbol(whichButton)
{
  if (currentTextBox) {
    switch(whichButton) {
      case 0:
        currentTextBox.value += "∧";
        break;
      case 1:
        currentTextBox.value += "∨";
        break;
      case 2:
        currentTextBox.value += "⇒";
        break;
      case 3:
        currentTextBox.value += "⇔";
        break;
      case 4:
        currentTextBox.value += "¬";
        break;
      }
      currentTextBox.focus();
  } else {
    alert("Please select a text box!");
  }
}

function selectTextBox(textBox) {
    currentTextBox = document.getElementById(textBox);
}


/* PARSING FORMULAE INTO TREES */

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

function buildTree(node) {
  if (node.value.length == 1) {
    node.value = node.value[0];
  } else if (findSymbol(node.value, '⇔')) {
      setNodeAndChildren(node, '⇔');
  } else if (findSymbol(node.value, '⇒')) {
      setNodeAndChildren(node, '⇒');
  } else if (findSymbol(node.value, '∨')) {
      setNodeAndChildren(node, '∨');
  } else if (findSymbol(node.value, '∧')) {
      setNodeAndChildren(node, '∧');
  } else if (findSymbol(node.value, '¬')) {
    setNodeAndChildren(node, '¬');
  } else {
    removeBrackets(node.value);
    buildTree(node);
  }
  node.children.forEach(child => buildTree(child));
}

function removeBrackets(node) {
  if (node[0] == '(' && node[node.length-1] == ')') {
    node.shift(); //removes opening bracket
    node.pop(); //removes closing bracket
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
    if ((nodeValue[i] == symbol) && (inBrackets == 0)) {
      return true;
    }
  }
  return false;
}

function setNodeAndChildren(node,symbol) {
  let leftChild = { value: [], children: [] };
  let rightChild = { value: [], children: [] };
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
      }
      for (k=i+1; k<node.value.length; k++) {
        rightChild.value.push(node.value[k]);
      }
      if (leftChild.value.length != 0) {  //for case when it's negation, only one child
        node.children.push(leftChild);
      }
      node.children.push(rightChild);
      node.value = symbol;
    }
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

function setupProof() {
  // take inputs and convert them into arrays and then trees
  let originalArray = buildArray(formulaInput.value);
  let finalArray = buildArray(transformedFormula.value);
  let originalTree = { value: originalArray, children: []};
  let finalTree = { value: finalArray, children: []};
  buildTree(originalTree);
  buildTree(finalTree);
  // present the problem to solve with Apply Rule button
  mainBody.innerHTML = "<h3>Prove that " + formulaInput.value + " ≡ " + transformedFormula.value +
  "</h3><p>Highlight the part of the formula you want to change, select the rule and click Apply Rule.</p><p>" + formulaInput.value + "</p>" + ruleSelect;
  console.log(originalTree);
  console.log(finalTree);
  // when Apply Rule button is clicked
  const applyRuleButton = document.getElementById('applyRule');
  applyRuleButton.addEventListener("click", function() {
    let formulaSection = window.getSelection();
    if (formulaSection.length != 0) {
      prompt(`You selected ${mySelect.value} on ${formulaSection}, please enter what you want to change it to:`, `Your change`);
    }

  })
}
