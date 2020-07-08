const tasks = document.querySelectorAll('.task');

tasks.forEach(function (task) {
  task.addEventListener("click", function () {
    sessionStorage.setItem("task", this.text);
  });
});
