const mainBody = document.getElementById("mainBody");

// Formula Input Buttons
const andButton = document.getElementById("andButton");
const orButton = document.getElementById("orButton");
const ifButton = document.getElementById("ifButton");
const onlyIfButton = document.getElementById("onlyIfButton");
const notButton = document.getElementById("notButton");
const startProof = document.getElementById("startProof");
const buttons = document.getElementById('symbolButtons');

andButton.addEventListener("click", function() { addSymbol(0) });
orButton.addEventListener("click", function() { addSymbol(1) });
ifButton.addEventListener("click", function() { addSymbol(2) });
onlyIfButton.addEventListener("click", function() { addSymbol(3) });
notButton.addEventListener("click", function() { addSymbol(4) });
startProof.addEventListener("click", setupProof);

const formulaInput = document.getElementById("formula");
const transformedFormula = document.getElementById("transformedFormula");

// If task is passed in from exercises page, put formulae into input boxes
function taskGiven() {
  let givenTask = sessionStorage.getItem('task');
  if (givenTask) {
    let beforeAndAfterFormulae = givenTask.split('≡');
    formulaInput.value = beforeAndAfterFormulae[0].trim();
    transformedFormula.value = beforeAndAfterFormulae[1].trim();
    sessionStorage.removeItem('task');
  }
}
taskGiven();

/* NAVBAR SETTINGS */
// Toggling rules display
// rules toggle separated from showing or hiding the rules so it can be toggled before inputting formulae
const rulesShown = document.getElementById('rulesShown');
rulesShown.addEventListener('click', toggleRulesDisplay);

function toggleRulesDisplay() {
  const rulesInToolRef = document.getElementById('rulesInTool');
  if (rulesShown.innerHTML === "Show rules") {
    rulesShown.innerHTML = "Hide rules";
  } else {
    rulesShown.innerHTML = "Show rules";
  }
  if (rulesInToolRef) {
    showOrHideRules();
  }
}

function showOrHideRules() {
  const rulesInToolRef = document.getElementById('rulesInTool');
  // display rules if show rules
  if (rulesShown.innerHTML === "Hide rules") {
    rulesInToolRef.style.display = "block";
  } else {
    rulesInToolRef.style.display = "none";
  }
}

// Working backwards toggle
const workBackwardsToggle = document.getElementById('workBackwardsToggle');
workBackwardsToggle.addEventListener('click', toggleWorkingBackwards);

function toggleWorkingBackwards() {
  const backwardWorkings = document.getElementById('backwardWorkings');
  if (workBackwardsToggle.innerHTML === "Work from top and bottom") {
    workBackwardsToggle.innerHTML = "Work only from top";
  } else {
    workBackwardsToggle.innerHTML = "Work from top and bottom";
  }
  if (backwardWorkings) {
    showBackwardWorkings();
  }
}

function showBackwardWorkings() {
  const backwardWorkings = document.getElementById('backwardWorkings');
  if (workBackwardsToggle.innerHTML === "Work from top and bottom") {
    backwardWorkings.style.display = "none";
  } else {
    backwardWorkings.style.display = "table";
  }
}

/* FORMULA INPUT */
let currentTextBox;

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
    showAlert("<h5>No text box selected</h5>Please select a text box!");
  }
}

function selectTextBox(textBox) {
    currentTextBox = document.getElementById(textBox);
}

/* ALERT BOXES/MODALS */
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalText = document.getElementById("modalText");

