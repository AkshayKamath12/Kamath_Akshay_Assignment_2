// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let g_selectedColor=[1.0, 0.0, 0.0, 1.0]
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_segments = 20;
function addActionsForHtmlUI(){
  document.getElementById("green").onclick= function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];}
  document.getElementById("red").onclick= function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];}
  document.getElementById("redSlider").addEventListener('change', function() {g_selectedColor[0] = this.value / 100;});
  document.getElementById("greenSlider").addEventListener('change', function() {g_selectedColor[1] = this.value / 100;});
  document.getElementById("blueSlider").addEventListener('change', function() {g_selectedColor[2] = this.value / 100;});
  document.getElementById("sizeSlider").addEventListener('change', function() {g_selectedSize = this.value;});
  document.getElementById("segmentSlider").addEventListener('change', function() {g_segments = this.value;});
  document.getElementById("clear").addEventListener('click', function() {g_shapes_list = []; renderAllShapes();})
  document.getElementById('point').addEventListener('click', function() {g_selectedType=POINT});
  document.getElementById('triangle').addEventListener('click', function() {g_selectedType=TRIANGLE})
  document.getElementById('circle').addEventListener('click', function() {g_selectedType=CIRCLE})
  document.getElementById('rayquaza').addEventListener('click', function() {drawRayquaza(-0.3, 0.1)})
  document.getElementById('animate').addEventListener('click', function() {
    animateRayquaza();
  })
}

function animateRayquaza() {
  let x = -0.8; 
  let y = 0.8;  
  const step = 0.01; 

  function move() {
    g_shapes_list = [];
    drawRayquaza(x, y);

    x += step;
    y -= step;

    if (x <= 1.1) {
      requestAnimationFrame(move); 
    }
  }
  move();
}

