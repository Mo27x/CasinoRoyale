import Card from "./card";
import Deck from "./deck";
import Player from "./player";

export default class Poker {
  private deck: Deck = new Deck();
  public pot!: number;
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
  public winners!: Player[];

  public constructor(private bigblind: number, public players: Player[]) {
    this.cards = [];
    this.smallBlind = this.bigblind / 2;
    this.maxBet = this.bigblind;
    this.rounds = 0;
    this.pot = 0;
    if (this.players.length == 2) {
      this.button = this.players[0];
      this.currentPlayer = this.button;
      this.bet(this.button, this.smallBlind);
      this.currentPlayer = players[1];
      this.bet(players[1], this.bigblind);
      this.firstBetter = this.button;
      this.nextPlayer(this.players[1]);
    }
    if (this.players.length >= 3) {
      this.button = this.players[0];
      this.bet(players[1], this.smallBlind);
      this.bet(players[2], bigblind);
      this.firstBetter = this.nextPlayer(this.players[2]);
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
        this.pot += this.maxBet - player.gameBet;
        player.money -= this.maxBet - player.gameBet;
        player.roundBet += this.maxBet - player.gameBet;
        player.gameBet += this.maxBet - player.gameBet;
      } else {
        player.roundBet += player.money;
        player.gameBet += player.money;
        this.pot += player.money;
        player.money = 0;
        player.allIn = true;
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
        this.pot += money;
      } else {
        player.roundBet += player.money;
        player.gameBet += player.money;
        this.pot += player.money;
        player.money = 0;
        player.allIn = true;
      }
      this.firstBetter = player;
      this.betted = true;
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
        this.pot += money;
        player.money -= money;
        player.roundBet += money;
        this.firstBetter = player;
      } else if (player.money == money) {
        this.pot += money;
        player.roundBet += player.money;
        player.money -= money;
        player.allIn = true;
        this.firstBetter = player;
      } else {
        this.pot += player.money;
        player.roundBet += player.money;
        player.money = 0;
        player.allIn = true;
      }
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  fold = (player: Player): Player[] => {
    if (this.findPlayer(player) && player == this.currentPlayer) {
      if ([player] != this.players) {
        player.folded = true;
        this.nextPlayer(player);
        if (this.currentPlayer == this.firstBetter) {
          this.rounds++;
        }
      } else {
        return this.compareHands();
      }
    }
    return [];
  };

  round = (player: Player): Player[] => {
    // gotta review later
    // if (this.currentPlayer != player) {
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
        return (this.winners = this.compareHands());
      }
      this.resetBets();
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

  sidePot = () => {};

  // canDrawAll = (): boolean => {
  //   for (let i = 0; i < this.players.length; i++) {
  //     if (this.players[i].canBet) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  compareHands = (): Player[] => {
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
    return bestHandPlayers;
  };
}
