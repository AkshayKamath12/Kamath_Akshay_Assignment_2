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
let g_globalAngle = 5;
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
    g_yellowAngle = Math.abs(-45 * Math.sin(g_seconds))+10;
    console.log(g_yellowAngle);
  }
}

function renderScene(){
  

  var globalRotateMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotateMat.translate(-0.2, 0.1, 0);
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
  var noseMatrix = new Matrix4(head.matrix);
  var eyeMatrix = new Matrix4(head.matrix);
  var eyeMatrix2 = new Matrix4(head.matrix);
  var pupilMatrix = new Matrix4(head.matrix);
  var pupilMatrix2 = new Matrix4(head.matrix);
  var crownMatrix = new Matrix4(head.matrix);
  head.matrix.scale(0.5, 0.5, 0.5);
  head.render();

  var nose = new Cube();
  nose.color = [1, 0.55, 0.63, 1.0]
  nose.matrix = noseMatrix;
  nose.matrix.translate(0.2, 0.15, -0.09);
  var nostrilMatrix = new Matrix4(nose.matrix);
  var nostrilMatrix2 = new Matrix4(nose.matrix);
  nose.matrix.scale(0.2, 0.24, 0.2);
  nose.render();

  var nostril = new Cube();
  nostril.color = [0.52, 0.29, 0, 1.0]
  nostril.matrix = nostrilMatrix;
  nostril.matrix.translate(0.066, 0.159, -0.015);
  nostril.matrix.scale(0.08, 0.08, 0.05);
  nostril.render();

  var nostril2 = new Cube();
  nostril2.color = [0.52, 0.29, 0, 1.0]
  nostril2.matrix = nostrilMatrix2;
  nostril2.matrix.translate(0.066, 0.0001, -0.015);
  nostril2.matrix.scale(0.08, 0.08, 0.05);
  nostril2.render();

  var eye = new Cube();
  eye.color = [1, 1, 1, 1.0]
  eye.matrix = eyeMatrix;
  eye.matrix.translate(0.1, 0.38, -0.01);
  eye.matrix.scale(0.1, 0.115, 0.1);
  eye.render();

  var pupil = new Cube();
  pupil.color = [0, 0, 0, 1.0]
  pupil.matrix = pupilMatrix;
  pupil.matrix.translate(0.1, 0.44, -0.02);
  pupil.matrix.scale(0.1, 0.0575, 0.1);
  pupil.render();

  var eye2 = new Cube();
  eye2.color = [1, 1, 1, 1.0]
  eye2.matrix = eyeMatrix2;
  eye2.matrix.translate(0.1, 0.001, -0.02);
  eye2.matrix.scale(0.1, 0.115, 0.1);
  eye2.render();

  var pupil2 = new Cube();
  pupil2.color = [0, 0, 0, 1.0]
  pupil2.matrix = pupilMatrix2;
  pupil2.matrix.translate(0.1, 0.0001, -0.04);
  pupil2.matrix.scale(0.1, 0.0575, 0.1);
  pupil2.render();


  var body = new Cube();
  body.color = [1, 0.55, 0.63, 1.0]
  body.matrix = tmpMatrix;
  body.matrix.translate(0.1, -0.1, 0.5);
  var tmpMatrix2 = new Matrix4(head.matrix);
  var tmpMatrix3 = new Matrix4(head.matrix);
  var tmpMatrix4 = new Matrix4(head.matrix);
  var tmpMatrix5 = new Matrix4(head.matrix);
  body.matrix.scale(0.5, 0.7, 0.7);
  body.render();

  var crown = new Cube();
  crown.color = [1, 0.84, 0, 1.0]
  crown.matrix = crownMatrix;
  crown.matrix.translate(-0.02, -0.02, -0.001);
  var crownCornerMatrix = new Matrix4(crown.matrix);
  var crownCornerMatrix2 = new Matrix4(crown.matrix);
  var crownCornerMatrix3 = new Matrix4(crown.matrix);
  var crownCornerMatrix4 = new Matrix4(crown.matrix);
  var crownMiddleMatrix = new Matrix4(crown.matrix);
  var crownMiddleMatrix2 = new Matrix4(crown.matrix);
  var crownMiddleMatrix3 = new Matrix4(crown.matrix);
  var crownMiddleMatrix4 = new Matrix4(crown.matrix);
  crown.matrix.scale(0.1, 0.53, 0.51);
  crown.render();

  var crownCorner = new Cube();
  crownCorner.color = [1, 0.84, 0, 1.0]
  crownCorner.matrix = crownCornerMatrix;
  crownCorner.matrix.translate(-0.08, 0, 0);
  crownCorner.matrix.scale(0.1, 0.1, 0.1);
  crownCorner.render();

  var crownMiddle = new Cube();
  crownMiddle.color = [1, 0.84, 0, 1.0]
  crownMiddle.matrix = crownMiddleMatrix;
  crownMiddle.matrix.translate(-0.08, 0.2, 0);
  crownMiddle.matrix.scale(0.1, 0.1, 0.1);
  crownMiddle.render();

  var crownCorner2 = new Cube();
  crownCorner2.color = [1, 0.84, 0, 1.0]
  crownCorner2.matrix = crownCornerMatrix2;
  crownCorner2.matrix.translate(-0.08, 0.43, 0);
  crownCorner2.matrix.scale(0.1, 0.1, 0.1);
  crownCorner2.render();

  var crownMiddle2 = new Cube();
  crownMiddle2.color = [1, 0.84, 0, 1.0]
  crownMiddle2.matrix = crownMiddleMatrix2;
  crownMiddle2.matrix.translate(-0.08, 0.2, 0.4);
  crownMiddle2.matrix.scale(0.1, 0.1, 0.1);
  crownMiddle2.render();

  var crownCorner3 = new Cube();
  crownCorner3.color = [1, 0.84, 0, 1.0]
  crownCorner3.matrix = crownCornerMatrix3;
  crownCorner3.matrix.translate(-0.08, 0.43, 0.4);
  crownCorner3.matrix.scale(0.1, 0.1, 0.1);
  crownCorner3.render();

  var crownMiddle3 = new Cube();
  crownMiddle3.color = [1, 0.84, 0, 1.0]
  crownMiddle3.matrix = crownMiddleMatrix3;
  crownMiddle3.matrix.translate(-0.08, 0.43, 0.2);
  crownMiddle3.matrix.scale(0.1, 0.1, 0.1);
  crownMiddle3.render();

  var crownCorner4 = new Cube();
  crownCorner4.color = [1, 0.84, 0, 1.0]
  crownCorner4.matrix = crownCornerMatrix4;
  crownCorner4.matrix.translate(-0.08, 0, 0.4);
  crownCorner4.matrix.scale(0.1, 0.1, 0.1);
  crownCorner4.render();
  
  var crownMiddle4 = new Cube();
  crownMiddle4.color = [1, 0.84, 0, 1.0]
  crownMiddle4.matrix = crownMiddleMatrix4;
  crownMiddle4.matrix.translate(-0.08, 0, 0.2);
  crownMiddle4.matrix.scale(0.1, 0.1, 0.1);
  crownMiddle4.render();

  var frontLeftLeg = new Cube();
  frontLeftLeg.color = [1, 0.55, 0.63, 1.0]
  frontLeftLeg.matrix = tmpMatrix2;
  frontLeftLeg.matrix.translate(1, 0.7, 1);
  frontLeftLeg.matrix.rotate(g_yellowAngle, 0, 0, 1);
  var frontToeMatrix = new Matrix4(frontLeftLeg.matrix);
  var frontToeMatrix2 = new Matrix4(frontLeftLeg.matrix);
  frontLeftLeg.matrix.scale(0.7, 0.4, 0.3);
  frontLeftLeg.render();

  var frontToe = new Cube();
  frontToe.color = [0.52, 0.29, 0, 1.0]
  frontToe.matrix = frontToeMatrix;
  frontToe.matrix.translate(0.6, 0.299, -0.001);
  frontToe.matrix.scale(0.1, 0.1, 0.1);
  frontToe.render();

  var frontToe2 = new Cube();
  frontToe2.color = [0.52, 0.29, 0, 1.0]
  frontToe2.matrix = frontToeMatrix2;
  frontToe2.matrix.translate(0.6, 0.001, -0.01);
  frontToe2.matrix.scale(0.1, 0.1, 0.1);
  frontToe2.render();

  var frontRightLeg = new Cube();
  frontRightLeg.color = [1, 0.55, 0.63, 1.0]
  frontRightLeg.matrix = tmpMatrix3;
  frontRightLeg.matrix.translate(1, -0.1, 1.1);
  var frontToeMatrix3 = new Matrix4(frontRightLeg.matrix);
  var frontToeMatrix4 = new Matrix4(frontRightLeg.matrix);
  frontRightLeg.matrix.scale(0.7, 0.4, 0.3);
  frontRightLeg.render();

  var frontToe3 = new Cube();
  frontToe3.color = [0.52, 0.29, 0, 1.0]
  frontToe3.matrix = frontToeMatrix3;
  frontToe3.matrix.translate(0.6, 0.299, -0.001);
  frontToe3.matrix.scale(0.1, 0.1, 0.1);
  frontToe3.render();

  var frontToe4 = new Cube();
  frontToe4.color = [0.52, 0.29, 0, 1.0]
  frontToe4.matrix = frontToeMatrix4;
  frontToe4.matrix.translate(0.6, 0.001, -0.01);
  frontToe4.matrix.scale(0.1, 0.1, 0.1);
  frontToe4.render();

  var backRightLeg = new Cube();
  backRightLeg.color = [1, 0.55, 0.63, 1.0]
  backRightLeg.matrix = tmpMatrix4;
  backRightLeg.matrix.translate(1, -0.1, 2);
  var backToeMatrix1 = new Matrix4(backRightLeg.matrix);
  var backToeMatrix2 = new Matrix4(backRightLeg.matrix);
  backRightLeg.matrix.scale(0.7, 0.4, 0.3);
  backRightLeg.render();

  var backToe1 = new Cube();
  backToe1.color = [0.52, 0.29, 0, 1.0]
  backToe1.matrix = backToeMatrix1;
  backToe1.matrix.translate(0.6, 0.299, -0.001);
  backToe1.matrix.scale(0.1, 0.1, 0.1);
  backToe1.render();

  var backToe2 = new Cube();
  backToe2.color = [0.52, 0.29, 0, 1.0]
  backToe2.matrix = backToeMatrix2;
  backToe2.matrix.translate(0.6, 0.001, -0.01);
  backToe2.matrix.scale(0.1, 0.1, 0.1);
  backToe2.render();

  var backLeftLeg = new Cube();
  backLeftLeg.color = [1, 0.55, 0.63, 1.0]
  backLeftLeg.matrix = tmpMatrix5;
  backLeftLeg.matrix.translate(1, 0.7, 2);
  var backToeMatrix3 = new Matrix4(backLeftLeg.matrix);
  var backToeMatrix4 = new Matrix4(backLeftLeg.matrix);
  backLeftLeg.matrix.scale(0.7, 0.4, 0.3);
  backLeftLeg.render();

  var backToe3 = new Cube();
  backToe3.color = [0.52, 0.29, 0, 1.0]
  backToe3.matrix = backToeMatrix3;
  backToe3.matrix.translate(0.6, 0.299, -0.001);
  backToe3.matrix.scale(0.1, 0.1, 0.1);
  backToe3.render();

  var backToe4 = new Cube();
  backToe4.color = [0.52, 0.29, 0, 1.0]
  backToe4.matrix = backToeMatrix4;
  backToe4.matrix.translate(0.6, 0.001, -0.01);
  backToe4.matrix.scale(0.1, 0.1, 0.1);
  backToe4.render();

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