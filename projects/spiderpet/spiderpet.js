//============== Setup =====================
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//============== Resize ====================
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
//==========================================
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
        //Outside of Boundary
        if(this.transform.x < 0) this.transform.x = this.size / 2;
        else if(this.transform.x > canvas.width) this.transform.x = canvas.width - this.size / 2;
        if(this.transform.y < 0) this.transform.y = this.size / 2;
        else if(this.transform.y > canvas.height) this.transform.y = canvas.height -this.size / 2;
        //Deflect X
        if (this.transform.x - this.size / 2 < 0) {
            this.velocity = new vector2D(this.velocity.x > 0 ? this.velocity.x : this.velocity.x * -1, this.velocity.y);
        }else if(this.transform.x + this.size / 2 > canvas.width){
            this.velocity = new vector2D(this.velocity.x > 0 ? this.velocity.x * -1 : this.velocity.x, this.velocity.y);
        }
        //Deflect Y
        if (this.transform.y - this.size / 2 < 0) {
            this.velocity = new vector2D(this.velocity.x, this.velocity.y > 0 ? this.velocity.y : this.velocity.y * -1);
        }else if(this.transform.y + this.size / 2 > canvas.height){
            this.velocity = new vector2D(this.velocity.x, this.velocity.y > 0 ? this.velocity.y * -1: this.velocity.y);
        }
        //Update transform
        this.transform = this.transform.add(this.velocity);
        //Animation state
        this.updateFrames ++;
        if (this.updateFrames % 8 == 0){
            this.wingState = this.wingState ? false : true;
        }
    }

    draw(){
        //overall
        ctx.lineWidth = this.size/50;
        //Collision Bounds
/*         ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.rect(this.transform.x - this.size /2, this.transform.y - this.size / 2, this.size, this.size);
        ctx.stroke();
 */
        //BackWing
        ctx.fillStyle = 'rgba(255, 255, 255, .2)';
        ctx.beginPath();
        ctx.ellipse(this.transform.x + this.size / 7, this.wingState? this.transform.y - this.size / 2 : this.transform.y + this.size / 2, this.size /1.5, this.size /2.5, this.wingState ? Math.PI * -1.25 : Math.PI * 1.25, 0, Math.PI * 2);
        ctx.fill();
        //Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.transform.x, this.transform.y, this.size /2, this.size /2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        //Head
        ctx.beginPath();
        ctx.arc(this.velocity.x > 0 ? this.transform.x + this.size/2 : this.transform.x - this.size/2, this.transform.y, this.size/4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        //Eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.velocity.x > 0 ? this.transform.x + this.size/1.45 : this.transform.x - this.size/1.45, this.transform.y - this.size / 11, this.size/7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        //Eye-front
        ctx.beginPath();
        ctx.arc(this.velocity.x > 0 ? this.transform.x + this.size/1.7 : this.transform.x - this.size/1.7, this.transform.y - this.size / 11, this.size/7, 0, Math.PI * 2);
        ctx.fill();
        //EyeBall
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.velocity.x > 0 ? this.transform.x + this.size/1.4 : this.transform.x - this.size/1.4, this.transform.y - this.size / 11, this.size/25, 0, Math.PI * 2);
        ctx.fill();
        //EyeBall-front
        ctx.beginPath();
        ctx.arc(this.velocity.x > 0 ? this.transform.x + this.size/1.65 : this.transform.x - this.size/1.65, this.transform.y - this.size / 11, this.size/25, 0, Math.PI * 2);
        ctx.fill();
        //FrontWing
        ctx.fillStyle = 'rgba(255, 255, 255, .6)';
        ctx.beginPath();
        ctx.ellipse(this.transform.x + this.size / 3, this.wingState? this.transform.y - this.size / 2.5 : this.transform.y + this.size / 2.5, this.size /1.5, this.size /2.5, this.wingState ? Math.PI * -1.25 : Math.PI * 1.25, 0, Math.PI * 2);
        ctx.fill();
    }
}

