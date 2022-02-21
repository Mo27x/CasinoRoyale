<script lang="ts">
  export let username: string;
  export let money: number;
</script>

<div class="player">
  <div>{username}</div>
  <div>{money}</div>
</div>

<style>
  .player {
    border: 0.5rem solid blueviolet;
  }
</style>
