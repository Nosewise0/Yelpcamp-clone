document.addEventListener('DOMContentLoaded', () => {
  const attachToggle = (btnId, inputId) => {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        if (isPassword) {
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-slash');
        } else {
          icon.classList.remove('bi-eye-slash');
          icon.classList.add('bi-eye');
        }
      } else {
        btn.textContent = isPassword ? 'Hide' : 'Show';
      }

      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  };

  attachToggle('togglePassword', 'password');
  attachToggle('togglePwd', 'password');
  attachToggle('toggleConfirmPwd', 'confirmPassword');
});