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



/* SETTING UP PROBLEM SOLUTION FEATURES */

let ruleSelect = '<form id=ruleSelect>Select rule:' + '<select id="mySelect">' +
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
    '</select>' + '<input type="button" id="applyRule" value="Apply Rule" class="btn btn-sm btn-outline-dark">' +
    '</form>';

function setupProof() {
  // take inputs and convert them into trees
  let originalTree = buildTreeFromString(formulaInput.value);
  let finalTree = buildTreeFromString(transformedFormula.value);

  let formInput = formulaInput.value.replace(/\s+/g, '');
  let transFormula = transformedFormula.value.replace(/\s+/g, '');
  // present the problem to solve with Apply Rule button
  mainBody.innerHTML = "<h3>Prove that " + formInput + " ≡ " + transFormula +
  "</h3><p>Highlight the part of the formula you want to change, select the rule and click Apply Rule.</p>" +
  "<table id=workings><tr id='lastRow'><td id='formulaToChange'>" + formInput + "</td><td id='selectArea'>" + ruleSelect + "</td></tr></table>";
  console.log(originalTree);
  console.log(finalTree);

  const applyRuleButton = document.getElementById('applyRule');
  const formulaToChange = document.getElementById('formulaToChange');
  const workingsTable = document.getElementById('workings');
  const ruleSelection = document.getElementById('ruleSelect');
  const lastRow = document.getElementById('lastRow');
  const selectArea = document.getElementById('selectArea');
  // when Apply Rule button is clicked
  applyRuleButton.addEventListener("click", function() {
    let formulaSection = window.getSelection();
    if (formulaSection.toString().length !== 0) {
      originalTree = buildTreeFromString(formulaToChange.innerHTML);
      let node = buildTreeFromString(formulaSection.toString());
      // min of anchor and focus offsets prevents errors if user highlights from right to left
      let rootNodeIndex = Math.min(formulaSection.anchorOffset, formulaSection.focusOffset) + node.arrayIndex;
      let nodeToSwap = findNodeWithIndex(rootNodeIndex, originalTree);
      if (nodesEqual(nodeToSwap, node)) {
        let previousStep = formulaToChange.innerHTML;
        node = applyRule(node, mySelect.value);
        nodeToSwap.value = node.value;
        nodeToSwap.children = node.children;
        console.log(originalTree);
        // add extra row before last one with the formula as it was and rule applied
        let previousRow = workingsTable.insertRow(workingsTable.rows.length - 1);
        let formulaPart = previousRow.insertCell(0);
        let rulePart = previousRow.insertCell(1);
        let previousStepFormula = document.createTextNode(previousStep);
        formulaPart.appendChild(previousStepFormula);
        let previousStepRule = document.createTextNode(mySelect.value);
        rulePart.appendChild(previousStepRule);
        // change last row to current state of formula
        formulaToChange.innerHTML = convertTreeToString(originalTree);
        // check if proof is finished
        if (nodesEqual(originalTree, finalTree)) {
          selectArea.innerHTML = 'Proof complete, congratulations!';
        }
      }
    } else {
     alert(`Please select part of the formula`);
   }
      /*
      let change = prompt(`You selected ${mySelect.value} on ${formulaSection}, please enter what you want to change it to:`, `Your change`);
     */
  });
}
