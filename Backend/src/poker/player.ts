import Hand from "./hand";

export default class Player {
  public roundBet!: number;
  public gameBet!: number;
  public pots!: number;
  public hasFolded!: boolean;
  public allIn!: boolean;
  public hand!: Hand;
  public handStrength!: number[];
  public highestCardNums!: number[];

  public constructor(
    public readonly username: string,
    public money: number,
    public id: string,
    public roomId: string
  ) {
    this.roundBet = 0;
    this.hasFolded = false;
    this.hand = new Hand();
    this.gameBet = 0;
    this.pots = -1;
  }
}
