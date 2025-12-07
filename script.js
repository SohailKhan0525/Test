/* ============================
   THEME TOGGLE WITH SAVE
============================ */
(function () {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    toggle.classList.add("light");
  }

  toggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light-mode");
    toggle.classList.toggle("light", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
})();

/* ============================
   SMOOTH SCROLL + ACTIVE NAV
============================ */
(function () {
  const navLinks = document.querySelectorAll(".navbar nav a");
  const sections = document.querySelectorAll("section[id]");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      const offset = target.offsetTop - 90;
      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 130;
    let current = "";

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  });
})();

/* ============================
   3D HOVER TILT (CARDS + SKILLS)
============================ */
(function () {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      el.style.transform = `
        rotateX(${y * 14}deg)
        rotateY(${-x * 14}deg)
        translateY(-8px)
      `;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

/* ============================
   SKILL BAR ANIMATION
============================ */
(function () {
  const fills = document.querySelectorAll(".fill");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;

        const level = e.target.getAttribute("data-level");
        e.target.style.width = level + "%";

        obs.unobserve(e.target);
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach((bar) => obs.observe(bar));
})();

/* ============================
   LIVE DEMO BLOCKER POPUP
============================ */
(function () {
  const demoButtons = document.querySelectorAll(".project-btn[data-nodemo]");

  demoButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showPopup("No live demo available for this project", false);
    });
  });
})();

/* ============================
   CONTACT FORM POPUP (SAFE)
============================ */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("message").value.trim();

    if (!name || !email || !msg) {
      showPopup("Please fill all fields", false);
      return;
    }

    showPopup("Message sent successfully ✅", true);
    form.reset();
  });
})();

/* ============================
   POPUP SYSTEM
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
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    background: ok ? "#4bb8ff" : "#ff4b4b",
    color: "#000",
    opacity: "1",
    zIndex: "99999",
    transition: "opacity .5s",
  });

  p.textContent = msg;
  setTimeout(() => (p.style.opacity = "0"), 2500);
}