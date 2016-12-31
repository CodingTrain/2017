// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following
// Vehicle class

function Vehicle(x, y, ms, mf, wp) {
  this.position = createVector(x, y);
  this.r = 8;
  this.maxspeed = ms;
  this.maxforce = mf;
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(this.maxspeed, 0);
  this.whichPath = wp;
}

// A function to deal with path following and separation
// Using global variables
Vehicle.prototype.applyBehaviors = function() {
  // Follow path force
  var f = this.follow(this.whichPath);
  // Separate from other boids force
  var s = this.separate(vehicles);
  // Arbitrary weighting
  f.mult(2);
  s.mult(2);
  // Accumulate in acceleration
  this.applyForce(f);
  this.applyForce(s);
}

Vehicle.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}


// Main "run" function
Vehicle.prototype.run = function() {
  this.update();
  this.render();
}

// This function implements Craig Reynolds' path following algorithm
// http://www.red3d.com/cwr/steer/PathFollow.html
Vehicle.prototype.follow = function(p) {

  // Predict position 25 (arbitrary choice) frames ahead
  var predict = this.velocity.copy();
  predict.normalize();
  predict.mult(25);
  var predictpos = p5.Vector.add(this.position, predict);

  // Now we must find the normal to the path from the predicted position
  // We look at the normal for each line segment and pick out the closest one
  var normal = null;
  var target = null;
  var worldRecord = 1000000; // Start with a very high worldRecord distance that can easily be beaten

  // Loop through all points of the path
  for (var i = 0; i < p.points.length; i++) {

    // Look at a line segment
    var a = p.points[i];
    var b = p.points[(i + 1) % p.points.length]; // Note Path has to wraparound

    // Get the normal point to that line
    var normalPoint = getNormalPoint(predictpos, a, b);

    // Check if normal is on line segment
    var dir = p5.Vector.sub(b, a);
    // If it's not within the line segment, consider the normal to just be the end of the line segment (point b)
    //if (da + db > line.mag()+1) {
    if (normalPoint.x < min(a.x, b.x) || normalPoint.x > max(a.x, b.x) || normalPoint.y < min(a.y, b.y) || normalPoint.y > max(a.y, b.y)) {
      normalPoint = b.copy();
      // If we're at the end we really want the next line segment for looking ahead
      a = p.points[(i + 1) % p.points.length];
      b = p.points[(i + 2) % p.points.length]; // Path wraps around
      dir = p5.Vector.sub(b, a);
    }

    // How far away are we from the path?
    var d = p5.Vector.dist(predictpos, normalPoint);
    // Did we beat the worldRecord and find the closest line segment?
    if (d < worldRecord) {
      worldRecord = d;
      normal = normalPoint;

      // Look at the direction of the line segment so we can seek a little bit ahead of the normal
      dir.normalize();
      // This is an oversimplification
      // Should be based on distance to path & velocity
      dir.mult(25);
      target = normal.copy();
      target.add(dir);
    }
  }
  // Only if the distance is greater than the path's radius do we bother to steer
  if (worldRecord > p.radius) {
    return this.seek(target);
  } else {
    return createVector(0, 0);
  }
}

// Separation
// Method checks for nearby boids and steers away
Vehicle.prototype.separate = function(boids) {
  var desiredseparation = this.r * 2;
  var steer = createVector(0, 0, 0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < boids.length; i++) {
    var other = boids[i];
    var d = p5.Vector.dist(this.position, other.position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position, other.position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}


// Method to update position
Vehicle.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Vehicle.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position); // A vector pointing from the position to the target

  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Vepositionity
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force

  return steer;
}


Vehicle.prototype.render = function() {
  // Simpler boid is just a circle
  fill(255);
  noStroke();
  push();
  translate(this.position.x, this.position.y);
  ellipse(0, 0, this.r, this.r);
  pop();
}

// A function to get the normal point from a point (p) to a line segment (a-b)
// This function could be optimized to make fewer new Vector objects
function getNormalPoint(p, a, b) {
  // Vector from a to p
  var ap = p5.Vector.sub(p, a);
  // Vector from a to b
  var ab = p5.Vector.sub(b, a);
  ab.normalize(); // Normalize the line
  // Project vector "diff" onto line by using the dot product
  ab.mult(ap.dot(ab));
  var normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}
