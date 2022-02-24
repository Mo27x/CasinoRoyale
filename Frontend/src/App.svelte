<script lang="ts">
  import { io } from "socket.io-client";
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./Home.svelte";
  import Player from "./Player.svelte";
  import Poker from "./Poker.svelte";
  const socket = io();
  const fetchUser = (async () => {
    const res = await fetch("http://localhost:3000/data");
    return res.json();
  })();
</script>

<div class="entire">
  <center>
    <h1>Casino Royale</h1>
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="poker">Poker</Link>
      </nav>
      <div>
        <Route path="/" component={Home} />
        <Route path="poker" component={Poker} {socket} />
      </div>
    </Router>
    {#await fetchUser}
      <p>...waiting</p>
    {:then data}
      {console.log(data)}
      <svelte:component this={Player} {...data} />
    {/await}
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
</style>
