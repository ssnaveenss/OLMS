/* ============================================================
   OLMS — Login Page Logic
   Particle animation, form validation, login flow
   ============================================================ */

const LoginPage = (() => {
  let particlesAnimationId = null;

  function init() {
    initParticles();
    setupForm();
  }

  // ── Particle Background ──
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(162, 155, 254, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      particlesAnimationId = requestAnimationFrame(animate);
    }

    animate();

    // GSAP entrance animation for login card
    if (typeof gsap !== 'undefined') {
      const card = document.querySelector('.login-card');
      if (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
        );
      }

      // Logo animation
      const logo = document.querySelector('.login-logo');
      if (logo) {
        gsap.fromTo(logo,
          { opacity: 0, scale: 0, rotation: -180 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.4 }
        );
      }

      // Form fields stagger
      const formGroups = document.querySelectorAll('.login-form .form-group');
      if (formGroups.length) {
        gsap.fromTo(formGroups,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.6 }
        );
      }

      // Button
      const loginBtn = document.querySelector('.login-btn');
      if (loginBtn) {
        gsap.fromTo(loginBtn,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.9 }
        );
      }
    }
  }

  // ── Form Setup ──
  function setupForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginBtn = document.getElementById('login-submit-btn');
    const loginCard = document.querySelector('.login-card');
    const successOverlay = document.querySelector('.login-success-overlay');

    // Password toggle
    const passToggle = document.querySelector('.password-toggle');
    if (passToggle) {
      passToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passToggle.innerHTML = type === 'password'
          ? '<i class="fas fa-eye"></i>'
          : '<i class="fas fa-eye-slash"></i>';
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Reset errors
      emailError.classList.remove('visible');
      passwordError.classList.remove('visible');
      emailInput.style.borderColor = '';
      passwordInput.style.borderColor = '';

      // Validate email
      const email = emailInput.value.trim();
      if (!email) {
        emailError.textContent = '⚠ Email is required';
        emailError.classList.add('visible');
        emailInput.style.borderColor = 'var(--danger)';
        valid = false;
      } else if (!email.includes('@')) {
        emailError.textContent = '⚠ Please enter a valid email';
        emailError.classList.add('visible');
        emailInput.style.borderColor = 'var(--danger)';
        valid = false;
      }

      // Validate password
      const password = passwordInput.value;
      if (!password) {
        passwordError.textContent = '⚠ Password is required';
        passwordError.classList.add('visible');
        passwordInput.style.borderColor = 'var(--danger)';
        valid = false;
      } else if (password.length < 3) {
        passwordError.textContent = '⚠ Password must be at least 3 characters';
        passwordError.classList.add('visible');
        passwordInput.style.borderColor = 'var(--danger)';
        valid = false;
      }

      if (!valid) {
        // Shake animation
        loginCard.classList.remove('shake');
        void loginCard.offsetWidth; // Force reflow
        loginCard.classList.add('shake');

        if (typeof gsap !== 'undefined') {
          const visibleErrors = document.querySelectorAll('.form-error.visible');
          gsap.fromTo(visibleErrors,
            { opacity: 0, y: -8 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
          );
        }
        return;
      }

      // Show loading state
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;

      // Simulate login delay
      setTimeout(() => {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;

        // Show success overlay
        if (successOverlay) {
          successOverlay.classList.add('active');
          if (typeof gsap !== 'undefined') {
            const checkmark = successOverlay.querySelector('.success-checkmark');
            gsap.fromTo(checkmark,
              { scale: 0, rotation: -90 },
              { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
            );
          }
        }

        // Navigate to dashboard after short delay
        setTimeout(() => {
          sessionStorage.setItem('olms-logged-in', 'true');
          if (successOverlay) successOverlay.classList.remove('active');
          // Cancel particle animation
          if (particlesAnimationId) cancelAnimationFrame(particlesAnimationId);
          App.navigateTo('dashboard');
          Toast.show('Welcome Back!', 'Successfully signed in to OLMS.', 'success');
        }, 1200);
      }, 1500);
    });
  }

  return { init };
})();
