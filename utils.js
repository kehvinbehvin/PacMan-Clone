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
const findObjinArray = (array, arrayOfArrays) => {
  //returns object
  const X = array[0];
  const Y = array[1];
  const filteredByX = arrayOfArrays.filter((element) => {
    return element.col === X;
  });
  const filteredByY = filteredByX.filter((element) => {
    return element.row === Y;
  });
  if (filteredByY.length === 0) {
    // console.log("X: ", X, "Y: ", Y, " Not found");
    return false;
  }
  return filteredByY[0];
};
const booleanObjinArray = (objs, arrayOfArrays) => {
  //returns boolean
  const X = objs.col;
  const Y = objs.row;
  const filteredByX = arrayOfArrays.filter((element) => {
    return element.col === X;
  });
  const filteredByY = filteredByX.filter((element) => {
    return element.row === Y;
  });
  if (filteredByY.length === 0) {
    // console.log("X: ", X, "Y: ", Y, " Not found");
    return false;
  }
  return true;
};
const findMinObjinArray = (arrayOfObjs) => {
  let minValue = arrayOfObjs[0].distanceFromSN;
  let obj = arrayOfObjs[0];
  for (let i = 1; i < arrayOfObjs.length; i++) {
    if (arrayOfObjs[i].distanceFromSN < minValue) {
      minValue = arrayOfObjs[i].distanceFromSN;
      obj = arrayOfObjs[i];
    }
  }
  return obj;
};
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

const removeObjsinArray = (obj, array) => {
  const X = obj.col;
  const Y = obj.row;
  const filtered = array.filter((element) => {
    return !(element.col === X && element.row === Y);
  });
  return filtered;
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
  let accumulator = [];
  for (let i = 1; i <= row; i++) {
    // i is the row
    for (let k = 1; k <= col; k++) {
      // k is the col
      accumulator.push([k, i]);
    }
  }
  return accumulator;
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

export {
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
};

/**
 * parent
 * css({
 * display:grid
 * template-grid-column: auto auto auto
 * template-grid-row:100%
 * })
 * 
 * children 1
 * css({
 * attr("id","1-2")
 * grid-column-start: 1
 * grid-column-end: 2
 * })

 * children2
 * css({
 * grid-column-start: 2
 * grid-column-end: 
 * })
 * 
 * for (let i = 0;i<100;1++) {
    * const child = ("<div>").attr("id",i).addClass(".child")
    * child.css({
        * grid-column-start: i
        * grid-column-end: i+1
 * })
 * parent.append(child)
 * }
 */
