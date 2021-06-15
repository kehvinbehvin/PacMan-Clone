///Created map

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
const getlongside = (start, end) => {
  return (end - start) * 20;
};

const checkCollide = (obj1, obj2) => {
  //Need X,Y coordinations, height and width of both objects
  console.log(obj1);
  console.log(obj2);
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

  const objArraycol = [
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
  ];

  const objArrayrow = [
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

  const obstacleArray = [];
  for (let i = 0; i < objArraycol.length; i++) {
    obstacleArray.push(new Obstacle(objArraycol[i]));
  }
  for (let i = 0; i < objArrayrow.length; i++) {
    obstacleArray.push(new Obstacle(objArrayrow[i]));
  }

  const item = {
    height: 100,
    width: 10,
    X: 10,
    Y: 10,
  };
  for (let i = 0; i < obstacleArray.length; i++) {
    if (checkCollide(item, obstacleArray[i])) {
      return console.log("true");
    }
  }
});
