import Card from "./card";
import Hand from "./hand";

export default class Player {
  public pots!: number;
  public hasFolded!: boolean;
  public allIn!: boolean;
  public hand!: Hand;
  public handStrength!: number[];
  public highestCardNums!: number[];
  public bet!: number;
  public plays!: any;
  public callAmount!: number;
  public initialMoney!: number;

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
  simplify = (): any => {
    return {
      username: this.username,
      money: this.money,
      plays: this.plays,
      callAmount: this.callAmount,
      initialMoney: this.initialMoney,
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
