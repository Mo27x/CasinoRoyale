import Player from "./player";
import Poker from "./poker";

export default class Room {
  public players: Player[];
  public game: Poker;
  public constructor(public readonly id: string) {}
  startGame = (bigBlind: number) => {
    this.game = new Poker(bigBlind, this.players);
  };
}
