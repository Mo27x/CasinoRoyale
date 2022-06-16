<script lang="ts">
  import { io } from "socket.io-client";
  import {
    Router,
    Route,
    Link,
    createHistory,
    createMemorySource,
  } from "svelte-navigator";
  import { pokerGameMoney, userData, isPlayingValue } from "./store";
  import Settings from "./Settings.svelte";
  import Account from "./Account.svelte";
  import Friends from "./Friends.svelte";
  import Home from "./Home.svelte";
  import Poker from "./Poker.svelte";

  const socket = io();
  let isLogged = true;
  let pokerMoney: number = 0;
  let isPlaying: boolean = false;
  let ids = ["home", "friends", "account", "settings"];
  let user: any;
  let loading = false;
  pokerGameMoney.subscribe((value) => {
    pokerMoney = value;
  });
  userData.subscribe((value) => {
    user = value;
  });
  isPlayingValue.subscribe((value) => {
    isPlaying = value;
  });
  const change = (id: string) => {
    ids.forEach((element) => {
      document.getElementById(element).classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
  };
  const html5History = createHistory(window);
  const memoryHistory = createHistory(createMemorySource());

  const fetchData = async () => {
    loading = true;
    let response = await fetch("/api/user/isLoggedIn");
    let data = await response.json();
    if (data.isLoggedIn) {
      isLogged = true;
    } else {
      isLogged = false;
      loading = false;
    }
    if (isLogged) {
      response = await fetch("/api/user/getUser");
      data = await response.json();
      user = data.user;
      userData.set(user);
      loading = false;
      console.log(user);
    }
  };

  const logout = async () => {
    let response = await fetch("/api/user/logout");
    let data = await response.json();
    if (data.success) {
      isLogged = false;
      user = {};
      window.location.href = "/";
    }
  };
  fetchData();
</script>

<div class="container">
  <header class="header">
    {#if !isLogged}
      <div class="center title">CASINO ROYALE</div>
    {:else}
      <Router primary={false} history={html5History}>
        {#if user}
          <div class="center money">{user.money}</div>
        {/if}
        <div class="left" on:click={() => change("home")}>
          <Link to="/">
            <img src="./icons/casinoroyale.jpg" alt="Logo" class="icon round" />
          </Link>
        </div>
        <div class="right">
          {#if isPlaying}
            <Link to="/">
              <div on:click={() => change("home")}>
                <img src="./icons/back.svg" alt="Go Back" class="icon" />
              </div>
            </Link>
          {/if}
        </div>
      </Router>
    {/if}
  </header>
  {#if isLogged}
    <div class="menu">
      <Router primary={false} history={html5History}>
        <div id="home" class="nav-item active" on:click={() => change("home")}>
          <Link to="/">
            <img src="./icons/home.svg" alt="" class="icon" />
          </Link>
        </div>
        <div id="friends" class="nav-item " on:click={() => change("friends")}>
          <Link to="/friends">
            <img src="./icons/friends.svg" alt="" class="icon" />
          </Link>
        </div>
        <div id="account" class="nav-item" on:click={() => change("account")}>
          <Link to="/account">
            <img src="./icons/account.svg" alt="" class="icon" />
          </Link>
        </div>
        <div id="settings" class="nav-item" on:click={() => change("settings")}>
          <Link to="/settings">
            <img src="./icons/settings.svg" alt="" class="icon" />
          </Link>
        </div>
        <div id="logout" class="nav-item" on:click={() => logout()}>
          <img src="./icons/logout.svg" alt="" class="icon" />
        </div>
      </Router>
    </div>
  {/if}
  <main class="main">
    <Router primary={false} history={html5History}>
      {#if !loading}
        <Route path="" component={Home} {isLogged} {socket} />
        <Route path="friends/*" component={Friends} {socket} />
        <Route path="account" component={Account} {socket} />
        <Route path="settings" component={Settings} {socket} />
        <Route path="poker" component={Poker} {socket} />
      {/if}
    </Router>
  </main>
</div>

<style>
  @media screen and (max-width: 660px) {
    .container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr min-content;
      gap: 0rem 0rem;
      grid-auto-flow: row;
      width: 100%;
      height: 100%;
    }

    .header {
      display: grid;
      place-items: center;
      grid-template-columns: min-content 1fr min-content;
      grid-template-rows: 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      grid-area: 1 / 1 / 2 / 2;
    }

    .header > .left {
      grid-area: 1 / 1 / 2 / 2;
      display: grid;
      place-items: center;
    }

    .header > .center {
      grid-area: 1 / 1 / 2 / 4;
    }

    .header > .right {
      grid-area: 1 / 3 / 2 / 4;
    }

    .title {
      text-align: center;
      font-size: 20pt;
    }
    .money {
      text-align: center;
      font-size: 16pt;
    }

    .menu {
      width: 100%;
      height: fit-content;
      background-color: #c8bfff;
      display: flex;
      grid-area: 3/1/4/2;
    }

    .menu > .nav-item {
      flex: 1;
      display: grid;
      place-items: center;
      border-bottom: solid 0rem #5a5867;
      transition: background-color 300ms, border-bottom-width 300ms;
    }

    .nav-item > :global(a) {
      text-decoration: none;
    }

    .menu > .nav-item.active {
      border-bottom-width: 0.4rem;
    }
    .icon {
      width: 2.5rem;
      height: 2.5rem;
    }
    .main {
      grid-area: 2 / 1 / 3 / 2;
      margin: 0.05rem 0 0.25rem 0;
    }
    .round {
      border-radius: 50%;
      padding: 0.05rem;
    }
  }
</style>
