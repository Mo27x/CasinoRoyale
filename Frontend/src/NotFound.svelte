<script lang="ts">
  import { Link } from "svelte-navigator";
  export let socket: any;
  socket.emit("leaveRoom");
</script>

<div class="container"><Link to="">Go To Home</Link></div>

<style>
  @media screen and (max-width: 660px) {
    .container {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      font-size: 18pt;
      color: #eeeeee;
    }
    :global(a) {
      text-decoration: none;
    }
  }
</style>
