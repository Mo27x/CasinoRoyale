import Card from "./card";
import Hand from "./hand";

export default class Player {
  public pots!: number;
  public hasFolded!: boolean;
  public allIn!: boolean;
  public hand!: Hand;
  public handStrength!: number[];
  public highestCardNums!: number[];
  public bet: number;
  private _plays: any;
  private _callAmount: number;

  public get callAmount(): number {
    return this._callAmount;
  }
  public set callAmount(value: number) {
    this._callAmount = value;
  }
  public get plays() {
    return this._plays;
  }
  public set plays(value) {
    this._plays = value;
  }

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
    this.plays = undefined;
  }
  simplify = (): any => {
    return {
      username: this.username,
      money: this.money,
      plays: this._plays,
      callAmount: this._callAmount,
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
