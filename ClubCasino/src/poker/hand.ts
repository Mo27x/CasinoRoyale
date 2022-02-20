import Card from "./card";

export default class Hand {
  public cards!: Card[];
  constructor() {}
  strength = (cards: Card[]): number[] => {
    let aCards = [...this.cards, ...cards];
    let funRet: number | number[];
    funRet = this.royalFlush(aCards);
    if (funRet != -1) return [10, funRet];

    funRet = this.straightFlush(aCards);
    if (funRet != -1) return [9, funRet];

    funRet = this.fourOfAKind(aCards);
    if (funRet != -1) return [8, funRet];

    funRet = this.fullHouse(aCards);
    if (funRet[0] != -1) return [7, ...funRet];

    funRet = this.flush(aCards);
    if (funRet != -1) return [6, funRet];

    funRet = this.straight(aCards);
    if (funRet != -1) return [5, funRet];

    funRet = this.fourOfAKind(aCards);
    if (funRet != -1) return [4, funRet];

    funRet = this.twoPair(aCards);
    if (funRet[0] != -1) return [3, ...funRet];

    funRet = this.pair(aCards);
    if (funRet != -1) return [2, funRet];

    funRet = this.highCard(cards);
    if (funRet[0] != -1) return [1, ...funRet];

    return [-1];
  };
  royalFlush = (cards: Card[]): number => {
    let maxNum = -1;
    let suits = [0, 0, 0, 0];
    let i: number[][] = [[], [], [], []];
    cards.forEach((card) => {
      if (card.suit == "clubsuit") {
        suits[0]++;
        i[0] = [...i[0], cards.indexOf(card)];
      } else if (card.suit == "diamondsuit") {
        suits[1] += 1;
        i[1] = [...i[1], cards.indexOf(card)];
      } else if (card.suit == "heartsuit") {
        suits[2]++;
        i[2] = [...i[2], cards.indexOf(card)];
      } else if (card.suit == "spadesuit") {
        suits[3]++;
        i[3] = [...i[3], cards.indexOf(card)];
      }
    });
    let max = Math.max(...suits);
    let r = suits.indexOf(max);
    if (max >= 5) {
      let finalCards: Card[] = [];
      i[r].forEach((element) => {
        finalCards = [...finalCards, cards[element]];
      });
      finalCards.sort((a, b) => b.num - a.num);
      if (finalCards[finalCards.length - 1].num == 1) {
        if (
          finalCards[0].num == 13 &&
          finalCards[1].num == 12 &&
          finalCards[2].num == 11 &&
          finalCards[3].num == 10
        ) {
          maxNum = 14;
        }
      }
    }
    return maxNum;
  };
  straightFlush = (cards: Card[]): number => {
    let suits = [0, 0, 0, 0];
    let suitsOccurrences: number[][] = [[], [], [], []];
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let maxNum = -1;
    cards.forEach((card) => {
      if (card.suit == "clubsuit") {
        suits[0]++;
        suitsOccurrences[0] = [...suitsOccurrences[0], cards.indexOf(card)];
      } else if (card.suit == "diamondsuit") {
        suits[1] += 1;
        suitsOccurrences[1] = [...suitsOccurrences[1], cards.indexOf(card)];
      } else if (card.suit == "heartsiut") {
        suits[2]++;
        suitsOccurrences[2] = [...suitsOccurrences[2], cards.indexOf(card)];
      } else if (card.suit == "spadesuit") {
        suits[3]++;
        suitsOccurrences[3] = [...suitsOccurrences[3], cards.indexOf(card)];
      }
    });
    let max = Math.max(...suits);
    let mostOccurredSuit = suits.indexOf(max);
    if (max < 5) {
    } else {
      let finalCards: Card[] = [];
      suitsOccurrences[mostOccurredSuit].forEach((element) => {
        finalCards = [...finalCards, cards[element]];
      });
      finalCards.forEach((card) => {
        nums[card.num - 1]++;
      });
      nums.reverse();
      finalCards.sort((a, b) => b.num - a.num);
      for (let i = 0; i < nums.length; i++) {
        if (i < 9) {
          for (let j = i; j < i + 5; j++) {
            if (nums[j] >= 1) {
              if (j == i + 4) {
                maxNum = finalCards[nums[i]].num;
              }
            } else break;
          }
        }
      }
      if (nums[nums.length - 1] >= 1) {
        for (let i = 0; i < 4; i++) {
          if (nums[i] >= 1) {
            if (i == 3) {
              maxNum = 14;
            }
          } else break;
        }
      }
    }
    return maxNum;
  };
  fourOfAKind = (cards: Card[]): number => {
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let maxNum = -1;
    cards.forEach((card) => {
      nums[card.num - 1]++;
    });
    let max = Math.max(...nums);
    if (max >= 4) {
      nums.forEach((num) => {
        if (num >= 4) {
          if (nums.lastIndexOf(num) + 1 > maxNum)
            maxNum = nums.lastIndexOf(num) + 1;
          if (nums.lastIndexOf(num) == 0) {
            maxNum = 14;
            return;
          }
        }
      });
    }
    return maxNum;
  };
  fullHouse = (cards: Card[]): number[] => {
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let maxNums = [-1, -1];
    cards.forEach((card) => {
      nums[card.num - 1]++;
    });
    let max = Math.max(...nums);
    let r = nums.lastIndexOf(max);
    if (max >= 3) {
      nums.forEach((num) => {
        if (num >= 3) {
          if (nums.lastIndexOf(num) + 1 > maxNums[0]) {
            maxNums[0] = nums.lastIndexOf(num) + 1;
            r = nums.lastIndexOf(num);
          }
          if (nums.lastIndexOf(num) == 0) {
            maxNums[0] = 14;
            r = nums.lastIndexOf(num);
            return;
          }
        }
      });
      let numsPair = [...nums];
      numsPair.splice(r, 1);
      let maxT = Math.max(...numsPair);
      if (maxT >= 2) {
        numsPair.forEach((num) => {
          if (num >= 2) {
            if (numsPair.lastIndexOf(num) + 1 > maxNums[1]) {
              if (numsPair.lastIndexOf(num) >= r) {
                maxNums[1] = numsPair.lastIndexOf(num) + 2;
              } else {
                maxNums[1] = numsPair.lastIndexOf(num) + 1;
              }
            }
            if (numsPair.lastIndexOf(num) == 0) {
              maxNums[1] = 14;
              return;
            }
          }
        });
      }
    }
    if (maxNums[0] == -1 || maxNums[1] == -1) {
      maxNums = [-1, -1];
    }
    return maxNums;
  };
  flush = (cards: Card[]): number => {
    let maxNum = -1;
    let suits = [0, 0, 0, 0];
    let maxNums: number[] = [-1, -1, -1, -1];
    cards.forEach((card) => {
      if (card.suit == "clubsuit") {
        suits[0]++;
        if (card.num > maxNums[0]) maxNums[0] = card.num;
        if (card.num == 1) maxNums[0] = 14;
      } else if (card.suit == "diamondsuit") {
        suits[1] += 1;
        if (card.num > maxNums[1]) maxNums[1] = card.num;
        if (card.num == 1) maxNums[1] = 14;
      } else if (card.suit == "heartsuit") {
        suits[2]++;
        if (card.num > maxNums[2]) maxNums[2] = card.num;
        if (card.num == 1) maxNums[2] = 14;
      } else if (card.suit == "spadesuit") {
        suits[3]++;
        if (card.num > maxNums[3]) maxNums[3] = card.num;
        if (card.num == 1) maxNums[3] = 14;
      }
    });
    let max = Math.max(...suits);
    if (max >= 5) {
      maxNum = maxNums[suits.indexOf(max)];
    }
    return maxNum;
  };
  straight = (cards: Card[]): number => {
    let maxNum = -1;
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards.forEach((card) => {
      nums[card.num - 1]++;
    });
    nums.reverse();
    cards.sort((a, b) => b.num - a.num);
    for (let i = 0; i < nums.length; i++) {
      if (i < 9) {
        for (let j = i; j < i + 5; j++) {
          if (nums[j] >= 1) {
            if (j == i + 4) {
              maxNum = cards[nums[i]].num;
            }
          } else break;
        }
      }
    }
    if (nums[nums.length - 1] >= 1) {
      for (let i = 0; i < 4; i++) {
        if (nums[i] >= 1) {
          if (i == 3) {
            maxNum = 14;
          }
        } else break;
      }
    }
    return maxNum;
  };
  threeOfAKind = (cards: Card[]): number => {
    let maxNum = -1;
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards.forEach((card) => {
      nums[card.num - 1]++;
    });
    let max = Math.max(...nums);
    if (max >= 3) {
      nums.forEach((num) => {
        if (num >= 3) {
          if (nums.lastIndexOf(num) + 1 > maxNum)
            maxNum = nums.lastIndexOf(num) + 1;
          if (nums.lastIndexOf(num) == 0) {
            maxNum = 14;
            return;
          }
        }
      });
    }
    return maxNum;
  };
  twoPair = (cards: Card[]): number[] => {
    let maxNums = [-1, -1];
    // let retFE = true;
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards.forEach((card) => {
      nums[card.num - 1]++;
    });
    let max = Math.max(...nums);
    let r = nums.lastIndexOf(max);
    if (max >= 2) {
      nums.forEach((num) => {
        if (num >= 2) {
          if (nums.lastIndexOf(num) + 1 > maxNums[0]) {
            maxNums[0] = nums.lastIndexOf(num) + 1;
            r = nums.lastIndexOf(num);
          }
          if (nums.lastIndexOf(num) == 0) {
            maxNums[0] = 14;
            r = nums.lastIndexOf(num);
            return;
          }
        }
      });
      let numsPair = [...nums];
      numsPair.splice(r, 1);
      let maxT = Math.max(...numsPair);
      if (maxT >= 2) {
        numsPair.forEach((num) => {
          if (num >= 2) {
            if (numsPair.lastIndexOf(num) + 1 > maxNums[1]) {
              if (numsPair.lastIndexOf(num) >= r) {
                maxNums[1] = numsPair.lastIndexOf(num) + 2;
              } else {
                maxNums[1] = numsPair.lastIndexOf(num) + 1;
              }
            }
            if (numsPair.lastIndexOf(num) == 0) {
              maxNums[1] = 14;
              return;
            }
          }
        });
      }
    }
    if (maxNums[0] == -1 || maxNums[1] == -1) {
      maxNums = [-1, -1];
    }
    return maxNums;
  };
  pair = (cards: Card[]): number => {
    let maxNum = -1;
    let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    cards.forEach((card) => {
      nums[card.num - 1]++;
    });
    let max = Math.max(...nums);
    if (max >= 2) {
      nums.forEach((num) => {
        if (num >= 2) {
          if (nums.lastIndexOf(num) + 1 > maxNum) {
            maxNum = nums.lastIndexOf(num) + 1;
          }
          if (nums.lastIndexOf(num) == 0) {
            maxNum = 14;
            return;
          }
        }
      });
    }
    return maxNum;
  };
  highCard = (cards: Card[]): number[] => {
    let maxNums: number[] = [];
    cards.sort((a, b) => b.num - a.num);
    cards.forEach((card) => {
      maxNums = [...maxNums, card.num];
    });
    if (maxNums != []) {
      return maxNums;
    }
    return [-1];
  };
}
