<script lang="ts">
  export let suit: string = "";
  export let num: number | string = -1;
  export let color: string = "";
</script>

{#if suit != "" && num != -1}
  <div class="card {color}">
    <h1>{num}</h1>
    <p class="figures">{@html suit}</p>
    <h1>{num}</h1>
  </div>
{/if}

<style>
  .red {
    color: #ec6e69;
  }
  .black {
    color: #515260;
  }

  .card {
    height: 70px;
    width: 50px;
    border-radius: 5px;
    display: inline-block;
    position: relative;
    background-color: white;
    font-family: "Houschka Rounded";
  }
  .card h1 {
    font-size: 10px;
    text-align: center;
    position: absolute;
    margin: 0, 5rem;
  }
  .figures {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10%;
    left: 43%;
    transform: translateX(-50%) translateY(-50%);
    margin-top: 15%;
    text-align: center;
    font-size: 3em;
  }
  div > h1:first-child {
    top: 5px;
    left: 5px;
  }
  div > h1:last-child {
    bottom: 5px;
    right: 5px;
    transform: rotatez(180deg);
  }
</style>
