import Hand from "./hand";

export default class Player {
  public roundBet!: number;
  public gameBet!: number;
  public pots!: number;
  public folded!: boolean;
  public allIn!: boolean;
  public hand!: Hand;
  public handStrength!: number[];
  public highestCardNums!: number[];

  public constructor(public readonly username: string, public money: number) {
    this.roundBet = 0;
    this.folded = false;
    this.hand = new Hand();
    this.gameBet = 0;
    this.pots = -1;
  }
}
