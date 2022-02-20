<script lang="ts">
  import { io } from "socket.io-client";
  import { Router, Link, Route } from "svelte-navigator";
  import Card from "./Card.svelte";
  const socket = io();
  let cards = [];
  let name: string = "";
  let id: number = -1;
  let playerCards = [];
  let currentPlayer = "";

  function send(play: string) {
    socket.emit(play, id);
  }

  const sendName = () => {
    socket.emit("name", name);
  };

  const changeValues = (card): void => {
    if (card.num == 1) card.num = "A";
    if (card.num == 11) card.num = "J";
    if (card.num == 12) card.num = "Q";
    if (card.num == 13) card.num = "K";
  };

  const getColor = (card) => {
    if (card.suit == "spadesuit" || card.suit == "clubsuit") {
      card.color = "black";
    }
    if (card.suit == "diamondsuit" || card.suit == "heartsuit") {
      card.color = "red";
    }
  };
  socket.on("cards", (card) => {
    cards = JSON.parse(card);
    for (let i = 0; i < cards.length; i++) {
      changeValues(cards[i]);
      getColor(cards[i]);
      cards[i].suit = "&" + cards[i].suit + ";";
    }
  });
  socket.on("playerCards", (card) => {
    playerCards = JSON.parse(card);
    console.log(playerCards);
    for (let i = 0; i < playerCards.length; i++) {
      changeValues(playerCards[i]);
      getColor(playerCards[i]);
      playerCards[i].suit = "&" + playerCards[i].suit + ";";
    }
  });
  socket.on("winners", (winners) => {
    console.log(winners);
  });
  socket.on("currentPlayer", (player) => {
    currentPlayer = player;
  });
</script>

<div class="entire">
  <center>
    <h1>Mo's Poker</h1>
    <div class="main">
      <input bind:value={name} type="text" required />
      <button on:click={() => sendName()}>Send</button>
      <input bind:value={currentPlayer} type="text" required />

      <div class="table">
        <div class="card-place">
          {#if cards != []}
            {#each cards as card}
              <svelte:component this={Card} {...card} />
            {/each}
          {/if}
        </div>
      </div>
      {#if playerCards != []}
        {#each playerCards as card}
          <svelte:component this={Card} {...card} />
        {/each}
      {/if}

      <button on:click={() => send("check")}>Check</button>
      <button on:click={() => send("bet")}>Bet</button>
      <button on:click={() => send("fold")}>Fold</button>
      <button on:click={() => send("raise")}>Raise</button>
      <button on:click={() => send("call")}>Call</button>
      <button on:click={() => send("playerCards")}>player Cards</button>

      <input bind:value={id} type="number" />
    </div>
  </center>
</div>

<style>
  .entire {
    margin: 0;
    padding: 0;
    background-color: cadetblue;
    height: 100%;
    width: 100%;
  }
  .main {
    width: 100vw;
    height: 100vh;
  }

  .table {
    height: 500px;
    width: 80%;
    border-radius: 50%;
    margin: 0 auto;
    width: 1000px;
    height: 400px;
    background-color: #4aad4a;
    position: absolute;
    border-radius: 150px;
    position: relative;
    border: 1em solid #a95555;
  }

  .table:before {
    content: "";
    border: 7px solid rgba(0, 0, 0, 0.1);
    display: block;
    width: 1015px;
    height: 415px;
    border-radius: 150px;
    position: absolute;
    top: -15px;
    left: -15px;
  }
  .table:after {
    content: "";
    border: 7px solid rgba(0, 0, 0, 0.1);
    display: block;
    width: 985px;
    height: 385px;
    border-radius: 130px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .table .card-place {
    border: 5px solid #63c763;
    height: 100px;
    width: 363px;
    position: absolute;
    border-radius: 10px;
    padding: 10px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-sizing: border-box;
  }
  .card-place > Card {
    margin-right: 15px;
  }
</style>
