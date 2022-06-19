import Blackjack from "./blackjack";
import Player from "./player";

const players = [
  new Player("Player 1", 1000, "player1", "room1"),
  new Player("Player 2", 1000, "player2", "room1"),
];
const game = new Blackjack(players);

game.bet(players[0], 100, 0);
game.bet(players[1], 100, 0);
game.play();
players.forEach((player) => {
  while (player.currentHand.value <= 16) {
    game.hit(player);
  }
  game.stand(player);
});

players.forEach((player) => {
  console.log(
    player.name,
    player.currentHand.cards,
    player.currentHand.value,
    player.money
  );
});

console.log(game.dealer.cards, game.dealer.value);
