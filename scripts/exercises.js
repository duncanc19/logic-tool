const tasks = document.querySelectorAll('.task');
// onclick to pass task to the tool page
tasks.forEach(function (task) {
  task.addEventListener("click", function () {
    sessionStorage.setItem("task", this.text);
  });
});
