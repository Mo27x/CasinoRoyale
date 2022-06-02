<script lang="ts">
  export let suit: string = "";
  export let num: string | number = -1;
  export let color: string = "";
</script>

{#if suit != "" && num != -1}
  <div class="card {color}">
    <div class="card-inner">
      <div class="top-left">
        <div>{num}</div>
        <div>{@html suit}</div>
      </div>
      <div class="center">{@html suit}</div>
      <div class="bottom-right">
        <div>{num}</div>
        <div>{@html suit}</div>
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
    font-size: 7.5pt;
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
  }

  .bottom-right {
    grid-area: 1/3/2/4;
    transform: rotate(180deg);
  }

  .center {
    display: grid;
    place-items: center;
    grid-area: 1/2/2/3;
    font-size: 24pt;
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
