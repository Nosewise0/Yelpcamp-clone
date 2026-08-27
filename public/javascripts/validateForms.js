// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Check password matching on registration forms
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    if (password && confirmPassword) {
      const validateMatch = () => {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Passwords do not match");
        } else {
          confirmPassword.setCustomValidity("");
        }
      };
      password.addEventListener("input", validateMatch);
      confirmPassword.addEventListener("input", validateMatch);
    }
  }

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();
