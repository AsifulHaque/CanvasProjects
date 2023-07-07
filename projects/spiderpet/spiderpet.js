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

/* var background = new Image();
background.src = "https://images.unsplash.com/photo-1497465135434-9dc15238075a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1416&q=80";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){
    ctx.drawImage(background,0,0, canvas.width, canvas.height);   
} */

//============== Vector Class ==============
class vector2D {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    rotate(angle, center){  
        const radians = angle * (Math.PI/180);
        const sinA = Math.sin(radians);
        const cosA = Math.cos(radians);
        let nx = (cosA * (this.x - center.x)) - (sinA * (this.y - center.y)) + center.x;
        let ny = (cosA * (this.y - center.y)) + (sinA * (this.x - center.x)) + center.y;

        return new vector2D(Math.round(nx), Math.round(ny));
    }
}
//============== SpiderWeb Class ==============
class Spiderweb {
    constructor(center, radius, branch, thread){
        this.center = center;
        this.radius = radius;
        this.branch = Math.round(branch);
        this.thread = thread;
        this.ends = [];
    }
    draw(){
        this.drawBranches();
        this.drawThreads();
    }
    drawBranches(){
        this.ends.push(new vector2D(this.center.x + this.radius, this.center.y));
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = .5;

        for (let i = 0; i < this.branch; i++) {//---------------Draw Branches
            let a = this.ends[0].rotate(i * 360 / this.branch, this.center);
            ctx.beginPath();
            ctx.moveTo(this.center.x, this.center.y);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
            ctx.beginPath();//------------------Draw Point
            ctx.arc(a.x, a.y, this.radius / 50, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    drawThreads(){
        for (let i = 1; i <= this.thread; i++) {
            let points = [];
            points.push(new vector2D(this.center.x + i * this.radius / (this.thread + 1), this.center.y));// first point in a single thread loop
            for (let j = 0; j < this.branch; j++) {//---------------Draw Branches -- full loop
                let a = points[0].rotate(j * 360 / this.branch, this.center);
                if (j>0){//-----------------Start thread loop
                    points.push(a);
                    ctx.beginPath();
                    ctx.moveTo(points[j-1].x, points[j-1].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
                if (j == this.branch - 1) {//----------End thread loop
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
                ctx.beginPath();//------------------Draw Point
                ctx.arc(a.x, a.y, this.radius / 50, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
//============== Functions ==============
/* spiderweb1 = new Spiderweb();
spiderweb1.draw(); */

//============== Events ==============
canvas.addEventListener('click', e =>{
    let spiderweb1 = new Spiderweb(new vector2D(e.clientX, e.clientY), Math.random() * canvas.height/3 + 1, Math.random() * 10 + 3, Math.random() * 10 + 1);
    spiderweb1.draw();
})