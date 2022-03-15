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
  let loggedIn = true;
</script>

<div class="container">
  <header class="header">CASINO ROYALE</header>
  <aside class="sidebar">
    <Router>
      <div class="home">
        <Link to="/">
          <img class="icon" src="./icons/home.svg" alt="Home" />
        </Link>
      </div>
      <div class="casino">
        <Link to="poker">
          <img class="icon" src="./icons/casino.svg" alt="Home" />
        </Link>
      </div>
      <div class="friends">
        <Link to="friends">
          <img src="./icons/friends.svg" alt="Friends" class="icon" />
        </Link>
      </div>
      <div class="account">
        <Link to="account">
          <img class="icon" src="./icons/account.svg" alt="Account" />
        </Link>
      </div>
      <div class="support">
        <Link to="support">
          <img src="./icons/contact_support.svg" alt="support" class="icon" />
        </Link>
      </div>
      <div class="settings">
        <Link to="settings">
          <img src="./icons/settings.svg" alt="Settings" class="icon" />
        </Link>
      </div>
      <Link to="logout">
        <div class="logout">
          <img src="./icons/logout.svg" alt="Logout" class="icon" />
        </div>
      </Link>
    </Router>
  </aside>
  <div class="main">
    {#await fetchUser then data}
      {#if typeof data != "undefined"}
        <svelte:component this={Player} {...data} />
        <Router>
          <Route path="/" component={Home} {loggedIn} />
          <Route path="poker" component={Poker} {socket} />
        </Router>
      {/if}
    {/await}
  </div>
</div>

<style>
</style>