//============== Spider class =============
class Spider{
    /**
     * @param {vector2D} transform
     */
    constructor(transform, size){
        this.transform = transform;
        this.size = size;
        this.primaryColor = 'teal';
        this.accentColor = 'cadetblue';
        this.highlightColor = 'white';
        /**Eye focus */
        this.focus = new vector2D(0,1);
    }
    update(){
        this.updateFocus();
    }
    updateFocus(){
        let nearestDistance = undefined;
        let nearestInsectID = undefined;
        for (let i = 0; i < insects.length; i++) {
            let dx = insects[i].transform.x - this.transform.x;
            let dy = insects[i].transform.y - this.transform.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if(nearestDistance == undefined || distance < nearestDistance) {
                nearestDistance = distance;
                nearestInsectID = i;
            }
        }
        if(nearestInsectID != undefined){
            let dx = insects[nearestInsectID].transform.x - this.transform.x;
            let dy = insects[nearestInsectID].transform.y - this.transform.y - this.size/2;
            this.focus = (Math.abs(dx)>Math.abs(dy))? new vector2D(dx/Math.abs(dx), dy/Math.abs(dx)) : new vector2D(dx/Math.abs(dy), dy/Math.abs(dy));
        }
    }
    draw(){
        let rightLegStart = new vector2D(this.transform.x - this.size/2, this.transform.y);
        let rightLeg1Mid = new vector2D(rightLegStart.x - this.size/2, rightLegStart.y).rotate(-45, rightLegStart);
        let rightLeg2Mid = new vector2D(rightLegStart.x - this.size/2, rightLegStart.y).rotate(-15, rightLegStart);
        let rightLeg3Mid = new vector2D(rightLegStart.x - this.size/2, rightLegStart.y).rotate(15, rightLegStart);
        let rightLeg4Mid = new vector2D(rightLegStart.x - this.size/2, rightLegStart.y).rotate(45, rightLegStart);
        let rightLeg1End = new vector2D(rightLeg1Mid.x - this.size/2, rightLeg1Mid.y).rotate(-85, rightLeg1Mid);
        let rightLeg2End = new vector2D(rightLeg2Mid.x - this.size/2, rightLeg2Mid.y).rotate(-60, rightLeg2Mid);
        let rightLeg3End = new vector2D(rightLeg3Mid.x - this.size/2, rightLeg3Mid.y).rotate(60, rightLeg3Mid);
        let rightLeg4End = new vector2D(rightLeg4Mid.x - this.size/2, rightLeg4Mid.y).rotate(85, rightLeg4Mid);

        let leftLegStart = new vector2D(this.transform.x + this.size/2, this.transform.y);
        let leftLeg1Mid = new vector2D(leftLegStart.x + this.size/2, leftLegStart.y).rotate(45, leftLegStart);
        let leftLeg2Mid = new vector2D(leftLegStart.x + this.size/2, leftLegStart.y).rotate(15, leftLegStart);
        let leftLeg3Mid = new vector2D(leftLegStart.x + this.size/2, leftLegStart.y).rotate(-15, leftLegStart);
        let leftLeg4Mid = new vector2D(leftLegStart.x + this.size/2, leftLegStart.y).rotate(-45, leftLegStart);
        let leftLeg1End = new vector2D(leftLeg1Mid.x + this.size/2, leftLeg1Mid.y).rotate(85, leftLeg1Mid);
        let leftLeg2End = new vector2D(leftLeg2Mid.x + this.size/2, leftLeg2Mid.y).rotate(60, leftLeg2Mid);
        let leftLeg3End = new vector2D(leftLeg3Mid.x + this.size/2, leftLeg3Mid.y).rotate(-60, leftLeg3Mid);
        let leftLeg4End = new vector2D(leftLeg4Mid.x + this.size/2, leftLeg4Mid.y).rotate(-85, leftLeg4Mid);
        //overall
        ctx.lineWidth = this.size/50;
        //Body
        ctx.fillStyle = this.primaryColor;
        ctx.beginPath();
        ctx.ellipse(this.transform.x, this.transform.y - this.size/2, this.size /1.5, this.size/1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.highlightColor;
        ctx.stroke();
        //Head
        ctx.beginPath();
        ctx.ellipse(this.transform.x, this.transform.y, this.size /2, this.size /2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        //Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(this.transform.x + this.size / 8, this.transform.y + this.size / 2, this.size /7, this.size /7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.transform.x - this.size / 8, this.transform.y + this.size / 2, this.size /7, this.size /7, 0, 0, Math.PI * 2);
        ctx.fill();
        //EyeBall
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(this.transform.x + this.size / 8 + this.focus.x * this.size/18, this.transform.y + this.size / 2 + this.focus.y * this.size/18, this.size /18, this.size /18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.transform.x - this.size / 8 + this.focus.x * this.size/18, this.transform.y + this.size / 2 + this.focus.y * this.size/18, this.size /18, this.size /18, 0, 0, Math.PI * 2);
        ctx.fill();
        //Legs-Left--------------------------------------
        ctx.fillStyle = this.highlightColor;
        ctx.strokeStyle = this.accentColor;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size/20;
        ctx.beginPath();
        ctx.ellipse(leftLegStart.x, leftLegStart.y, this.size /18, this.size/18, 0, 0, Math.PI * 2);
        ctx.fill();
        //Leg1-L
        ctx.beginPath();
        ctx.moveTo(leftLegStart.x, leftLegStart.y);
        ctx.lineTo(leftLeg1Mid.x, leftLeg1Mid.y);
        ctx.lineTo(leftLeg1End.x, leftLeg1End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(leftLeg1Mid.x, leftLeg1Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //leg2-L
        ctx.beginPath();
        ctx.moveTo(leftLegStart.x, leftLegStart.y);
        ctx.lineTo(leftLeg2Mid.x, leftLeg2Mid.y);
        ctx.lineTo(leftLeg2End.x, leftLeg2End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(leftLeg2Mid.x, leftLeg2Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //leg3-L
        ctx.beginPath();
        ctx.moveTo(leftLegStart.x, leftLegStart.y);
        ctx.lineTo(leftLeg3Mid.x, leftLeg3Mid.y);
        ctx.lineTo(leftLeg3End.x, leftLeg3End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(leftLeg3Mid.x, leftLeg3Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //leg4-L
        ctx.beginPath();
        ctx.moveTo(leftLegStart.x, leftLegStart.y);
        ctx.lineTo(leftLeg4Mid.x, leftLeg4Mid.y);
        ctx.lineTo(leftLeg4End.x, leftLeg4End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(leftLeg4Mid.x, leftLeg4Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //Legs-Right
        ctx.beginPath();
        ctx.ellipse(rightLegStart.x, rightLegStart.y, this.size /18, this.size/18, 0, 0, Math.PI * 2);
        ctx.fill();
        //Leg1-R--------------------------------------
        ctx.beginPath();
        ctx.moveTo(rightLegStart.x, rightLegStart.y);
        ctx.lineTo(rightLeg1Mid.x, rightLeg1Mid.y);
        ctx.lineTo(rightLeg1End.x, rightLeg1End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(rightLeg1Mid.x, rightLeg1Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //Leg2-R
        ctx.beginPath();
        ctx.moveTo(rightLegStart.x, rightLegStart.y);
        ctx.lineTo(rightLeg2Mid.x, rightLeg2Mid.y);
        ctx.lineTo(rightLeg2End.x, rightLeg2End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(rightLeg2Mid.x, rightLeg2Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //Leg3-R
        ctx.beginPath();
        ctx.moveTo(rightLegStart.x, rightLegStart.y);
        ctx.lineTo(rightLeg3Mid.x, rightLeg3Mid.y);
        ctx.lineTo(rightLeg3End.x, rightLeg3End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(rightLeg3Mid.x, rightLeg3Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //Leg4-R
        ctx.beginPath();
        ctx.moveTo(rightLegStart.x, rightLegStart.y);
        ctx.lineTo(rightLeg4Mid.x, rightLeg4Mid.y);
        ctx.lineTo(rightLeg4End.x, rightLeg4End.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(rightLeg4Mid.x, rightLeg4Mid.y, this.size /25, this.size/25, 0, 0, Math.PI * 2);
        ctx.fill();
        //Collision Bounds
/*         ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.rect(this.transform.x - this.size /2, this.transform.y - this.size / 2, this.size, this.size);
        ctx.stroke(); */
    }
}
//==========================================
//================= Events =================
canvas.addEventListener('click', e =>{
   insects.push(new Insect(new vector2D(e.clientX, e.clientY), Math.random() * 40 + 20));
});
canvas.addEventListener('mousemove', e=>{//TODO need to change when multiple spider is on the scene
    if(!insects.length){
        let dx = e.clientX - spiders[0].transform.x;
        let dy = e.clientY - spiders[0].transform.y - spiders[0].size/2;
        spiders[0].focus = (Math.abs(dx)>Math.abs(dy))? new vector2D(dx/Math.abs(dx), dy/Math.abs(dx)) : new vector2D(dx/Math.abs(dy), dy/Math.abs(dy));
    }
})
//====================== Main Loop ====================
let insects = [];
let spiders = [];
function render(){
    //Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, .3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //DrawSpiders
    for (let i = 0; i < spiders.length; i++) {
        spiders[i].update();
        spiders[i].draw();
    }
    //DrawInsects
    for (let i = 0; i < insects.length; i++) {
        insects[i].update();
        insects[i].draw();
    }
    //----
    requestAnimationFrame(render);
}
spiders.push(new Spider(new vector2D(canvas.width/2, canvas.height/2), 200));
render();