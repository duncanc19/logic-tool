/* ALERT BOXES/MODALS */
const modal = document.getElementById("myModal");

function showAlert(text) {
  const span = document.getElementsByClassName("close")[0];
  const modalText = document.getElementById("modalText");

  modalText.innerHTML = text;
  modal.style.display = "block";

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
}

const idempotenceCard = document.getElementById('idempotence');
const commutativityCard = document.getElementById('commutativity');
const associativityCard = document.getElementById('associativity');
const absorptionCard = document.getElementById('absorption');
const distributivityCard = document.getElementById('distributivity');
const negationCard = document.getElementById('negation');
const doubleNegationCard = document.getElementById('doubleNegation');
const deMorganCard = document.getElementById('deMorgan');
const implicationCard = document.getElementById('implication');
const biImplicationCard = document.getElementById('biImplication');

idempotenceCard.addEventListener("click", () => {
  showAlert(`<h3>Idempotence</h3><p>A ∧ A ≡ A</p><p>A ∨ A ≡ A</p>
    <p>The idempotence rule can be used to remove or add the same variable. Below is an example of the idempotence rule being applied in reverse:</p>
    <img class="exampleOfRule" src="/images/idempotence.png" alt="Idempotence applied in reverse">
    <p>It can also be used for a section of a formula, e.g. (a⇒b)∧(a⇒b) ≡ a⇒b.`);
})

commutativityCard.addEventListener("click", () => {
  showAlert(`<h3>Commutativity</h3><p>A ∧ B ≡ B ∧ A</p><p>A ∨ B ≡ B ∨ A</p><p>The commutativity rule can be used
    to move around either variables or parts of the formula linked by ∨ or ∧. Here is an example of it being used with the tool:</p>
    <img class="exampleOfRule" src="/images/commutativity.png" alt="Commutativity applied in reverse">
    <p>Here, as ∧ has higher precedence than ∨ and the whole formula was highlighted when applying the rule,
    the parts before and after the ∨ were switched. You could instead highlight a∧b to change the formula to b∧a∨c.`);
})

associativityCard.addEventListener("click", () => {
  showAlert(`<h3>Associativity</h3><p>A ∧ (B ∧ C) ≡ (A ∧ B) ∧ C</p><p>A ∨ (B ∨ C) ≡ (A ∨ B) ∨ C</p>
  <p>Associativity can be used to bind variables in brackets to other variables if they are linked by the same symbol, either ∧ or ∨.</p>
  <img class="exampleOfRule" src="/images/associativityReverse.png" alt="Associativity applied in reverse">
  <img class="exampleOfRule" src="/images/associativityComplex.png" alt="Associativity applied">
  <p>The first example shows a simple case in reverse. The second example shows a more complex case where there are nested brackets,
  but the rule can be applied the same.`);
})

absorptionCard.addEventListener("click", () => {
  showAlert(`<h3>Absorption</h3><p>A ∧ (A ∨ B) ≡ A</p><p>A ∨ (A ∧ B) ≡ A</p><p>Absorption can
  be used to simplify a formula and can be useful applied in reverse to add an extra variable.</p>
  <img class="exampleOfRule" src="/images/absorptionReverse.png" alt="Absorption applied in reverse">
  <img class="exampleOfRule" src="/images/absorption2.png" alt="Absorption applied in reverse">
  <p>The rule can be applied in reverse to any section of a formula(assuming it conforms to the rules of precedence).`);
})

distributivityCard.addEventListener("click", () => {
  showAlert(`<h5>Distributivity</h5><p>A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)</p><p>A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)</p>
  <p>Here is a more complex example of distributivity being applied with the tool:</p>
  <img class="exampleOfRule" src="/images/distributivity.png" alt="Complex example of distributivity">`);
})
