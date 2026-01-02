/* ============================================================
   1. CONFIGURATION & SETUP
============================================================ */
const CONFIG = {
  // Replace with your actual EmailJS keys
  emailJS: {
    publicKey: "YITu4swbGHXKFsR0q",
    serviceID: "service_kmvnnax",
    templateID: "template_yadt1ng"
  },
  typingSpeed: 100,
  eraseSpeed: 50,
  pauseDelay: 2000
};

// Initialize EmailJS
document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs !== "undefined") {
    emailjs.init(CONFIG.emailJS.publicKey);
  }
});

/* ============================================================
   2. PRELOADER
============================================================ */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const loaderText = preloader.querySelector(".loader-text");
  
  // Simulate system boot sequence
  const stages = ["LOADING CORE...", "CONNECTING NEURAL NET...", "SYSTEM READY"];
  let step = 0;

  const interval = setInterval(() => {
    if (step < stages.length) {
      loaderText.textContent = stages[step];
      loaderText.setAttribute("data-text", stages[step]);
      step++;
    } else {
      clearInterval(interval);
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }
  }, 600);
});

/* ============================================================
   3. NEURAL NETWORK BACKGROUND (CANVAS)
============================================================ */
const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];

// Responsive Canvas Size
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00f3ff"; // Neon Cyan
    ctx.fill();
  }
}

// Create Particle Network
function initParticles() {
  particles = [];
  const count = window.innerWidth < 768 ? 40 : 80; // Fewer particles on mobile
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

// Animation Loop
function animateNetwork() {
  ctx.clearRect(0, 0, width, height);
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Draw connections
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 150})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateNetwork);
}

initParticles();
animateNetwork();


/* ============================================================
   4. TYPING EFFECT (ROLE TEXT)
============================================================ */
const roles = ["AI ENGINEER", "DATA SCIENTIST", "PYTHON DEV"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedOutput = document.querySelector(".typed-output");

function typeEffect() {
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    typedOutput.innerHTML = currentRole.substring(0, charIndex - 1) + '<span class="blink">_</span>';
    charIndex--;
  } else {
    typedOutput.innerHTML = currentRole.substring(0, charIndex + 1) + '<span class="blink">_</span>';
    charIndex++;
  }

  let speed = isDeleting ? CONFIG.eraseSpeed : CONFIG.typingSpeed;

  if (!isDeleting && charIndex === currentRole.length) {
    speed = CONFIG.pauseDelay;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

// Start typing effect
if (typedOutput) typeEffect();


/* ============================================================
   5. HOLOGRAPHIC TILT EFFECT (DESKTOP ONLY)
============================================================ */
const cards = document.querySelectorAll(".tilt-card");

if (window.matchMedia("(min-width: 1024px)").matches) {
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });
}


/* ============================================================
   6. CONTACT FORM HANDLING
============================================================ */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector("button");
    const originalText = btn.innerHTML;
    
    // Cyberpunk loading state
    btn.innerHTML = `<span class="btn-content">TRANSMITTING...</span>`;
    btn.style.opacity = "0.7";

    const params = {
      from_name: document.getElementById("name").value,
      reply_to: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    try {
      await emailjs.send(CONFIG.emailJS.serviceID, CONFIG.emailJS.templateID, params);
      
      // Success State
      btn.innerHTML = `<span class="btn-content" style="color:#00ff00">TRANSMISSION COMPLETE</span>`;
      contactForm.reset();
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = "1";
      }, 3000);
      
    } catch (error) {
      console.error("Transmission Failed:", error);
      btn.innerHTML = `<span class="btn-content" style="color:red">ERROR // RETRY</span>`;
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = "1";
      }, 3000);
    }
  });
}


/* ============================================================
   7. MOBILE MENU TOGGLE
============================================================ */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.querySelector(".navbar nav");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  
  // Toggle icon animation class
  navToggle.classList.toggle("open");
});

// Close menu when clicking a link
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

/* ============================================================
   8. NO DEMO POPUP
============================================================ */
document.querySelectorAll(".no-demo").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const msg = link.getAttribute("data-msg") || "ACCESS DENIED: No Interface Available";
    alert(`[SYSTEM NOTICE]\n${msg}`);
  });
});
      
