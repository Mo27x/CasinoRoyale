<script lang="ts">
  import Table from "./Table.svelte";
  import { pokerGameMoney } from "./store";
  export let user: any;
  export let socket: any;
  let money: number;
  let moneyToBet: number = user.money / 2;
  let game: any;

  pokerGameMoney.subscribe((value) => {
    money = value;
  });

  const progress = () => {
    let time = (<HTMLProgressElement>document.getElementById("time")).value;
    if (time <= 0) {
      clearInterval(interval);
    } else {
      (<HTMLProgressElement>document.getElementById("time")).value -= 1;
      if ((<HTMLProgressElement>document.getElementById("time")).value <= 5) {
        (<HTMLProgressElement>(
          document.getElementById("time")
        )).style.accentColor = "#973838";
      }
    }
  };

  let interval = setInterval(progress, 1000);

  let bet = { min: 200, max: 1000 };
  let raise = { min: 200, max: 1000 };

  let plays = ["Check", "Bet"];
  let play = "";

  const changePlay = (passedPay: string) => {
    play = passedPay;
  };

  const changeAmount = (amount: number) => {
    money = amount;
  };
  let personalCards: any = [];
  const startGame = (money: number) => {
    socket.emit("poker", user, money);
  };
  socket.on("pokerGame", (data: any) => {
    game = data;
  });
  socket.on("personalCards", (data: any) => {
    personalCards = JSON.parse(data);
  });
  const sendPlay = (play: string) => {
    socket.emit(play, money);
  };
  const changeValue = (card: any) => {
    if (card.num == 1) card.num = "A";
    if (card.num == 11) card.num = "J";
    if (card.num == 12) card.num = "Q";
    if (card.num == 13) card.num = "K";
    return card;
  };
  const getColor = (card: any) => {
    if (card.suit == "spadesuit" || card.suit == "clubsuit") {
      return "black";
    } else {
      return "red";
    }
  };
  startGame(money);
</script>

<div class="container">
  <div class="table">
    <Table />
  </div>
  <div class="center">
    <div class="progress">
      <progress id="time" max="20" value="20" />
    </div>
  </div>
  <div class="center">
    <div class="buttons">
      {#if play == ""}
        <div class="space-evenly">
          <button class="play">{plays[0]}</button>
          <button class="play" on:click={() => changePlay("bet")}
            >{plays[1]}</button
          >
          <button class="play fold">Fold</button>
        </div>
      {:else if play == "bet"}
        <div class="detailed">
          <div class="left">
            <div class="top">Your {play}</div>
            <div class="bottom">{money}</div>
          </div>

          <div class="center">
            <div class="space-between top">
              <button on:click={() => changeAmount(200)}>Min</button>
              <button on:click={() => changeAmount(1000)}>All-In</button>
            </div>
            <div class="center bottom">
              <input
                type="range"
                name="money"
                id="money"
                min="200"
                max="1000"
                step="50"
                bind:value={moneyToBet}
              />
            </div>
          </div>
          <div class="right">
            <div class="top center"><button>{plays[1]}</button></div>
            <div class="bottom center">
              <button class="cancel" on:click={() => changePlay("")}
                >Cancel</button
              >
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content min-content;
    gap: 0px 0px;
    grid-auto-flow: row;
    height: 100%;
    width: 100%;
  }

  .table {
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  .progress {
    grid-area: 2 / 1 / 3 / 2;
  }

  .buttons {
    grid-area: 3 / 1 / 4 / 2;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: min-content;
  }
  .progress {
    width: 98%;
  }
  #time {
    accent-color: palegreen;
    width: 100%;
  }
  .buttons {
    width: 98%;
  }
  .space-evenly {
    display: flex;
    justify-content: space-evenly;
  }

  .space-between {
    display: flex;
    justify-content: space-between;
  }

  .detailed {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-template-rows: 1fr 1fr;
    gap: 0rem 0.2rem;
    grid-auto-flow: row;
  }

  .detailed > .left {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: 1 / 1 / 3 / 2;
  }

  .left > .top {
    grid-area: 1 / 1 / 2 / 2;
    display: grid;
    place-items: center;
  }

  .left > .bottom {
    background-color: #5a5867;
    border-radius: 0.4rem;
    grid-area: 2 / 1 / 3 / 2;
    display: grid;
    place-items: center;
  }

  .detailed > .center {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: 1 / 2 / 3 / 3;
  }
  .center > .top {
    grid-area: 1 / 1 / 2 / 2;
  }

  .center > .bottom {
    grid-area: 2 / 1 / 3 / 2;
    display: flex;
    align-items: baseline;
  }

  .detailed > .right {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.2rem 0rem;
    grid-auto-flow: row;
    grid-area: 1 / 3 / 3 / 4;
  }
  .right > .top {
    grid-area: 1 / 1 / 2 / 2;
  }

  .right > .bottom {
    grid-area: 2 / 1 / 3 / 2;
  }

  input[type="range"] {
    accent-color: #ffae82;
    width: 95%;
  }

  button {
    border: none;
    background: none;
    color: #eeeeee;
    font-size: 12pt;
    height: 2rem;
    background-color: #5a5867;
    border-radius: 0.5rem;
  }

  .play {
    width: 6rem;
  }
  .cancel {
    background: none;
    border: 0.2rem solid #5a5867;
  }
  .fold {
    background: none;
    border: 0.2rem solid #973838;
    color: #973838;
  }
</style>
