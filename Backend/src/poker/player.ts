import Hand from "./hand";

export default class Player {
  public roundBet!: number;
  public gameBet!: number;
  public folded!: boolean;
  public raised!: boolean;
  public allIn!: boolean;
  public hand!: Hand;
  // public canBet!: boolean;
  public handStrength!: number[];
  public highestCardNums!: number[];

  public constructor(
    public readonly username: string,
    public money: number,
    // public readonly image: number
  ) {
    this.roundBet = 0;
    this.folded = false;
    this.hand = new Hand();
    this.gameBet = 0;
  }
}
