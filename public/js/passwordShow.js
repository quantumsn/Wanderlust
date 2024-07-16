let eye = document.querySelector(".pass-show");
let password = document.querySelector(".password");
let icon = document.querySelector(".fa-eye-slash");
eye.addEventListener("click", (event) => {
  if (icon.getAttribute("class") == "fa-solid fa-eye-slash") {
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
    password.type = "text";
  } else {
    icon.classList.add("fa-eye-slash");
    icon.classList.remove("fa-eye");
    password.type = "password";
  }
});
