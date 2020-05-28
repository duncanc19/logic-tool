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
formulaInput.onkeypress = function(e) {
  let key = e.which || e.keyCode;
  if (key>=49 && key<=53) {
    e.preventDefault();
    currentTextBox = this;
    // converting key codes of numbers 1-5 to switch numbers in addSymbol
    addSymbol(key-49);
  }
}

transformedFormula.onkeypress = function(e) {
  let key = e.which || e.keyCode;
  if (key>=49 && key<=53) {
    e.preventDefault();
    currentTextBox = this;
    // converting key codes of numbers 1-5 to switch numbers in addSymbol
    addSymbol(key-49);
  }
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

function setupProof() {
  let originalArray = buildArray(formulaInput.value);
  let finalArray = buildArray(transformedFormula.value);
  let originalTree = { value: originalArray, children: []};
  let finalTree = { value: finalArray, children: []};
  buildTree(originalTree);
  buildTree(finalTree);

  mainBody.innerHTML = "<h1>" + formulaInput.value + " ≡ " + transformedFormula.value +
  "</h1><br><p>" + formulaInput.value + "</p>";
  console.log(originalTree);
  console.log(finalTree);
}


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
  }
  node.children.forEach(child => buildTree(child));
}




function findSymbol(nodeValue, symbol) {
  for (i=0; i<nodeValue.length; i++) {
    if (nodeValue[i] == symbol) {
      return true;
    }
  }
  return false;
}

function setNodeAndChildren(node,symbol) {
  let leftChild = { value: [], children: [] };
  let rightChild = { value: [], children: [] };
  // finds symbol, puts left of symbol in leftChild, right of symbol in rightChild
  for (i=0; i<node.value.length; i++) {
    if (node.value[i] == symbol) {
      for (j=0; j<i; j++) {
        leftChild.value.push(node.value[j]);
      }
      for (k=i+1; k<node.value.length; k++) {
        rightChild.value.push(node.value[k]);
      }
      if (leftChild.value.length != 0) {
        node.children.push(leftChild);
      }
      node.children.push(rightChild);
      node.value = symbol;
    }
  }
}
