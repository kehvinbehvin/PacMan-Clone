const findArrayinArray = (array, arrayOfArrays) => {
  const X = array[0];
  const Y = array[1];
  const filteredByX = arrayOfArrays.filter((element) => {
    return element[0] === X;
  });
  const filteredByY = filteredByX.filter((element) => {
    return element[1] === Y;
  });
  if (filteredByY.length > 0) {
    return false; //more than 0 means a copy was found, wall exists
  } else if (filteredByY.length === 0) {
    return true;
  }
};

const removeArrayinArray = (array, arrayOfArrays) => {
  //   console.log(array);
  const X = array[0];
  const Y = array[1];
  const filtered = arrayOfArrays.filter((element) => {
    return !(element[0] === X && element[1] === Y);
  });

  //   if (filtered.length > 0) {
  //     console.log("exists");
  //   } else if (filtered.length === 0) {
  //     console.log("does not exist");
  //   }

  return filtered;
};

const removeMultipleArrays = (arrayofArrays1, arrayofArrays2) => {
  let staging = arrayofArrays2;

  for (const element of arrayofArrays1) {
    staging = removeArrayinArray(element, staging);
  }

  return staging;
};

const calcAllcolumns = (col, row) => {
  accumulator = [];
  for (let i = 1; i <= row; i++) {
    // i is the row
    for (let k = 1; k <= col; k++) {
      // k is the col
      accumulator.push([k, i]);
    }
  }
  return accumulator;
};
const createcolumn = (parent, start, end, col, id) => {
  const column = $("<div>").addClass("column").attr("id", `${id}`);
  column.css({
    gridColumn: col,
    gridRow: `${start}/${end}`,
    backgroundColor: "black",
  });
  parent.append(column);
  return { start: start, end: end, col: col };
};
const createrow = (parent, start, end, row, id) => {
  const column = $("<div>").addClass("column").attr("id", `${id}`);
  column.css({
    gridColumn: `${start}/${end}`,
    gridRow: row,
    backgroundColor: "black",
  });
  parent.append(column);
  return { start: start, end: end, row: row };
};

const getRowWalls = (wallRowObj) => {
  const Ycord = wallRowObj.row;
  let Xcord = wallRowObj.start;
  const limit = wallRowObj.end - Xcord;
  const accumulator = [];
  for (let i = 0; i < limit; i++) {
    accumulator.push([Xcord, Ycord]);
    Xcord += 1;
  }
  return accumulator;
};

const getColWalls = (wallColObj) => {
  let Ycord = wallColObj.start;
  const Xcord = wallColObj.col;
  const limit = wallColObj.end - Ycord;
  const accumulator = [];
  for (let i = 0; i < limit; i++) {
    accumulator.push([Xcord, Ycord]);
    Ycord += 1;
  }
  return accumulator;
};

class PacMan {
  constructor(col, row) {
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
    parent.append($("<div>").attr("id", "paccy"));
    this.generateCss();
  }

  generateCss() {
    $("#paccy").css({
      gridColumn: this.col,
      gridRow: this.row,
      backgroundColor: "yellow",
    });
  }
  autoMove(key) {
    while (this.direction === 83) {
      if (key !== 83) {
        return;
      }
    }
  }
  //   generateScore (parent) {
  //     parent.append($("<div>").attr("id", "Score"));
  //   }
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
      console.log("Pacman row", this.row);
      console.log("Pacman col", this.col);
      this.aboveCoin();
    });
  }
  retrieveCoinsinfo(coinsArray) {
    this.coinsArray = coinsArray;
  }
  aboveCoin() {
    const pacmanPosition = [this.col, this.row];
    const coin = findArrayinArray(pacmanPosition, this.coinsArray); //false means there is a coin
    this.eatCoin();
  }
  eatCoin() {
    const pacmanPosition = [this.col, this.row];
    const stringcol = this.col.toString();
    const stringrow = this.row.toString();
    const coinid = stringcol + stringrow + stringrow + stringcol;
    if (this.coinsArray.length > 0) {
      this.coinsArray = removeArrayinArray(pacmanPosition, this.coinsArray);
      console.log($(`.coin#${coinid}`));
      $(`.coin#${coinid}`).remove();
      this.score += 1;
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
  generate() {
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
    this.generateWalls();
  }
  makePacMan() {
    this.paccy = new PacMan(10, 10); // Walldetection fn called
    this.paccy.generateBody(this.ref);
    this.paccy.listenMovement();
    this.paccy.retrieveWallinfo(this.wallsRowArray, this.wallsColArray); // retrieve
    this.paccy.retrieveCoinsinfo(this.startingCoins);
    return this.paccy;
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

$(() => {
  const game = new Game();
  game.generate();
  game.generateWalls();
  const coinsArray = game.generateCoins();
  const pacman = game.makePacMan();
});

//
