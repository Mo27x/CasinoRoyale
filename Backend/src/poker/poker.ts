import Card from "./card";
import Deck from "./deck";
import Player from "./player";

export default class Poker {
  private deck: Deck = new Deck();
  public pots: number[] = [];
  private potNum!: number;
  private button!: Player;
  public rounds!: number;
  private betted!: boolean;
  private roundMaxBet!: number;
  private maxBet: number;
  private smallBlind!: number;
  // change to private also players
  public currentPlayer!: Player;
  public firstBetter!: Player;
  public cards!: Card[];
  public winners: Player[][] = [[]];

  public constructor(
    private bigblind: number,
    public players: Player[] // private endCallback = (game, winner) => {}
  ) {
    this.cards = [];
    this.smallBlind = this.bigblind / 2;
    this.maxBet = this.bigblind;
    this.rounds = 0;
    this.potNum = 0;
    // this.pots[this.potNum] = 0;
    // this.pots = [...this.pots, 0];
    if (this.players.length == 2) {
      this.button = this.players[0];
      this.currentPlayer = this.button;
      this.bet(this.button, this.smallBlind);
      this.currentPlayer = players[1];
      this.bet(players[1], this.bigblind);
      this.firstBetter = players[1];
      this.nextPlayer(this.players[1]);
      this.firstBetter = this.currentPlayer;
    }
    if (this.players.length > 2) {
      this.button = this.players[0];
      this.currentPlayer = this.players[1];
      this.bet(this.players[1], this.smallBlind);
      this.currentPlayer = this.players[2];
      this.bet(this.players[2], bigblind);
      this.nextPlayer(this.players[2]);
      this.firstBetter = this.currentPlayer;
    }
  }

  giveCards = () => {
    this.players.forEach((player) => {
      player.hand.cards = this.deck.getCards(2);
    });
  };

  displayCards = (numCards: number) => {
    this.cards = [...this.cards, ...this.deck.getCards(numCards)];
  };

