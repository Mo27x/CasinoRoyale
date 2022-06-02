import Player from "./player";
import Poker from "./poker";

export default class Room {
  public players: Player[];
  public game: Poker;
  public constructor(public readonly id: string) {}
  startGame = (bigBlind: number) => {
    this.game = new Poker(bigBlind, this.players);
    this.rotateBlinds();
  };

  rotateBlinds = () => {
    const first = this.players.shift();
    this.players = [...this.players, first];
  };

  getPlayers = (): Player[] => {
    let continuers = [];
    this.players.forEach((player) => {
      if (player.money >= 200) {
        continuers = [...continuers, player];
      }
    });
    return continuers;
  };
}
