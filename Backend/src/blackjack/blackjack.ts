import Card from "./card";
import Deck from "./deck";
import Hand from "./hand";
import BlackjackPlayer from "./player";

export default class Blackjack {
  public currentPlayer!: BlackjackPlayer;
  private _deck = new Deck();
  private _isGameEnded: boolean = false;
  private _hasDealerRevealed: boolean = false;
  private _dealer!: Hand;
  constructor(public readonly players: BlackjackPlayer[]) {
    this.resetPlayers();
    this._dealer = new Hand();
    players.forEach((player) => {
      this.bet(player, player.initialBet, 0);
    });
  }

  public get dealer(): Hand {
    return this._dealer;
  }

  public get isGameEnded(): boolean {
    return this._isGameEnded;
  }

  bet(player: BlackjackPlayer, amount: number, handIndex: number): boolean {
    if (!player.bet(amount, handIndex)) {
      player.hands[handIndex].bet = 0;
      return false;
    }
    return true;
  }

  play = (): void => {
    if (this.haveAllBetted()) {
      this._deck.shuffle();
      this.players.forEach((player) => {
        player.hands[0].cards = [this._deck.deal(), this._deck.deal()];
      });
      this._dealer.cards = [this._deck.deal(), this._deck.deal()];
      this.currentPlayer = this.players[0];
      if (this._dealer.firstCard.rank.name === "Ace") {
        this.players.forEach((player) => {
          player.currentHand.canInsure = true;
        });
      }
    }
  };

  hit = (player: BlackjackPlayer): boolean => {
    if (
      this.isPlayerInGame(player) &&
      player === this.currentPlayer &&
      !player.currentHand.hasSurrendered &&
      !player.currentHand.hasStood
    ) {
      player.currentHand.cards = [
        ...player.currentHand.cards,
        this._deck.deal(),
      ];
      if (player.currentHand.value > 21) {
        this.stand(player);
      }
      return true;
    }
    return false;
  };

  stand = (player: BlackjackPlayer): boolean => {
    if (
      this.isPlayerInGame(player) &&
      player === this.currentPlayer &&
      !player.currentHand.hasSurrendered &&
      !player.currentHand.hasStood
    ) {
      player.currentHand.hasStood = true;
      if (!player.goToNextHand())
        if (!this.goToNextPlayer()) this.calculateWinner();
      return true;
    }
    return false;
  };

  doubleDown = (player: BlackjackPlayer): boolean => {
    if (
      this.isPlayerInGame(player) &&
      player === this.currentPlayer &&
      !player.currentHand.hasSurrendered &&
      !player.currentHand.hasStood
    ) {
      player.currentHand.bet *= 2;
      this.hit(player);
      this.stand(player);
      return true;
    }
    return false;
  };

  split = (player: BlackjackPlayer): boolean => {
    if (
      this.isPlayerInGame(player) &&
      player === this.currentPlayer &&
      !player.currentHand.hasSurrendered &&
      !player.currentHand.hasStood &&
      player.currentHand.cards[0].rank.value ===
        player.currentHand.cards[1].rank.value &&
      player.money >= player.currentHand.bet
    ) {
      const hand = new Hand();
      player.hands.push(hand);
      hand.cards = [player.currentHand.cards[1], this._deck.deal()];
      player.bet(player.currentHand.bet, player.hands.indexOf(hand));
      hand.bet = player.currentHand.bet;
      player.currentHand.cards[1] = this._deck.deal();
      return true;
    }
    return false;
  };

  surrender = (player: BlackjackPlayer): boolean => {
    if (
      this.isPlayerInGame(player) &&
      player === this.currentPlayer &&
      !player.currentHand.hasStood &&
      !player.currentHand.hasSurrendered
    ) {
      player.initialMoney -= player.hands[0].bet / 2;
      player.money += player.hands[0].bet / 2;
      player.currentHand.cards = [];
      player.currentHand.bet = 0;
      player.currentHand.hasSurrendered = true;
      if (!player.goToNextHand())
        if (!this.goToNextPlayer()) this.calculateWinner();
      return true;
    }
    return false;
  };

