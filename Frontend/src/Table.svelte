<script lang="ts">
  import Card from "./Card.svelte";
  let game = { pot: 9999999 };
</script>

<div class="table">
  <div class="pot">
    <div>POT</div>
    <div>{game.pot}</div>
  </div>
  <div class="card-place">
    <div class="cards">
      <Card num="10" suit="&diamondsuit;" color="red" />
      <Card num="A" suit="&spadesuit;" color="black" />
      <Card num="Q" suit="&heartsuit;" color="red" />
      <Card num="7" suit="&clubsuit;" color="black" />
      <Card num="9" suit="&spadesuit;" color="black" />
    </div>
  </div>
  <div class="player player1">
    <div class="top">Player1</div>
    <div class="center player-cards">
      <Card />
      <Card />
    </div>
    <div class="bottom">999999</div>
  </div>
  <div class="player player2">
    <div class="top">Player2</div>
    <div class="center player-cards">
      <Card />
      <Card />
    </div>
    <div class="bottom">999999</div>
  </div>
  <div class="player player3">
    <div class="top">Player3</div>
    <div class="center player-cards">
      <Card />
      <Card />
    </div>
    <div class="bottom">999999</div>
  </div>
  <div class="player player4">
    <div class="top">Player4</div>
    <div class="center player-cards">
      <Card />
      <Card />
    </div>
    <div class="bottom">999999</div>
  </div>
  <div class="player player5">
    <div class="top">Player5</div>
    <div class="center player-cards">
      <Card />
      <Card />
    </div>
    <div class="bottom">999999</div>
  </div>
  <div class="player player6">
    <div>Player6</div>
    <div class="player-cards">
      <Card />
      <Card />
    </div>
    <div>999999</div>
  </div>
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
    }

    .player2 {
      grid-area: 4 / 1 / 5 / 2;
      width: 96%;
      height: 96%;
    }

    .player3 {
      grid-area: 2 / 1 / 3 / 2;
      width: 96%;
      height: 96%;
    }

    .player4 {
      grid-area: 1 / 2 / 2 / 3;
      width: 96%;
      height: 96%;
    }

    .player5 {
      grid-area: 2 / 3 / 3 / 4;
      width: 96%;
      height: 96%;
    }

    .player6 {
      grid-area: 4 / 3 / 5 / 4;
      width: 96%;
      height: 96%;
    }

    .player-cards {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
</style>
