import Card from "./card";
import Player from "./player";
import Poker from "./poker";

export default class Room {
  private _waitingPlayers: Player[] = [];
  public players: Player[] = [];
  public game: Poker;
  public bigBlind: number = 200;
  isGameStarted: boolean = false;

  public constructor(public readonly id: string) {}
  startGame = () => {
    this.addWaitingPlayersToPlayers();
    if (
      (!this.game || this.isGameEnded() || !this.isGameStarted) &&
      this.players.length > 1 &&
      this.players.length < 7
    ) {
      this.game = new Poker(this.bigBlind, this.players);
      this.isGameStarted = true;
    }
    // this.rotateBlinds();
  };
  rotateBlinds = () => {
    this.players = [...this.players, this.players[0]];
    const first = this.players.shift();
    this.players = [...this.players, first];
  };

  getPlayersCanPlay = (): Player[] => {
    let continuers = [];
    this.players.forEach((player) => {
      if (player.money >= 200 && this.isPlayerInRoom(player))
        continuers = [...continuers, player];
      else this.removePlayer(player);
    });
    this.waitingPlayers.forEach((player) => {
      if (player.money >= 200 && this.isPlayerInRoom(player))
        continuers = [...continuers, player];
      else this.removePlayer(player);
    });
    return continuers;
  };

  private addWaitingPlayersToPlayers() {
    this.getPlayersCanPlay().forEach((player) => {
      if (!this.players.includes(player)) {
        this.players = [...this.players, player];
        this.waitingPlayers = this.waitingPlayers.includes(player)
          ? this.waitingPlayers.splice(this.waitingPlayers.indexOf(player), 1)
          : this.waitingPlayers;
      }
    });
  }
  public get waitingPlayers(): Player[] {
    return this._waitingPlayers;
  }
  public set waitingPlayers(value: Player[]) {
    this._waitingPlayers = value;
  }

  addWaitingPlayer(player: Player) {
    this.waitingPlayers = [...this.waitingPlayers, player];
  }
  removeWaitingPlayer(player: Player) {
    this.waitingPlayers.splice(this.waitingPlayers.indexOf(player), 1);
  }
  removePlayer = (player: Player): number => {
    let playerMoney = player.money - player.initialMoney;
    if (this.isPlayerInRoom(player)) {
      if (this.game) {
        if (
          this.isPlayerInGame(player) &&
          !this.game.isGameEnded &&
          this.game.getActivePlayers().length > 1
        ) {
          this.fold(player);
          player.money = 0;
        }
      }
      this.players.splice(this.players.indexOf(player), 1);
    }
    return playerMoney;
  };
  bet = (player: Player, amount: number): boolean => {
    if (this.isPlayerInRoom(player)) return this.game.bet(player, amount);
  };
  call = (player: Player): boolean => {
    if (this.isPlayerInRoom(player)) return this.game.call(player);
  };
  raise = (player: Player, amount: number): boolean => {
    if (this.isPlayerInRoom(player)) return this.game.raise(player, amount);
  };

  fold = (player: Player): boolean => {
    if (this.isPlayerInRoom(player)) return this.game.fold(player);
  };
  check = (player: Player): boolean => {
    if (this.isPlayerInRoom(player)) return this.game.check(player);
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
  getActivePlayers = (): Player[] => {
    return this.game.getActivePlayers();
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
    return (
      this.players.includes(player) || this.waitingPlayers.includes(player)
    );
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
  isPlayerInGame = (player: Player): boolean => {
    return this.players ? this.game.players.includes(player) : false;
  };
}
