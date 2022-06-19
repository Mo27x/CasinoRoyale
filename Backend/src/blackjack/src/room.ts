import Blackjack from "./blackjack";
import Card from "./card";
import Player from "./player";

export default class Room {
  private _waitingPlayers: Player[] = [];
  private _players: Player[] = [];
  private _game!: Blackjack;
  private _isGameStarted: boolean = false;

  constructor(public readonly id: string) {}

  public get players(): Player[] {
    return this._players;
  }
  public set players(value: Player[]) {
    this._players = value;
  }

  startGame = (): void => {
    this.getPlayerWithMoney();
    if (
      (!this._isGameStarted || this.isGameEnded) &&
      this.players.length > 1 &&
      this.players.length < 5 &&
      this.haveAllBetted
    ) {
      this._game = new Blackjack(this._players);
      this._game.play();
      this._isGameStarted = true;
    }
  };

  get isGameEnded(): boolean {
    return this._game.isGameEnded;
  }

  private get haveAllBetted(): boolean {
    return this._game.haveAllBetted();
  }

  getPlayerWithMoney(): Player[] {
    return (this._players = [
      ...this._players.filter((player) => player.money > 0),
      ...this._waitingPlayers.filter((player) => player.money > 0),
    ]);
  }

  addWaitingPlayer = (player: Player): void => {
    this._waitingPlayers = [...this._waitingPlayers, player];
  };

  removeWaitingPlayer = (player: Player): void => {
    this._waitingPlayers = this._waitingPlayers.filter((p) => p !== player);
  };

  removePlayer = (player: Player): number => {
    let playerMoney = (player.money = player.moneyToBet);
    if (this.isPlayerInRoom(player)) {
      if (this._game) {
        if (this.isPlayerInGame(player)) {
          player.hands = [];
          player.money = 0;
          player.moneyToBet = 0;
          this._players.filter((p) => p !== player);
        }
      }
      this._waitingPlayers.filter((p) => p !== player);
    }
    return playerMoney;
  };

  isPlayerInRoom = (player: Player): boolean => {
    return (
      this._players.includes(player) || this._waitingPlayers.includes(player)
    );
  };

  isPlayerInGame = (player: Player): boolean => {
    return this._players.includes(player);
  };

  hit = (player: Player): void => {
    if (this._game) this._game.hit(player);
  };

  stand = (player: Player): void => {
    if (this._game) this._game.stand(player);
  };

  doubleDown = (player: Player): void => {
    if (this._game) this._game.doubleDown(player);
  };

  surrender = (player: Player): void => {
    if (this._game) this._game.surrender(player);
  };

  split = (player: Player): void => {
    if (this._game) this._game.split(player);
  };

  insurance = (player: Player): void => {
    if (this._game) this._game.insurance(player);
  };

  getSimplifiedGame = () => {
    if (this._game) return this._game.simplify();
    return null;
  };
}
