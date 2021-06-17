import { dijkstra, dijkstraCalcPath } from "./algorithm.js";
import {
  createcolumn,
  createrow,
  findArrayinArray,
  removeArrayinArray,
  removeMultipleArrays,
  calcAllcolumns,
  getRowWalls,
  getColWalls,
  findObjinArray,
  booleanObjinArray,
} from "./utils.js";

class Thing {
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
    // console.log("walls transfered to PacMan");
    this.wallsColArray = colwalls;
    this.wallsRowArray = rowwalls;
    // console.log(this.wallsColArray);
    // console.log(this.wallsRowArray);
    this.environmentCollision = this.Walldetection();
  }
  getWallCords() {
    // console.log("Pacman read the walls");
    const accumulator = [];
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
  Walldetection() {
    // console.log("Pacmna created the collision function");
    const allWallCords = this.getWallCords();
    const collision = (row, col) => {
      //   console.log("PacMan checking");
      //   console.log(allWallCords.length);
      const matchcols = allWallCords.filter((element) => {
        // console.log(element);
        return element[0] === col;
      });
      //   console.log("Checking row: ", row);
      //   console.log(matchcols);
      const matchrows = matchcols.filter((element) => {
        return element[1] === row;
      });
      //   console.log("Checking col: ", col);
      //   console.log(matchrows);
      if (matchrows.length > 0) {
        // console.log("empty", false);
        return false;
      } else if (matchrows.length === 0) {
        // console.log("empty", true);
        return true;
      }
      //returns true if collision is detected at a specified row/col
    };
    return collision; //invoking walldetection gives us the collision function
  }
}
class Enemy extends Thing {
  constructor(col, row, id, color) {
    super(col, row, id, color);
    this.visitedPathPacMan = [];
    this.moving;
    this.atePacMan = false;
    this.atePacManHandler;
  }
  receiveOpponent(obj) {
    this.opponent = obj;
  }
  retrieveRegularPaths(paths, startPaths) {
    this.regularPaths = paths;
    this.startPaths = startPaths;
  }
  chooseStartPath() {
    const randomChoice = [Math.floor(Math.random() * this.startPaths.length)]; //random choice of inner array
    return this.startPaths[randomChoice].reverse();
  }
  chooseRegularPath() {
    //regular path is made of 3 big arrays, each big array is made up of many arrays of node objs, the path is the array of nodes, i want to only retrieve the array of nodes of which the row and col is the same as the current position of blinky
    let nextPath = [];
    console.log(this.regularPaths);
    for (let i = 0; i < 3; i++) {
      //look at 3 array
      for (let j = 0; j < this.regularPaths[i].length; j++) {
        //look at array of paths
        const tofindX = this.path[this.path.length - 1].col;
        const tofindY = this.path[this.path.length - 1].row;
        const XInspect = this.regularPaths[i][j][0].col;
        const YInspect = this.regularPaths[i][j][0].row;
        //This code looks at the coordinates at the end of the enemy's current path, then it searches the array of paths (regularpaths) for the same coordinates a
        const XInspectEND =
          this.regularPaths[i][j][this.regularPaths[i][j].length - 1].col;
        const YInspectEND =
          this.regularPaths[i][j][this.regularPaths[i][j].length - 1].row;
        if (XInspect === tofindX && YInspect === tofindY) {
          // console.log("found");
          nextPath.push(this.regularPaths[i][j]);
        } else if (XInspectEND === tofindX && YInspectEND === tofindY) {
          // console.log("found reverse");
          nextPath.push(this.regularPaths[i][j].reverse());
        }
      }
    }
    //nextpath will have a few paths inside, then i will choose randomly which one to append to the path of Blinky
    const randomChoice = Math.floor(Math.random() * nextPath.length);
    return nextPath[randomChoice];
  }
  retrievePacManpath() {
    this.updatePacManPathHandler = setInterval(() => {
      if (this.visitedPathPacMan.length === 0) {
        this.path = this.opponent.path[this.id];
      } else {
        const filtered = path.filter((element) => {
          return !booleanObjinArray(element, this.visitedPathPacMan);
        });
        this.path = filtered;
      }
    }, 100);
  }
  pacManCheck() {
    this.atePacManHandler = setInterval(() => {
      // for blinky, this needs to be regularpath instead
      let pacManPositionX = parseInt(this.opponent.col);
      let pacManPositionY = parseInt(this.opponent.row);
      if (pacManPositionX === this.col && pacManPositionY === this.row) {
        //When Enemy finds pacman before the path finishes
        if (this.opponent.super) {
          $(`#${this.id}`).remove();
          this.stop();
        } else {
          this.stop();
          this.atePacMan = true;
        }
      }
    }, 50);
  }
  startMoving(speed) {
    if (this.id === "Inky") {
      this.retrievePacManpath();
      this.pacManCheck();
      this.moving = setInterval(() => {
        if (this.path.length === 0) {
          //When Enemy finishes the path algo
          this.stop();
        }
        // console.log(this.id);
        this.col = this.path[0].col;
        this.row = this.path[0].row;
        this.generateCss();
        this.path.shift();
      }, speed);
    } else if (this.id === "Blinky") {
      this.path = this.chooseStartPath();
      this.pacManCheck();
      this.moving = setInterval(() => {
        // console.log(this.path.length);
        if (this.path.length <= 5) {
          // console.log(this.path);
          this.path = this.path.concat(this.chooseRegularPath());
          console.log(this.path);
        }
        // console.log(this.id);
        this.col = this.path[0].col;
        this.row = this.path[0].row;
        this.generateCss();
        this.path.shift();
      }, speed);
    }
  }
  stop() {
    clearInterval(this.moving);
    clearInterval(this.atePacManHandler);
    clearInterval(this.updatePacManPathHandler);
  }
}
class PacMan extends Thing {
  constructor(col, row) {
    super(col, row, "paccy", "yellow");
    this.completed = false;
    this.super = false;
    this.path = {};
    this.opponents = {};
  }
  receiveOpponent(obj, enemy) {
    this.opponents[enemy] = obj;
  }
  retrievenodes(allnodes) {
    this.nodes = allnodes;
  }
  retrievepath(path, enemy) {
    this.path[enemy] = path;
  }
  listenMovement() {
    $("body").on("keydown", (event) => {
      if (event.keyCode === 83) {
        // console.log("Move Down");
        if (
          this.row !== this.limitY[1] &&
          this.environmentCollision(this.row + 1, this.col)
        ) {
          this.row += 1;
          this.generateCss();
        }
      } else if (event.keyCode === 87) {
        // console.log("Move Up");
        if (
          this.row !== this.limitY[0] &&
          this.environmentCollision(this.row - 1, this.col)
        ) {
          this.row -= 1;
          this.generateCss();
        }
      } else if (event.keyCode === 68 && this.keyCode !== 68) {
        // console.log("Move Right");
        if (
          this.col !== this.limitX[1] &&
          this.environmentCollision(this.row, this.col + 1)
        ) {
          this.col += 1;
          this.generateCss();
        }
      } else if (event.keyCode === 65) {
        // console.log("Move Left");
        if (
          this.col !== this.limitX[0] &&
          this.environmentCollision(this.row, this.col - 1)
        ) {
          this.col -= 1;
          this.generateCss();
        }
      }
      const nextPositionObj = findObjinArray([this.col, this.row], this.nodes); //Pacman uses all the array with all the node objs to retrieve the node that corresponds to the current position of Panman and appends the path array for the enemy to follow.
      // for (const item in this.opponents) {
      //   this.path[item].push(nextPositionObj);
      // }
      this.path["Inky"].push(nextPositionObj);
      this.abovePowerUp();
      this.aboveCoin();
    });
  }
  retrieveCoinsinfo(coinsArray) {
    this.coinsArray = coinsArray;
  }
  retrievePowerUpinfo(powerUpArray) {
    this.powerUpArray = powerUpArray;
  }
  abovePowerUp() {
    const pacmanPosition = [this.col, this.row];
    const powerUp = findArrayinArray(pacmanPosition, this.powerUpArray);
    //false means there is a coin
    if (powerUp === false) {
      // console.log("theres a powerup below");
      this.eatPowerUp();
    }
  }
  eatPowerUp() {
    const pacmanPosition = [this.col, this.row];
    const stringcol = this.col.toString();
    const stringrow = this.row.toString();
    const powerUpid = stringcol + "-" + stringrow;
    if (this.powerUpArray.length > 0 && this.super === false) {
      //Cannot eat powerUp while pacman is super
      this.powerUpArray = removeArrayinArray(pacmanPosition, this.powerUpArray);
      $(`.power-up#${powerUpid}`).remove();
      this.super = true;
      for (const item in this.opponents) {
        this.opponents[item].color = "green";
      }
      setTimeout(() => {
        this.super = false;
        for (const item in this.opponents) {
          this.opponents[item].color = "red";
        }
      }, 10000);
    }
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
    const coinid = stringcol + "-" + stringrow;
    if (this.coinsArray.length > 0) {
      this.coinsArray = removeArrayinArray(pacmanPosition, this.coinsArray);
      $(`.coin#${coinid}`).remove();
      let currentScore = parseInt($($(".score")[0]).text());
      //   console.log(currentScore)
      currentScore += 1;
      $($(".score")[0]).text(currentScore);
    } else {
      this.completed = true;
    }
  }
}
class GameMechanics {
  constructor() {
    this.parent = parent;
    this.wallsColArray = [];
    this.wallsRowArray = [];
    this.ref = $(".game");
    this.paccy = {};
    this.startingCoins = 0;
    this.regularPaths = [];
  }
  makePacMan() {
    this.paccy = new PacMan(10, 10);
    this.paccy.generateBody(this.ref);
    this.paccy.retrieveWallinfo(this.wallsRowArray, this.wallsColArray);
    this.paccy.retrieveCoinsinfo(this.startingCoins);
    this.paccy.retrievePowerUpinfo(this.powerUpArray);
    return this.paccy;
  }
  makeEnemies() {
    this.inky = new Enemy(20, 11, "Inky", "purple");
    this.inky.generateBody(this.ref);
    this.inky.retrieveWallinfo(this.wallsRowArray, this.wallsColArray);
    this.inky.receiveOpponent(this.paccy);
    this.paccy.receiveOpponent(this.inky, this.inky.id);
    this.runDijkstra([20, 11], [10, 10], "Inky");

    this.blinky = new Enemy(20, 12, "Blinky", "red");
    this.blinky.generateBody(this.ref);
    this.blinky.retrieveWallinfo(this.wallsRowArray, this.wallsColArray);
    this.blinky.receiveOpponent(this.paccy);
    this.paccy.receiveOpponent(this.blinky, this.blinky.id);
    this.blinky.retrieveRegularPaths(
      this.regularPaths,
      this.generateStartingPaths([20, 12])
    );
  }
  runDijkstra(sourcePosition, destinationposition, enemyid) {
    //runDijkstra has to be run for each enemy
    const allnodesCalculated = dijkstra(sourcePosition, this.getfreesquares()); //is a list of all non-wall node objs with their distance calculated from the sourceNode.
    const path = dijkstraCalcPath(destinationposition, allnodesCalculated);
    this.paccy.retrievenodes(allnodesCalculated); //paccy needs the nodes to append the node that it went to so that the enemy knows where paccy went
    this.paccy.retrievepath(path, enemyid);
    // this.enemy.retrievepath(path);
  }
  generateStartingPaths(startPosition) {
    const startWaypoints = [];
    const startPaths = [
      [7, 6],
      [14, 6],
      [17, 15],
      [24, 15],
      [7, 6],
      [14, 6],
      [17, 15],
      [24, 15],
      [30, 10],
      [2, 10],
    ];
    for (let i = 0; i < startPaths.length; i++) {
      const allnodesCalculated = dijkstra(startPaths[i], this.getfreesquares());
      const path = dijkstraCalcPath(startPosition, allnodesCalculated);
      startWaypoints.push(path);
    }
    return startWaypoints;
  }
  generateRegularPaths() {
    const innerMostWaypointsCord = [
      [7, 6],
      [14, 6],
      [17, 15],
      [24, 15],
    ];
    const middleWaypointsCord = [
      [11, 4],
      [20, 4],
      [11, 17],
      [20, 17],
    ];
    const outerMostWaypointsCord = [
      [30, 10],
      [2, 10],
    ];
    const innerAndMiddle = [];
    const innerAndOuter = [];
    const middleAndOuter = [];

    for (let i = 0; i < innerMostWaypointsCord.length; i++) {
      for (let j = 0; j < middleWaypointsCord.length; j++) {
        const allnodesCalculated = dijkstra(
          innerMostWaypointsCord[i],
          this.getfreesquares()
        );
        const path = dijkstraCalcPath(
          middleWaypointsCord[j],
          allnodesCalculated
        );
        innerAndMiddle.push(path);
      }
    }

    for (let i = 0; i < innerMostWaypointsCord.length; i++) {
      for (let j = 0; j < outerMostWaypointsCord.length; j++) {
        const allnodesCalculated = dijkstra(
          innerMostWaypointsCord[i],
          this.getfreesquares()
        );
        const path = dijkstraCalcPath(
          outerMostWaypointsCord[j],
          allnodesCalculated
        );
        innerAndOuter.push(path);
      }
    }

    for (let i = 0; i < outerMostWaypointsCord.length; i++) {
      for (let j = 0; j < middleWaypointsCord.length; j++) {
        const allnodesCalculated = dijkstra(
          outerMostWaypointsCord[i],
          this.getfreesquares()
        );
        const path = dijkstraCalcPath(
          middleWaypointsCord[j],
          allnodesCalculated
        );
        middleAndOuter.push(path);
      }
    }

    this.regularPaths = [innerAndOuter, innerAndMiddle, middleAndOuter];
    // console.log(this.regularPaths);
  }
  generatePowerUp(id, column, row) {
    const colstring = column.toString();
    const rowstring = row.toString();
    const powerUpContainer = $("<div>").attr("id", `${id}`);
    powerUpContainer.css({
      gridColumn: column,
      gridRow: row,
      backgroundColor: "blue",
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gridTemplateRows: "repeat(3,1fr)",
    });
    $(".game").append(powerUpContainer);

    const powerUp = $("<div>")
      .attr("id", `${colstring + "-" + rowstring}`)
      .addClass("power-up");
    powerUp.css({
      gridColumn: 2,
      gridRow: 2,
      backgroundColor: "pink",
    });
    $(`#${id}`).append(powerUp);
  }
  generatePowerUps() {
    const powerUpArea = [
      [30, 1],
      [1, 1],
      [1, 20],
      [30, 20],
    ];
    for (let i = 0; i < powerUpArea.length; i++) {
      const column = powerUpArea[i][0];
      const row = powerUpArea[i][1];
      const id = "powerUp" + i;
      this.generatePowerUp(id, column, row);
    }
    this.powerUpArray = powerUpArea;
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
    //Coin id generation here is still not done properly, its not unique enough, make sure to change the eatCoin function in pacman as well //resolved
    const coin = $("<div>")
      .attr("id", `${colstring + "-" + rowstring}`)
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
      [30, 1],
      [1, 1],
      [1, 20],
      [30, 20],
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
    this.startCoinsValue = removedRestrictedArea.length;
    this.startingCoins = removedRestrictedArea;
    return removedRestrictedArea;
  }
  getWallCords() {
    const accumulator = [];
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
  loadGame() {
    this.generateWalls();
    this.generateCoins();
    this.generatePowerUps();
    this.generateRegularPaths();
    this.makePacMan();
    this.makeEnemies();
  }
  runGame() {
    this.inky.startMoving(800);
    this.blinky.startMoving(500);
    this.paccy.listenMovement();
  }
}
class Game {
  constructor() {
    this.gameMechanics = new GameMechanics();
  }
  // generatePlatform() {
  // $(".main-container").css({
  //   position: "absolute",
  //   top: "10px",
  //   left: "10px",
  //   height: "500px",
  //   width: "600px",
  //   backgroundColor: "black",
  //   display: "grid",
  // });
  // $(".main-container").css({
  //   margin: "5px",
  //   gridTemplateColumns: "60% 40%",
  //   gridTemplateRows: "100px auto",
  // });
  // $(".game").css({
  //   backgroundColor: "blue",
  //   gridColumn: "1 / 3",
  //   gridRow: 2,
  //   height: "400px",
  //   width: "600px",
  //   display: "grid",
  // });
  // $(".score").css({
  //   backgroundColor: "red",
  //   gridColumn: 2,
  //   gridRow: 1,
  //   fontSize: "60px",
  //   color: "white",
  //   fontFamily: "Notable",
  //   textAlign: "center",
  // });
  // $(".header").css({
  //   backgroundColor: "green",
  //   gridColumn: 1,
  //   gridRow: 1,
  //   fontSize: "60px",
  //   textAlign: "center",
  //   fontFamily: "Notable",
  //   color: "yellow",
  // });
  // }
  startMenu() {
    $(".game").addClass("startMenu");

    const startButton = $("<div>")
      .attr("id", "start-button")
      .text("Start")
      .addClass("startButton")
      .addClass("startMenu");

    $(".game").append(startButton);
    $("#start-button").on("click", (event) => {
      this.loadGame();
    });
    // $(".game").css({
    //   backgroundColor: "blue",
    //   gridColumn: "1 / 3",
    //   gridRow: 2,
    //   height: "400px",
    //   width: "600px",
    //   display: "grid",
    //   gridTemplateColumns: "45% 10% 45%",
    //   gridTemplateRows: "45% 10% 45%",
    // });

    // startButton.css({
    //   gridColumn: 2,
    //   gridRow: 2,
    //   backgroundColor: "blue",
    //   textAlign: "center",
    //   fontFamily: "Notable",
    //   color: "yellow",
    //   cursor: "pointer",
    // });
  }
  loadGame() {
    $(".game").empty();
    $("#overlay").remove();
    $("#score-board").remove();
    $(".score").text("0");
    $(".game").addClass("loadGame");

    this.gameMechanics.loadGame();
    this.gameMechanics.runGame();
    this.endMenu();

    // $(".game").css({
    //   backgroundColor: "blue",
    //   gridColumn: "1 / 3",
    //   gridRow: 2,
    //   height: "400px",
    //   width: "600px",
    //   display: "grid",
    //   gridTemplateColumns: "none",
    //   gridTemplateRows: "none",
    // });
  }
  endMenu() {
    const checkPacMan = setInterval(() => {
      this.totalScore = parseInt(this.gameMechanics.startCoinsValue);
      this.currentScore = parseInt($(".score").text());
      if (
        this.gameMechanics.inky.atePacMan ||
        this.gameMechanics.blinky.atePacMan ||
        this.totalScore === this.currentScore
      ) {
        clearInterval(checkPacMan);
        this.gameMechanics.blinky.stop();
        this.gameMechanics.inky.stop();
        $("body").off("keydown");
        const overlay = $("<div>").attr("id", "overlay");
        overlay.css({
          position: "absolute",
          top:
            $(".main-container").position().top + $(".game").position().top + 5,
          left:
            $(".main-container").position().left +
            $(".game").position().left +
            5,
          opacity: "0.5",
          backgroundColor: "black",
          height: "400px",
          width: "600px",
        });
        $("body").append(overlay);

        const scoreboard = $("<div>").attr("id", "score-board");
        scoreboard.css({
          position: "absolute",
          top:
            $(".main-container").position().top +
            $(".game").position().top +
            5 +
            100,
          left:
            $(".main-container").position().left +
            $(".game").position().left +
            5 +
            150,
          backgroundColor: "grey",
          opacity: 1,
          height: "200px",
          width: "300px",
          fontFamily: "Notable",
          textAlign: "center",
        });
        $("body").append(scoreboard);
        const message = $("<p>").text("GAME OVER");
        message.css({
          fontSize: "30px",
          marginTop: "20px",
        });
        $("#score-board").append(message);
        const endScore = $(".score").text();
        const messageScore = $("<p>").text("Score: " + endScore);
        messageScore.css({
          fontSize: "25px",
        });
        $("#score-board").append(messageScore);
        const reStartButton = $("<div>")
          .attr("id", "re-start-button")
          .text("Play Again");
        reStartButton.css({
          backgroundColor: "blue",
          textAlign: "center",
          fontFamily: "Notable",
          color: "yellow",
          cursor: "pointer",
          width: "100px",
          height: "50px",
          marginLeft: "100px",
        });
        $("#score-board").append(reStartButton);
        $("#re-start-button").on("click", (event) => {
          this.loadGame();
        });
      }
    }, 100);
  }
}
export { Game };
