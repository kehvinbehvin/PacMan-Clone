//Created Dijkstra
import {
  generatePlatform,
  createcolumn,
  createrow,
  findArrayinArray,
  removeArrayinArray,
  removeMultipleArrays,
  calcAllcolumns,
  getRowWalls,
  getColWalls,
  findObjinArray,
  findMinObjinArray,
  removeObjsinArray,
  booleanObjinArray,
} from "../utils.js";
class things {
  constructor(col, row, id, color) {
    this.id = id;
    this.color = color;
    this.col = col;
    this.row = row;
    this.direction = false;
    this.limitX = [1, 30];
    this.limitY = [1, 20];
    this.wallsColArray = [];
    this.wallsRowArray = [];
    this.environmentCollision;
    this.score = 0;
  }

  generateBody(parent) {
    parent.append($("<div>").attr("id", `${this.id}`));
    this.generateCss();
  }

  generateCss() {
    $(`#${this.id}`).css({
      gridColumn: this.col,
      gridRow: this.row,
      backgroundColor: this.color,
    });
  }
  retrieveWallinfo(rowwalls, colwalls) {
    this.wallsColArray = colwalls;
    this.wallsRowArray = rowwalls;
    this.environmentCollision = this.Walldetection();
  }
  getWallCords() {
    const accumulator = [];
    this.wallsColArray.map((elementObj) => {
      return accumulator.push(getColWalls(elementObj));
    });

    this.wallsRowArray.map((elementObj) => {
      return accumulator.push(getRowWalls(elementObj));
    });
    const deconstructed = [];
    accumulator.map((element) => {
      return element.map((innerElement) => {
        return deconstructed.push(innerElement);
      });
    });
    return deconstructed;
  }

  Walldetection() {
    const allWallCords = this.getWallCords();
    const collision = (row, col) => {
      const matchcols = allWallCords.filter((element) => {
        return element[0] === col;
      });
      const matchrows = matchcols.filter((element) => {
        return element[1] === row;
      });
      if (matchrows.length > 0) {
        return false;
      } else if (matchrows.length === 0) {
        return true;
      }
      //returns true if collision is detected at a specified row/col
    };
    return collision; //invoking walldetection gives us the collision function
  }
}
class Enemy extends things {
  constructor(col, row) {
    super(col, row, "enemy", "red");
    this.visitedPath = [];
    this.moving;
  }
  retrievenodes(allnodes) {
    this.nodes = allnodes;
  }
  retrievepath(path) {
    if (this.visitedPath.length === 0) {
      this.path = path;
    } else {
      const filtered = path.filter((element) => {
        return !booleanObjinArray(element, this.visitedPath);
      });
      this.path = filtered;
    }
  }
  startMoving() {
    this.moving = setInterval(() => {
      if (this.path.length === 0) {
        this.stop();
        $(".game").children().remove();
      }
      this.col = this.path[0].col;
      this.row = this.path[0].row;
      this.generateCss();
      this.path.shift();
    }, 100);
  }
  stop() {
    clearInterval(this.moving);
  }
}
class PacMan extends things {
  constructor(col, row) {
    super(col, row, "paccy", "green");
  }
  retrievenodes(allnodes) {
    this.nodes = allnodes;
  }
  retrievepath(path) {
    this.path = path;
  }
  listenMovement() {
    $("body").on("keydown", (event) => {
      if (event.keyCode === 83) {
        console.log("Move Down");
        if (
          this.row !== this.limitY[1] &&
          this.environmentCollision(this.row + 1, this.col)
        ) {
          this.row += 1;
          this.generateCss();
        }
      } else if (event.keyCode === 87) {
        console.log("Move Up");
        if (
          this.row !== this.limitY[0] &&
          this.environmentCollision(this.row - 1, this.col)
        ) {
          this.row -= 1;
          this.generateCss();
        }
      } else if (event.keyCode === 68 && this.keyCode !== 68) {
        console.log("Move Right");
        if (
          this.col !== this.limitX[1] &&
          this.environmentCollision(this.row, this.col + 1)
        ) {
          this.col += 1;
          this.generateCss();
        }
      } else if (event.keyCode === 65) {
        console.log("Move Left");
        if (
          this.col !== this.limitX[0] &&
          this.environmentCollision(this.row, this.col - 1)
        ) {
          this.col -= 1;
          this.generateCss();
        }
      }
      //   console.log("Pacman row", this.row);
      //   console.log("Pacman col", this.col);
      const nextPositionObj = findObjinArray([this.col, this.row], this.nodes);
      this.path.push(nextPositionObj);
      //   dijkstraCalcPath([this.col, this.row], this.nodes);
      this.aboveCoin();
    });
  }
  retrieveCoinsinfo(coinsArray) {
    this.coinsArray = coinsArray;
  }
  aboveCoin() {
    const pacmanPosition = [this.col, this.row];
    const coin = findArrayinArray(pacmanPosition, this.coinsArray);
    //false means there is a coin
    if (coin === false) {
      this.eatCoin();
    }
  }
  eatCoin() {
    const pacmanPosition = [this.col, this.row];
    const stringcol = this.col.toString();
    const stringrow = this.row.toString();
    const coinid = stringcol + stringrow + stringrow + stringcol;
    if (this.coinsArray.length > 0) {
      this.coinsArray = removeArrayinArray(pacmanPosition, this.coinsArray);
      $(`.coin#${coinid}`).remove();
      let currentScore = parseInt($($(".score")[0]).text());
      //   console.log(currentScore)
      currentScore += 1;
      $($(".score")[0]).text(currentScore);
    } else {
      console.log("All coins eaten!");
    }
  }
}
class Game {
  constructor() {
    this.parent = parent;
    this.wallsColArray = [];
    this.wallsRowArray = [];
    this.ref = $(".game");
    this.paccy = {};
    this.startingCoins = 0;
  }

