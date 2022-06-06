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
  }
  simplify = (): any => {
    return {
      username: this.username,
      money: this.money,
    };
  };
  getCards = (): Card[] => {
    return this.hand.getCards();
  };
}
