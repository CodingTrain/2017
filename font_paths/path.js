// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following

function Path() {
  // Arbitrary radius of 20
  this.radius = 5;
  this.points = [];
}

// Add a point to the path
Path.prototype.addPoint = function(x, y) {
  var point = createVector(x, y);
  this.points.push(point);
}

// Draw the path
Path.prototype.display = function() {
  strokeJoin(ROUND);

  // Draw thick line for radius
  stroke(175);
  strokeWeight(this.radius * 2);
  noFill();
  beginShape();
  for (var i = 0; i < this.points.length; i++) {
    var v = this.points[i];
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
  // Draw thin line for center of path
  stroke(0);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < this.points.length; i++) {
    var v = this.points[i];
    vertex(v.x, v.y);
    ellipse(v.x, v.y, 3, 3);
  }
  endShape(CLOSE);
}
