<script lang="ts">
  import { Link, Route } from "svelte-navigator";
  import ChangePassword from "./ChangePassword.svelte";
  import ChangeUsername from "./ChangeUsername.svelte";
  import { userData } from "./store";
  let user: any;

  userData.subscribe((data) => {
    user = data;
  });
  export let socket: any;
  socket.emit("leaveRoom");

  const deleteAccount = async () => {
    let response = await fetch("/api/deleteAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
      }),
    });
    let data = await response.json();
    if (data.success) {
      window.location.href = "/";
    }
  };
</script>

<div>
  <div class="box">
    <div class="section">
      <div class="title">Change username</div>
      <hr />
      <div class="content">
        <Link to="changeUsername">Change username</Link>
      </div>
    </div>
  </div>
  <div class="box">
    <div class="section">
      <div class="title">Change password</div>
      <hr />
      <div class="content">
        <Link to="changePassword">Change password</Link>
      </div>
    </div>
  </div>
  <div class="box">
    <div class="section">
      <div class="title red">Delete account</div>
      <hr class="hr-red" />
      <div class="text">
        Once you delete your account, there is no going back
      </div>
      <div class="content">
        <button class="red" on:click={() => deleteAccount()}>
          Delete your account
        </button>
      </div>
    </div>
  </div>
  <div class="test">
    <!-- <Route path="" component={ChangeUsername} {socket} /> -->
    <!-- <Route path="changeUsername" componet={ChangeUsername} {socket} /> -->
    <!-- <Route path="ChagePassword" component={ChangePassword} {socket} /> -->
  </div>
</div>

<style>
  .test {
    width: 100%;
    height: 100%;
  }
  :global(a) {
    text-decoration: none;
  }
  .title {
    font-size: 16pt;
  }
  .box {
    display: grid;
    place-items: center;
  }
  .section {
    display: grid;
    width: 90%;
    margin: 1rem 0 0 0;
  }
  hr {
    padding: 0;
    margin: 0;
    width: 100%;
    margin: 0 0 0.5rem 0;
  }
  button {
    background: none;
    border: none;
    background-color: #5a5867;
    font-size: 12pt;
    width: 12rem;
    height: 2rem;
    color: #eeeeee;
    border-radius: 0.5rem;
    margin: 0.5rem 0 0 0;
  }
  .red {
    color: #973838;
  }
  .text {
    font-size: 11pt;
  }
</style>
