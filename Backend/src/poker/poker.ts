import Card from "./card";
import Deck from "./deck";
import Player from "./player";

export default class Poker {
  private deck: Deck = new Deck();
  public pots: number[] = [];
  private potNum!: number;
  public rounds!: number;
  private actualBet!: number;
  private smallBlind!: number;
  public currentPlayer!: Player;
  public firstBetter!: Player;
  public cards!: Card[];
  public winners: Player[][] = [[]];
  public isGameEnded = false;
  private canCheck!: boolean;

  public constructor(private bigBlind: number, public players: Player[]) {
    this.cards = [];
    this.smallBlind = this.bigBlind / 2;
    this.rounds = 0;
    this.potNum = 0;
    this.pots[this.potNum] = 0;
    this.canCheck = true;
    if (this.players.length == 2) {
      this.currentPlayer = this.players[0];
      this.bet(this.players[0], this.smallBlind);
      this.currentPlayer = this.players[1];
      this.canCheck = true;
      this.bet(players[1], this.bigBlind);
      this.firstBetter = players[1];
      this.nextPlayer(this.players[1]);
      this.firstBetter = this.currentPlayer;
      this.canCheck = true;
    }
    if (this.players.length > 2) {
      this.currentPlayer = this.players[1];
      this.bet(this.players[1], this.smallBlind);
      this.currentPlayer = this.players[2];
      this.canCheck = true;
      this.bet(this.players[2], bigBlind);
      this.nextPlayer(this.players[2]);
      this.firstBetter = this.currentPlayer;
    }

    this.canCheck = false;
    this.updatePlayersPlays();
    this.actualBet = bigBlind;
  }

