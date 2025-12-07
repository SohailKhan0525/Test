/* ============================================================
   EMAILJS CONFIG + CONTACT FORM
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  if (window.emailjs) {
    emailjs.init("YITu4swbGHXKFsR0q"); // your public key
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showPopup("Please fill all fields.", false);
      return;
    }

    if (!window.emailjs) {
      showPopup("Email service not loaded. Try again later.", false);
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
});

/* POPUP TOAST */
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
    boxShadow: "0 10px 25px rgba(0,0,0,0.6)"
  });

  p.textContent = msg;
  setTimeout(() => (p.style.opacity = "0"), 2600);
}

/* ============================================================
   SKILLS — CATEGORY FIRST, THEN ITEMS
============================================================ */
(function () {
  const categories = document.querySelectorAll(".skill-category");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const cat = entry.target;
        cat.classList.add("visible");

        // progress bars
        const fills = cat.querySelectorAll(".fill");
        fills.forEach((f, i) => {
          const level = parseInt(f.getAttribute("data-level") || 0, 10);
          const width = level <= 5 ? 5 : level;
          setTimeout(() => (f.style.width = width + "%"), 200 + i * 120);
        });

        obs.unobserve(cat);
      });
    },
    { threshold: 0.2 }
  );

  categories.forEach((c) => obs.observe(c));
})();

/* ============================================================
   NAVBAR — SMOOTH SCROLL + ACTIVE HIGHLIGHT
============================================================ */
(function () {
  const navLinks = document.querySelectorAll(".navbar nav a");

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 90;

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
})();

/* ============================================================
   3D BACKGROUND — THREE.JS
============================================================ */
(function () {
  const canvas = document.getElementById("three-bg");
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02040a, 0.18);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    50
  );
  camera.position.set(0, 1.6, 5);

  // lights
  const ambient = new THREE.AmbientLight(0x5577ff, 0.6);
  const dir = new THREE.DirectionalLight(0x88ccff, 1.3);
  dir.position.set(4, 6, 4);
  scene.add(ambient, dir);

  // main shapes group
  const group = new THREE.Group();
  scene.add(group);

  // torus knot (energy ring)
  const torusGeo = new THREE.TorusKnotGeometry(1.1, 0.25, 180, 32);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x3acbff,
    emissive: 0x1a72a8,
    emissiveIntensity: 0.8,
    metalness: 0.7,
    roughness: 0.35,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(-1.2, 0.3, 0);
  group.add(torus);

  // glowing icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x6f87ff,
    emissive: 0x2534a0,
    emissiveIntensity: 0.8,
    metalness: 0.6,
    roughness: 0.4,
    wireframe: false,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(1.4, -0.2, -0.6);
  group.add(ico);

  // floating orbs
  const orbGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x4bb8ff,
    emissive: 0x1a9fd8,
    emissiveIntensity: 0.9,
    metalness: 0.4,
    roughness: 0.2,
  });

  const orbs = [];
  for (let i = 0; i < 18; i++) {
    const m = new THREE.Mesh(orbGeo, orbMat);
    const r = 2.3 + Math.random() * 1.4;
    const a = Math.random() * Math.PI * 2;
    const y = -0.8 + Math.random() * 2.2;
    m.userData = { radius: r, angle: a, speed: 0.15 + Math.random() * 0.35, baseY: y };
    m.position.set(
      Math.cos(a) * r,
      y,
      Math.sin(a) * r
    );
    group.add(m);
    orbs.push(m);
  }

  // star field
  const starGeo = new THREE.BufferGeometry();
  const starCount = 500;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0x6f87ff,
    size: 0.04,
    transparent: true,
    opacity: 0.9,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.position.y = -2;
  scene.add(stars);

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  onResize();
  window.addEventListener("resize", onResize);

  // mouse parallax
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("pointermove", (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseX = x;
    mouseY = y;
  });

  let last = performance.now();
  function animate() {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;

    // group + main shapes
    group.rotation.y += 0.12 * dt;
    torus.rotation.x += 0.3 * dt;
    torus.rotation.y -= 0.25 * dt;
    ico.rotation.x -= 0.22 * dt;
    ico.rotation.z += 0.18 * dt;

    // orbiting orbs
    orbs.forEach((orb) => {
      const d = orb.userData;
      d.angle += d.speed * dt * 0.6;
      const bob = Math.sin(now * 0.001 + d.radius) * 0.25;
      orb.position.set(
        Math.cos(d.angle) * d.radius,
        d.baseY + bob,
        Math.sin(d.angle) * d.radius
      );
    });

    // parallax camera
    const targetX = mouseX * 0.6;
    const targetY = 1.6 + mouseY * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.lookAt(0, 0.6, 0);

    stars.rotation.y += 0.01 * dt;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ============================================================
   PROJECT CARDS — 3D Tilt (DOM level, not Three.js)
============================================================ */
(function () {
  const cards = document.querySelectorAll(".project-card-3d");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotX = (y - 0.5) * 16;
      const rotY = (x - 0.5) * -16;

      card.style.transform =
        `translateY(-4px) scale(1.01) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "translateY(0) scale(1) perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
})();

/* ============================================================
   SKILL TILE 3D TILT (DOM)
============================================================ */
(function () {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;

      const rx = (y - 0.5) * 10;
      const ry = (x - 0.5) * -10;

      el.style.transform =
        `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
})();

/* ============================================================
   ROLE ROTATION
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
    }, 300);
  }, 3000);
})();

/* ============================================================
   SECTIONS PARALLAX (3D scroll depth)
============================================================ */
(function () {
  const layers = document.querySelectorAll(".depth-layer");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;

    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "0");
      const translateY = scrollY * depth * -0.4;
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  });
})();

/* ============================================================
   DARK / LIGHT MODE TOGGLE
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

/* ============================================================
   PRELOADER FADE OUT
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
   NO-LIVE-DEMO POPUP HANDLER
============================================================ */
(function () {
  document.querySelectorAll(".no-demo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const msg =
        btn.getAttribute("data-message") ||
        "No live demo available for this project.";
      showPopup(msg, false);
    });
  });
})();