<script lang="ts">
  import Table from "./Table.svelte";
  import { userData, pokerGameMoney, isPlayingValue } from "./store";
  let user: any;
  export let socket: any;
  let gameMoney: number;
  let moneyToBet = 0;
  let game: any;
  let isPlaying: boolean;
  let personalCards: any;
  let play = "";
  let player: any;
  let interval: any;
  let timer = false;
  $: username = user.username;

  pokerGameMoney.subscribe((value) => {
    gameMoney = value;
  });

  userData.subscribe((value) => {
    user = value;
  });
  isPlayingValue.subscribe((value) => {
    isPlaying = value;
  });
  isPlayingValue.set(true);

  const progress = () => {
    let time = (<HTMLProgressElement>document.getElementById("time")).value;
    if (time <= 0) {
      clearInterval(interval);
      timer = false;
      if (<HTMLProgressElement>document.getElementById("time")) {
        (<HTMLProgressElement>document.getElementById("time")).value = 20;
        (<HTMLProgressElement>(
          document.getElementById("time")
        )).style.accentColor = "#98fb98";
      }
      sendPlay("fold");
    } else {
      (<HTMLProgressElement>document.getElementById("time")).value -= 1;
      if (time > 0 && time <= 5) {
        (<HTMLProgressElement>(
          document.getElementById("time")
        )).style.accentColor = "#973838";
      }
    }
  };

  const changePlay = (passedPay: string) => {
    play = passedPay;
  };

  const changeAmount = (amount: number) => {
    moneyToBet = amount;
  };

  const startGame = (money: number) => {
    socket.emit("poker", user, money);
  };
  socket.on("pokerGame", (data: any) => {
    game = data;
    if (game) {
      if (game.players) {
        game.players.forEach((player: any) => {
          if (player.username == user.username) {
            game.players.splice(game.players.indexOf(player), 1);
          }
        });
      }
      if (game.cards) {
        fetchUser();
        game.cards.forEach((card: any) => {
          changeSuit(card);
          changeNumber(card);
        });
      }
      if (game.isGameEnded) {
        game.winners.forEach((potWinners: any) => {
          potWinners.forEach((winner: any) => {
            if (winner.username != user.username) {
              winner.hand.cards.forEach((card: any) => {
                changeSuit(card);
                changeNumber(card);
              });
              game.players.forEach((player) => {
                player.hand.cards = winner.hand.cards;
              });
            }
          });
        });
        clearInterval(interval);
        if (<HTMLProgressElement>document.getElementById("time")) {
          (<HTMLProgressElement>document.getElementById("time")).value = 20;
          (<HTMLProgressElement>(
            document.getElementById("time")
          )).style.accentColor = "#98fb98";
        }
        fetchUser();
      }
      if (
        game.currentPlayer &&
        game.currentPlayer.username == user.username &&
        !game.isGameEnded &&
        !timer
      ) {
        interval = setInterval(progress, 1000);
        timer = true;
      } else {
        clearInterval(interval);
        timer = false;
        if (<HTMLProgressElement>document.getElementById("time")) {
          (<HTMLProgressElement>document.getElementById("time")).value = 20;
          (<HTMLProgressElement>(
            document.getElementById("time")
          )).style.accentColor = "#98fb98";
        }
      }
      if (game.isGameEnded && (!player.money || player.money < 200)) {
        window.location.href = "/";
      }
    }
  });
  const changeSuit = (card: any) => {
    if (!card.suit.startsWith("&") && !card.suit.endsWith(";")) {
      card.suit = "&" + card.suit + ";";
    }
  };
  const changeNumber = (card: any) => {
    if (card.num == 1) card.num = "A";
    if (card.num == 11) card.num = "J";
    if (card.num == 12) card.num = "Q";
    if (card.num == 13) card.num = "K";
  };
  socket.on("personalCards", (data: any) => {
    personalCards = data;
    if (personalCards) {
      personalCards.forEach((card: any) => {
        changeSuit(card);
        changeNumber(card);
      });
    }
  });
  socket.on("player", (data: any) => {
    player = data;
    if (!player.plays) {
      if (player.callAmount > 0) {
        player.plays = ["call", "raise", "fold"];
      } else {
        player.plays = ["check", "bet", "fold"];
      }
    }
    moneyToBet = Math.ceil(player.money / 2);
  });

  const sendPlay = (play: string) => {
    socket.emit(play, moneyToBet);
    if (player.username == user.username) {
      clearInterval(interval);
      (<HTMLProgressElement>document.getElementById("time")).value = 20;
      (<HTMLProgressElement>document.getElementById("time")).style.accentColor =
        "#98fb98";
    }
  };
  const fetchUser = async () => {
    let response = await fetch("/api/user/getUser");
    let data = await response.json();
    user = data.user;
    userData.set(user);
  };
  startGame(gameMoney);
  fetchUser();
</script>

<div class="container">
  <div class="table">
    {#if game && player}
      <Table {game} {username} {personalCards} {player} />
    {:else}
      <div class="center">
        <img src="./icons/casinoroyale.jpg" alt="Logo" class="waiting" />
      </div>
    {/if}
  </div>
  <div class="center">
    {#if game && player}
      <div class="progress">
        <progress id="time" max="20" value="20" />
      </div>
    {/if}
  </div>
  <div class="center">
    <div class="buttons">
      {#if player}
        {#if play == ""}
          <div class="space-evenly">
            <button class="play" on:click={() => sendPlay(player.plays[0])}>
              {player.plays[0] + " "}
              {player.callAmount > 0 ? player.callAmount : ""}
            </button>
            <button class="play" on:click={() => changePlay(player.plays[1])}>
              {player.plays[1]}
            </button>
            <button class="play fold" on:click={() => sendPlay("fold")}>
              Fold
            </button>
          </div>
        {:else if play == "bet" || play == "raise"}
          <div class="detailed">
            <div class="left">
              <div class="top">Your {play}</div>
              <div class="bottom">{moneyToBet}</div>
            </div>

            <div class="center">
              <div class="space-between top">
                <button
                  on:click={() =>
                    changeAmount(player.money > 200 ? 200 : player.money)}
                  >Min</button
                >
                <button on:click={() => changeAmount(player.money)}>
                  All-In
                </button>
              </div>
              <div class="center bottom">
                <input
                  type="range"
                  name="money"
                  id="money"
                  min={player.money > 200 ? 200 : player.money}
                  max={player.money}
                  step="50"
                  bind:value={moneyToBet}
                />
              </div>
            </div>
            <div class="right">
              <div class="top center">
                <button on:click={() => sendPlay(player.plays[1])}>
                  {player.plays[1]}
                </button>
              </div>
              <div class="bottom center">
                <button class="cancel" on:click={() => changePlay("")}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .waiting {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    -webkit-animation: spin 4s linear infinite;
    -moz-animation: spin 4s linear infinite;
    animation: spin 4s linear infinite;
  }
  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
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
    accent-color: #98fb98;
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
