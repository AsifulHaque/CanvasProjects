//--------------CANVAS SETUP------------------------------
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(ctx);
let bounds;
//--------------MEMORY CANVAS-----------------------------
let memCanvas = document.createElement('canvas');
let memCtx = memCanvas.getContext('2d');
memCanvas.width = screen.width;
memCanvas.height = screen.height;
//---------------Canvas RESIZE---------------------------
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeBrush();
    ctx.drawImage(memCanvas, 0, 0);
});
//---------------------------------------------------------
//--------------GET CONTROLS-------------------------------
//---------------------------------------------------------
const menu = document.getElementById('menu');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const brushSizeSld = document.getElementById('brushSizeSld');
const colorPckr = document.getElementById('colorPckr');
const opacitySld = document.getElementById('opacitySld');
//---------------CONTROL FUNCTIONS-------------------------
downloadBtn.onclick = function(){
    downloadImage();
}
clearBtn.onclick = function(){
    clearCanvas();
    memCtx.clearRect(0, 0, canvas.width, canvas.height);
}
brushSizeSld.oninput = function(){
    memCtx.lineWidth = brushSizeSld.value;
}
colorPckr.oninput = function(){
    memCtx.strokeStyle = colorPckr.value;
    memCtx.shadowColor = colorPckr.value;
}
opacitySld.oninput = function(){
    //ctx.globalAlpha = opacitySld.value / 100;
    memCtx.globalAlpha = opacitySld.value / 100;
}
//--------------INITIAL BRUSH PROPERTIES------------------
initializeBrush();
//--------------BRUSH PROPERTIES--------------------------
const brush = {
    isDown: false,
}
function initializeBrush() {
    clearCanvas();
    memCtx.lineWidth = brushSizeSld.value;
    memCtx.strokeStyle = colorPckr.value;
    memCtx.globalAlpha = opacitySld.value / 100;
    memCtx.lineCap = memCtx.lineJoin = 'round';
    memCtx.shadowBlur = 2;
    memCtx.shadowColor = colorPckr.value;
    bounds = canvas.getBoundingClientRect();
}

function setRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return v = 'rgb(' + r + ',' + g + ',' + b + ')';
}

//------------------DRAW------------------------------
canvas.addEventListener('mousemove', function(event){
    if(event.buttons == 1){
        if(brush.isDown == false){
            brush.isDown=true;
            menu.style.display = 'none';
            memCtx.beginPath();
            memCtx.moveTo(event.clientX - bounds.x, event.clientY - bounds.y)
        }
        else{
            memCtx.lineTo(event.clientX - bounds.x, event.clientY - bounds.y);
            memCtx.stroke();
            clearCanvas();
            ctx.drawImage(memCanvas, 0, 0);
        }
    }
    else{
        brush.isDown = false;
        menu.style.display = 'inline';
    }  
});

function clearCanvas(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width, canvas.height);
}

function drawCircle(x,y) {
    ctx.fillStyle = brush.color;
    ctx.beginPath();
    ctx.arc(x, y, brush.lineWidth, 0, Math.PI * 2);
    ctx.fill();
}

function downloadImage(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    canvas.toBlob(function(blob) {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
}