  check = (player: Player): boolean => {
    if (
      this.isActive(player) &&
      player == this.currentPlayer &&
      (this.canCheck || this.getMaxBet() == player.bet)
    ) {
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  bet = (player: Player, money: number): boolean => {
    if (
      money > 0 &&
      player.money > money &&
      this.isActive(player) &&
      player == this.currentPlayer &&
      this.canCheck
    ) {
      if (player.money > money) {
        this.pots[this.potNum] += money;
        player.money -= money;
        player.bet += money;
        this.actualBet = money;
        if (player.pots < 0) {
          player.pots = 0;
        }
      } else {
        player.allIn = true;
        // player in pot 0?
        if (this.getActivePlayers().length > 1) {
          this.pots[this.potNum] += player.money;
          this.actualBet = player.money;
          player.bet += player.money;
          player.money = 0;
        } else {
          this.endGame();
        }
      }
      this.firstBetter = player;
      this.canCheck = false;
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  call = (player: Player): boolean => {
    if (
      this.isActive(player) &&
      player == this.currentPlayer &&
      !this.canCheck
    ) {
      if (player.money > this.getMaxBet() - player.bet) {
        this.pots[this.potNum] += this.getMaxBet() - player.bet;
        player.money -= this.getMaxBet() - player.bet;
        player.bet += this.getMaxBet() - player.bet;
        if (player.pots < 0) {
          player.pots = 0;
        }
      } else {
        this.pots[this.potNum] += player.money;
        player.bet += player.money;
        player.money = 0;
        player.allIn = true;
        // player in pot 0?
        this.potNum++;
        this.getActivePlayers().forEach((activePlayer) => {
          if (activePlayer.bet > player.bet) {
            this.pots[this.potNum - 1] -= activePlayer.bet - player.bet;
            this.pots[this.potNum] += activePlayer.bet - player.bet;
            activePlayer.pots++;
          }
        });
        if (this.getActivePlayers.length < 2) {
          this.endGame();
        }
      }
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  raise = (player: Player, money: number) => {
    if (
      this.isActive(player) &&
      player == this.currentPlayer &&
      !this.canCheck &&
      money > 2 * this.actualBet
    ) {
      if (player.money >= money) {
        this.pots[this.potNum] += money;
        player.money -= money;
        this.actualBet = money;
        this.firstBetter = player;
        player.bet += money;
        if (player.pots < 0) {
          player.pots = 0;
        }
      } else {
        this.pots[this.potNum] += player.money;
        player.bet += player.money;
        player.money = 0;
        player.allIn = true;
        // player in pot 0 if player.money < money?
        this.potNum++;
        this.getActivePlayers().forEach((activePlayer) => {
          if (activePlayer.bet > player.bet) {
            this.pots[this.potNum - 1] -= activePlayer.bet - player.bet;
            this.pots[this.potNum] += activePlayer.bet - player.bet;
            activePlayer.pots++;
          }
        });
        if (this.getActivePlayers.length < 2) {
          this.endGame();
        }
      }
      this.nextPlayer(player);
      return true;
    }
    return false;
  };

  fold = (player: Player): boolean => {
    if (this.isActive(player) && this.currentPlayer == player) {
      player.hasFolded = true;
      if (this.getActivePlayers().length > 1) {
        this.nextPlayer(player);
        if (player == this.firstBetter) {
          this.firstBetter = this.currentPlayer;
        }
      } else if (this.getActivePlayers().length == 1) {
        this.firstBetter = this.getActivePlayers()[0];
        while (this.rounds < 5) {
          this.nextPlayer(player);
        }
      }
    }
    return false;
  };

  private giveCards = () => {
    this.players.forEach((player) => {
      player.hand.cards = this.deck.getCards(2);
    });
  };

  private displayCards = (numCards: number) => {
    this.cards = [...this.cards, ...this.deck.getCards(numCards)];
  };

  endGame = () => {
    for (let i = 0; i < this.pots.length; i++) {
      this.winners[i] = this.compareHands(this.pots[i]);
    }
    this.isGameEnded = true;
  };

  round = () => {
    this.updatePlayersPlays();
    if (this.currentPlayer == this.firstBetter) {
      this.canCheck = true;
      this.rounds++;
      if (this.rounds == 1) {
        this.giveCards();
      } else if (this.rounds == 2) {
        this.displayCards(3);
      } else if (this.rounds > 2 && this.rounds < 5) {
        this.displayCards(1);
      } else if (this.rounds == 5) {
        this.endGame();
      }
    }
  };

  nextPlayer = (player: Player): Player => {
    let j = this.players.indexOf(player) + 1;
    for (let i = j; i < this.players.length; i++) {
      if (this.isActive(this.players[i])) {
        this.currentPlayer = this.players[i];
        this.round();
        return this.players[i];
      }
    }
    for (let i = 0; i < j - 1; i++) {
      if (this.isActive(this.players[i])) {
        this.currentPlayer = this.players[i];
        this.round();
        return this.players[i];
      }
    }
    this.round();
    return player;
  };

  getMaxBet = (): number => {
    let maxBet = -1;
    this.getActivePlayers().forEach((player) => {
      if (player.bet > maxBet) {
        maxBet = player.bet;
      }
    });
    return maxBet;
  };

  getCallAmount = (player: Player): number => {
    return this.getMaxBet() - player.bet;
  };

  updatePlayersPlays = () => {
    this.players.forEach((player) => {
      if (this.isActive(player)) {
        if (this.getCallAmount(player) > 0) {
          player.plays = ["call", "raise", "fold"];
        } else {
          player.plays = ["check", "bet", "fold"];
        }
      }
    });
  };

  private isActive = (player: Player): boolean => {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] == player && !player.hasFolded && !player.allIn) {
        return true;
      }
    }
    return false;
  };

  getActivePlayers = (): Player[] => {
    let ret: Player[] = [];
    this.players.forEach((player) => {
      if (!player.hasFolded && !player.allIn) {
        ret = [...ret, player];
      }
    });
    return ret;
  };

  simplify = (): any => {
    let simplifiedPlayers: Player[] = [];
    this.players.forEach((player) => {
      simplifiedPlayers = [...simplifiedPlayers, player.simplify()];
    });
    let simplifiedWinners = this.winners.map((potWinners) => {
      return potWinners.map((winner) => {
        return winner.simplify();
      });
    });
    let ret = {
      players: simplifiedPlayers,
      winners: this.isGameEnded ? simplifiedWinners : undefined,
      cards: this.cards ? this.cards : undefined,
      currentPlayer: this.currentPlayer.simplify(),
      pot: this.pots.reduce((acc, curr) => acc + curr, 0),
      isGameEnded: this.isGameEnded,
    };
    return ret;
  };

  compareHands = (pot: number): Player[] => {
    let bestHandPlayers: Player[] = [];
    let activePlayers: Player[] = [];
    this.players.forEach((player) => {
      if (!player.hasFolded && player.pots >= this.pots.indexOf(pot)) {
        activePlayers = [...activePlayers, player];
      }
    });
    activePlayers.forEach((player) => {
      player.handStrength = player.hand.strength(this.cards);
      player.highestCardNums = player.hand.highCard();
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
