// script.js

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

const canvas = document.getElementById("binaryCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = 200; // footer height

const binary = "01";
const fontSize = 16;
const columns = Math.floor(width / fontSize);
const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100; // start randomly above
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#00bfff";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = binary[Math.floor(Math.random() * binary.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }

  requestAnimationFrame(draw);
}

draw();

// Update canvas size on window resize
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = 200;
});

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target); // animate only once
    }
  });
}, { threshold: 0.2 }); // trigger when 20% visible

hiddenElements.forEach(el => observer.observe(el));

// Starfield with depth effect
const starCanvas = document.getElementById("starfield");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, starCanvas.clientWidth / starCanvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: starCanvas, alpha: true });
renderer.setSize(starCanvas.clientWidth, starCanvas.clientHeight);

// Create stars with depth and size
const starCount = 1500;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = [];
const starSizes = [];

for (let i = 0; i < starCount; i++) {
  const depth = Math.random() * 400 - 200; // z position
  starPositions.push((Math.random() - 0.5) * 200); // x
  starPositions.push((Math.random() - 0.5) * 200); // y
  starPositions.push(depth); // z
  starSizes.push(Math.random() * 1.2 + 0.3); // size variation
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

// Material for stars
const starsMaterial = new THREE.PointsMaterial({
  color: 0x00bfff,
  size: 0.5,
  sizeAttenuation: true, // closer stars appear bigger
  transparent: true
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

camera.position.z = 50;

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animateStars() {
  requestAnimationFrame(animateStars);

  const positions = starField.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const z = positions[i + 2];
    const speed = (200 - Math.abs(z)) * 0.0005; // closer stars move faster
    positions[i + 2] += speed;
    if (positions[i + 2] > 200) positions[i + 2] = -200; // wrap around
  }
  starField.geometry.attributes.position.needsUpdate = true;

  // Parallax effect with mouse
  camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 25 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animateStars();

function resizeStarCanvas() {
  const rect = starCanvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeStarCanvas);
resizeStarCanvas();