<script lang="ts">
  import Card from "./BlackjackCard.svelte";
  export let game: any;
  export let player: any;
  export let username: string;
</script>

<div class="table">
  {#if game}
    <div class="dealer">
      <div class="dealer-name">
        <span>Dealer</span>
      </div>
      <div class="dealer-cards">
        {#each game.dealerCards as card}
          <Card {card} />
        {/each}
        {#if game.dealerCards.length === 1}
          <Card />
        {/if}
      </div>
      <div class="value">Hand value: {game.dealerHandValue}</div>
    </div>
    <div class="player1" id="player1">
      {#if player}
        <div class="player-name">{username}</div>
        <div class="hands">
          {#each player.hands as hand}
            {#if player.currentHand.id == hand.id}
              <div class="hand current">
                <div class="cards">
                  {#each hand.cards as card}
                    <Card {card} />
                  {/each}
                </div>
                <div class="value">Hand value: {hand.value}</div>
                <div class="bet">Bet: {hand.bet}</div>
              </div>
            {:else}
              <div class="hand">
                <div class="cards">
                  {#each hand.cards as card}
                    <Card {card} />
                  {/each}
                </div>
                <div class="value">Hand value: {hand.value}</div>
                <div class="bet">Bet: {hand.bet}</div>
              </div>
            {/if}
            <div class="money">Money: {player.money}</div>
          {/each}
        </div>
      {/if}
    </div>
    {#each game.players as player, i}
      {#if player.name != username}
        <div class="player{i + 2}" id="player{i + 2}">
          <div class="player-name">{player.name}</div>
          <div class="hands">
            {#each player.hands as hand}
              <div class="hand">
                <div class="cards">
                  {#each hand.cards as card}
                    <Card {card} />
                  {/each}
                </div>
                <div class="value">Hand value: {hand.value}</div>
                <div class="bet">Bet: {hand.bet}</div>
              </div>
            {/each}
          </div>
          <div class="money">Money: {player.money}</div>
        </div>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .table {
    border-collapse: collapse;
    border-spacing: 0;
    border: 1rem solid #592c28;
    background-color: #2e5955;
    width: 90%;
    height: 50%;
    border-radius: 5rem 5rem 100% 100%;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
  }
  .dealer {
    grid-area: 2 / 3 / 3 / 5;
  }

  .player2 {
    grid-area: 3 / 5 / 4 / 6;
  }

  .player1 {
    grid-area: 4 / 4 / 5 / 5;
  }

  .player3 {
    grid-area: 4 / 3 / 5 / 4;
  }

  .player4 {
    grid-area: 3 / 2 / 4 / 3;
  }
  .hand {
    border: 0.2rem solid #592c28;
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  .current {
    border: 0.2rem solid #eee8aa;
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  .bet-box {
    width: 2.4rem;
    height: 3.6rem;
    background-color: transparent;
    border: 0.25rem solid #f2d857;
    display: inline-block;
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  }

  .left.bet-box {
    /* margin: 0 0 0 2.2rem; */
    transform: rotate(25deg);
  }

  .right.bet-box {
    /* margin: 0 2.2rem 0 0; */
    transform: rotate(-25deg);
  }
  .center.bet-box {
    /* margin: 0 0 2.2rem 0; */
    transform: rotate(0deg);
  }
</style>
