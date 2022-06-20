import Blackjack from "./blackjack";
import Card from "./card";
import BlackjackPlayer from "./player";

export default class BlackjackRoom {
  private _waitingPlayers: BlackjackPlayer[] = [];
  private _players: BlackjackPlayer[] = [];
  private _game!: Blackjack;
  public get game(): Blackjack {
    return this._game;
  }
  private _isGameStarted: boolean = false;
  public get isGameStarted(): boolean {
    return this._isGameStarted;
  }

  constructor(public readonly id: string) {}

  public get players(): BlackjackPlayer[] {
    return this._players;
  }

  startGame = (): void => {
    this.getPlayerWithMoney();
    if (
      (!this._isGameStarted || this.isGameEnded) &&
      this.players.length > 0 &&
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
    return this._players.every((player) => player.initialBet > 0);
  }

  getPlayerWithMoney(): BlackjackPlayer[] {
    this._waitingPlayers.forEach((waitingPlayer) => {
      this._players =
        !this._players.includes(waitingPlayer) &&
        waitingPlayer.initialMoney > 0 &&
        waitingPlayer.isPlaying
          ? [...this._players, waitingPlayer]
          : this._players;
    });
    this._players = this._players.filter(
      (player) => player.initialMoney > 0 && player.isPlaying
    );
    return this._players;
  }

  addWaitingPlayer = (player: BlackjackPlayer): void => {
    this._waitingPlayers = !this._waitingPlayers.includes(player)
      ? [...this._waitingPlayers, player]
      : [...this._waitingPlayers];
  };

  removeWaitingPlayer = (player: BlackjackPlayer): void => {
    this._waitingPlayers = this._waitingPlayers.filter((p) => p !== player);
  };

  removePlayer = (player: BlackjackPlayer): number => {
    let playerMoney = (player.initialMoney = player.initialMoney);
    if (this.isPlayerInRoom(player)) {
      if (this._game) {
        if (this.isPlayerInGame(player)) {
          player.hands = [];
          player.initialMoney = 0;
          player.initialMoney = 0;
          this._players.filter((p) => p !== player);
        }
      }
      this._waitingPlayers.filter((p) => p !== player);
    }
    return playerMoney;
  };

  isPlayerInRoom = (player: BlackjackPlayer): boolean => {
    return (
      this._players.includes(player) || this._waitingPlayers.includes(player)
    );
  };

  isPlayerInGame = (player: BlackjackPlayer): boolean => {
    return this._players.includes(player);
  };

  hit = (player: BlackjackPlayer): boolean => {
    if (this._game) return this._game.hit(player);
  };

  stand = (player: BlackjackPlayer): boolean => {
    if (this._game) return this._game.stand(player);
  };

  doubleDown = (player: BlackjackPlayer): boolean => {
    if (this._game) return this._game.doubleDown(player);
  };

  surrender = (player: BlackjackPlayer): boolean => {
    if (this._game) return this._game.surrender(player);
  };

  split = (player: BlackjackPlayer): boolean => {
    if (this._game) return this._game.split(player);
  };

  insurance = (player: BlackjackPlayer): boolean => {
    if (this._game) return this._game.insurance(player);
  };

  getSimplifiedGame = () => {
    if (this._game) return this._game.simplify();
    return null;
  };
}
