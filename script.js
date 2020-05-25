const andButton = document.getElementById("andButton");
const orButton = document.getElementById("orButton");
const ifButton = document.getElementById("ifButton");
const onlyIfButton = document.getElementById("onlyIfButton");
const notButton = document.getElementById("notButton");

const formulaInput = document.getElementById('formula');


andButton.addEventListener("click", function() { addSymbol(0) });
orButton.addEventListener("click", function() { addSymbol(1) });
ifButton.addEventListener("click", function() { addSymbol(2) });
onlyIfButton.addEventListener("click", function() { addSymbol(3) });
notButton.addEventListener("click", function() { addSymbol(4) });

function addSymbol(whichButton)
{
  switch(whichButton) {
    case 0:
      formulaInput.value += "∧";
      break;
    case 1:
      formulaInput.value += "∨";
      break;
    case 2:
      formulaInput.value += "⇒";
      break;
    case 3:
      formulaInput.value += "⇔";
      break;
    case 4:
      formulaInput.value += "¬";
      break;
    }
}
