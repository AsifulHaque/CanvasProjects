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
    /**
     * @param {float} angle Degree angle 
     * @param {vector2D} center Center to rotate around
     */
    rotate(angle, center){  
        const radians = angle * (Math.PI/180);
        const sinA = Math.sin(radians);
        const cosA = Math.cos(radians);
        let nx = (cosA * (this.x - center.x)) - (sinA * (this.y - center.y)) + center.x;
        let ny = (cosA * (this.y - center.y)) + (sinA * (this.x - center.x)) + center.y;

        return new vector2D(Math.round(nx), Math.round(ny));
    }
    add(vectorToAdd){
        return new vector2D(this.x + vectorToAdd.x, this.y + vectorToAdd.y);
    }
}
//============== SpiderWeb Class ==============
class Spiderweb {
    /**
    * @param {vector2D} center
    * @param {float} radius
    * @param {int} branch Number of branches
    * @param {int} thread Number of threads 
    */
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
            for (let j = 0; j < this.branch; j++) {//---------------For each Branch
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

//============== Events ==============
canvas.addEventListener('click', e =>{
    //objects.push(new Spiderweb(new vector2D(e.clientX, e.clientY), Math.random() * canvas.height/3 + 1, Math.random() * 10 + 3, Math.random() * 10 + 1));
    objects.push(new Insect(new vector2D(e.clientX, e.clientY), Math.random() * 40 + 10));
});

//============== Insect class =============
class Insect{
    /**
    * @param {vector2D} transform
    */
    constructor(transform, size){
        this.transform = transform;
        this.size = size;
        this.color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)';;
        this.velocity = new vector2D((Math.random() * 3) - 1, (Math.random() * 3) - 1);
        this.wingState = true;
        this.updateFrames = 0;
    }
    update(){
        if (this.transform.x - this.size / 2 < 0 || this.transform.x + this.size / 2 > canvas.width) {
            this.velocity = new vector2D(this.velocity.x * -1, this.velocity.y);
        }
        if (this.transform.y - this.size / 2 < 0 || this.transform.y + this.size / 2 > canvas.height) {
            this.velocity = new vector2D(this.velocity.x, this.velocity.y * -1);
        }
        this.transform = this.transform.add(this.velocity);
        this.updateFrames ++;
        if (this.updateFrames % 8 == 0){
            this.wingState = this.wingState ? false : true;
        }
        //
    }
    /* TODO: Move this to Global render */
    draw(){

        //Collision Boungs
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.rect(this.transform.x - this.size /2, this.transform.y - this.size / 2, this.size, this.size);
        ctx.stroke();

        //BackWing
        ctx.fillStyle = 'rgba(255, 255, 255, .2)';
        ctx.beginPath();
        ctx.ellipse(this.transform.x + this.size / 7, this.wingState? this.transform.y - this.size / 2 : this.transform.y + this.size / 2, this.size /1.5, this.size /2.5, this.wingState ? Math.PI * -1.25 : Math.PI * 1.25, 0, Math.PI * 2);
        ctx.fill();
        //Body
        ctx.fillStyle = 'dimgrey';
        ctx.beginPath();
        ctx.ellipse(this.transform.x, this.transform.y, this.size /2, this.size /2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        //Head
        ctx.beginPath();
        ctx.arc(this.transform.x - this.size/2, this.transform.y, this.size/4, 0, Math.PI * 2);
        ctx.fill();
        //Eye
        ctx.strokeStyle = 'grey'
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.transform.x - this.size/1.45, this.transform.y - this.size / 11, this.size/7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        //Eye-front
        ctx.beginPath();
        ctx.arc(this.transform.x - this.size/1.7, this.transform.y - this.size / 11, this.size/7, 0, Math.PI * 2);
        ctx.fill();
        //EyeBall
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.transform.x - this.size/1.4, this.transform.y - this.size / 11, this.size/25, 0, Math.PI * 2);
        ctx.fill();
        //EyeBall-front
        ctx.beginPath();
        ctx.arc(this.transform.x - this.size/1.65, this.transform.y - this.size / 11, this.size/25, 0, Math.PI * 2);
        ctx.fill();
        //FrontWing
        ctx.fillStyle = 'rgba(255, 255, 255, .6)';
        ctx.beginPath();
        ctx.ellipse(this.transform.x + this.size / 5, this.wingState? this.transform.y - this.size / 2.5 : this.transform.y + this.size / 2.5, this.size /1.5, this.size /2.5, this.wingState ? Math.PI * -1.25 : Math.PI * 1.25, 0, Math.PI * 2);
        ctx.fill();
    }
}

//====================== Main Loop ====================
let objects = [];
function render(){
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objects.length; i++) {
        if(objects[i].constructor.name == 'Insect')
        {
            objects[i].update();
        }
        objects[i].draw();
    }
    requestAnimationFrame(render);
}
render();