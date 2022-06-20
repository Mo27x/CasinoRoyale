import Rank from "./rank";

export default class Card {
  constructor(public readonly suit: string, public readonly rank: Rank) {}
}
