//============== Setup ==============
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//============== Resize ==============
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
//============== Globals ==============
const particlesArray = [];
let hue = 0;
const mouse = {
    x: undefined,
    y: undefined,
}
//============== Events ==============
canvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 50; i++) {
        particlesArray.push(new Particle());
    }
});

canvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    let numParticles = Math.random() * 20 + 1;
    for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle());
    }
});
canvas.addEventListener('touchmove', function(event){
    mouse.x = event.changedTouches[0].clientX;
    mouse.y = event.changedTouches[0].clientY;
    let numParticles = Math.random() * 20 + 1;
    for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle());
    }
});
//============== Particles ==============
class Particle {
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1; //random number between 16 & 1
        this.speedX = Math.random() * 3 - 1.5; //random number between +1.5 & -1.5
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 360);
        ctx.fill();
    }
}
//============== Functions ==============

function handleParticles(){
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= .3){
            particlesArray.splice(i, 1);
            console.log(particlesArray.length);
            i--;
        }
        
    }
}
//============== Main Loop ==============
function animate(){
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    handleParticles();
    hue++;
    requestAnimationFrame(animate);
}
animate();