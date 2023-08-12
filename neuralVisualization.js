let layers = [{ nodes: 6 }, { nodes: 4 }, { nodes: 3 }];

let neuralLayers = [];
let dataPoints = [];
let gradientOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  let xSpacing = width / (layers.length + 1);
  layers.forEach((layer, i) => {
    let neuralLayer = new Layer(layer.nodes, xSpacing * (i + 1));
    neuralLayers.push(neuralLayer);
  });
}

function draw() {
  background(220);

  for (let i = dataPoints.length - 1; i >= 0; i--) {
    dataPoints[i].update();
    dataPoints[i].display();

    if (dataPoints[i].completed) {
      dataPoints.splice(i, 1);
    }
  }

  for (let i = 0; i < neuralLayers.length - 1; i++) {
    neuralLayers[i].connectTo(neuralLayers[i + 1]);
  }

  neuralLayers.forEach((layer) => layer.show());

  gradientOffset += 0.01;
  if (gradientOffset > 1) {
    gradientOffset = 0;
  }
}

function mouseClicked() {
  for (let node of neuralLayers[0].nodes) {
    let targetNodes = neuralLayers[1].nodes;
    let targetNode = random(targetNodes);
    dataPoints.push(new DataPoint(node, targetNode));
  }
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
  }

  show() {
    fill("blue");
    ellipse(this.x, this.y, this.radius * 2);

    if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
      fill(100, 100, 250, 150);
      ellipse(this.x, this.y, this.radius * 2.5);
    }
  }
}

class Layer {
  constructor(nodeCount, x) {
    this.nodes = [];
    let spacing = height / (nodeCount + 1);
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push(new Node(x, spacing * (i + 1)));
    }
  }

  show() {
    this.nodes.forEach((node) => node.show());
  }

  connectTo(nextLayer) {
    this.nodes.forEach((node) => {
      nextLayer.nodes.forEach((nextNode) => {
        this.gradientLine(
          node.x,
          node.y,
          nextNode.x,
          nextNode.y,
          gradientOffset
        );
      });
    });
  }

  gradientLine(x1, y1, x2, y2, offset) {
    let grad = createLinearGradient(x1, y1, x2, y2, offset);
    drawingContext.strokeStyle = grad;
    drawingContext.beginPath();
    drawingContext.moveTo(x1, y1);
    drawingContext.lineTo(x2, y2);
    drawingContext.stroke();
  }
}

function createLinearGradient(x1, y1, x2, y2, offset) {
  let grad = drawingContext.createLinearGradient(x1, y1, x2, y2);

  grad.addColorStop((0 + offset) % 1, "rgba(255, 255, 255, 1)");
  grad.addColorStop((0.2 + offset) % 1, "rgba(0, 255, 0, 1)");
  grad.addColorStop((0.5 + offset) % 1, "rgba(0, 0, 255, 1)");
  grad.addColorStop((0.8 + offset) % 1, "rgba(255, 0, 0, 1)");

  return grad;
}

class DataPoint {
  constructor(startNode, endNode) {
    this.pos = createVector(startNode.x, startNode.y);
    this.target = createVector(endNode.x, endNode.y);
    this.speed = 3;
    this.completed = false;
  }

  update() {
    let dir = p5.Vector.sub(this.target, this.pos).normalize();
    this.pos.add(dir.mult(this.speed));

    if (p5.Vector.dist(this.pos, this.target) <= this.speed) {
      this.completed = true;
    }
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 10);
  }
}
