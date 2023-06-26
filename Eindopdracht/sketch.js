let serial;

let port = "/dev/tty.usbmodemOJA_0011";

let isConnected = false;

let velocities = [ 20, 30, 40, 50, 60, 70, 80, 90 ];
let noteNums = [ 60, 62, 64, 65, 67, 69, 71, 72 ];

let defaultVelocity = 100;

let client;

let strings = [];

let numStringsH = 8;
let numStringsV = 8;

class HarpString {
  constructor(xPos, yPos, orientation, mappedParam, value) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.state = 'idle';
    this.idleRGB = [255, 0, 0];
    this.clickedRGB = [0, 255, 255];
    this.inactiveRGB = [100, 100, 100];
    this.color = [0, 0, 0];
    this.length = 280;
    this.orientation = orientation;
    this.thickness = 5;
    this.mappedParam = mappedParam;
    this.value = value;
  }

  draw() {
    switch (this.state) {
      case 'idle':
        this.color = this.idleRGB;
        break;
      case 'clicked':
        this.color = this.clickedRGB;
        break;
      case 'inactive':
        this.color = this.inactiveRGB;
        break;
    }

    stroke(this.color[0], this.color[1], this.color[2]);

    strokeWeight(this.thickness);

    if (this.orientation == 'V') {
      line(this.xPos, this.yPos, this.xPos, this.yPos + this.length);
    } else {
      line(this.xPos, this.yPos, this.xPos + this.length, this.yPos);
    }
  }

  trigger() {
    this.state = 'clicked';
  }
}

function connectToTeensy(serialPort) {
  
    serial.getPorts();
    serial.openPort(serialPort, 9600);
    /*
    let conn = false;
    while (!conn) {
        serial.getSerialData(data => {
          if (data == "REQ") {
            serial.sendSerialData("OK");
            conn = true;
            console.log("Connected on port: " + serialPort + ".");
          }
        });
        i++;
    }
    return conn;
    */

    return true;
}

function sendNote(noteNum, velocity) {
  client.sendMessage("/note", noteNum);
  console.log(noteNum);
  strings[noteNums.indexOf(noteNum)].trigger();
  strings[8 + velocities.indexOf(noteNum)].trigger();
  client.sendMessage("/velocity", velocity);
}

function setup() {
  createCanvas(800,600);
  background(255);
  frameRate(60);

  serial = new Serial();
  isConnected = connectToTeensy(port);

  client = new Client();
  client.startClient("127.0.0.1", 5808);

  for (let i = 0; i < numStringsH; i++) {
    strings[i] = new HarpString(100, (i * 40) + 100, 'H', '/velocity', 20);
  }

  for (let i = 0; i < numStringsV; i++) {
    strings[i + 8] = new HarpString((i * 40) + 100, 100, 'V', '/note', 20);
  }
}

function draw() {
  background(0);

  for (let i = 0; i < strings.length; i++) {
    strings[i].draw();
  }

  let currentVelocities = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

  let currentPlayingNotes = {

  };

  serial.getSerialData(data => {
    
    let sensorIndex = data.split('=')[0];
    let value = Boolean(data.split('=')[1]);


    if (parseInt(data.split('=')[1]) < 100) {
      sendNote(60, 90);
    } else {
      sendNote(60, 0);
    }

  });


}