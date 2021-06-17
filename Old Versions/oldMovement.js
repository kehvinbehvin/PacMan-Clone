/**
 * $("body").on("keydown", (event) => {
      if (event.keyCode === 83 && this.keyCode !== 83) {
        // console.log("Move Down");
        this.keyCode = 83;
        if (
          this.row !== this.limitY[1] &&
          this.environmentCollision(this.row + 1, this.col)
        ) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            //Stops the object from leaving the play area while moving , the clearinterval does not stop immediately, i think is because of the async properties, there is a constant delay of 1px, need to adjust this when create the parameter to read the environment where the obj is being created
            console.log(this.row);
            console.log(this.limitY[1]);
            if (
              this.row === this.limitY[1] ||
              !this.environmentCollision(this.row + 1, this.col)
            ) {
              clearInterval(this.movingdirection);
            } else {
              this.row += 1;
              this.generateCss();
              $("#paccy img").css({
                transform: "rotate(90deg)",
              });
              const nextPositionObj = findObjinArray(
                [this.col, this.row],
                this.nodes
              );
              this.path["Inky"].push(nextPositionObj);
              this.abovePowerUp();
              this.aboveCoin();
            }
          }, 300);
        }
      } else if (event.keyCode === 87 && this.keyCode !== 87) {
        // console.log("Move Up");
        this.keyCode = 87;
        if (
          this.row !== this.limitY[0] &&
          this.environmentCollision(this.row - 1, this.col)
        ) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            console.log(this.row);
            console.log(this.limitY[0]);
            if (
              this.row === this.limitY[0] ||
              !this.environmentCollision(this.row - 1, this.col)
            ) {
              clearInterval(this.movingdirection);
            } else {
              this.row -= 1;
              this.generateCss();
              $("#paccy img").css({
                transform: "rotate(-90deg)",
              });
              const nextPositionObj = findObjinArray(
                [this.col, this.row],
                this.nodes
              );
              this.path["Inky"].push(nextPositionObj);
              this.abovePowerUp();
              this.aboveCoin();
            }
          }, 300);
        }
      } else if (event.keyCode === 68 && this.keyCode !== 68) {
        // console.log("Move Right");
        this.keyCode = 68;
        if (
          this.col !== this.limitX[1] &&
          this.environmentCollision(this.row, this.col + 1)
        ) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            console.log(this.col);
            console.log(this.limitX[1]);
            if (
              this.col === this.limitX[1] ||
              !this.environmentCollision(this.row, this.col + 1)
            ) {
              clearInterval(this.movingdirection);
            } else {
              this.col += 1;
              this.generateCss();
              $("#paccy img").css({
                transform: "rotate(0deg)",
              });
              const nextPositionObj = findObjinArray(
                [this.col, this.row],
                this.nodes
              );
              this.path["Inky"].push(nextPositionObj);
              this.abovePowerUp();
              this.aboveCoin();
            }
          }, 300);
        }
      } else if (event.keyCode === 65 && this.keyCode !== 65) {
        // console.log("Move Left");
        this.keyCode = 65;
        if (
          this.col !== this.limitX[0] &&
          this.environmentCollision(this.row, this.col - 1)
        ) {
          clearInterval(this.movingdirection);
          this.movingdirection = setInterval(() => {
            console.log(this.col);
            console.log(this.limitX[0]);
            if (
              this.col === this.limitX[0] ||
              !this.environmentCollision(this.row, this.col - 1)
            ) {
              clearInterval(this.movingdirection);
            } else {
              this.col -= 1;
              this.generateCss();
              $("#paccy img").css({
                transform: "rotate(180deg)",
              });
              const nextPositionObj = findObjinArray(
                [this.col, this.row],
                this.nodes
              );
              this.path["Inky"].push(nextPositionObj);
              this.abovePowerUp();
              this.aboveCoin();
            }
          }, 300);
        }
      }
      //Pacman uses all the array with all the node objs to retrieve the node that corresponds to the current position of Panman and appends the path array for the enemy to follow.
      // for (const item in this.opponents) {
      //   this.path[item].push(nextPositionObj);
      // }
      const nextPositionObj = findObjinArray([this.col, this.row], this.nodes);
      this.path["Inky"].push(nextPositionObj);
      this.abovePowerUp();
      this.aboveCoin();
    });
 */