  insurance = (player: BlackjackPlayer): boolean => {
    if (
      this.isPlayerInGame(player) &&
      player === this.currentPlayer &&
      this._dealer.firstCard.rank.value === 1 &&
      player.money >= player.currentHand.bet / 2
    ) {
      player.currentHand.insurance += player.currentHand.bet / 2;
      player.money -= player.currentHand.bet / 2;
      return true;
    }
    return false;
  };

  dealerHit = (): void => {
    while (this._dealer.value < 17) {
      this._dealer.cards.push(this._deck.deal());
    }
    this._dealer.hasStood = true;
  };

  isPush = (player: BlackjackPlayer): boolean => {
    return (
      this._dealer.value === player.hands[0].value &&
      this._dealer.hasStood &&
      player.hands[0].hasStood
    );
  };

  canContinue = (): boolean => {
    return this.players.every((player) => player.canContinue);
  };

  goToNextPlayer = (): boolean => {
    if (this.players.indexOf(this.currentPlayer) + 1 < this.players.length) {
      this.currentPlayer =
        this.players[this.players.indexOf(this.currentPlayer) + 1];
      return true;
    }
    return false;
  };

  haveAllBetted = (): boolean => {
    return this.players.every((player) => player.hands[0].bet > 0);
  };

  isPlayerInGame = (player: BlackjackPlayer): boolean => {
    return this.players.includes(player);
  };

  resetPlayers = () => {
    this.players.forEach((player) => {
      player.reset();
    });
  };

  getDealerCards = (): Card[] => {
    if (!this._hasDealerRevealed) {
      return [this._dealer.firstCard];
    } else {
      return this._dealer.cards;
    }
  };

  simplify = () => {
    return {
      players: this.players.map((player) => player.simplify()),
      dealerCards: this.getDealerCards(),
      dealerHandValue: this._hasDealerRevealed
        ? this._dealer.value
        : this._dealer.firstCard.rank.value === 1
        ? 11
        : this._dealer.firstCard.rank.value,
      currentPlayer: !this.isGameEnded ? this.currentPlayer.simplify() : null,
      isGameEnded: this.isGameEnded,
    };
  };

  calculateWinner = (): void => {
    if (!this.canContinue()) {
      this._hasDealerRevealed = true;
      this.dealerHit();
      this.players.forEach((player) => {
        if (!player.canContinue) {
          player.hands.forEach((hand) => {
            if (!hand.hasSurrendered && hand.hasStood) {
              if (hand.hasBusted || this._dealer.hasBusted) {
                if (hand.hasBusted) {
                  console.log(player.name + " busted");
                  return;
                }
                if (this._dealer.hasBusted) {
                  player.money += hand.bet * 2;
                  hand.hasWon = true;
                  console.log("dealer busted");
                  return;
                }
              } else if (hand.isBlackjack || this._dealer.isBlackjack) {
                if (hand.isBlackjack) {
                  player.money += hand.bet * 2.5;
                  hand.hasWon = true;
                  console.log(player.name + " has blackjack");
                  return;
                }
                if (this._dealer.isBlackjack) {
                  if (hand.insurance > 0) player.money += hand.insurance * 2;
                  console.log("dealer has blackjack");
                  return;
                }
              } else {
                if (hand.value > this._dealer.value) {
                  player.money += hand.bet * 2;
                  hand.hasWon = true;
                  console.log(player.name + " has higher value");
                  return;
                } else if (hand.value < this._dealer.value) {
                  console.log(player.name + " has lower value");
                  return;
                } else if (this.isPush(player)) {
                  player.money += hand.bet;
                  hand.isPush = true;
                  console.log("push");
                  return;
                }
              }
            }
          });
        }
      });
      this._isGameEnded = true;
    }
  };
}
