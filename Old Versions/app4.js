//first attempt at collision

class screenObj {
  constructor(height, width, color, parentreference, objobarray) {
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
    this.obstacles = objobarray[0];
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
      //   console.log("Hi");
      //check what keycode is pressed and only pass if not active already
      if (
        event.keyCode === 83 &&
        this.keyCode !== 83 &&
        collision(this.obstacles) !== true
      ) {
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
      } else if (
        event.keyCode === 87 &&
        this.keyCode !== 87 &&
        collision(this.obstacles) !== true
      ) {
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
      } else if (
        event.keyCode === 68 &&
        this.keyCode !== 68 &&
        collision(this.obstacles) !== true
      ) {
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
      } else if (
        event.keyCode === 65 &&
        this.keyCode !== 65 &&
        collision(this.obstacles) !== true
      ) {
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
//====================================================================================================================================================================================================================================================================================
class Obstacle {
  constructor(obj) {
    this.obj = obj;
    this.type = this.obj.RC === true ? "col" : "row";
    this.height = this.obj.RC === true ? this.obj.longside : 20;
    this.width = this.obj.RC === false ? this.obj.longside : 20;
    this.X = this.obj.jqobj.position().left;
    this.Y = this.obj.jqobj.position().top;
  }
}
const randomNum = (num) => {
  return Math.floor(Math.random() * num + 1);
};
const createObstacle = (parent, id) => {
  const obstacle = $("<div>").addClass("obstacle").attr("id", `${id}`);
  parent.append(obstacle);
  obstacle.css({
    height: "100px",
    width: "5px",
    backgroundColor: "red",
    position: "absolute",
    top: randomNum(100),
    left: randomNum(100),
  });
  return $(`${id}`);
};

const createcolumn = (parent, start, end, col, id) => {
  const column = $("<div>").addClass("column").attr("id", `${id}`);
  column.css({
    gridColumn: col,
    gridRow: `${start}/${end}`,
    backgroundColor: "black",
  });
  parent.append(column);
  return {
    jqobj: $(`div #${id}`),
    longside: getlongside(start, end),
    // xcord: start,
    // ycord: col,
    RC: true, //true for col
  };
};
const createrow = (parent, start, end, row, id) => {
  const column = $("<div>").addClass("column").attr("id", `${id}`);
  column.css({
    gridColumn: `${start}/${end}`,
    gridRow: row,
    backgroundColor: "black",
  });
  parent.append(column);
  return {
    jqobj: $(`div #${id}`),
    longside: getlongside(start, end),
    // xcord: start,
    // ycord: row,
    RC: false,
  };
};

const createMap = () => {
  const ob1 = createcolumn($(".game"), 2, 10, 2, 1);
  const ob3 = createcolumn($(".game"), 2, 10, 29, 3);
  const ob6 = createcolumn($(".game"), 11, 19, 29, 6);
  const ob7 = createcolumn($(".game"), 4, 17, 4, 7);
  const ob8 = createcolumn($(".game"), 4, 17, 27, 8);
  const ob15 = createcolumn($(".game"), 6, 16, 6, 15);
  const ob16 = createcolumn($(".game"), 6, 16, 25, 16);
  const ob19 = createcolumn($(".game"), 6, 16, 16, 19);
  const ob20 = createcolumn($(".game"), 6, 16, 15, 20);
  const ob22 = createcolumn($(".game"), 8, 15, 18, 22);
  const ob25 = createcolumn($(".game"), 6, 13, 13, 25);
  const ob4 = createcolumn($(".game"), 11, 19, 2, 4);

  const ob2 = createrow($(".game"), 2, 30, 2, 2);
  const ob5 = createrow($(".game"), 2, 30, 19, 5);
  const ob9 = createrow($(".game"), 4, 11, 4, 9);
  const ob10 = createrow($(".game"), 12, 20, 4, 10);
  const ob11 = createrow($(".game"), 21, 28, 4, 11);
  const ob12 = createrow($(".game"), 4, 11, 17, 12);
  const ob13 = createrow($(".game"), 12, 20, 17, 13);
  const ob14 = createrow($(".game"), 21, 28, 17, 14);
  const ob17 = createrow($(".game"), 17, 25, 6, 17);
  const ob18 = createrow($(".game"), 6, 15, 15, 18);
  const ob21 = createrow($(".game"), 18, 24, 8, 21);
  const ob23 = createrow($(".game"), 18, 24, 15, 23);
  const ob24 = createrow($(".game"), 8, 14, 6, 24);
  const ob26 = createrow($(".game"), 8, 14, 13, 26);

  const objArray = [
    ob1,
    ob3,
    ob6,
    ob7,
    ob8,
    ob15,
    ob16,
    ob19,
    ob20,
    ob22,
    ob25,
    ob4,
    ob2,
    ob5,
    ob9,
    ob10,
    ob11,
    ob12,
    ob13,
    ob14,
    ob17,
    ob18,
    ob21,
    ob23,
    ob24,
    ob26,
  ];
  return [objArray];
};
const getlongside = (start, end) => {
  return (end - start) * 20;
};

const checkCollide = (obj1, obj2) => {
  //Need X,Y coordinations, height and width of both objects
  //   console.log(obj1);
  //   console.log(obj2);
  if (
    obj1.X < obj2.X + obj2.width &&
    obj1.X + obj1.width > obj2.X &&
    obj1.Y < obj2.Y + obj2.height &&
    obj1.Y + obj1.height > obj1.Y
  ) {
    return true;
  }
  return false;
};
const collision = (objArray) => {
  let collided = false;
  const obstacleArray = [];
  for (let i = 0; i < objArray.length; i++) {
    obstacleArray.push(new Obstacle(objArray[i]));
  }

  const paccy = {
    height: 10,
    width: 10,
    X: $("#PacMan").position().left,
    Y: $("#PacMan").position().top,
  };
  console.log(paccy.X, paccy.Y);
  for (let i = 0; i < obstacleArray.length; i++) {
    if (checkCollide(paccy, obstacleArray[i])) {
      collided = true;
      console.log(collided);
      return collided;
    }
  }
  console.log(collided);
  return collided;
};
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

  $(".game").css({
    gridTemplateColumns: "repeat(30,1fr)",
    gridTemplateRows: "repeat(20,1fr)",
  });
  const obstaclesObjArray = createMap();
  const pacman = new screenObj(20, 20, "red", $(".game"), obstaclesObjArray);
  pacman.renderObj("PacMan");
  pacman.objListenMove();
});
