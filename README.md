# PacMan-Clone

The main.js file is where the game is called

The objects.js file contains all the objects and classes used in the program.

The utils.js file contains all kinds of misc functions that i created.

The algorithm.js file contains the dijkstra's algorithm to find the shortest path for the enemy to take to reach pacman.

There are 4 main classes, Pacman, Enemy, GameMechanics, Game.

The GameMechanics object serves as a platform for the Pacman and Enemy objects to interact with each other and to also automate the generation of the environment such as the walls and coins

The Game object helps to integrate the GameMechanics together with the overall application such as the start menu, end menu, score and play buttons

Diving deeper into the Pacman and Enemy objects, both are children classes of the class "things", Pacman moves by identifying the keypress event and if there are walls ahead of him
The Enemy's movement is more complex. Initial implementation with Math.random function resulted in an enemy that on average remains around the same area, even with wall detection, the enemy does not progress far past its own start point.

Thus, a path finding algorithm was implemented to allow the enemy to move in the direction of pacMan while avoiding obstacles. The algorithm was initially planned to serve dynamic sourcenode and destination node positioning however, no solution could be found to recalculate the shortest path of a dynamic sourceNode without re-running the algorithm, which takes a substantial amount of time to run. Hence, the current solution only appends movements taken by Pacman onto the existing shortest path array to allow the enemy to follow pacman's footsteps after it completes the initial shortest path.

An inherent problem with using a path finding algorithm in a game with multiple enemies is that all enemies will be moving along the same path. Hence a solution for this, was to use waypoints (doors in the maze) as checkpoints. Dijkstra's algo was used to calculate the path between waypoints and each time the enemy approached a waypoint, it randomly chooses a next waypoint to move towards.

Main Challenges of Project:

1. Wall detection for both PacMan and Enemies
2. Pathfinder alogrithm and Creating Waypoints
3. Interactions between PacMan and different Enemies
   ->Enemies' movements were dependent on Pacman's movements
   ->PacMan super abilities can kill enemies
   ->Enemies killing PacMan
