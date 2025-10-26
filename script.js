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

