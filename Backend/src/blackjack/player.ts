import Hand from "./hand";

export default class BlackjackPlayer {
  private _hands!: Hand[];
  private _money!: number;
  private _currentHand!: Hand;
  private _isPlaying: boolean = true;
  public get isPlaying(): boolean {
    return this._isPlaying;
  }
  public set isPlaying(value: boolean) {
    this._isPlaying = value;
  }
  constructor(
    public readonly name: string,
    public initialMoney: number,
    public readonly id: string,
    public roomId: string,
    public readonly initialBet: number
  ) {
    this.hands = [new Hand()];
    this.currentHand = this.hands[0];
    this.money = initialMoney;
  }

  public get hands(): Hand[] {
    return this._hands;
  }
  public set hands(value: Hand[]) {
    this._hands = value;
  }

  public get money(): number {
    return this._money;
  }
  public set money(value: number) {
    this._money = value;
  }

  public get currentHand(): Hand {
    return this._currentHand;
  }
  public set currentHand(value: Hand) {
    this._currentHand = value;
  }

  bet(amount: number, handIndex: number): boolean {
    if (this._money >= amount) {
      this._money -= amount;
      this.hands[handIndex].bet = amount;
      return true;
    }
    return false;
  }

  goToNextHand = (): boolean => {
    if (this.hands.length > this.hands.indexOf(this.currentHand) + 1) {
      this.currentHand = this.hands[this.hands.indexOf(this.currentHand) + 1];
      return true;
    }
    return false;
  };

  get canContinue(): boolean {
    return this.hands.every((hand) => !hand.hasStood && !hand.hasSurrendered);
  }

  simplify = () => {
    return {
      name: this.name,
      hands: this.hands.map((hand) => hand.simplify()),
      currentHand: this.currentHand.simplify(),
      money: this.money,
    };
  };

  reset = () => {
    this.hands = [new Hand()];
    this.currentHand = this.hands[0];
    this.money = this.initialMoney;
  };
}