  makePacMan() {
    this.paccy = new PacMan(10, 10); // Walldetection fn called
    this.paccy.generateBody(this.ref);
    this.paccy.listenMovement();
    this.paccy.retrieveWallinfo(this.wallsRowArray, this.wallsColArray); // retrieve
    this.paccy.retrieveCoinsinfo(this.startingCoins);
    return this.paccy;
  }

  makeEnemies() {
    this.enemy = new Enemy(20, 11);
    this.enemy.generateBody(this.ref);
    this.enemy.retrieveWallinfo(this.wallsRowArray, this.wallsColArray);
  }

  openCommunicationChannel() {
    this.channels = setInterval(() => {
      if (this.enemy.path.length === 0) {
        clearInterval(this.channels);
      }
      console.log(this.paccy.path);
      this.enemy.retrievepath(this.paccy.path);
    }, 5000);
  }

  generateSingleCoin(id, column, row) {
    const colstring = column.toString();
    const rowstring = row.toString();
    const coinContainer = $("<div>").attr("id", `${id}`);
    coinContainer.css({
      gridColumn: column,
      gridRow: row,
      backgroundColor: "blue",
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gridTemplateRows: "repeat(3,1fr)",
    });
    $(".game").append(coinContainer);
    //Coin id generation here is still not done properly, its not unique enough, make sure to change the eatCoin function in pacman as well
    const coin = $("<div>")
      .attr("id", `${colstring + rowstring + rowstring + colstring}`)
      .addClass("coin");
    coin.css({
      gridColumn: 2,
      gridRow: 2,
      backgroundColor: "brown",
    });
    $(`#${id}`).append(coin);
  }
  getfreesquares() {
    const allsquares = calcAllcolumns(30, 20);
    const allWallCords = this.getWallCords();
    const emptySuares = allsquares.filter((elementArrayCord) => {
      return findArrayinArray(elementArrayCord, allWallCords);
    });
    return emptySuares; // number does not add becuse the walls overlap
  }
  generateCoins() {
    //Get all the areas with no walls
    const potentialCoinArea = this.getfreesquares();
    const restrictedArea = [
      [10, 10],
      [8, 7],
      [8, 8],
      [8, 9],
      [8, 10],
      [8, 11],
      [8, 12],
      [9, 7],
      [9, 8],
      [9, 9],
      [9, 10],
      [9, 11],
      [9, 12],
      [10, 7],
      [10, 8],
      [10, 9],
      [10, 10],
      [10, 11],
      [10, 12],
      [11, 7],
      [11, 8],
      [11, 9],
      [11, 10],
      [11, 11],
      [11, 12],
      [12, 7],
      [12, 8],
      [12, 9],
      [12, 10],
      [12, 11],
      [12, 12],

      [19, 9],
      [19, 10],
      [19, 11],
      [19, 12],
      [19, 13],
      [19, 14],

      [20, 9],
      [20, 10],
      [20, 11],
      [20, 12],
      [20, 13],
      [20, 14],

      [21, 9],
      [21, 10],
      [21, 11],
      [21, 12],
      [21, 13],
      [21, 14],

      [22, 9],
      [22, 10],
      [22, 11],
      [22, 12],
      [22, 13],
      [22, 14],

      [23, 9],
      [23, 10],
      [23, 11],
      [23, 12],
      [23, 13],
      [23, 14],
    ];
    const removedRestrictedArea = removeMultipleArrays(
      restrictedArea,
      potentialCoinArea
    );
    for (let i = 0; i < removedRestrictedArea.length; i++) {
      const column = removedRestrictedArea[i][0];
      const row = removedRestrictedArea[i][1];
      const id = "coin" + i;
      this.generateSingleCoin(id, column, row);
    }

    this.startingCoins = removedRestrictedArea;
    return removedRestrictedArea;
  }
  getWallCords() {
    // console.log("Pacman read the walls");
    const accumulator = [];

    // for (let i = 0; i < this.wallsColArray.length; i++) {
    //   const arraysCol = getColWalls(this.wallsColArray[i]);
    //   accumulator.push(arraysCol);
    // }
    // for (let i = 0; i < this.wallsRowArray.length; i++) {
    //   const arraysRow = getRowWalls(this.wallsRowArray[i]);
    //   accumulator.push(arraysRow);
    // }
    // console.log(accumulator);
    this.wallsColArray.map((elementObj) => {
      return accumulator.push(getColWalls(elementObj));
    });

    this.wallsRowArray.map((elementObj) => {
      return accumulator.push(getRowWalls(elementObj));
    });
    // console.log(accumulator);
    const deconstructed = [];
    accumulator.map((element) => {
      return element.map((innerElement) => {
        return deconstructed.push(innerElement);
      });
    });
    // console.log(deconstructed);
    return deconstructed;
  }
  generateWalls() {
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

    this.wallsColArray = [
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

    this.wallsRowArray = [
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
  }
}
class Nodes {
  constructor(col, row, type) {
    this.col = col;
    this.row = row;
    this.position = [this.col, this.row];
    this.previousnode = {};
    this.nextnode = {};
    this.visited = false;
    this.looked = false;
    this.type = type; // false means empty, true is wall
    this.distanceFromSN = 9999;
    this.neighbours = {};
  }
  getNeighbours(arrayobj) {
    let topNN =
      this.row - 1 >= 1
        ? findObjinArray([this.col, this.row - 1], arrayobj)
        : false;
    let botNN =
      this.row + 1 <= 20
        ? findObjinArray([this.col, this.row + 1], arrayobj)
        : false;
    let leftNN =
      this.col - 1 >= 1
        ? findObjinArray([this.col - 1, this.row], arrayobj)
        : false;
    let rightNN =
      this.col + 1 <= 30
        ? findObjinArray([this.col + 1, this.row], arrayobj)
        : false;
    this.neighbours = {
      topNode: topNN,
      bottomNode: botNN,
      leftNode: leftNN,
      rightNode: rightNN,
    };
    return;
  }

  //   if(this.row === 1) {
  //     return {
  //         topNN:false,
  //         botNN:[this.col,this.row+1],
  //         leftNN: [this.col-1,this.row],
  //         rightNN: [this.col+1,this.row],
  //     }
  //   } else if (this.row === 20) {
  //     return {
  //         topNN:[this.col,this.row],
  //         botNN:false,
  //         leftNN: [this.col,this.row],
  //         rightNN: [this.col,this.row],
  //     }
  //   } else if (this.col === 1) {
  //     return {
  //         topNN:[this.col,this.row],
  //         botNN:[this.col,this.row],
  //         leftNN: false,
  //         rightNN: [this.col,this.row],
  //     }
  //   }else if (this.col === 30) {
  //     return {
  //         topNN:[this.col,this.row],
  //         botNN:[this.col,this.row],
  //         leftNN: [this.col,this.row],
  //         rightNN: false
  //     }

  //   } else {

  //   }
}
const generateSinglePath = (id, column, row) => {
  const colstring = column.toString();
  const rowstring = row.toString();
  const path = $("<div>").attr("id", `${id}`).addClass("Path");
  path.css({
    gridColumn: column,
    gridRow: row,
    backgroundColor: "pink",
  });
  $(".game").append(path);
};
// const generateFullPath = (arrayofObjs) => {
//   $(".Path").remove();
//   for (let i = arrayofObjs.length - 1; i >= 0; i--) {
//     // console.log(arrayofObjs[i]);
//     const column = arrayofObjs[i].col;
//     const row = arrayofObjs[i].row;
//     const id = "path" + i;
//     generateSinglePath(id, column, row);
//   }
// };

const dijkstra = (start, nodes) => {
  const allnodes = nodes;

  const allnodesobjs = allnodes.map((element) => {
    return new Nodes(element[0], element[1], false);
  });
  const preNodes = allnodesobjs.map((elementobj) => {
    elementobj.getNeighbours(allnodesobjs);
    return elementobj;
  });

  let visited = [];
  let unvisited = preNodes;
  const sourceNodePosition = start;
  const sourceNode = findObjinArray(sourceNodePosition, unvisited);
  let currentNode = sourceNode;
  currentNode.distanceFromSN = 0;
  let looked = [currentNode];

  //   while (unvisited.length > 0) {
  for (let i = 0; i < 354; i++) {
    // console.log("currentNode: ", currentNode);
    // console.log("visited ", visited);
    // console.log("looked: ", looked);
    // console.log("unvisted: ", unvisited);

    currentNode = findMinObjinArray(looked);
    currentNode.visited = true;
    currentNode.looked = true;

    if (
      currentNode.neighbours.topNode !== false &&
      currentNode.neighbours.topNode.looked === false
    ) {
      currentNode.neighbours.topNode.distanceFromSN =
        1 + currentNode.distanceFromSN;
      currentNode.neighbours.topNode.looked = true;
      looked.push(currentNode.neighbours.topNode);
      unvisited = removeObjsinArray(currentNode.neighbours.topNode, unvisited);
    }
    if (
      currentNode.neighbours.bottomNode !== false &&
      currentNode.neighbours.bottomNode.looked === false
    ) {
      currentNode.neighbours.bottomNode.distanceFromSN =
        1 + currentNode.distanceFromSN;
      currentNode.neighbours.bottomNode.looked = true;
      looked.push(currentNode.neighbours.bottomNode);
      unvisited = removeObjsinArray(
        currentNode.neighbours.bottomNode,
        unvisited
      );
    }
    if (
      currentNode.neighbours.leftNode !== false &&
      currentNode.neighbours.leftNode.looked === false
    ) {
      currentNode.neighbours.leftNode.distanceFromSN =
        1 + currentNode.distanceFromSN;
      currentNode.neighbours.leftNode.looked = true;
      looked.push(currentNode.neighbours.leftNode);
      unvisited = removeObjsinArray(currentNode.neighbours.leftNode, unvisited);
    }
    if (
      currentNode.neighbours.rightNode !== false &&
      currentNode.neighbours.rightNode.looked === false
    ) {
      currentNode.neighbours.rightNode.distanceFromSN =
        1 + currentNode.distanceFromSN;
      currentNode.neighbours.rightNode.looked = true;
      looked.push(currentNode.neighbours.rightNode);
      unvisited = removeObjsinArray(
        currentNode.neighbours.rightNode,
        unvisited
      );
    }

    visited.push(currentNode);
    unvisited = removeObjsinArray(currentNode, unvisited);
    looked = removeObjsinArray(currentNode, looked);
  }
  return preNodes;
};

// const dijkstraRecalc = (start, arrayObjs, direction) => {
//   const newStartPosition = start;
//   const Xvalue = newStartPosition[0];
//   //   console.log(Xvalue);
//   const Yvalue = newStartPosition[1];
//   //   console.log(Yvalue);
//   const newStartobj = findObjinArray(newStartPosition, arrayObjs);
//   if (direction === 0) {
//     //left
//     const objsLeft = arrayObjs
//       .filter((element) => element.col < Xvalue)
//       .map((element) => (element.distanceFromSN -= 1));

//     const objsRight = arrayObjs
//       .filter((element) => element.col >= Xvalue)
//       .map((element) => (element.distanceFromSN += 1));
//   } else if (direction === 1) {
//     //right
//     const objsLeft = arrayObjs
//       .filter((element) => element.col > Xvalue)
//       .map((element) => (element.distanceFromSN += 1));

//     const objsRight = arrayObjs
//       .filter((element) => element.col <= Xvalue)
//       .map((element) => (element.distanceFromSN -= 1));
//   } else if (direction === 2) {
//     //down
//     const objsUp = arrayObjs.filter((element) => {
//       return element.row <= Yvalue;
//     });

//     objsUp.map((element) => (element.distanceFromSN += 1));

//     const objsDown = arrayObjs.filter((element) => {
//       return element.row > Yvalue;
//     });

//     objsDown.map((element) => (element.distanceFromSN -= 1));
//   } else if (direction === 3) {
//     //Up
//     console.log(Yvalue);
//     const objsUp = arrayObjs.filter((element) => {
//       return element.row >= Yvalue;
//     });
//     console.log(objsUp);
//     objsUp.map((element) => (element.distanceFromSN += 1));

//     const objsDown = arrayObjs.filter((element) => {
//       return element.row < Yvalue;
//     });
//     console.log(objsDown);
//     objsDown.map((element) => (element.distanceFromSN -= 1));
//   }
// };
const dijkstraCalcPath = (destinationNode, arrayObjs) => {
  let path = [];
  //   console.log(arrayObjs);
  let currentobj = findObjinArray(destinationNode, arrayObjs);
  for (let i = currentobj.distanceFromSN - 1; i >= 0; i--) {
    //Find the neightbour that is equal to i
    const neighbours = [
      currentobj.neighbours.topNode,
      currentobj.neighbours.bottomNode,
      currentobj.neighbours.leftNode,
      currentobj.neighbours.rightNode,
    ];
    // console.log(neighbours);
    for (let j = 0; j < 4; j++) {
      if (neighbours[j] !== false) {
        if (neighbours[j].distanceFromSN === i) {
          path.unshift(neighbours[j]);
          currentobj = neighbours[j];
          console.log(currentobj);
          break;
        }
      }
    }
  }
  //   console.log(path);
  //   generateFullPath(path);
  return path;
};
$(() => {
  generatePlatform();
  const game = new Game();
  game.generateWalls();
  game.generateCoins();
  game.makePacMan();
  const allnodesCalculated = dijkstra([20, 11], game.getfreesquares());
  const path = dijkstraCalcPath([10, 10], allnodesCalculated);
  game.paccy.retrievenodes(allnodesCalculated);
  game.paccy.retrievepath(path);
  game.makeEnemies();
  game.enemy.retrievenodes(allnodesCalculated);
  game.enemy.retrievepath(path);
  game.openCommunicationChannel();
  game.enemy.startMoving();
});