function drawRayquaza(l=0, r=0){
  g_shapes_list = []
  let triangle = new Triangle();
  triangle.position=[0.5+l, 0.5+r]
  triangle.size = 30
  triangle.color = [0.0, 1.0, 0.0, 1.0]
  triangle.angle = 0;
  g_shapes_list.push(triangle);

  let triangle2 = new Triangle();
  triangle2.position=[0.5+l, 0.3+r]
  triangle2.size = 45
  triangle2.color = [0.0, 1.0, 0.0, 1.0]
  g_shapes_list.push(triangle2);

  let triangle3 = new Triangle();
  triangle3.position=[0.57+l, 0.37+r]
  triangle3.size = 45
  triangle3.color = [0.0, 1.0, 0.0, 1.0]
  triangle3.angle = -180
  g_shapes_list.push(triangle3);

  let triangle4 = new Triangle();
  triangle4.position=[0.69+l, 0.432+r]
  triangle4.size = 40
  triangle4.color = [0.0, 1.0, 0.0, 1.0]
  triangle4.angle = -50;
  g_shapes_list.push(triangle4);

  let triangle5 = new Triangle();
  triangle5.position=[0.55+l, 0.2+r]
  triangle5.size = 31
  triangle5.color = [0.0, 1.0, 0.0, 1.0]
  triangle5.angle = -180;
  g_shapes_list.push(triangle5);

  let triangle6 = new Triangle();
  triangle6.position=[0.66+l, 0.30+r]
  triangle6.size = 40.3
  triangle6.color = [0.0, 1.0, 0.0, 1.0]
  triangle6.angle = -180;
  g_shapes_list.push(triangle6);

  let triangle7 = new Triangle();
  triangle7.position=[0.675+l,0.37+r]
  triangle7.size = 17
  triangle7.color = [0.0, 0.0, 0.0, 1.0]
  triangle7.angle = -200;
  g_shapes_list.push(triangle7);

  let triangle8 = new Triangle();
  triangle8.position=[0.42+l, 0.34+r]
  triangle8.size = 25
  triangle8.color = [0.0, 1.0, 0.0, 1.0]
  triangle8.angle = -180;
  g_shapes_list.push(triangle8);

  let triangle9 = new Triangle();
  triangle9.position=[0.38+l, 0.3+r]
  triangle9.size = 25
  triangle9.color = [0.0, 1.0, 0.0, 1.0]
  triangle9.angle = 0;
  g_shapes_list.push(triangle9);

  let triangle10 = new Triangle();
  triangle10.position=[0.30+l,0.34+r]
  triangle10.size = 25
  triangle10.color = [0.0, 1.0, 0.0, 1.0]
  triangle10.angle = -180;
  g_shapes_list.push(triangle10);

  let triangle11 = new Triangle();
  triangle11.position=[0.26+l, 0.3+r]
  triangle11.size = 25
  triangle11.color = [0.0, 1.0, 0.0, 1.0]
  triangle11.angle = 0;
  g_shapes_list.push(triangle11);

  let triangle12 = new Triangle();
  triangle12.position=[0.127+l, 0.222+r]
  triangle12.size = 40
  triangle12.color = [0.0, 1.0, 0.0, 1.0]
  triangle12.angle = 90;
  g_shapes_list.push(triangle12);

  let triangle13 = new Triangle();
  triangle13.position=[0.114+l,0.08+r]
  triangle13.size = 30
  triangle13.color = [0.0, 1.0, 0.0, 1.0]
  triangle13.angle = 90;
  g_shapes_list.push(triangle13);

  let triangle14 = new Triangle();
  triangle14.position=[0.062+l,0.125+r]
  triangle14.size = 30
  triangle14.color = [0.0, 1.0, 0.0, 1.0]
  triangle14.angle = -90;
  g_shapes_list.push(triangle14);

  let triangle15 = new Triangle();
  triangle15.position=[0.114+l,-0.055+r]
  triangle15.size = 30
  triangle15.color = [0.0, 1.0, 0.0, 1.0]
  triangle15.angle = 90;
  g_shapes_list.push(triangle15);

  let triangle16 = new Triangle();
  triangle16.position=[0.062+l,-0.01+r]
  triangle16.size = 30
  triangle16.color = [0.0, 1.0, 0.0, 1.0]
  triangle16.angle = -90;
  g_shapes_list.push(triangle16);

  let triangle17 = new Triangle();
  triangle17.position=[0.21+l, -0.25+r]
  triangle17.size = 40
  triangle17.color = [0.0, 1.0, 0.0, 1.0]
  triangle17.angle = 0;
  g_shapes_list.push(triangle17);

  let triangle18 = new Triangle();
  triangle18.position=[0.11+l, -0.162+r]
  triangle18.size = 32
  triangle18.color = [0.0, 1.0, 0.0, 1.0]
  triangle18.angle = 180;
  g_shapes_list.push(triangle18);

  let triangle19 = new Triangle();
  triangle19.position=[0.28+l, -0.383+r]
  triangle19.size = 40
  triangle19.color = [0.0, 1.0, 0.0, 1.0]
  triangle19.angle = 180;
  g_shapes_list.push(triangle19);

  let triangle20 = new Triangle();
  triangle20.position=[0.213+l, -0.445+r]
  triangle20.size = 40
  triangle20.color = [0.0, 1.0, 0.0, 1.0]
  triangle20.angle = 0;
  g_shapes_list.push(triangle20);

  let triangle21 = new Triangle();
  triangle21.position=[0.212+l, -0.578+r]
  triangle21.size = 40
  triangle21.color = [0.0, 1.0, 0.0, 1.0]
  triangle21.angle = -90;
  g_shapes_list.push(triangle21);

  let triangle22 = new Triangle();
  triangle22.position=[0.72+l, 0.27+r]
  triangle22.size = 6
  triangle22.color = [1.0, 1.0, 1.0, 1.0]
  triangle22.angle = 135;
  g_shapes_list.push(triangle22);

  let triangle23 = new Triangle();
  triangle23.position=[0.75+l, 0.25+r]
  triangle23.size = 6
  triangle23.color = [1.0, 1.0, 1.0, 1.0]
  triangle23.angle = 135;
  g_shapes_list.push(triangle23);

  let triangle24 = new Triangle();
  triangle24.position=[0.65+l, 0.22+r]
  triangle24.size = 6
  triangle24.color = [1.0, 1.0, 1.0, 1.0]
  triangle24.angle = 0;
  g_shapes_list.push(triangle24);

  let triangle25 = new Triangle();
  triangle25.position=[0.65+l, 0.18+r]
  triangle25.size = 6
  triangle25.color = [1.0, 1.0, 1.0, 1.0]
  triangle25.angle = 0;
  g_shapes_list.push(triangle25);

  let triangle26 = new Triangle();
  triangle26.position=[0.21+l, 0.19+r]
  triangle26.size = 10
  triangle26.color = [0.0, 1.0, 0.0, 1.0]
  triangle26.angle = -90;
  g_shapes_list.push(triangle26);

  let triangle27 = new Triangle();
  triangle27.position=[0.02+l, -0.57+r]
  triangle27.size = 40
  triangle27.color = [0.0, 1.0, 0.0, 1.0]
  triangle27.angle = -90;
  g_shapes_list.push(triangle27);

  let triangle28 = new Triangle();
  triangle28.position=[0.080+l, -0.64+r]
  triangle28.size = 40
  triangle28.color = [0.0, 1.0, 0.0, 1.0]
  triangle28.angle = 90;
  g_shapes_list.push(triangle28);

  let triangle29 = new Triangle();
  triangle29.position=[-0.112+l, -0.639+r]
  triangle29.size = 40
  triangle29.color = [0.0, 1.0, 0.0, 1.0]
  triangle29.angle = 90;
  g_shapes_list.push(triangle29);

  let triangle30 = new Triangle();
  triangle30.position=[-0.115+l, -0.77+r]
  triangle30.size = 40
  triangle30.color = [0.0, 1.0, 0.0, 1.0]
  triangle30.angle = 180;
  g_shapes_list.push(triangle30);

  let triangle31 = new Triangle();
  triangle31.position=[-0+l, 0.05+r]
  triangle31.size = 20
  triangle31.color = [0.0, 1.0, 0.0, 1.0]
  triangle31.angle = 180;
  g_shapes_list.push(triangle31);

  let triangle32 = new Triangle();
  triangle32.position=[-0.03+l, 0.02+r]
  triangle32.size = 20
  triangle32.color = [0.0, 1.0, 0.0, 1.0]
  triangle32.angle = 0;
  g_shapes_list.push(triangle32);

  let triangle33 = new Triangle();
  triangle33.position=[-0.095+l, 0.019+r]
  triangle33.size = 20
  triangle33.color = [0.0, 1.0, 0.0, 1.0]
  triangle33.angle = 90;
  g_shapes_list.push(triangle33);

  let triangle34 = new Triangle();
  triangle34.position=[-0.125+l, -0.011+r]
  triangle34.size = 10
  triangle34.color = [0.0, 1.0, 0.0, 1.0]
  triangle34.angle = -90;
  g_shapes_list.push(triangle34);

  let triangle35 = new Triangle();
  triangle35.position=[0.24+l, 0.019+r]
  triangle35.size = 20
  triangle35.color = [0.0, 1.0, 0.0, 1.0]
  triangle35.angle = 90;
  g_shapes_list.push(triangle35);

  let triangle36 = new Triangle();
  triangle36.position=[0.21+l, 0.05+r]
  triangle36.size = 20
  triangle36.color = [0.0, 1.0, 0.0, 1.0]
  triangle36.angle = -90;
  g_shapes_list.push(triangle36);

  let triangle37 = new Triangle();
  triangle37.position=[0.3+l, 0.0185+r]
  triangle37.size = 20
  triangle37.color = [0.0, 1.0, 0.0, 1.0]
  triangle37.angle = 0;
  g_shapes_list.push(triangle37);

  let triangle38 = new Triangle();
  triangle38.position=[0.365+l, -0.011+r]
  triangle38.size = 10
  triangle38.color = [0.0, 1.0, 0.0, 1.0]
  triangle38.angle = 180;
  g_shapes_list.push(triangle38);

  let triangle39 = new Triangle();
  triangle39.position=[-0.06+l, -0.8+r]
  triangle39.size = 30
  triangle39.color = [0.0, 1.0, 0.0, 1.0]
  triangle39.angle = 225;
  g_shapes_list.push(triangle39);


  renderAllShapes();
}



function setupWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function main() {
  
  setupWebGL()

  connectVariablesToGLSL()
  addActionsForHtmlUI()
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){if(ev.buttons == 1) click(ev);}
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function clickToXY(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return [x, y];
}

var g_shapes_list = [];
/*
var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
*/

function click(ev) {
  let [x,y] = clickToXY(ev)
  // Store the coordinates to g_points array
  /*
  g_points.push([x, y]);
  g_colors.push(g_selectedColor.slice());
  g_sizes.push(g_selectedSize);
  */
  let point;
  if(g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  } else{
    point = new Circle();
    point.segments = g_segments;
    console.log(g_segments);
  }
  point.position=[x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapes_list.push(point);
  // Clear <canvas>
  renderAllShapes()
}

function renderAllShapes(){
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapes_list.length;
  for(let i = 0; i < len; i++) {
    g_shapes_list[i].render();
  }
}