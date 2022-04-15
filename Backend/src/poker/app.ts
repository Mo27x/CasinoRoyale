import Player from "./player";
import Poker from "./poker";

let players = [
  new Player("momo", 20000),
  new Player("mimmo", 20000),
  new Player("username", 20000),
  new Player("yeah", 20000),
];

let game = new Poker(200, players);
// console.log(game.currentPlayer.username);
game.call(players[3]);
game.call(players[0]);
game.call(players[1]);
game.check(players[2]);

game.check(players[3]);
game.check(players[0]);
game.check(players[1]);
game.check(players[2]);

game.check(players[3])
game.fold(players[0]);
game.check(players[1]);
game.check(players[2]);

// game.check(players[0]);
// game.check(players[1]);
// game.check(players[2]);

// game.check(players[0]);
// game.check(players[1]);
// game.check(players[2]);

// console.log(game.cards);
// console.log(players[0].hand.cards, players[0].handStrength);
// console.log(players[1].hand.cards, players[1].handStrength);
// console.log(players[2].hand.cards, players[2].handStrength);

console.log(game.rounds, game.winners);
