/* ============================================================
   1. THREE.JS PARTICLE NETWORK (Background)
============================================================ */
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// PARTICLES SETUP
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500; // Number of stars
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20; // Spread factor
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// MATERIAL
const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f2ff, // Cyan
    transparent: true,
    opacity: 0.8,
});

// MESH
const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

camera.position.z = 3;

// MOUSE INTERACTION
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// ANIMATION LOOP
const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the entire galaxy slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseY * 0.0001;
    particlesMesh.rotation.y += mouseX * 0.0001;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};
animate();

// RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


/* ============================================================
   2. UI INTERACTIONS
============================================================ */

// PRELOADER
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }, 1000);
});

// TYPEWRITER EFFECT
const words = ["Machine Learning.", "Data Science.", "Intelligent Systems."];
let i = 0;
let timer;

function typeWriter() {
    const heading = document.getElementById("typewriter");
    let word = words[i];
    let j = 0;
    let isDeleting = false;

    function loop() {
        heading.innerHTML = word.substring(0, j);
        if (!isDeleting && j < word.length) {
            j++;
            timer = setTimeout(loop, 100);
        } else if (isDeleting && j > 0) {
            j--;
            timer = setTimeout(loop, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) i = (i + 1) % words.length;
            timer = setTimeout(loop, isDeleting ? 1000 : 500);
            word = words[i];
        }
    }
    loop();
}
typeWriter();

// 3D CARD TILT EFFECT (Vanilla JS)
const cards = document.querySelectorAll('[data-tilt]');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});
// (You can add class="fade-in" to HTML elements you want to animate on scroll)


// EMAILJS FORM HANDLER
// Replace with your actual PUBLIC KEY from EmailJS dashboard
emailjs.init("YOUR_PUBLIC_KEY"); 

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Sending...';
    
    // Simulate sending for now
    setTimeout(() => {
        alert('Message sent successfully! (Connect your EmailJS Key to make this real)');
        btn.innerHTML = originalText;
        this.reset();
    }, 1500);
});
