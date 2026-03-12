
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.register-link');
const registerLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const iconMinimize = document.querySelector('.icon-minimize');

// Form switch
loginLink.onclick = () => { wrapper.classList.add('active'); };
registerLink.onclick = () => { wrapper.classList.remove('active'); };

// Window controls
btnPopup.onclick = () => { wrapper.classList.add('active-popup'); wrapper.classList.remove('minimized'); };
iconClose.onclick = () => { wrapper.classList.remove('active-popup'); };
iconMinimize.onclick = () => { wrapper.classList.add('minimized'); };

// Password Show/Hide Logic
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.onclick = function() {
        const input = document.getElementById(this.getAttribute('data-target'));
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'password';
            this.classList.replace('fa-eye', 'fa-eye-slash');
        }
    };
});

// Particle Effect
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}
function init() { for (let i = 0; i < 80; i++) particles.push(new Particle()); }
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
init(); animate();
