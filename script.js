// =================================================================
// 1. SETUP SCENE
// =================================================================
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.035); // Cool fog effect

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// =================================================================
// 2. CREATE 3D OBJECTS (Procedural Geometry)
// =================================================================

// MATERIAL (Cyberpunk Grid Wireframe)
const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true });
const materialSecondary = new THREE.MeshBasicMaterial({ color: 0xbc13fe, wireframe: true });
const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });

// --- OBJECT 1: HERO SECTION (Torus Knot) ---
// This is the complex knot shape at the top
const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const torusMesh = new THREE.Mesh(torusGeometry, material);
torusMesh.position.y = 0; // Top of page
scene.add(torusMesh);

// --- OBJECT 2: PROJECTS SECTION (Floating Cubes) ---
// We create a group of cubes that will float on the right side
const objectsDistance = 4; // Distance between sections vertically
const projectGroup = new THREE.Group();

for(let i=0; i<5; i++) {
    const boxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const box = new THREE.Mesh(boxGeo, materialSecondary);
    
    // Random positions relative to the group center
    box.position.x = (Math.random() - 0.5) * 4;
    box.position.y = (Math.random() - 0.5) * 4;
    box.position.z = (Math.random() - 0.5) * 2;
    
    // Add randomness for rotation
    box.rotation.x = Math.random() * Math.PI;
    box.rotation.y = Math.random() * Math.PI;

    projectGroup.add(box);
}
projectGroup.position.y = -objectsDistance * 1; // 1 section down
projectGroup.position.x = -2; // Move to left so text is on right
scene.add(projectGroup);

// --- OBJECT 3: SKILLS SECTION (Particle Ring) ---
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMesh = new THREE.Points(particlesGeo, particleMaterial);
particlesMesh.position.y = -objectsDistance * 2; // 2 sections down
scene.add(particlesMesh);


// Store objects in array for animation loop
const sectionMeshes = [ torusMesh, projectGroup, particlesMesh ];


// =================================================================
// 3. LIGHTS (Subtle)
// =================================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);


// =================================================================
// 4. SCROLL & MOUSE INTERACTION
// =================================================================

// MOUSE
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / sizes.width - 0.5;
    mouseY = event.clientY / sizes.height - 0.5;
});

// SCROLL
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    const newSection = Math.round(scrollY / sizes.height);
    
    if(newSection !== currentSection) {
        currentSection = newSection;
        
        // Trigger a simple spin animation when entering a new section
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        );
    }
});


// =================================================================
// 5. ANIMATION LOOP
// =================================================================
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate Camera based on Scroll
    // We map scroll Y pixels to 3D Y units
    camera.position.y = -scrollY / sizes.height * objectsDistance;

    // Parallax effect (Mouse movement)
    const parallaxX = mouseX * 0.5;
    const parallaxY = -mouseY * 0.5;
    
    // Smooth camera movement towards mouse position
    camera.position.x += (parallaxX - camera.position.x) * 5 * deltaTime;
    camera.position.y += (parallaxY - camera.position.y) * 5 * deltaTime; // Note: this conflicts slightly with scroll, simplified below:
    
    // Let's refine camera group logic:
    // Actually, simple scroll mapping is better for stability:
    camera.position.y = (-scrollY / sizes.height * objectsDistance); 
    
    // Rotate Meshes continuously
    torusMesh.rotation.x += deltaTime * 0.1;
    torusMesh.rotation.y += deltaTime * 0.12;

    projectGroup.rotation.y += deltaTime * 0.05;
    
    // Rotate individual cubes in project group
    projectGroup.children.forEach(child => {
        child.rotation.x += deltaTime * 0.1;
    });

    particlesMesh.rotation.y = elapsedTime * 0.05;

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();


// =================================================================
// 6. RESIZE HANDLER
// =================================================================
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// =================================================================
// 7. PRELOADER & UI LOGIC
// =================================================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Hide loader
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

// EmailJS Init (Replace with your actual key)
emailjs.init("YOUR_PUBLIC_KEY_HERE");

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'TRANSMITTING...';
    
    setTimeout(() => {
        alert("TRANSMISSION SUCCESSFUL");
        btn.innerText = originalText;
        this.reset();
    }, 2000);
});
