<script lang="ts">
  import { Link, Route } from "svelte-navigator";
  import Friendships from "./Friendships.svelte";
  import Requests from "./Requests.svelte";
  import Search from "./Search.svelte";
  import { userData } from "./store";

  let user: any;
  export let socket: any;

  let ids = ["friendships", "requests", "search"];
  const change = (id: string, index: number) => {
    ids.forEach((element) => {
      document.getElementById(element).classList.remove("selected");
    });
    document.getElementById(id).classList.add("selected");
  };
  userData.subscribe((value) => {
    user = value;
  });
  socket.emit("leaveRoom");
</script>

<div class="container">
  <div class="options">
    <div
      id="friendships"
      class="option selected"
      on:click={() => change("friendships", 0)}
    >
      <Link to="friendships">Friendships</Link>
    </div>
    <div id="requests" class="option" on:click={() => change("requests", 1)}>
      <Link to="requests">Requests</Link>
    </div>
    <div id="search" class="option" on:click={() => change("search", 2)}>
      <Link to="search">Search</Link>
    </div>
  </div>
  <div class="content-area">
    <Route path="" component={Friendships} {user} />
    <Route path="friendships" component={Friendships} {user} />
    <Route path="requests" component={Requests} {user} />
    <Route path="search" component={Search} {user} />
  </div>
</div>

<style>
  @media screen and (max-width: 660px) {
    :global(a) {
      text-decoration: none;
    }
    .container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      width: 100%;
      height: 100%;
    }

    .content-area {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      grid-area: 2 / 1 / 3 / 2;
    }

    .options {
      display: flex;
      justify-content: space-evenly;
      grid-area: 1 / 1 / 2 / 2;
    }
    .option {
      color: #eeeeee;
      background: none;
      text-decoration: none;
      border: none;
      font-size: 15pt;
    }
    .selected {
      text-decoration: underline 0.25rem;
    }
  }
</style>
