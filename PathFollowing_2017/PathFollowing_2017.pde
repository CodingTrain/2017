// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Crowd Path Following
// Via Reynolds: http://www.red3d.com/cwr/steer/CrowdPath.html

// Using this variable to decide whether to draw all the stuff
boolean debug = false;


// A path object (series of connected points)
Path path;

Path[] paths = new Path[5];

// Two vehicles
ArrayList<Vehicle> vehicles;

Table table;

PImage texture;

int totalParticles = 1500;
int often = 60;

void setup() {
  size(1280, 720, P2D);
  blendMode(ADD);
  pixelDensity(2);
  // Call a function to generate new Path object
  newPath();
  table = loadTable("paths.csv");
  texture = loadImage("texture24.png");

  for (int i = 0; i < paths.length; i++) {
    paths[i] = new Path();
  }



  for (TableRow row : table.rows()) {
    int i = row.getInt(0);
    float x = row.getFloat(1) + 24;
    float y = row.getFloat(2) + 100;
    paths[i].addPoint(x, y);
  }

  // We are now making random vehicles and storing them in an ArrayList
  vehicles = new ArrayList<Vehicle>();
  newVehicle(0, 200, 0);
}

void draw() {
  background(0);
  if (frameCount % often == 0) {
    if (vehicles.size() < totalParticles) {
      newVehicle(-500, 200, 0);
    }
    often--;
    if (often < 1) {
      often = 1;
    }
  }
  // Display the path
  // paths[0].display();

  for (Vehicle v : vehicles) {
    // Path following and separation are worked on in this function
    // Call the generic run method (update, borders, display, etc.)
    v.run();
    v.applyBehaviors(vehicles, paths);
  }
  saveFrame("output/render####.png");
}

void newPath() {
  // A path is a series of connected points
  // A more sophisticated path might be a curve
  path = new Path();
  float offset = 30;
  path.addPoint(offset, offset);
  path.addPoint(width-offset, offset);
  path.addPoint(width-offset, height-offset);
  path.addPoint(width/2, height-offset*3);
  path.addPoint(offset, height-offset);
}

void newVehicle(float x, float y, int wp) {
  float maxspeed = random(3, 8);
  float maxforce = 0.5;
  vehicles.add(new Vehicle(new PVector(x, y), maxspeed, maxforce, wp));
}