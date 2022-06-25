<script lang="ts">
  import { io } from "socket.io-client";
  import {
    Router,
    Route,
    Link,
    createHistory,
    createMemorySource,
    // useNavigate,
  } from "svelte-navigator";
  import { pokerGameMoney, userData, isPlayingValue } from "./store";
  import Settings from "./Settings.svelte";
  import Account from "./Account.svelte";
  import Friends from "./Friends.svelte";
  import Home from "./Home.svelte";
  import Poker from "./Poker.svelte";
  import ChangeUsername from "./ChangeUsername.svelte";
  import ChangePassword from "./ChangePassword.svelte";
  import NotFound from "./NotFound.svelte";
  import Blackjack from "./Blackjack.svelte";

  const socket = io();
  // const navigate = useNavigate();
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
          <div class="inner">
            <img src="./icons/casinoroyale.jpg" alt="Logo" class="icon round" />
            <div class="text"><div class="title">CASINO ROYALE</div></div>
          </div>
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
        <div
          id="home"
          class="nav-item home active"
          on:click={() => change("home")}
        >
          <Link to="/">
            <div class="inner">
              <img src="./icons/home.svg" alt="" class="icon" />
              <div class="text"><div class="name">HOME</div></div>
            </div>
          </Link>
        </div>
        <div
          id="friends"
          class="nav-item friends"
          on:click={() => change("friends")}
        >
          <Link to="/friends">
            <div class="inner">
              <img src="./icons/friends.svg" alt="" class="icon" />
              <div class="text"><div class="name">FRIENDS</div></div>
            </div>
          </Link>
        </div>
        <div
          id="account"
          class="nav-item account"
          on:click={() => change("account")}
        >
          <Link to="/account" class="inner">
            <div class="inner">
              <img src="./icons/account.svg" alt="" class="icon" />
              <div class="text"><div class="name">ACCOUNT</div></div>
            </div>
          </Link>
        </div>
        <div
          id="settings"
          class="nav-item settings"
          on:click={() => change("settings")}
        >
          <Link to="/settings">
            <div class="inner">
              <img src="./icons/settings.svg" alt="" class="icon" />
              <div class="text"><div class="name">SETTINGS</div></div>
            </div>
          </Link>
        </div>
        <div id="logout" class="nav-item logout" on:click={() => logout()}>
          <div class="inner">
            <img src="./icons/logout.svg" alt="" class="icon" />
            <div class="text"><div class="name">LOGOUT</div></div>
          </div>
        </div>
      </Router>
    </div>
  {/if}
  <main class="main">
    <Router primary={false} history={html5History}>
      {#if !loading}
        <Route path="/" component={Home} {isLogged} {socket} />
        <Route path="friends/*" component={Friends} {socket} />
        <Route path="account" component={Account} {socket} />
        <Route path="settings/*" component={Settings} {socket} />
        <Route path="poker" component={Poker} {socket} />
        <Route path="blackjack" component={Blackjack} {socket} />
        <Route component={NotFound} {socket} />
        <Route
          path="settings/changeUsername"
          component={ChangeUsername}
          {socket}
        />
        <Route
          path="settings.changePassword"
          componet={ChangePassword}
          {socket}
        />
      {/if}
    </Router>
  </main>
</div>

<style>
  .title {
    text-align: center;
    font-size: 20pt;
    color: #e6e3f8;
  }
  .money {
    text-align: center;
    font-size: 16pt;
  }

  .menu > .nav-item {
    border-left: solid 0.4rem transparent;
    transition: background-color 300ms, border-bottom-width 300ms;
  }

  .nav-item > :global(a) {
    text-decoration: none;
    width: 100%;
    height: 100%;
  }

  .menu > .nav-item.active {
    border-left-color: #ffae82;
  }
  .icon {
    width: 3rem;
    height: 3rem;
    margin-left: 1rem;
  }
  .round {
    border-radius: 50%;
    padding: 0.05rem;
  }
  .container {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-template-rows: 4rem 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    height: 100%;
    width: 100%;
  }

  .main {
    grid-area: 2 / 2 / 3 / 3;
  }
  .menu {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: 2 / 1 / 3 / 2;
    background-color: #5a5867;
    height: 100%;
    width: 100%;
  }

  .home {
    grid-area: 1 / 1 / 2 / 2;
    display: flex;
    align-items: center;
  }

  .friends {
    grid-area: 2 / 1 / 3 / 2;
    display: flex;
    align-items: center;
  }

  .account {
    grid-area: 3 / 1 / 4 / 2;
    display: flex;
    align-items: center;
  }

  .settings {
    grid-area: 4 / 1 / 5 / 2;
    display: flex;
    align-items: center;
  }

  .logout {
    grid-area: 7 / 1 / 8 / 2;
    display: flex;
    align-items: center;
  }

  .inner {
    display: grid;
    grid-template-columns: 4rem 1fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    width: 100%;
    height: 100%;
    align-items: center;
  }

  .inner > img {
    width: 3rem;
    height: 3rem;
    grid-area: 1 / 1 / 2 / 2;
  }
  .inner > .text {
    grid-area: 1 / 2 / 2 / 3;
    font-size: 14pt;
    font-weight: bold;
    color: #eee;
  }

  .inner > .text:hover {
    color: #fff;
  }
  .inner > .text > .name {
    margin-left: 1rem;
  }

  .header {
    display: grid;
    grid-template-columns: 20% 1fr min-content;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: 1 / 1 / 2 / 3;
    place-items: center;
    font-size: 18pt;
  }

  .header > .left {
    display: flex;
    align-items: center;
    grid-area: 1 / 1 / 2 / 2;
    height: 100%;
    width: 100%;
    background-color: #5a5867;
  }

  .header > .center {
    grid-area: 1 / 2 / 2 / 3;
  }
  .header > .right {
    grid-area: 1/3/2/4;
  }
</style>
