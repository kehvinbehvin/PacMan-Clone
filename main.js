import { Game } from "./objects.js";
$(() => {
  const game = new Game();
  game.generatePlatform();
  game.startMenu();
});
