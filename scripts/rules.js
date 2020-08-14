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
const rulesOfPrecedence = document.getElementById('rulesOfPrecedence');

idempotenceCard.addEventListener("click", () => {
  showAlert(`<h3>Idempotence</h3><p>A ∧ A ≡ A</p><p>A ∨ A ≡ A</p>
    <p>The idempotence rule can be used to remove or add the same variable. Below is an example of the idempotence rule being applied in reverse:</p>
    <img class="exampleOfRule" src="../images/idempotence.png" alt="Idempotence applied in reverse">
    <p>It can also be used for a section of a formula, e.g. (a⇒b)∧(a⇒b) ≡ a⇒b.`);
});

commutativityCard.addEventListener("click", () => {
  showAlert(`<h3>Commutativity</h3><p>A ∧ B ≡ B ∧ A</p><p>A ∨ B ≡ B ∨ A</p><p>The commutativity rule can be used
    to move around either variables or parts of the formula linked by ∨ or ∧. Here is an example of it being used with the tool:</p>
    <img class="exampleOfRule" src="../images/commutativity.png" alt="Commutativity applied in reverse">
    <p>Here, as ∧ has higher precedence than ∨ and the whole formula was highlighted when applying the rule,
    the parts before and after the ∨ were switched. You could instead highlight a∧b to change the formula to b∧a∨c.`);
});

associativityCard.addEventListener("click", () => {
  showAlert(`<h3>Associativity</h3><p>A ∧ (B ∧ C) ≡ (A ∧ B) ∧ C</p><p>A ∨ (B ∨ C) ≡ (A ∨ B) ∨ C</p>
  <p>Associativity can be used to bind variables in brackets to other variables if they are linked by the same symbol, either ∧ or ∨.</p>
  <img class="exampleOfRule" src="../images/associativityReverse.png" alt="Associativity applied in reverse">
  <img class="exampleOfRule" src="../images/associativityComplex.png" alt="Associativity applied">
  <p>The first example shows a simple case in reverse. The second example shows a more complex case where there are nested brackets,
  but the rule can be applied the same.`);
});

absorptionCard.addEventListener("click", () => {
  showAlert(`<h3>Absorption</h3><p>A ∧ (A ∨ B) ≡ A</p><p>A ∨ (A ∧ B) ≡ A</p><p>Absorption can
  be used to simplify a formula and can be useful applied in reverse to add an extra variable.</p>
  <img class="exampleOfRule" src="../images/absorptionReverse.png" alt="Absorption applied in reverse">
  <img class="exampleOfRule" src="../images/absorption2.png" alt="Absorption applied in reverse">
  <p>The rule can be applied in reverse to any section of a formula(assuming it conforms to the rules of precedence).`);
});

distributivityCard.addEventListener("click", () => {
  showAlert(`<h3>Distributivity</h3><p>A ∧ (B ∨ C) ≡ (A ∧ B) ∨ (A ∧ C)</p><p>A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)</p>
  <p>Here is a more complex example of distributivity being applied with the tool:</p>
  <img class="exampleOfRule" src="../images/distributivity.png" alt="Complex example of distributivity">`);
});

negationCard.addEventListener("click", () => {
  showAlert(`<h3>Negation</h3><p>A ∧ (¬A) ≡ false</p><p>A ∨ (¬A) ≡ true</p>
  <p>Negation can be used to replace a formula which must always be true/false. It can be useful to use in reverse as
  true or false can be replaced by any variable. Here is an example of using negation to change the variables in a formula:
  <img class="exampleOfRule" src="../images/negation.png" alt="Example of negation">`);
});

doubleNegationCard.addEventListener("click", () => {
  showAlert(`<h3>Double Negation</h3><p>¬(¬A) ≡ A</p>
  <p>Double negation can be applied to either remove two negations or to add two negations in front of a variable.</p>
  <p>It can be applied to a single variable or a section of a formula. Here is an example of it applied both forwards and backwards:</p>
  <img class="exampleOfRule" src="../images/doubleNegation.png" alt="Example of double negation">`);
});

deMorganCard.addEventListener("click", () => {
  showAlert(`<h3>de Morgan</h3><p>¬(A ∧ B) ≡ (¬A) ∨ (¬B)</p><p>¬(A ∨ B) ≡ (¬A) ∧ (¬B)</p>
  <p>de Morgan's rules are named after a British mathematician from the 19th century and are regularly used in
  computer programs and circuit design. The rules can be described as 'not (A or B) = not A and not B; and
    not (A and B) = not A or not B'. Here is an example of the rule being applied with the tool:</p>
    <img class="exampleOfRule" src="../images/deMorgan.png" alt="Example of de Morgan rule">`);
});

implicationCard.addEventListener("click", () => {
  showAlert(`<h3>Implication</h3><p>A ⇒ B ≡ (¬A) ∨ B</p><p>The implication rule plays an important role in semantic equivalence exercises,
  as it is the only rule which can change the implication symbol(with the exception of bi-implication).
  Here is an example of the rule applied in reverse:</p>
  <img class="exampleOfRule" src="../images/implication.png" alt="Example of implication rule">`);
});

biImplicationCard.addEventListener("click", () => {
  showAlert(`<h3>Bi-Implication</h3><p>A ⇔ B ≡ (A ⇒ B) ∧ (B ⇒ A)</p><p>The bi-implication symbol is often thought of as 'A is true if and only if B is true'
  and is semantically equivalent to saying A implies B and B implies A. Here is an example of the bi-implication rule being applied with the tool:</p>
  <img class="exampleOfRule" src="../images/biImplication.png" alt="Example of bi-implication rule">`);
});

rulesOfPrecedence.addEventListener("click", () => {
  showAlert(`<h5>Rules of Precedence</h5><p>The order of precedence from highest to lowest: ¬, ∧, ∨, ⇒, ⇔</p>
    <p>The rules of precedence tell us the order in which symbols are applied, in a similar way to BODMAS in maths. This means that brackets are not always
    necessary if the formula follows the rules of precedence.</p><p>For example, (A ∧ B) ∨ C is equivalent to A ∧ B ∨ C, as ∧ has higher precedence than ∨.
    It is particularly important to be aware of the order of precedence when using the tool, as it may remove unnecessary brackets.</p>
    <p>This means that attempting to apply commutativity for example on A ∧ <span style="background-color: yellow">B ∨ C</span> would fail, as B is bound to
    the ∧ symbol.</p>`);
});
