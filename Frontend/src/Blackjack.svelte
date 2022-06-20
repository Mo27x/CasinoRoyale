<script lang="ts">
  import BlackjackTable from "./BlackjackTable.svelte";
  import { userData, blackjackGameMoney, isPlayingValue } from "./store";
  export let socket: any;
  let user: any;
  let gameMoney: number;
  let initialBet = gameMoney ? Math.ceil(gameMoney / 2) : 100;
  let game: any;
  let isPlaying: boolean;
  let play: string = "";
  let player: any;
  let interval: any;
  let timer = false;
  $: username = user.username;
  let hasSentStartGame: boolean = false;

  blackjackGameMoney.subscribe((value) => {
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
      sendAction("surrender");
    } else {
      (<HTMLProgressElement>document.getElementById("time")).value -= 1;
      if (time > 0 && time <= 5) {
        (<HTMLProgressElement>(
          document.getElementById("time")
        )).style.accentColor = "#973838";
      }
    }
  };

  const changePlay = (passedPlay: string) => {
    play = passedPlay;
  };

  const changeAmount = (amount: number) => {
    gameMoney = amount;
  };

  const startGame = () => {
    socket.emit("blackjack", user, gameMoney, initialBet);
    hasSentStartGame = true;
  };

  socket.on("blackjackGame", (data: any) => {
    game = data;
    if (game) {
      fetchUser();
      if (game.dealerCards) {
        game.dealerCards.forEach((card) => {
          changeNumber(card);
          changeSuit(card);
        });
      }
      if (game.players) {
        game.players.forEach((gamePlayer: any) => {
          gamePlayer.hands.forEach((hand: any) => {
            hand.cards.forEach((card: any) => {
              changeSuit(card);
              changeNumber(card);
            });
          });
          if (gamePlayer.name === user.username) {
            player = gamePlayer;
            console.log(player.currentHand.actions);
          }
        });
        game.players.splice(game.players.indexOf(player), 1);
      }
      if (game.isGameEnded) {
        clearInterval(interval);
        timer = false;
        if (<HTMLProgressElement>document.getElementById("time")) {
          (<HTMLProgressElement>document.getElementById("time")).value = 20;
          (<HTMLProgressElement>(
            document.getElementById("time")
          )).style.accentColor = "#98fb98";
        }
      }
      if (
        game.currentPlayer &&
        game.currentPlayer.name == user.username &&
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
    }
  });

  const changeSuit = (card: any) => {
    if (!card.suit.startsWith("&") && !card.suit.endsWith(";")) {
      card.suit = "&" + card.suit + ";";
    }
  };

  const changeNumber = (card: any) => {
    if (
      card.rank.name === "Jack" ||
      card.rank.name === "Queen" ||
      card.rank.name === "King" ||
      card.rank.name === "Ace"
    ) {
      card.rank.value = card.rank.name[0];
    }
  };

  const fetchUser = async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    userData.set(data);
  };

  const sendAction = (action: string) => {
    socket.emit(action);
  };
</script>

<div class="container">
  <div class="table-place">
    {#if game}
      <BlackjackTable {game} {username} {player} />
    {:else if !hasSentStartGame}
      <div>Bet</div>
      <div>
        <input
          type="range"
          name="money"
          id="money"
          min="100"
          bind:value={initialBet}
          max={gameMoney}
          step="100"
        />
      </div>
      <div><output for="money">{initialBet}</output></div>
      <div>
        <button on:click={() => startGame()}>Start Game</button>
      </div>
    {:else if hasSentStartGame}
      <div class="center">
        <img src="./icons/casinoroyale.jpg" alt="Logo" class="waiting" />
      </div>
    {/if}
  </div>
  {#if game && game.currentPlayer && game.currentPlayer.name == username && !game.isGameEnded}
    <div class="progress center">
      <progress id="time" max="20" value="20" />
    </div>
  {/if}

  <div class="buttons">
    {#if game && game.currentPlayer && game.currentPlayer.name == username && !game.isGameEnded}
      {#each player.currentHand.actions as action}
        <button class="play" on:click={() => sendAction(action)}>
          {action}
        </button>
      {/each}
    {/if}
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

  .table-place {
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  .progress {
    grid-area: 2 / 1 / 3 / 2;
    width: 98%;
  }

  .buttons {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    grid-area: 3 / 1 / 4 / 2;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: min-content;
  }

  button {
    width: max-content;
    height: 3rem;
    border: none;
    background-color: #333;
    border-radius: 0.5rem;
    font-size: 14pt;
    cursor: pointer;
  }

  #time {
    width: 90%;
    accent-color: palegreen;
  }
</style>
