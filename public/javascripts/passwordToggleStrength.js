document.addEventListener('DOMContentLoaded', () => {
  const pwd = document.getElementById('password');
  const strengthText = document.getElementById('pwdStrength');

  if (!pwd || !strengthText) return;

  function scorePassword(p) {
    let score = 0;
    if (!p) return score;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }

  pwd.addEventListener('input', () => {
    const s = scorePassword(pwd.value);
    const labels = ['Very weak', 'Weak', 'Ok', 'Strong', 'Very strong'];
    strengthText.textContent = labels[s];
    strengthText.style.color = ['#dc3545', '#ff8800', '#f0ad4e', '#28a745', '#0f9d58'][s] || '#666';
  });
});