  check = (player: Player): boolean => {
    this.maxBetFun();
    if (
      this.findPlayer(player) &&
      player.gameBet == this.maxBet &&
      player == this.currentPlayer
    ) {
      this.betted = false;
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  call = (player: Player): boolean => {
    this.maxBetFun();
    if (
      this.findPlayer(player) &&
      player.roundBet < this.maxBet &&
      player == this.currentPlayer
    ) {
      if (player.money > this.maxBet - player.gameBet) {
        this.pots[this.potNum] += this.maxBet - player.gameBet;
        player.money -= this.maxBet - player.gameBet;
        player.roundBet += this.maxBet - player.gameBet;
        player.gameBet += this.maxBet - player.gameBet;
      } else {
        player.roundBet += player.money;
        player.gameBet += player.money;
        this.pots[this.potNum] += player.money;
        player.money = 0;
        player.allIn = true;
        if (this.getActivePlayers().length >= 2) {
          this.potNum++;
        } else {
          for (let i = 0; i < this.pots.length; i++) {
            this.winners[i] = this.compareHands(this.pots[i]);
          }
          console.log(this.winners);
        }
      }
      // can return winners
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  bet = (player: Player, money: number): boolean => {
    this.maxBetFun();
    if (
      this.findPlayer(player) &&
      !player.folded &&
      player == this.currentPlayer &&
      // player.roundBet == this.maxBet &&
      // !this.betted &&
      money > 0
    ) {
      if (player.money > money) {
        player.money -= money;
        player.roundBet += money;
        player.gameBet += money;
        this.pots[this.potNum] += money;
      } else {
        player.roundBet += player.money;
        player.gameBet += player.money;
        this.pots[this.potNum] += player.money;
        player.money = 0;
        player.allIn = true;
        if (this.getActivePlayers().length >= 2) {
          this.potNum++;
        } else {
          for (let i = 0; i < this.pots.length; i++) {
            this.winners[i] = this.compareHands(this.pots[i]);
          }
        }
      }
      if (this.rounds >= 0) {
        this.firstBetter = player;
        this.betted = true;
      }
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  raise = (player: Player, money: number) => {
    this.maxBetFun();
    if (
      this.findPlayer(player) &&
      !player.folded &&
      player == this.currentPlayer &&
      player.roundBet == this.maxBet &&
      money >= this.roundMaxBet - player.roundBet &&
      player != this.firstBetter &&
      this.betted
    ) {
      if (player.money > money) {
        this.pots[this.potNum] += money;
        player.money -= money;
        player.roundBet += money;
        this.firstBetter = player;
      } else if (player.money == money) {
        this.pots[this.potNum] += money;
        player.roundBet += player.money;
        player.money -= money;
        player.allIn = true;
        if (this.getActivePlayers().length >= 2) {
          this.potNum++;
        } else {
          for (let i = 0; i < this.pots.length; i++) {
            this.winners[i] = this.compareHands(this.pots[i]);
          }
        }
        this.firstBetter = player;
      } else {
        this.pots[this.potNum] += player.money;
        player.roundBet += player.money;
        player.money = 0;
        player.allIn = true;
        if (this.getActivePlayers().length >= 2) {
          this.potNum++;
        } else {
          for (let i = 0; i < this.pots.length; i++) {
            this.winners[i] = this.compareHands(this.pots[i]);
          }
        }
      }
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  fold = (player: Player): Player[][] => {
    if (this.findPlayer(player) && player == this.currentPlayer) {
      if ([player] != this.getActivePlayers()) {
        player.folded = true;
        this.nextPlayer(player);
        if (this.getActivePlayers().length == 1) {
          for (let i = 0; i < this.pots.length; i++) {
            this.winners[i][0] = this.currentPlayer;
          }
          return this.winners;
        }
      }
    }
    return [];
  };

  round = (player: Player): Player[][] => {
    // gotta review later
    if (this.currentPlayer != player) {
      if (this.currentPlayer == this.firstBetter) {
        this.betted = false;
        this.rounds++;
        if (this.rounds == 1) {
          this.giveCards();
        } else if (this.rounds == 2) {
          this.displayCards(3);
        } else if (this.rounds > 2 && this.rounds <= 4) {
          this.displayCards(1);
        } else if (this.rounds == 5) {
          // finish game
          for (let i = 0; i < this.pots.length; i++) {
            this.winners[i] = this.compareHands(this.pots[i]);
          }
          return this.winners;
        }
        this.resetBets();
      }
    }
    // } else {
    // gotta decide what to do if there is only one player
    // }
    return [];
  };

  nextPlayer = (player: Player): Player => {
    let j = this.players.indexOf(player) + 1;
    for (let i = j; i < this.players.length; i++) {
      if (!this.players[i].folded) {
        this.currentPlayer = this.players[i];
        this.round(player);
        return this.players[i];
      }
    }
    for (let i = 0; i < j - 1; i++) {
      if (!this.players[i].folded) {
        this.currentPlayer = this.players[i];
        this.round(player);
        return this.players[i];
      }
    }
    this.round(player);
    return player;
  };

  findPlayer = (player: Player): boolean => {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] == player) {
        return true;
      }
    }
    return false;
  };

  maxBetFun = (): number => {
    let maxBet = -1;
    this.players.forEach((player) => {
      if (player.gameBet > maxBet) maxBet = player.gameBet;
    });
    this.maxBet = maxBet;
    return maxBet;
  };

  resetBets = () => {
    this.players.forEach((player) => {
      player.roundBet = 0;
    });
  };

  getActivePlayers = (): Player[] => {
    let ret: Player[] = [];
    this.players.forEach((player) => {
      if (!player.folded && !player.allIn) {
        ret = [...ret, player];
      }
    });
    return ret;
  };

  sidePot = () => {};

  // canDrawAll = (): boolean => {
  //   for (let i = 0; i < this.players.length; i++) {
  //     if (this.players[i].canBet) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  compareHands = (pot: number): Player[] => {
    let bestHandPlayers: Player[] = [];
    let activePlayers: Player[] = [];
    this.players.forEach((player) => {
      if (!player.folded) {
        activePlayers = [...activePlayers, player];
      }
    });
    activePlayers.forEach((player) => {
      player.handStrength = player.hand.strength(this.cards);
      player.highestCardNums = player.hand.highCard(player.hand.cards);
    });
    bestHandPlayers[0] = activePlayers[0];
    for (let i = 0; i < activePlayers.length; i++) {
      if (i != 0) {
        if (
          activePlayers[i].handStrength[0] > bestHandPlayers[0].handStrength[0]
        ) {
          bestHandPlayers[0] = activePlayers[i];
        } else if (
          activePlayers[i].handStrength[0] == bestHandPlayers[0].handStrength[0]
        ) {
          if (
            activePlayers[i].handStrength[1] >
            bestHandPlayers[0].handStrength[1]
          ) {
            bestHandPlayers[0] = activePlayers[i];
          } else if (
            activePlayers[i].handStrength[1] ==
            bestHandPlayers[0].handStrength[1]
          ) {
            if (typeof activePlayers[2] == "number") {
              if (
                activePlayers[i].handStrength[2] >
                bestHandPlayers[0].handStrength[2]
              ) {
                bestHandPlayers[0] = activePlayers[i];
              } else if (
                activePlayers[i].handStrength[2] ==
                bestHandPlayers[0].handStrength[2]
              ) {
                if (
                  activePlayers[i].highestCardNums[0] >
                  bestHandPlayers[0].highestCardNums[0]
                ) {
                  bestHandPlayers[0] = activePlayers[i];
                } else if (
                  activePlayers[i].highestCardNums[0] ==
                  bestHandPlayers[0].highestCardNums[0]
                ) {
                  if (
                    activePlayers[i].highestCardNums[1] >
                    bestHandPlayers[0].highestCardNums[1]
                  ) {
                    bestHandPlayers[0] = activePlayers[i];
                  } else if (
                    activePlayers[i].highestCardNums[1] ==
                    bestHandPlayers[0].highestCardNums[1]
                  ) {
                    bestHandPlayers = [...bestHandPlayers, activePlayers[i]];
                  }
                }
              }
            } else {
              if (
                activePlayers[i].highestCardNums[0] >
                bestHandPlayers[0].highestCardNums[0]
              ) {
                bestHandPlayers[0] = activePlayers[i];
              } else if (
                activePlayers[i].highestCardNums[0] ==
                bestHandPlayers[0].highestCardNums[0]
              ) {
                if (
                  activePlayers[i].highestCardNums[1] >
                  bestHandPlayers[0].highestCardNums[1]
                ) {
                  bestHandPlayers[0] = activePlayers[i];
                } else if (
                  activePlayers[i].highestCardNums[1] ==
                  bestHandPlayers[0].highestCardNums[1]
                ) {
                  bestHandPlayers = [...bestHandPlayers, activePlayers[i]];
                }
              }
            }
          }
        }
      }
    }
    pot /= bestHandPlayers.length;
    bestHandPlayers.forEach((bestHandPlayer) => {
      bestHandPlayer.money += pot;
    });
    return bestHandPlayers;
  };
}
