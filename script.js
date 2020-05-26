const andButton = document.getElementById("andButton");
const orButton = document.getElementById("orButton");
const ifButton = document.getElementById("ifButton");
const onlyIfButton = document.getElementById("onlyIfButton");
const notButton = document.getElementById("notButton");

const formulaInput = document.getElementById('formula');
const transformedFormula = document.getElementById('transformedFormula');

let currentTextBox;


andButton.addEventListener("click", function() { addSymbol(0) });
orButton.addEventListener("click", function() { addSymbol(1) });
ifButton.addEventListener("click", function() { addSymbol(2) });
onlyIfButton.addEventListener("click", function() { addSymbol(3) });
notButton.addEventListener("click", function() { addSymbol(4) });

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
  } else {
    alert("Please select a text box!");
  }
}

function selectTextBox(textBox) {
    currentTextBox = document.getElementById(textBox);
}
