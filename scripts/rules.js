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

idempotenceCard.addEventListener("click", () => {
  showAlert(`<h3>Idempotence</h3><p>A ∧ A ≡ A</p><p>A ∨ A ≡ A</p>
    <p>The idempotence rule can be used to remove or add the same variable. Below is an example of the idempotence rule being applied in reverse:</p>
    <img class="exampleOfRule" src="/images/idempotence.png" alt="Idempotence applied in reverse">
    <p>It can also be used for a section of a formula, e.g. (a⇒b)∧(a⇒b) ≡ a⇒b.`);
})
