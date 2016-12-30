// 8 nights of Hanukkah 2016 Examples
// Night 7: Animated Circle Packing
// Expansion of: https://youtu.be/XATr_jdh-44
// Daniel Shiffman
// http://codingrainbow.com/

// All the circles
var circles = [];
var circles = [];
var spots = [];

var txt;

function preload() {
  txt = loadImage("data/2017.png");
}

function setup() {
  createCanvas(900, 400);
  txt.loadPixels();
  for (var x = 0; x < txt.width; x++) {
    for (var y = 0; y < txt.height; y++) {
      var index = (x + y * txt.width) * 4
      var rVal = txt.pixels[index];
      if (rVal > 10) {
        spots.push(createVector(x, y));
      }
    }
  }
}

function draw() {
  background(0);
  // All the circles
  for (var i = 0; i < circles.length; i++) {
    var c = circles[i];
    c.show();

    // Is it a growing one?
    if (c.growing) {
      c.grow();
      // Does it overlap any previous circles?
      for (var j = 0; j < circles.length; j++) {
        var other = circles[j];
        if (other != c) {
          var d = dist(c.x, c.y, other.x, other.y);
          if (d - 1 < c.r + other.r) {
            c.growing = false;
          }
        }
      }

      // Is it stuck to an edge?
      if (c.growing) {
        c.growing = !c.edges();
      }
    }
  }

  // Let's try to make a certain number of new circles each frame
  // More the longer it has been running
  var target = 1; // + constrain(frameCount / 120, 0, 20);
  var count = 0;
  // Try N times
  for (var i = 0; i < 2000; i++) {
    if (addCircle()) {
      count++;
    }
    // We made enough

    if (count == target) {
      break;
    }
  }
  // We can't make any more
  if (count < 1) {
    noLoop();
    console.log("finished");
  }
}

// Add one circle

function addCircle() {
  // Here's a new circle
  var index = floor(random(spots.length));
  var spot = spots[index];
  var newCircle = new Circle(spot.x, spot.y, 1);
  // Is it in an ok spot?
  for (var i = 0; i < circles.length; i++) {
    var other = circles[i];
    var d = dist(newCircle.x, newCircle.y, other.x, other.y);
    if (d < other.r + 2) {
      newCircle = null;
      break;
    }
  }
  // If it is, add it
  if (newCircle != null) {
    circles.push(newCircle);
    return true;
  } else {
    return false;
  }
}



function Circle(x, y, r) {
  this.growing = true;
  this.x = x;
  this.y = y;
  this.r = r;

  // Check stuck to an edge
  this.edges = function() {
    return (this.r > width - this.x || this.r > this.x || this.r > height - this.y || this.r > this.y);
  }

  // Grow
  this.grow = function() {
    this.r += 0.5;
  }

  // Show
  this.show = function() {
    stroke(255);
    noFill();
    strokeWeight(2);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
