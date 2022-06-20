import Card from "./card";
import Rank from "./rank";

export default class Deck {
  private _cards = [
    new Card("clubsuit", new Rank("Ace", 1)),
    new Card("clubsuit", new Rank("Two", 2)),
    new Card("clubsuit", new Rank("Three", 3)),
    new Card("clubsuit", new Rank("Four", 4)),
    new Card("clubsuit", new Rank("Five", 5)),
    new Card("clubsuit", new Rank("Six", 6)),
    new Card("clubsuit", new Rank("Seven", 7)),
    new Card("clubsuit", new Rank("Eight", 8)),
    new Card("clubsuit", new Rank("Nine", 9)),
    new Card("clubsuit", new Rank("Ten", 10)),
    new Card("clubsuit", new Rank("Jack", 10)),
    new Card("clubsuit", new Rank("Queen", 10)),
    new Card("clubsuit", new Rank("King", 10)),
    new Card("diamondsuit", new Rank("Ace", 1)),
    new Card("diamondsuit", new Rank("Two", 2)),
    new Card("diamondsuit", new Rank("Three", 3)),
    new Card("diamondsuit", new Rank("Four", 4)),
    new Card("diamondsuit", new Rank("Five", 5)),
    new Card("diamondsuit", new Rank("Six", 6)),
    new Card("diamondsuit", new Rank("Seven", 7)),
    new Card("diamondsuit", new Rank("Eight", 8)),
    new Card("diamondsuit", new Rank("Nine", 9)),
    new Card("diamondsuit", new Rank("Ten", 10)),
    new Card("diamondsuit", new Rank("Jack", 10)),
    new Card("diamondsuit", new Rank("Queen", 10)),
    new Card("diamondsuit", new Rank("King", 10)),
    new Card("heartsuit", new Rank("Ace", 1)),
    new Card("heartsuit", new Rank("Two", 2)),
    new Card("heartsuit", new Rank("Three", 3)),
    new Card("heartsuit", new Rank("Four", 4)),
    new Card("heartsuit", new Rank("Five", 5)),
    new Card("heartsuit", new Rank("Six", 6)),
    new Card("heartsuit", new Rank("Seven", 7)),
    new Card("heartsuit", new Rank("Eight", 8)),
    new Card("heartsuit", new Rank("Nine", 9)),
    new Card("heartsuit", new Rank("Ten", 10)),
    new Card("heartsuit", new Rank("Jack", 10)),
    new Card("heartsuit", new Rank("Queen", 10)),
    new Card("heartsuit", new Rank("King", 10)),
    new Card("spadesuit", new Rank("Ace", 1)),
    new Card("spadesuit", new Rank("Two", 2)),
    new Card("spadesuit", new Rank("Three", 3)),
    new Card("spadesuit", new Rank("Four", 4)),
    new Card("spadesuit", new Rank("Five", 5)),
    new Card("spadesuit", new Rank("Six", 6)),
    new Card("spadesuit", new Rank("Seven", 7)),
    new Card("spadesuit", new Rank("Eight", 8)),
    new Card("spadesuit", new Rank("Nine", 9)),
    new Card("spadesuit", new Rank("Ten", 10)),
    new Card("spadesuit", new Rank("Jack", 10)),
    new Card("spadesuit", new Rank("Queen", 10)),
    new Card("spadesuit", new Rank("King", 10)),
  ];

  constructor() {}

  public get cards(): Card[] {
    return this._cards;
  }
  public set cards(value: Card[]) {
    this._cards = value;
  }

  shuffle = (): void => {
    this.cards.sort(() => Math.random() - 0.5);
  };

  deal = (): Card => {
    let card = this._cards[0];
    this.cards.shift();
    return card;
  };

  get length(): number {
    return this.cards.length;
  }
}
