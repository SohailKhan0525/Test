/* ============================================================
   TOAST POPUP (used by form + no-demo buttons)
============================================================ */
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
    borderRadius: "10px",
    fontWeight: "700",
    background: ok ? "#00c8ff" : "#ff4b4b",
    color: "#000",
    opacity: "1",
    zIndex: 9999,
    transition: "opacity .6s ease",
  });

  p.textContent = msg;
  setTimeout(() => (p.style.opacity = "0"), 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     EMAILJS CONTACT FORM
  ============================================================ */
  if (window.emailjs) {
    emailjs.init("YITu4swbGHXKFsR0q"); // your public key
  }

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showPopup("Please fill all fields.", false);
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
        console.error(err);
        showPopup("Failed to send — try again.", false);
      }
    });
  }

  /* ============================================================
     NAVBAR — SMOOTH SCROLL + ACTIVE HIGHLIGHT
  ============================================================ */
  const navLinks = document.querySelectorAll(".navbar nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // 3D page-transition flash
      triggerPageTransition();

      const offset =
        target.getBoundingClientRect().top + window.scrollY - 90;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    });
  });

  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    const top = window.scrollY + 120;
    let current = "";

    sections.forEach((sec) => {
      if (top >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  });

  /* ============================================================
     3D SCROLL DEPTH (PARALLAX SECTIONS / HEADER / FOOTER)
  ============================================================ */
  const parallaxEls = document.querySelectorAll(
    "header[data-depth], section[data-depth], footer[data-depth]"
  );

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const depth = parseFloat(el.getAttribute("data-depth") || "0");
      const translateY = -(scrollY * depth);
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  }

  updateParallax();
  window.addEventListener("scroll", updateParallax);

  /* ============================================================
     SCROLL REVEAL (reveal-on-scroll)
  ============================================================ */
  const revealEls = document.querySelectorAll(".reveal-on-scroll");

  if (revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          revealObs.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ============================================================
     3D CARD TILT (Projects + Skills + Hero orbit wrapper)
  ============================================================ */
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.style.transformStyle = "preserve-3d";

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (y - 0.5) * 18; // depth
      const rotateY = (x - 0.5) * -18;

      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
      el.style.transition = "transform .45s ease";
      setTimeout(() => (el.style.transition = ""), 460);
    });
  });

  /* ============================================================
     PROJECT CARDS — REVEAL + GLOW SPARKS + BORDER PULSE
  ============================================================ */
  const projectCards = document.querySelectorAll(".project-card-3d");

  if (projectCards.length) {
    // Reveal (already have global reveal, but we allow stagger here)
    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          cardObs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    projectCards.forEach((card) => {
      cardObs.observe(card);

      // Spark canvas
      const canvas =
        card.querySelector(".project-glow-canvas") ||
        document.createElement("canvas");
      canvas.className = "project-glow-canvas";
      card.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      function resizeCanvas() {
        canvas.width = card.clientWidth;
        canvas.height = card.clientHeight;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const sparks = [];
      for (let i = 0; i < 16; i++) {
        sparks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 1 + Math.random() * 2,
          a: 0.15 + Math.random() * 0.25,
        });
      }

      function animateSparks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sparks.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.fillStyle = `rgba(75,184,255,${p.a})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(animateSparks);
      }
      animateSparks();

      // Border pulse via boxShadow / border color
      let glow = 0;
      function borderGlow() {
        glow += 0.03;
        const t = (Math.sin(glow) + 1) / 2;
        const hue = 190 + t * 40;
        const alpha = 0.25 + t * 0.25;

        card.style.boxShadow = `0 24px 60px rgba(0,0,0,0.75), 0 0 ${
          14 + t * 16
        }px rgba(75,184,255,0.35)`;
        card.style.border = `1px solid hsla(${hue},90%,65%,${alpha})`;

        requestAnimationFrame(borderGlow);
      }
      borderGlow();
    });
  }

  /* ============================================================
     3D BUTTON PRESS PHYSICS
  ============================================================ */
  const buttons3D = document.querySelectorAll(".btn-3d");

  buttons3D.forEach((btn) => {
    btn.addEventListener("mousedown", () => {
      btn.classList.add("pressed");
    });
    btn.addEventListener("mouseup", () => {
      btn.classList.remove("pressed");
    });
    btn.addEventListener("mouseleave", () => {
      btn.classList.remove("pressed");
    });
    btn.addEventListener("touchstart", () => {
      btn.classList.add("pressed");
    });
    btn.addEventListener("touchend", () => {
      btn.classList.remove("pressed");
    });
  });

  /* ============================================================
     ROLE ROTATION (AI Engineer / Tech Enthusiast)
  ============================================================ */
  (function () {
    const role = document.getElementById("role");
    if (!role) return;

    const roles = ["AI Engineer", "Tech Enthusiast"];
    let i = 0;

    setInterval(() => {
      role.style.opacity = "0";
      setTimeout(() => {
        i = (i + 1) % roles.length;
        role.textContent = roles[i];
        role.style.opacity = "1";
      }, 260);
    }, 3000);
  })();

  /* ============================================================
     NO LIVE DEMO POPUP
  ============================================================ */
  document.querySelectorAll(".no-demo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const message =
        btn.getAttribute("data-message") ||
        "No live demo available for this project.";
      showPopup(message, false);
    });
  });

  /* ============================================================
     THEME TOGGLE (Dark / Light)
  ============================================================ */
  (function () {
    const toggle = document.getElementById("theme-toggle");
    const body = document.body;
    if (!toggle) return;

    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      body.classList.add("light-mode");
      toggle.classList.add("light");
    }

    toggle.addEventListener("click", () => {
      const isLight = body.classList.toggle("light-mode");
      toggle.classList.toggle("light", isLight);
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  })();
});

/* ============================================================
   PRELOADER FADE-OUT
============================================================ */
window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  if (!loader) return;

  loader.classList.add("fade-out");
  setTimeout(() => {
    loader.style.display = "none";
  }, 600);
});

/* ============================================================
   3D PAGE TRANSITION OVERLAY
============================================================ */
function triggerPageTransition() {
  const overlay = document.getElementById("page-transition");
  if (!overlay) return;

  overlay.classList.remove("pt-active");
  // reflow to restart animation
  void overlay.offsetWidth;
  overlay.classList.add("pt-active");
}