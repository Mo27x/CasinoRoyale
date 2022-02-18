import Card from "./card";

export default class Deck {
  private cards: Card[] = [
    new Card("clubsuit", 1),
    new Card("clubsuit", 2),
    new Card("clubsuit", 3),
    new Card("clubsuit", 4),
    new Card("clubsuit", 5),
    new Card("clubsuit", 6),
    new Card("clubsuit", 7),
    new Card("clubsuit", 8),
    new Card("clubsuit", 9),
    new Card("clubsuit", 10),
    new Card("clubsuit", 11),
    new Card("clubsuit", 12),
    new Card("clubsuit", 13),
    new Card("diamondsuit", 1),
    new Card("diamondsuit", 2),
    new Card("diamondsuit", 3),
    new Card("diamondsuit", 4),
    new Card("diamondsuit", 5),
    new Card("diamondsuit", 6),
    new Card("diamondsuit", 7),
    new Card("diamondsuit", 8),
    new Card("diamondsuit", 9),
    new Card("diamondsuit", 10),
    new Card("diamondsuit", 11),
    new Card("diamondsuit", 12),
    new Card("diamondsuit", 13),
    new Card("heartsuit", 1),
    new Card("heartsuit", 2),
    new Card("heartsuit", 3),
    new Card("heartsuit", 4),
    new Card("heartsuit", 5),
    new Card("heartsuit", 6),
    new Card("heartsuit", 7),
    new Card("heartsuit", 8),
    new Card("heartsuit", 9),
    new Card("heartsuit", 10),
    new Card("heartsuit", 11),
    new Card("heartsuit", 12),
    new Card("heartsuit", 13),
    new Card("spadesuit", 1),
    new Card("spadesuit", 2),
    new Card("spadesuit", 3),
    new Card("spadesuit", 4),
    new Card("spadesuit", 5),
    new Card("spadesuit", 6),
    new Card("spadesuit", 7),
    new Card("spadesuit", 8),
    new Card("spadesuit", 9),
    new Card("spadesuit", 10),
    new Card("spadesuit", 11),
    new Card("spadesuit", 12),
    new Card("spadesuit", 13),
  ];

  public constructor() {
    this.shuffle();
  }

  public getCards = (numCards: number): Card[] | any => {
    if (numCards == 1 || numCards == 3) {
      this.cards.splice(0, 1);
    }
    if (numCards > 0 && numCards <= this.cards.length) {
      let ret: Card[] = [];
      for (let i = 0; i < numCards; i++) {
        ret[i] = this.cards[i];
        if (i > -1) {
          this.cards.splice(i, 1);
        }
      }
      return ret;
    }
  };

  public shuffle = () => {
    for (let i = 0; i < this.cards.length; i++) {
      const j = this.randNum(this.cards.length - 1);
      const tmp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = tmp;
    }
  };

  private randNum = (max: number): number => {
    return Math.floor(Math.random() * (max + 1));
  };
}
