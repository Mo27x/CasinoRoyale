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
      plays: this.plays,
    };
  };
  getCards = (): Card[] => {
    return this.hand.getCards();
  };
}
