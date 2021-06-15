//Implemented grid movement for pacman

//   Create PacMan Object
class screenObj {
  constructor(height, width, color, parentreference, obstacletest) {
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
    this.obstacles = obstacletest;
    this.collided = false;
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
    // console.log(this.currentPosition[0], this.currentPosition[1]);
    $("#PacMan").css({
      top: this.currentPosition[0],
      left: this.currentPosition[1],
    });
  }
  objListenMove() {
    console.log("objlistenmove started");
    console.log(this.obstacles);
    $("body").on("keydown", (event) => {
      if (event.keyCode === 83 && this.keyCode !== 83) {
        this.keyCode = 83;
        if (this.currentPosition[0] < this.moveLimit[0]) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (
              this.currentPosition[0] === this.moveLimit[0] - 1 ||
              checkBelow(this.obstacles)
            ) {
              clearInterval(this.movingdirection);
            }
            this.topOffset -= 1;
            this.reposition();
          }, 10);
        }
      } else if (event.keyCode === 87 && this.keyCode !== 87) {
        this.keyCode = 87;
        if (this.currentPosition[0] > 0) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (this.currentPosition[0] === 1 || checkAbove(this.obstacles)) {
              clearInterval(this.movingdirection);
            }
            this.topOffset += 1;
            this.reposition();
          }, 10);
        }
      } else if (event.keyCode === 68 && this.keyCode !== 68) {
        this.keyCode = 68;
        if (this.currentPosition[1] < this.moveLimit[1]) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (
              this.currentPosition[1] === this.moveLimit[1] - 1 ||
              checkRight(this.obstacles)
            ) {
              clearInterval(this.movingdirection);
            }
            this.leftOffset -= 1;
            this.reposition();
          }, 10);
        }
      } else if (event.keyCode === 65 && this.keyCode !== 65) {
        this.keyCode = 65;
        if (this.currentPosition[1] > 0) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            if (this.currentPosition[1] === 1 || checkLeft(this.obstacles)) {
              clearInterval(this.movingdirection);
            }
            this.leftOffset += 1;
            this.reposition();
          }, 10);
        }
      }
    });
  }
}
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
const getlongside = (start, end) => {
  return (end - start) * 20;
};

const checkAbove = (obj2) => {
  console.log("checking above");
  const paccy = {
    height: 10,
    width: 10,
    X: $("#PacMan").position().left,
    Y: $("#PacMan").position().top,
  };
  if (paccy.Y < obj2.Y + obj2.height) {
    return true;
  }
};

const checkBelow = (obj2) => {
  console.log("checking below");
  const paccy = {
    height: 10,
    width: 10,
    X: $("#PacMan").position().left,
    Y: $("#PacMan").position().top,
  };
  if (paccy.Y + paccy.height > obj2.Y) {
    return true;
  }
};

const checkRight = (obj2) => {
  console.log("checking right");
  const paccy = {
    height: 10,
    width: 10,
    X: $("#PacMan").position().left,
    Y: $("#PacMan").position().top,
  };
  if (paccy.X + paccy.width > obj2.X) {
    if (paccy.height + paccy.Y > obj2.Y && paccy.Y < obj2.Y + obj2.height) {
      return true;
    }
  }
};

const checkLeft = (obj2) => {
  console.log("checking left");
  const paccy = {
    height: 10,
    width: 10,
    X: $("#PacMan").position().left,
    Y: $("#PacMan").position().top,
  };
  if (paccy.X < obj2.X + obj2.width) {
    if (true) {
      return true;
    }
  }
};

// const checkCollide = (obj1, obj2) => {
//   //Need X,Y coordinations, height and width of both objects
//   // ((obj1.X < obj2.X + obj2.width &&
//   //   obj1.X + obj1.width > obj2.X + obj2.width) || //Check right or left
//   //   (obj1.X < obj2.X && obj1.X + obj1.width > obj2.X)) &&
//   // ((obj1.X < obj2.X && obj1.Y + obj1.height > obj2.Y) || //Check up or down
//   //   (obj1.Y < obj2.Y + obj2.height &&
//   //     obj1.Y + obj1.height > obj2.Y + obj2.height)) //Either one of pair must be true
//   // obj1.X < obj2.X + obj2.width &&
//   // obj1.X + obj1.width > obj2.X &&
//   // obj1.Y < obj2.Y + obj2.height &&
//   // obj1.Y + obj1.height > obj1.Y
//   //   console.log("pacman: ", obj1);
//   //   console.log("obstacle: ", obj2);
//   if (
//     obj1.Y + 12 + obj1.height + 12 > obj2.Y + 12 &&
//     obj1.Y + 12 < obj2.Y + 12 + obj2.height + 12 &&
//     obj1.X + 12 + obj1.width + 12 > obj2.X + 12 &&
//     obj1.X + 12 < obj2.X + 12 + obj2.width + 12
//   ) {
//     //Check if its above
//     console.log("check 1");
//     return true;
//     //   } else if (obj1.X + obj1.width > obj2.X && obj1.X < obj2.X + obj2.width) {
//     //     //Check if its on the left
//     //     console.log("check 2");
//     //     return true;
//     //   } else if (obj1.X + obj1.width > obj2.X && obj1.X < obj2.X + obj2.width) {
//     //     //Check if its on the right
//     //     console.log("check 3");
//     //     return true;
//     //   } else if (obj1.Y + obj1.height > obj2.Y && obj1.Y < obj2.Y + obj2.height) {
//     //     //check if its below
//     //     console.log("check 4");
//     //     return true;
//   }
//   return false;
// };
class Obstacle {
  constructor(obj) {
    this.obj = obj;
    this.type = this.obj.RC === true ? "col" : "row";
    this.height = this.obj.RC === true ? this.obj.longside : 20;
    this.width = this.obj.RC === false ? this.obj.longside : 20;
    this.X = this.obj.jqobj.position().left;
    this.Y = this.obj.jqobj.position().top;
  }
  display() {
    console.log("type: ", this.type);
    console.log("height: ", this.height);
    console.log("width: ", this.width);
    console.log("X: ", this.X);
    console.log("Y: ", this.Y);
  }
}
const collision = (obob1) => {
  let collided = false;
  const obstacleArray = [];
  const obobj = new Obstacle(obob1);
  obstacleArray.push(obobj);

  //   console.log(paccy.X, paccy.Y);
  for (let i = 0; i < obstacleArray.length; i++) {
    if (checkCollide(paccy, obstacleArray[i])) {
      collided = true;
      console.log("collided");
      return collided;
    }
  }
  console.log("clear");
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
  const obob1 = createrow($(".game"), 2, 10, 6, 2);
  const obobj = new Obstacle(obob1);
  const pacman = new screenObj(20, 20, "red", $(".game"), obobj);
  pacman.renderObj("PacMan");
  pacman.objListenMove();
});
