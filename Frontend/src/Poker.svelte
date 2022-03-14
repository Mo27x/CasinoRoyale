<script lang="ts">
  import Card from "./Card.svelte";
  import Player from "./Player.svelte";
  export let socket;
  let cards = [];
  let id: number = -1;
  let playerCards = [];
  let currentPlayer = [];
  let player = [];
  let players = [];

  function send(play: string) {
    socket.emit(play, id);
  }

  const game = (user: {}) => {
    socket.emit("game", user);
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

  socket.on("players", (inPlayers) => {
    console.log(inPlayers);
    players = inPlayers;
  });

  socket.on("player", (inPlayer) => {
    player = inPlayer;
  });

  const fetchUser = (async () => {
    const res = await fetch("http://localhost:3000/data");
    return res.json();
  })();
</script>

{#await fetchUser then user}
  {#if typeof user != "undefined"}
    {console.debug("user")}
    {game(user)}
  {/if}
{/await}

<div class="main">
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
  {#if players != []}
    {#each players as player}
      <!-- <svelte:component this={Player} {...player} /> -->
    {/each}
  {/if}
  {#if player != []}
    <div class=" player player1">
      <!-- You: <svelte:component this={Player} {...player} /> -->
    </div>
  {/if}
  {#if currentPlayer != []}
    <div class=" player player2">
      CurrentPlayer: <svelte:component this={Player} {...currentPlayer} />
    </div>
  {/if}
  <div class="buttons">
    <button on:click={() => send("check")}>Check</button>
    <button on:click={() => send("bet")}>Bet</button>
    <button on:click={() => send("fold")}>Fold</button>
    <button on:click={() => send("raise")}>Raise</button>
    <button on:click={() => send("call")}>Call</button>
    <button on:click={() => send("playerCards")}>cards</button>
  </div>
</div>

<style>
  /* .main {
    display: grid;
    place-items: center;
    grid-auto-columns: 1fr;
    grid-template-columns:
      minmax(min-content, 8.5rem) minmax(min-content, 8.5rem) minmax(
        min-content,
        8.5rem
      )
      minmax(min-content, 8.5rem) minmax(min-content, 8.5rem);
    grid-template-rows:
      0.3fr minmax(min-content, 8.5rem) 1.3fr 1.3fr minmax(min-content, 8.5rem)
      0.5fr;
    gap: 0px 0px;
    grid-template-areas:
      ". . . . ."
      ". . . . ."
      ". . . . ."
      ". . . . ."
      ". . . . .";
    grid-area: 2/2/3/3;
  } */
  .table {
    grid-area: 3/2/5/5;
    width: 1000px;
    height: 390px;
    background-color: #2b8b60;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 150px;
    position: relative;
    border: 15px solid #212022;
  }

  .table:before {
    content: "";
    border: 7px solid rgba(0, 0, 0, 0.1);
    display: block;
    width: 1015px;
    height: 405px;
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
    height: 375px;
    border-radius: 130px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .card-place {
    border: 5px solid #3ca576;
    height: 100px;
    width: 400px;
    position: absolute;
    border-radius: 10px;
    padding: 10px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-sizing: border-box;
  }
  .player {
    border: 0.2rem solid #ededed;
  }

  .player1 {
    grid-area: 5/4/6/5;
  }
  .player2 {
    grid-area: 5/3/6/4;
  }
  .player3 {
    grid-area: 5/2/6/3;
  }
  .player4 {
    grid-area: 4/1/5/2;
  }
  .player5 {
    grid-area: 3/1/4/2;
  }
  .player6 {
    grid-area: 2/2/3/3;
  }
  .player7 {
    grid-area: 2/3/3/4;
  }
  .player8 {
    grid-area: 2/4/3/5;
  }
  .player9 {
    grid-area: 3/5/4/6;
  }
  .player10 {
    grid-area: 4/5/5/6;
  }

  .buttons {
    grid-area: 6/2/7/5;
    height: 100%;
    width: 100%;
    text-align: center;
    background-color: #da0037;
  }
  button {
    height: 2rem;
    width: 5rem;
    background-color: #2b8b60;
    border-radius: 0.3rem;
  }
  .stripes {
    border: 0.3rem solid #ffffff;
    border-radius: 0.3rem;
    background-image: repeating-linear-gradient(
      -45deg,
      #8b89ff 0rem,
      #8b89ff 0.3rem,
      #6765ff 0.3rem,
      #6765ff 0.6rem
    );
  }
</style>
