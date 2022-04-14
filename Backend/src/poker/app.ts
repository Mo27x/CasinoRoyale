import Player from "./player";
import Poker from "./poker";

let players = [
  new Player("momo", 20000),
  new Player("mimmo", 20000),
  new Player("username", 20000),
];

let game = new Poker(200, players);
// console.log(game.currentPlayer.username);

game.call(players[0]);
game.call(players[1]);
game.check(players[2]);
// game.check(players[1]);
// game.check(players[0]);
// game.check(players[1]);
// game.check(players[0]);
// game.check(players[1]);
// game.check(players[0]);

// console.log(game.cards);
// console.log(players[0].hand.cards, players[0].handStrength);
// console.log(players[1].hand.cards, players[1].handStrength);
// console.log(game.winners);
console.log(game.firstBetter.username);
console.log(game.currentPlayer.username, game.players, game.rounds);
