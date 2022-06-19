import Card from "./card";
import Hand from "./hand";

export default class Player {
  public pots!: number;
  public hasFolded!: boolean;
  public allIn!: boolean;
  public hand!: Hand;
  public handStrength!: number[];
  public highestCardsNum!: number[];
  public bet!: number;
  public plays!: any;
  public callAmount!: number;
  public initialMoney!: number;
  private _hasWon: boolean = false;

  public constructor(
    public readonly username: string,
    public money: number,
    public id: string,
    public roomId: string
  ) {
    this.hasFolded = false;
    this.hand = new Hand();
    this.pots = -1;
    this.bet = 0;
    this.allIn = false;
    this.initialMoney = money;
  }

  public get hasWon(): boolean {
    return this._hasWon;
  }
  public set hasWon(value: boolean) {
    this._hasWon = value;
  }

  simplify = (): any => {
    return {
      username: this.username,
      money: this.money,
      plays: this.plays,
      callAmount: this.callAmount,
      initialMoney: this.initialMoney,
      hasWon: this._hasWon,
      hand: { cards: undefined },
    };
  };
  getCards = (): Card[] => {
    return this.hand.getCards();
  };
  reset = (): void => {
    this.hasFolded = false;
    this.hand = new Hand();
    this.pots = -1;
    this.bet = 0;
    this.allIn = false;
    this.plays = undefined;
  };
}
