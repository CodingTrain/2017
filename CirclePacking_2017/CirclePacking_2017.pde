// 8 nights of Hanukkah 2016 Examples
// Night 7: Animated Circle Packing
// Expansion of: https://youtu.be/XATr_jdh-44
// Daniel Shiffman
// http://codingrainbow.com/

// All the circles
ArrayList<Circle> circles = new ArrayList<Circle>();
ArrayList<PVector> spots = new ArrayList<PVector>();

void setup() {
  size(900, 400);
  PImage txt = loadImage("2017.png");
  txt.loadPixels();
  for (int x = 0; x < txt.width; x++) {
    for (int y = 0; y < txt.height; y++) {
      color c = txt.pixels[x + y * txt.width];
      if (brightness(c) > 10) {
        spots.add(new PVector(x,y)); 
      }
    }
  }
  pixelDensity(2);
}

void draw() {
  background(0);
  // All the circles
  for (Circle c : circles) {
    c.show();

    // Is it a growing one?
    if (c.growing) {
      c.grow();
      // Does it overlap any previous circles?
      for (Circle other : circles) {
        if (other != c) {
          float d = dist(c.x, c.y, other.x, other.y);
          if (d-1 < c.r + other.r) {
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
  int target = 1;// + constrain(frameCount / 120, 0, 20);
  int count = 0;
  // Try N times
  for (int i = 0; i < 2000; i++) {
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
    println("finished");
  }
  //tint(50);
  //image(canvas, 0, 0);
}

// Add one circle

boolean addCircle() {
  // Here's a new circle
  
  int index = int(random(spots.size()));
  PVector spot = spots.get(index);
  Circle newCircle = new Circle(spot.x, spot.y, 1);
  // Is it in an ok spot?
  for (Circle other : circles) {
    float d = dist(newCircle.x, newCircle.y, other.x, other.y);
    if (d < other.r+2) {
      newCircle = null;
      break;
    }
  }
  // If it is, add it
  if (newCircle != null) {
    circles.add(newCircle);
    return true;
  } else {
    return false;
  }
}