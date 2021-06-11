//   Create PacMan Object
class screenObj {
  constructor(height, width, color, parentreference) {
    this.color = color;
    this.size = [height, width];
    this.parentheight = parentreference.height();
    this.parentwidth = parentreference.width();
    // this.parentTopOffset = parentreference.position().top;
    // this.parentLeftOffset = parentreference.position().left;
    this.moveLimit = [
      this.parentheight - this.size[0],
      this.parentwidth - this.size[1],
    ];
    //Change the offset to change the starting position The
    //offset includes the offset of the parent
    this.topOffset = this.parentheight - this.size[0]; //this is 0 based on the height and width of the parent, no need to include parent offset
    this.leftOffset = this.parentwidth - this.size[1];
    //current position
    this.currentPosition = [
      this.parentheight - this.topOffset - this.size[0],
      this.parentwidth - this.leftOffset - this.size[1],
    ];
    this.movingdirection = 0;
    this.keyCode = 0;
  }
  renderObj(id) {
    const screenObject = $("<div>").attr("id", `${id}`);
    screenObject.css({
      height: this.size[0],
      width: this.size[1],
      backgroundColor: this.color,
      //Starting Position
      position: "absolute",
      top: this.currentPosition[0],
      left: this.currentPosition[1],
    });
    $(".game").append(screenObject);
    console.log("Object rendered");
    return $(`${id}`);
  }

  reposition() {
    // Re-adjust the css
    this.currentPosition = [
      this.parentheight - this.topOffset - this.size[0],
      this.parentwidth - this.leftOffset - this.size[1],
    ];
    $("#PacMan").css({
      top: this.currentPosition[0],
      left: this.currentPosition[1],
    });
  }
  objListenMove() {
    console.log("objlistenmove started");
    $("body").on("keydown", (event) => {
      //check what keycode is pressed and only pass if not active already
      if (event.keyCode === 83 && this.keyCode !== 83) {
        // if not active, set current direction of obj as keycode to indicate active
        this.keyCode = 83;
        console.log("Move Down");
        // Check if position is within the play area and if
        if (this.currentPosition[0] < this.moveLimit[0]) {
          //Remove any setIntervals if the obj was moving in a different direction
          clearInterval(this.movingdirection);
          //Setinterval to make the obj move at 50ms
          this.movingdirection = setInterval(() => {
            //Stops the object from leaving the play area while moving , the clearinterval does not stop immediately, i think is because of the async properties, there is a constant delay of 1px, need to adjust this when create the parameter to read the environment where the obj is being created
            if (this.currentPosition[0] === this.moveLimit[0] - 1) {
              clearInterval(this.movingdirection);
            }
            this.topOffset -= 1;
            this.reposition();
          }, 25);
        }
      } else if (event.keyCode === 87 && this.keyCode !== 87) {
        this.keyCode = 87;
        console.log("Move Up");
        if (this.currentPosition[0] > 0) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (this.currentPosition[0] === 1) {
              clearInterval(this.movingdirection);
            }
            this.topOffset += 1;
            this.reposition();
          }, 25);
        }
      } else if (event.keyCode === 68 && this.keyCode !== 68) {
        this.keyCode = 68;
        console.log("Move Right");
        if (this.currentPosition[1] < this.moveLimit[1]) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (this.currentPosition[1] === this.moveLimit[1] - 1) {
              clearInterval(this.movingdirection);
            }
            this.leftOffset -= 1;
            this.reposition();
          }, 25);
        }
      } else if (event.keyCode === 65 && this.keyCode !== 65) {
        this.keyCode = 65;
        console.log("Move Left");
        if (this.currentPosition[1] > 0) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (this.currentPosition[1] === 1) {
              clearInterval(this.movingdirection);
            }
            this.leftOffset += 1;
            this.reposition();
          }, 25);
        }
      }
    });
  }
}

$(() => {
  //creating the environment
  $(".game").css({
    position: "absolute",
    top: "10px",
    left: "10px",
    height: "400px",
    width: "600px",
    backgroundColor: "blue",
    display: "grid",
  });

  const pacman = new screenObj(20, 20, "red", $(".game"));
  pacman.renderObj("PacMan");
  pacman.objListenMove();
});
