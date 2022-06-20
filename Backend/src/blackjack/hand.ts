import Card from "./card";

export default class Hand {
  private _cards!: Card[];
  private _actions!: string[];
  private _bet!: number;
  private _hasStood: boolean = false;
  private _hasSurrendered: boolean = false;
  private _insurance: number = 0;
  private _hasWon: boolean = false;
  private _isPush: boolean = false;
  private _canInsure: boolean = false;
  public get canInsure(): boolean {
    return this._canInsure;
  }
  public set canInsure(value: boolean) {
    this._canInsure = value;
  }

  constructor() {
    this.cards = [];
    this.bet = 0;
    this.hasStood = false;
  }

  public get bet(): number {
    return this._bet;
  }
  public set bet(value: number) {
    this._bet = value;
  }

  public get cards(): Card[] {
    return this._cards;
  }
  public set cards(value: Card[]) {
    this._cards = value;
  }

  public get insurance(): number {
    return this._insurance;
  }
  public set insurance(value: number) {
    this._insurance = value;
  }

  public get hasSurrendered(): boolean {
    return this._hasSurrendered;
  }
  public set hasSurrendered(value: boolean) {
    this._hasSurrendered = value;
  }

  public get hasStood(): boolean {
    return this._hasStood;
  }
  public set hasStood(value: boolean) {
    this._hasStood = value;
  }

  public get hasWon(): boolean {
    return this._hasWon;
  }
  public set hasWon(value: boolean) {
    this._hasWon = value;
  }

  public get isPush(): boolean {
    return this._isPush;
  }
  public set isPush(value: boolean) {
    this._isPush = value;
  }

  public get value(): number {
    let value = 0;
    let aces = 0;
    this.cards.forEach((card) => {
      if (card.rank.value === 1 || card.rank.value === 11) {
        aces++;
      } else value += card.rank.value;
    });
    if (aces >= 1 && value <= 10) {
      value += 11;
      aces--;
    }
    while (aces > 0) {
      value += 1;
      aces--;
    }
    return value;
  }

  get firstCard(): Card {
    return this.cards[0];
  }

  get isBlackjack(): boolean {
    return this.cards.length === 2 && this.value === 21;
  }

  get hasBusted(): boolean {
    return this.value > 21;
  }

  canSplit = (): boolean => {
    return (
      this.cards.length === 2 &&
      this.firstCard.rank.value === this.cards[1].rank.value &&
      !this.hasStood &&
      !this.isBlackjack
    );
  };
  canDoubleDown = (): boolean => {
    return (
      this.cards.length === 2 &&
      !this.hasStood &&
      !this.hasSurrendered &&
      !this.isBlackjack
    );
  };
  canSurrender = (): boolean => {
    return (
      this.cards.length === 2 &&
      !this.hasStood &&
      !this.hasSurrendered &&
      !this.isBlackjack
    );
  };

  canHit = (): boolean => {
    return (
      this.value < 21 &&
      !this.hasStood &&
      !this.hasSurrendered &&
      !this.hasBusted &&
      !this.isBlackjack
    );
  };

  get actions(): string[] {
    this._actions = [];
    if (this._cards.length > 0 && !this.hasSurrendered && !this.hasStood) {
      if (this.canHit()) this._actions = ["hit"];
      this._actions = [...this._actions, "stand"];
      if (this.canSplit()) this._actions = [...this._actions, "split"];
      if (this.canDoubleDown())
        this._actions = [...this._actions, "double down"];
      if (this.canSurrender()) this._actions = [...this._actions, "surrender"];
      if (this.canInsure && this.cards.length === 2) {
        this._actions = [...this._actions, "insurance"];
      }
    }
    return this._actions;
  }

  simplify = () => {
    return {
      bet: this._bet,
      cards: this._cards,
      hasWon: this._hasWon,
      isBlackjack: this.isBlackjack,
      actions: this.actions,
      value: this.value,
    };
  };
}
