// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let g_selectedColor=[1.0, 0.0, 0.0, 1.0]
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_segments = 20;
let g_globalAngle = 0.0;
let g_yellowAngle = 45.0;
let animate = false;

function addActionsForHtmlUI(){

  document.getElementById("yellowSlider").addEventListener('mousemove', function() {g_yellowAngle = this.value; renderAllShapes();});
  document.getElementById("cameraSlider").addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
  document.getElementById('animate').addEventListener('click', function() {animate = true;});
  document.getElementById('stopAnimate').addEventListener('click', function() {animate = false;});
}


function setupWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function main() {
  
  setupWebGL()

  connectVariablesToGLSL()
  addActionsForHtmlUI()
  // Register function (event handler) to be called on a mouse press  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  
  requestAnimationFrame(tick);
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
  
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick(){
  g_seconds = performance.now()/1000.0 - g_startTime;
  updateAnimationAngle();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimationAngle(){
  if(animate){
    g_yellowAngle = 45 * Math.sin(g_seconds);
  }
}

function renderScene(){
  

  var globalRotateMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotateMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //drawTriangle3D([-1.0, 0.0, 0.0, -0.5, -1.0, 0.0,  0.0, 0.0, 0.0]);
  var head = new Cube();
  head.color = [1, 0.55, 0.63, 1.0]
  head.matrix.translate(-0.5, 0.25, 0);
  head.matrix.rotate(-90, 0, 0, 1);
  head.matrix.rotate(-20, 1, 0, 0);
  head.matrix.rotate(-10, 0, 1, 0);
  var tmpMatrix = new Matrix4(head.matrix);
  head.matrix.scale(0.5, 0.5, 0.5);
  head.render();

  var body = new Cube();
  body.color = [1, 0.55, 0.63, 1.0]
  body.matrix = tmpMatrix;
  body.matrix.translate(0.1, -0.1, 0.5);
  body.matrix.scale(0.5, 0.7, 0.7);
  body.render();

  /*
  var leftArm = new Cube();
  leftArm.color = [1.0, 0.75, 0.89, 1.0]
  leftArm.matrix = tmpMatrix;
  leftArm.matrix.setTranslate(0.15, 0, 0.1);
  leftArm.matrix.scale(1, 0.7, 0.6);
  leftArm.matrix.rotate(-90, 0, 0, 1);
  leftArm.matrix.rotate(g_yellowAngle, 0, 0, 1);
  

  
  var preScaledMatrix = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.2, 0.7, 0.4);
  leftArm.matrix.translate(-0.5, 0, 0.0);
  leftArm.render();

  var box = new Cube();
  box.color = [1.0, 0, 1.0, 1.0]
  box.matrix = preScaledMatrix;
  box.matrix.translate(0, 0.7, 0.0);
  box.matrix.scale(0.23, 0.2, 0.2);
  box.matrix.rotate(-30, 1, 0, 0);
  box.matrix.translate(-0.5, -0.5, 0, -0.001);

  box.matrix.translate(-0.1, -0.1, 0, 0);
  box.matrix.rotate(-30, 1, 0, 0);
  box.matrix.scale(0.2, 0.4, 0.2);

  box.render();
  */
}