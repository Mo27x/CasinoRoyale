<script lang="ts">
  let suit: string = "";
  let value: string | number = -1;
  export let card: any = {
    suit: suit,
    rank: {
      name: "",
      value: value,
    },
  };
  let color: string = "";
  const getColor = () => {
    if (card.suit == "&spadesuit;" || card.suit == "&clubsuit;") {
      color = "black";
    } else {
      color = "red";
    }
  };
  if (card.suit != "" && card.rank.value != -1) {
    getColor();
  }
  if (!card.suit.startsWith("&") && !card.suit.endsWith(";")) {
    card.suit = "&" + card.suit + ";";
  }
</script>

{#if card.suit != "" && card.rank.value != -1}
  <div class="card {color}">
    <div class="card-inner">
      <div class="top-left">
        <div>{card.rank.value}</div>
        <div>{@html card.suit}</div>
      </div>
      <div class="center">{@html card.suit}</div>
      <div class="bottom-right">
        <div>{card.rank.value}</div>
        <div>{@html card.suit}</div>
      </div>
    </div>
  </div>
{:else}
  <div class="card stripes" />
{/if}

<style>
  .card {
    position: relative;
    display: inline-block;
    width: 2.4rem;
    height: 3rem;
    background: #ffffff;
    text-align: center;
    padding: 0;
    margin: 0;
    border: 0.2rem solid #ffffff;
    border-radius: 0.2rem;
  }
  .card-inner {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr;
    gap: 0em 0em;
    grid-auto-flow: row;
    width: 100%;
    height: 100%;
  }

  .top-left {
    grid-area: 1/1/2/2;
    font-size: 50%;
  }

  .bottom-right {
    grid-area: 1/3/2/4;
    transform: rotate(180deg);
    font-size: 50%;
  }

  .center {
    display: grid;
    place-items: center;
    grid-area: 1/2/2/3;
    font-size: 100%;
  }

  .red {
    color: #ff0000;
  }

  .black {
    color: #000000;
  }
  .stripes {
    background-image: repeating-linear-gradient(
      -45deg,
      #8b89ff 0rem,
      #8b89ff 0.2rem,
      #6765ff 0.2rem,
      #6765ff 0.4rem
    );
  }
</style>
