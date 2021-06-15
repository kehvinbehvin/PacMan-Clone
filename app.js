//Created Pacman using pixels implementation

$(() => {
  //creating the environment
  $(".game").css({
    height: "400px",
    width: "400px",
    backgroundColor: "blue",
    display: "flex",
  });

  //create a PacMan inside of the environment
  const pacManSize = [50, 100];
  const limit = [400 - pacManSize[0], 400 - pacManSize[1]];
  let vertical = 0;
  let leftPush = 0;
  let pacManPosition = [limit[0] - vertical, limit[1] - leftPush];
  const pacman = $("<div>").attr("id", "PacMan");

  pacman.css({
    height: pacManSize[0],
    width: pacManSize[1],
    backgroundColor: "red",
    position: "absolute",
    top: pacManPosition[0],
    left: pacManPosition[1],
  });

  //function to move vertically

  //function to move horizontally

  //function to move right

  //function to move left

  //function to move up
  //function to move down
  $(".game").append(pacman);
  $("body").on("keydown", (event) => {
    //Everytime a key is pressed, the corresponding value of key is returned here
    console.log(event.keyCode);
    //when S is pressed, the Pacman movesdown, S=83
    if (event.keyCode === 83) {
      console.log("Move Down");
      if (pacManPosition[0] < limit[0]) {
        // De-crement the vertical
        vertical -= 2;
        // Re-adjust the css
        pacManPosition = [limit[0] - vertical, limit[1] - leftPush];
        $("#PacMan").css({
          top: pacManPosition[0],
          left: pacManPosition[1],
        });
      }
    } else if (event.keyCode === 87) {
      console.log("Move Up");
      if (pacManPosition[0] > 0) {
        // Increment the vertical (Trying different kinds of decrements)
        vertical += 1;
        vertical += 1;
        // Re-adjust the css
        pacManPosition = [limit[0] - vertical, limit[1] - leftPush];
        $("#PacMan").css({
          top: pacManPosition[0],
          left: pacManPosition[1],
        });
      }
    } else if (event.keyCode === 68) {
      console.log("Move Right");
      if (pacManPosition[1] < limit[1]) {
        // Increment the leftside
        leftPush -= 2;
        // Re-adjust the css
        pacManPosition = [limit[0] - vertical, limit[1] - leftPush];
        $("#PacMan").css({
          top: pacManPosition[0],
          left: pacManPosition[1],
        });
      }
    } else if (event.keyCode === 65) {
      console.log("Move Left");
      // Decrement the leftside
      if (pacManPosition[1] > 0) {
        leftPush += 2;
        // Re-adjust the css
        pacManPosition = [limit[0] - vertical, limit[1] - leftPush];
        $("#PacMan").css({
          top: pacManPosition[0],
          left: pacManPosition[1],
        });
      }
    }
  });
});
