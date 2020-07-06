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

const ruleSelect = '<form id=ruleSelect>Select rule:' + '<select id="mySelect" class="btn btn-sm btn-outline-dark">' +
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
  // take inputs and convert them into trees
  let originalTree;
  let finalTree;
  try {
    originalTree = buildTreeFromString(formulaInput.value);
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
  applyRuleButton.addEventListener("click", function() {
    let formulaSection = window.getSelection();
    if (formulaSection.toString().length === 0) {
      showAlert(`<h5>Nothing is highlighted</h5>Please select part of the formula`);
      return;
    }

    originalTree = buildTreeFromString(formulaToChange.innerHTML);
    let node;
    try {
      node = buildTreeFromString(formulaSection.toString());
    } catch {
      showAlert(`<h5>Section highlighted can't be parsed</h5>Make sure you are highlighting part of the formula from the latest step of your workings.`);
      return;
    }

    // min of anchor and focus offsets prevents errors if user highlights from right to left
    let rootNodeIndex = Math.min(formulaSection.anchorOffset, formulaSection.focusOffset) + node.arrayIndex;
    let nodeToSwap = findNodeWithIndex(rootNodeIndex, originalTree);
    // gives error message if highlighted section doesn't match section of formula in the tree
    if (!nodesEqual(nodeToSwap, node)) {
      showAlert(`<h5>Section highlighted doesn't match formula</h5>If highlighting brackets,
      make sure you get both opening and closing brackets. Be careful with the rules of precedence,
      for example, a∧<span style="background-color:yellow;">b∨c</span> won't work, as b is linked with a(i.e. the same as (a∧b)∨c).`);
      return;
    }

    let previousStep = formulaToChange.innerHTML;
    node = applyRule(node, mySelect.value);
    if (!node) {
      showAlert(`<h5>The rule could not be applied</h5>
        The section highlighted matched the formula but it did not conform to the requirements of the ${mySelect.value} rule.
        Have a look at the rules section(toggle in the Settings or look on the Rules page for more details).`);
      return;
    }
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
      /*
      let change = prompt(`You selected ${mySelect.value} on ${formulaSection}, please enter what you want to change it to:`, `Your change`);
     */
  });

  function setUpWorkingsTable() {
    let formInput = formulaInput.value.replace(/\s+/g, '');
    let transFormula = transformedFormula.value.replace(/\s+/g, '');
    // present the problem to solve with Apply Rule button
    mainBody.innerHTML = "<h3>Prove that " + formInput + " ≡ " + transFormula +
    "</h3><button type='button' id='previousStepButton' class='btn btn-sm btn-outline-dark'>Go back to a previous step</button><p>Highlight the part of the formula you want to change, select the rule and click Apply Rule.</p>" +
    rulesInTool + "<table id=workings><tr id='lastRow'><td id='formulaToChange'>" + formInput + "</td><td id='selectArea'>" + ruleSelect + "</td></tr></table>";
    rulesChecked(); // display rules if checked in the navbar
    console.log(originalTree);
    console.log(finalTree);
  }

  /* NAVBAR SETTINGS */
  function rulesChecked() {
    const rulesCheckbox = document.getElementById('rulesCheckbox');
    const rulesInToolRef = document.getElementById('rulesInTool');
    if (rulesCheckbox.checked === true) {
      rulesInToolRef.style.display = "block";
    } else {
      rulesInToolRef.style.display = "none";
    }
  }

  rulesCheckbox.addEventListener('change', rulesChecked);

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
      row.onclick = function() {
        return false;
      }
    }
  }
}
