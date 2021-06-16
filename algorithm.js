import {
  findObjinArray,
  findMinObjinArray,
  removeObjsinArray,
} from "./utils.js";

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
}

const dijkstra = (start, nodes) => {
  const allnodes = nodes; //all non-wall areas
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
  return preNodes; //returns all non-wall nodes objs
};

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
          //   console.log(currentobj);
          break;
        }
      }
    }
  }
  //   console.log(path);
  //   generateFullPath(path);
  return path;
};

export { dijkstra, dijkstraCalcPath };
