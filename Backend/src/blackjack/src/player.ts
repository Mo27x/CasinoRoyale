import Hand from "./hand";

export default class Player {
  private _hands!: Hand[];
  private _moneyToBet!: number;
  private _currentHand!: Hand;
  constructor(
    public readonly name: string,
    public money: number,
    public readonly id: string,
    public readonly roomId: string
  ) {
    this.hands = [new Hand()];
    this.currentHand = this.hands[0];
    this.moneyToBet = money;
  }

  public get hands(): Hand[] {
    return this._hands;
  }
  public set hands(value: Hand[]) {
    this._hands = value;
  }

  public get moneyToBet(): number {
    return this._moneyToBet;
  }
  public set moneyToBet(value: number) {
    this._moneyToBet = value;
  }

  public get currentHand(): Hand {
    return this._currentHand;
  }
  public set currentHand(value: Hand) {
    this._currentHand = value;
  }

  bet(amount: number, handIndex: number): boolean {
    if (this._moneyToBet >= amount) {
      this._moneyToBet -= amount;
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
      moneyToBet: this.moneyToBet,
    };
  };
}
