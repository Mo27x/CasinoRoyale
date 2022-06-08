import Card from "./card";
import Player from "./player";
import Poker from "./poker";

export default class Room {
  public players: Player[] = [];
  public game: Poker;
  public bigBlind: number = 200;
  isGameStarted: boolean = false;

  public constructor(public readonly id: string) {}
  startGame = () => {
    if (!this.game || this.isGameEnded() || !this.isGameStarted) {
      this.game = new Poker(this.bigBlind, this.players);
      this.isGameStarted = true;
    }
    // this.rotateBlinds();
  };
  rotateBlinds = () => {
    const first = this.players.shift();
    this.players = [...this.players, first];
  };

  getContinuers = (): Player[] => {
    let continuers = [];
    this.players.forEach((player) => {
      if (player.money >= 200 && this.isPlayerInRoom(player)) {
        continuers = [...continuers, player];
      }
    });
    return continuers;
  };
  addPlayer = (player: Player): void => {
    this.players = [...this.players, player];
  };
  removePlayer = (player: Player): void => {
    if (this.isPlayerInRoom(player))
      this.players = this.players.splice(this.players.indexOf(player), 1);
  };
  bet = (player: Player, amount: number): void => {
    if (this.isPlayerInRoom(player)) this.game.bet(player, amount);
  };
  call = (player: Player): void => {
    if (this.isPlayerInRoom(player)) this.game.call(player);
  };
  raise = (player: Player, amount: number): void => {
    if (this.isPlayerInRoom(player)) this.game.raise(player, amount);
  };

  fold = (player: Player): void => {
    if (this.isPlayerInRoom(player)) this.game.fold(player);
  };
  check = (player: Player): void => {
    if (this.isPlayerInRoom(player)) this.game.check(player);
  };
  getWinners = (): Player[][] => {
    return this.game.winners;
  };
  getCards = (): Card[] => {
    return this.game.cards;
  };
  getCurrentPlayer = (): Player => {
    return this.game.currentPlayer;
  };
  getPot = (): number => {
    return this.game.pots.reduce((acc, curr) => acc + curr, 0);
  };
  getPlayers = (): Player[] => {
    let simplifiedPlayers = [];
    this.players.forEach((player) => {
      simplifiedPlayers = [...simplifiedPlayers, player.simplify()];
    });
    return simplifiedPlayers;
  };
  isPlayerInRoom(player: Player): boolean {
    return this.players.includes(player);
  }
  getCallAmount = (player): number => {
    return this.game.getCallAmount(player);
  };
  isGameEnded = (): boolean => {
    return this.game.isGameEnded;
  };
  getSimplifiedGame = (): any => {
    return this.game ? this.game.simplify() : undefined;
  };
}
