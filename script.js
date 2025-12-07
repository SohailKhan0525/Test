/* ============================
   EMAILJS CONFIG
============================ */
document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("YITu4swbGHXKFsR0q");

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showPopup("Please fill all fields", false);
      return;
    }

    try {
      await emailjs.send("service_kmvnnax", "template_yadt1ng", {
        from_name: name,
        reply_to: email,
        message,
      });

      showPopup("Message sent — thank you!", true);
      form.reset();
    } catch (err) {
      showPopup("Failed to send — try again.", false);
    }
  });
});

/* ============================
   POPUP TOAST SYSTEM
============================ */
function showPopup(msg, ok = true) {
  let p = document.getElementById("popup");
  if (!p) {
    p = document.createElement("div");
    p.id = "popup";
    document.body.appendChild(p);
  }

  Object.assign(p.style, {
    position: "fixed",
    bottom: "36px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "999px",
    fontWeight: "700",
    background: ok ? "#00c8ff" : "#ff4b4b",
    color: "#000",
    opacity: "1",
    zIndex: 99999,
    transition: "opacity .5s ease",
  });

  p.textContent = msg;
  setTimeout(() => (p.style.opacity = "0"), 2400);
}

/* ============================
   3D SCROLL PARALLAX
============================ */
document.addEventListener("scroll", () => {
  const depthItems = document.querySelectorAll(".hero-left, .hero-right, .project-card-3d, .skill-category");

  depthItems.forEach(el => {
    const speed = el.dataset.depth || 0.15;
    el.style.transform = `translateZ(${window.scrollY * speed}px)`;
  });
});

/* ============================
   TRUE 3D MOUSE DEPTH ENGINE
============================ */
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  document.querySelectorAll(".project-card-3d, .skill-item, .logo-frame").forEach(el => {
    el.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
});

/* ============================
   PROJECT REVEAL ON SCROLL
============================ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".project-card-3d, .skill-category").forEach(el => {
  revealObserver.observe(el);
});

/* ============================
   SKILLS PROGRESS BARS
============================ */
document.querySelectorAll(".fill").forEach(bar => {
  const level = bar.dataset.level;
  setTimeout(() => {
    bar.style.width = level + "%";
  }, 400);
});

/* ============================
   ROLE ROTATION
============================ */
const role = document.getElementById("role");
if (role) {
  const roles = ["AI Engineer", "Tech Enthusiast", "ML Engineer"];
  let i = 0;

  setInterval(() => {
    role.style.opacity = "0";
    setTimeout(() => {
      role.textContent = roles[i++ % roles.length];
      role.style.opacity = "1";
    }, 300);
  }, 2500);
}

/* ============================
   NO LIVE DEMO POPUP
============================ */
document.querySelectorAll(".no-demo").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const msg = btn.dataset.message || "No live demo available.";
    showPopup(msg, false);
  });
});

/* ============================
   DARK / LIGHT MODE
============================ */
const toggle = document.getElementById("theme-toggle");
const body = document.body;

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  toggle.classList.add("light");
}

toggle.addEventListener("click", () => {
  const isLight = body.classList.toggle("light-mode");
  toggle.classList.toggle("light", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

/* ============================
   PRELOADER
============================ */
window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  loader.classList.add("fade-out");

  setTimeout(() => {
    loader.style.display = "none";
  }, 700);
});