function showAlert(text) {
  modalText.innerHTML = text;
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/* SETTING UP PROBLEM SOLUTION FEATURES */
const rulesInTool = `<div id="rulesInTool"><h5>Rules</h5>
  <p onclick="showAlert('<h5>Idempotence</h5><p>A ∧ A ≡ A</p><p>A ∨ A ≡ A</p>')">Idempotence</p>
  <p onclick="showAlert('<h5>Commutativity</h5><p>A ∧ B ≡ B ∧ A</p><p>A ∨ B ≡ B ∨ A</p>')">Commutativity</p>
  <p onclick="showAlert('<h5>Associativity:</h5><p>A ∧ (B ∧ C) ≡ (A ∧ B) ∧ C</p><p>A ∨ (B ∨ C) ≡ (A ∨ B) ∨ C</p>')">Associativity</p>
  <p onclick="showAlert('<h5>Absorption:</h5><p>A ∧ (A ∨ B) ≡ A</p><p>A ∨ (A ∧ B) ≡ A</p>')">Absorption</p>
  <p onclick="showAlert('<h5>Distributivity:</h5><p>A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)</p><p>A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)</p>')">Distributivity</p>
  <p onclick="showAlert('<h5>Negation:</h5><p>A ∧ (¬A) ≡ false</p><p>A ∨ (¬A) ≡ true</p>')">Negation</p>
  <p onclick="showAlert('<h5>Double Negation:</h5><p>¬(¬A) ≡ A</p>')">Double Negation</p>
  <p onclick="showAlert('<h5>de Morgan:</h5><p>¬(A ∧ B) ≡ (¬A) ∨ (¬B)</p><p>¬(A ∨ B) ≡ (¬A) ∧ (¬B)</p>')">de Morgan</p>
  <p onclick="showAlert('<h5>Implication:</h5><p>A ⇒ B ≡ (¬A) ∨ B</p>')">Implication</p>
  <p onclick="showAlert('<h5>Bi-Implication:</h5><p>A ⇔ B ≡ (A ⇒ B) ∧ (B ⇒ A)</p>')">Bi-Implication</p>
</div>`;

function setupProof() {
  // rule application selects
  const ruleSelectGeneral = '<option value="idempotence">Idempotence</option>' +
      '<option value="commutativity">Commutativity</option>' +
      '<option value="associativity">Associativity</option>'+
      '<option value="absorption">Absorption</option>' +
      '<option value="distributivity">Distributivity</option>' +
      '<option value="negation">Negation</option>' +
      '<option value="doubleNegation">Double Negation</option>' +
      '<option value="deMorgan">de Morgan</option>' +
      '<option value="implication">Implication</option>' +
      '<option value="biImplication">Bi-Implication</option>';

  const ruleSelect = '<select id="mySelect" class="btn btn-sm btn-outline-dark">' +
    '<form id=ruleSelect>Select rule:' + ruleSelectGeneral +
    '<input type="button" id="applyRule" value="Apply Rule" class="btn btn-sm btn-outline-dark">' + '</select></form>';

  const backwardRuleSelect = '<select id="myBackwardSelect" class="btn btn-sm btn-outline-dark">' +
    '<form id=backwardRuleSelect>Select rule:' + ruleSelectGeneral +
    '<input type="button" id="applyBackwardRule" value="Apply Rule Backwards" class="btn btn-sm btn-outline-dark">' + '</select></form>';

  // take inputs and convert them into trees
  let originalTree;
  let backwardsTree;
  let finalTree;
  try {
    originalTree = buildTreeFromString(formulaInput.value);
    backwardsTree = buildTreeFromString(transformedFormula.value);
    finalTree = buildTreeFromString(transformedFormula.value);
  } catch {
    showAlert(`<h5>The formulae entered are not valid</h5>
    Please check them and look out for problems such as unclosed brackets.`);
    return;
  }

  setUpWorkingsTable();

  const applyRuleButton = document.getElementById('applyRule');
  const formulaToChange = document.getElementById('formulaToChange');
  const workingsTable = document.getElementById('workings');
  const ruleSelection = document.getElementById('ruleSelect');
  const lastRow = document.getElementById('lastRow');
  const selectArea = document.getElementById('selectArea');
  // when Apply Rule button is clicked
  applyRuleButton.addEventListener("click", function() { applyRuleButtonsFunctionality(mySelect.value, formulaToChange, false, originalTree) });

  function applyRuleButtonsFunctionality(selectValue, formula, isBackwardsTable, whichTree) {
    let formulaSection = window.getSelection();
    let node;
    let nodeToSwap;
    let previousStep = formula.innerHTML;
    // change the original/backwards tree outside of function scope by changing its inner state
    let nextStep = buildTreeFromString(previousStep);
    whichTree.value =  nextStep.value;
    whichTree.children = nextStep.children;
    whichTree.arrayIndex = nextStep.arrayIndex;
    let nodeAfterRule;

    try {
      node = buildSelectionTree(formulaSection);
      nodeToSwap = findHighlightedNode(formulaSection, node, whichTree);
      nodeAfterRule = applyRule(node, selectValue);
      if (!nodeAfterRule) {
        ruleWithAddedInformation(selectValue, formulaSection, node, nodeToSwap, previousStep);
      } else {
        nodeToSwap.value = nodeAfterRule.value;
        nodeToSwap.children = nodeAfterRule.children;
        if (isBackwardsTable) {
          addRowToBackwardTable(selectValue, previousStep);
        } else {
          addRowToTable(selectValue, previousStep);
        }
      }
    } catch (err) {
      showAlert(err);
      return;
    }
  }

  // backward rule elements
  const applyBackwardRuleButton = document.getElementById('applyBackwardRule');
  const topFormula = document.getElementById('finalFormula');
  const backwardWorkingsTable = document.getElementById('backwardWorkings');
  const backwardRuleSelection = document.getElementById('backwardRuleSelect');
  const topRow = document.getElementById('finalRow');
  const backwardSelectArea = document.getElementById('backwardSelectArea');
  const myBackwardSelect = document.getElementById('myBackwardSelect');

  // when Backwards Apply Rule button is clicked
  applyBackwardRuleButton.addEventListener("click", function() { applyRuleButtonsFunctionality(myBackwardSelect.value, topFormula, true, backwardsTree) });

  function addRowToBackwardTable(rule, formulaBeforeChange) {
    let topRow = backwardWorkingsTable.insertRow(0);
    topRow.appendChild(topFormula);
    let rulePart = topRow.insertCell(1);
    let previousStepRule = document.createTextNode(rule);
    rulePart.appendChild(previousStepRule);
    let reinsertedFormula = backwardWorkingsTable.rows[1].insertCell(0);
    let previousStepFormula = document.createTextNode(formulaBeforeChange);
    reinsertedFormula.appendChild(previousStepFormula);
    topFormula.innerHTML = convertTreeToString(backwardsTree);
  }

  function addRowToTable(rule, formulaBeforeChange) {
    console.log(originalTree);
    // add extra row before last one with the formula as it was and rule applied
    let previousRow = workingsTable.insertRow(workingsTable.rows.length - 1);
    let formulaPart = previousRow.insertCell(0);
    let rulePart = previousRow.insertCell(1);
    let previousStepFormula = document.createTextNode(formulaBeforeChange);
    formulaPart.appendChild(previousStepFormula);
    let previousStepRule = document.createTextNode(rule);
    rulePart.appendChild(previousStepRule);
    // change last row to current state of formula
    formulaToChange.innerHTML = convertTreeToString(originalTree);
    // check if proof is finished
    if (nodesEqual(originalTree, finalTree)) {
      selectArea.innerHTML = 'Proof complete, congratulations!';
    }
  }



  // if rule requires extra information
  function setupRuleInput(rule, highlighted) {
    if (!(rule === 'idempotence' || rule === 'absorption' || rule === 'negation')) {
      throw `<h5>The rule could not be applied</h5>
        The section highlighted matched the formula but it did not conform to the requirements of the ${mySelect.value} rule.
        Have a look at the rules section(toggle in the Settings or look on the Rules page for more details).`;
    }
    showAlert(`<div id="addRuleChange"><label for="ruleChange">You are applying ${rule} to ${highlighted.toString()}, please enter what you'd like to change it to:</label>
    <input type="text" name="ruleChange" placeholder="Your change" id="ruleChange" onblur="selectTextBox(this.id)"></div>
    <input type="button" id="enterChange"  data-dismiss="modal" class="btn btn-sm btn-outline-dark" value="Enter Change">`);
  }

  function ruleWithAddedInformation(rule, highlighted, originalNode, switchedNode, formulaBeforeChange) {
    setupRuleInput(rule, highlighted);
    const addRuleChange = document.getElementById('addRuleChange');
    const ruleChange = document.getElementById('ruleChange');

    selectTextBox('ruleChange');
    addRuleChange.appendChild(buttons);
    ruleChange.onkeypress = function(e) {
      keyboardSymbols(this, e);
    }

    const enterChange = document.getElementById('enterChange');
    enterChange.addEventListener("click", () => {
      let newNode;
      try {
        newNode = buildTreeFromString(ruleChange.value);
      } catch {
        showAlert(`The entered formula is not valid. Look out for things such as unclosed brackets.`);
        return;
      }
      // make clone of node so original is not modified when applying rule
      let newNodeClone = Object.assign({}, newNode);
      let ruleAppliedToNewNode = applyRule(newNodeClone, rule);
      if (!ruleAppliedToNewNode || !nodesEqual(originalNode, ruleAppliedToNewNode)) {
        showAlert(`The rule can't be applied to give what you have entered.`);
        return;
      }
      modal.style.display = "none";
      switchedNode.value = newNode.value;
      switchedNode.children = newNode.children;
      addRowToTable(rule, formulaBeforeChange);
    });
  }

  function setUpWorkingsTable() {
    let formInput = formulaInput.value.replace(/\s+/g, '');
    let transFormula = transformedFormula.value.replace(/\s+/g, '');
    // present the problem to solve with Apply Rule button
    mainBody.innerHTML = "<h3>Prove that " + formInput + " ≡ " + transFormula +
    "</h3><button type='button' id='previousStepButton' class='btn btn-sm btn-outline-dark'>Go back to a previous step</button><p>Highlight the part of the formula you want to change, select the rule and click Apply Rule.</p>" +
    rulesInTool + "<table id=workings><tr id='lastRow'><td id='formulaToChange'>" + formInput + "</td><td id='selectArea'>" + ruleSelect + "</td></tr></table></br>" +
    "<table id=backwardWorkings><tr id='finalRow'><td id='finalFormula'>" + transFormula + "</td><td id='backwardSelectArea'>" + backwardRuleSelect + "</td></tr></table>";

    showOrHideRules(); // display rules if checked in the navbar
    showBackwardWorkings(); // show backwards if applied in settings
    console.log(originalTree);
    console.log(finalTree);
  }

  function buildSelectionTree(highlightedSection) {
    if (highlightedSection.toString().length === 0) {
      throw `<h5>Nothing is highlighted</h5>Please select part of the formula`;
    }
    let node;
    try {
      node = buildTreeFromString(highlightedSection.toString());
      return node;
    } catch {
      throw `<h5>Section highlighted can't be parsed</h5>Make sure you are highlighting part of the formula from the latest step of your workings.`;
    }
  }

  function findHighlightedNode(highlightedSection, highlightedNode, wholeTree) {
    // min of anchor and focus offsets prevents errors if user highlights from right to left
    let rootNodeIndex = Math.min(highlightedSection.anchorOffset, highlightedSection.focusOffset) + highlightedNode.arrayIndex;
    let nodeToSwap = findNodeWithIndex(rootNodeIndex, wholeTree);
    // gives error message if highlighted section doesn't match section of formula in the tree
    if (!nodesEqual(nodeToSwap, highlightedNode)) {
      throw `<h5>Section highlighted doesn't match formula</h5>If highlighting brackets,
      make sure you get both opening and closing brackets. Be careful with the rules of precedence,
      for example, a∧<span style="background-color:yellow;">b∨c</span> won't work, as b is linked with a(i.e. the same as (a∧b)∨c).`;
    }
    return nodeToSwap;
  }

  // PREVIOUS STEPS
  const previousStepButton = document.getElementById('previousStepButton');
  previousStepButton.addEventListener("click", goToPreviousStep);

  function goToPreviousStep() {
    workingsTable.classList.toggle('tableHighlight');
    if (workingsTable.classList.contains('tableHighlight')) {
      previousStepButton.innerHTML = "Cancel changing step";
      for (let row of workingsTable.rows) {
        row.onclick = function removeRows() {
          selectRow(row);
          previousStepButton.innerHTML = "Go back to a previous step";
          workingsTable.classList.toggle('tableHighlight');
        }
      }
    } else {
      // case where user presses button again to cancel
      removeEventListeners();
      previousStepButton.innerHTML = "Go back to a previous step";
    }
  }

  function selectRow(row) {
    // changes last table row formula to selected
    formulaToChange.innerHTML = row.cells[0].innerHTML;
    let lastRowIndex = workingsTable.rows.length-1;
    let originalIndex = row.rowIndex;
    // remove the event listeners from all the table rows
    removeEventListeners();
    for (let i = originalIndex; i<lastRowIndex; i++) {
      workingsTable.deleteRow(originalIndex);
    }
  }

  function removeEventListeners() {
    for (let row of workingsTable.rows) {
      row.onclick = () => false;
    }
  }
}
