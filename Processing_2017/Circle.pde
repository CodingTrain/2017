// 8 nights of Hanukkah 2016 Examples
// Night 7: Animated Circle Packing
// Expansion of: https://youtu.be/XATr_jdh-44
// Daniel Shiffman
// http://codingrainbow.com/

// Circle class
class Circle {
  float x, y, r;

  boolean growing = true;

  Circle(float x_, float y_, float r_) {
    x = x_;
    y = y_;
    r = r_;
  }

  // Check stuck to an edge

  boolean edges() {
    return (r > width - x || r > x || r > height-y || r > y);
  }

  // Grow
  void grow() {
    r += 0.5;
  }

  // Show
  void show() {
    stroke(255);
    noFill();
    strokeWeight(2);
    ellipse(x, y, r*2, r*2);
  }
}