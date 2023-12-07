const passwordField = document.getElementById("password");
const passwordConfirmField = document.getElementById("confirmPassword");

const form = document.getElementById("regFrm");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (passwordField.value != passwordConfirmField.value) {
    passwordField.classList.add("error");
    passwordConfirmField.classList.add("error");
  } else {
    form.submit();
  }
});