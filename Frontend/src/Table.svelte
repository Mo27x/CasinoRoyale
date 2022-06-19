<script lang="ts">
  import Card from "./Card.svelte";
  export let game: any;
  export let player: any;
  export let personalCards: any;
  export let username: string;

  const glow = (id: string): string => {
    document.getElementById(id).classList.add("animation-glow");
    setTimeout(() => {
      document.getElementById(id).classList.remove("animation-glow");
    }, 15000);
    return "";
  };

  if (game.winners) {
  }
</script>

<div class="table">
  <div class="pot">
    <div>POT</div>
    {#if game.pot}
      <div>{game.pot}</div>
    {/if}
  </div>
  <div class="card-place">
    <div class="cards">
      {#if game}
        {#if game.cards}
          {#each game.cards as card}
            <Card {card} />
          {/each}
        {/if}
      {/if}
    </div>
  </div>
  {#if game}
    <div class="player player1" id="player1">
      {#if player.hasWon}
        {glow("player1") || ""}
      {/if}
      <div class="top">{player.username}</div>
      <div class="center player-cards">
        {#if personalCards}
          {#each personalCards as card}
            <Card {card} />
          {/each}
        {:else}
          <Card />
          <Card />
        {/if}
      </div>
      <div class="bottom">{player.money}</div>
    </div>
    {#each game.players as player, index}
      {#if player.username != username}
        <div class="player player{index + 2}" id="player{index + 2}">
          {#if player.hasWon}
            {glow("player" + (index + 2)) || ""}
          {/if}
          <div class="top">{player.username}</div>
          <div class="center player-cards">
            {#if player.hand.cards}
              {#each player.hand.cards as card}
                <Card {card} />
              {/each}
            {:else}
              <Card />
              <Card />
            {/if}
          </div>
          <div class="bottom">{player.money}</div>
        </div>
      {/if}
    {/each}
  {/if}
</div>

<style>
  @media only screen and (max-width: 640px) {
    .table {
      display: grid;
      grid-auto-columns: 1fr;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr min-content 1fr 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      height: 100%;
      width: 97%;
      background-color: #35654d;
      border: 0.2rem solid #212121;
      place-items: center;
      border-radius: 8.5rem;
    }

    .card-place {
      grid-area: 3 / 1 / 4 / 4;
      display: grid;
      place-items: center;
    }

    .pot {
      display: grid;
      place-items: center;
      grid-area: 2/2/3/3;
      font-size: 14pt;
    }

    .cards {
      height: 4rem;
      width: 110%;
      text-align: center;
      border: 0.2rem solid #006338;
      border-radius: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      height: max-content;
    }

    .player {
      font-size: 14pt;
      text-align: center;
      background-color: #3e9469;
      border: 0.2rem solid #006338;
      border-radius: 0.5rem;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr min-content;
      gap: 0px 0px;
      grid-auto-flow: row;
    }

    .animation-glow {
      animation: glow 1s infinite alternate;
    }

    @keyframes glow {
      from {
        box-shadow: 0 0 1rem -1rem #fff;
      }
      to {
        box-shadow: 0 0 1rem 1rem #fff;
      }
    }

    .top {
      grid-area: 1/1/2/2;
    }

    .center {
      grid-area: 2/1/3/1;
    }

    .bottom {
      grid-area: 3/1/4/2;
    }

    .player1 {
      grid-area: 5 / 2 / 6 / 3;
      width: 96%;
      height: 96%;
      height: max-content;
    }

    .player2 {
      grid-area: 4 / 1 / 5 / 2;
      width: 96%;
      height: 96%;
      height: max-content;
    }

    .player3 {
      grid-area: 2 / 1 / 3 / 2;
      width: 96%;
      height: 96%;
      height: max-content;
    }

    .player4 {
      grid-area: 1 / 2 / 2 / 3;
      width: 96%;
      height: 96%;
      height: max-content;
    }

    .player5 {
      grid-area: 2 / 3 / 3 / 4;
      width: 96%;
      height: 96%;
      height: max-content;
    }

    .player6 {
      grid-area: 4 / 3 / 5 / 4;
      width: 96%;
      height: 96%;
      height: max-content;
    }

    .player-cards {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
</style>
