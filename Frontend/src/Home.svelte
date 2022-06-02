<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
  import Poker from "./Poker.svelte";
  let isLoggingIn = true;
  export let isLogged;
  let loginData = {
    email: "",
    password: "",
  };

  let signUpData = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const changeMode = () => {
    isLoggingIn = !isLoggingIn;
  };
  export let user;
  let pokerMoney = user.money / 2;
  let blackjackMoney = user.money / 2;
  let tradeMoney = user.money / 2;

  const login = async () => {
    let response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accpept: "application/json",
      },
      mode: "same-origin",
      redirect: "follow",
      credentials: "same-origin",
      body: JSON.stringify(loginData),
    });
    let data = await response.json();
    if (data.success) {
      window.location.pathname = "/";
    } else {
      alert(data.message);
    }
  };

  const signUp = async () => {
    let response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    });
    let data = await response.json();
    if (data.success) {
      window.location.pathname = "/";
    } else {
      alert(data.message);
    }
  };
</script>

{#if !isLogged}
  <div class="cardsImg">
    <img src="./icons/casinoroyale.jpg" alt="Cards" class="logo" />
  </div>
  {#if !isLoggingIn}
    <div class="welcome">WELCOME!</div>
    <div class="verticallyCenter">
      <div class="verticalMargin">Create your account</div>
      <div>
        <div class="insert">
          <label for="username">Username</label>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              pattern="[^\s]+"
              required
              bind:value={signUpData.username}
            />
          </div>
        </div>
        <div class="insert">
          <label for="email">Email</label>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              required
              bind:value={signUpData.email}
            />
          </div>
        </div>
        <div class="insert">
          <label for="passwd">Password</label>
          <div>
            <input
              type="password"
              name="passwd"
              id="passwd"
              required
              bind:value={signUpData.password}
            />
          </div>
        </div>
        <div class="insert">
          <label for="passwdConfirm">Confirm Password</label>
          <div>
            <input
              type="password"
              name="passwdConfirm"
              id="passwdConfirm"
              required
              bind:value={signUpData.passwordConfirm}
            />
          </div>
        </div>
        <div class="right">
          <button class="submit" on:click={() => signUp()}>Create</button>
        </div>
      </div>
      <div>
        Already have an account? <button class="option" on:click={changeMode}
          >Login</button
        >
      </div>
    </div>
  {:else}
    <div class="welcome">WELCOME BACK!</div>
    <div class="verticallyCenter">
      <div class="verticalMargin">Login to your account</div>
      <div>
        <div class="insert">
          <label for="email">Email</label>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              required
              bind:value={loginData.email}
            />
          </div>
        </div>
        <div class="insert">
          <label for="passwd">Password</label>
          <div>
            <input
              type="password"
              name="passwd"
              id="passwd"
              required
              bind:value={loginData.password}
            />
          </div>
        </div>
        <div><a href="#" class="none">Forgot password?</a></div>
        <div class="right">
          <button class="submit" on:click={() => login()}>Login</button>
        </div>
      </div>
      <div>
        New here? <button class="option" on:click={changeMode}>Sign Up</button> and
        start playing
      </div>
    </div>
  {/if}
{:else}
  <Router>
    <div>
      <div class="center-items">
        <div class="space-between">
          <div>Hi {user.username}</div>
          <div><button class="daily_prize">Daily Prize</button></div>
        </div>
      </div>
      <div class="games">
        <div class="game">
          <div class="name">Poker</div>
          <div class="top-left-margin">How much you wanna play with?</div>
          <div class="center">
            <div>
              <input
                type="range"
                name="money"
                id="money"
                min="200"
                max={user.money}
                step="100"
                bind:value={pokerMoney}
              />
            </div>
            <div><output for="money" id="output">{pokerMoney}</output></div>
          </div>
          <div class="container">
            <div class="tutorial verticallyCenter">
              <button class="choice">Tutorial</button>
            </div>
            <div class="play verticallyCenter">
              <button class="choice primary"
                ><Link to="/poker" class="link">Play</Link></button
              >
            </div>
            <Route path="/poker" component={Poker} />
          </div>
        </div>
        <div class="game">
          <div class="name">Blackjack</div>
          <div class="top-left-margin">How much you wanna play with?</div>
          <div class="center">
            <div>
              <input
                type="range"
                name="money"
                id="money"
                min="200"
                max={user.money}
                step="100"
                bind:value={blackjackMoney}
              />
            </div>
            <div><output for="money" id="output">{blackjackMoney}</output></div>
          </div>
          <div class="container">
            <div class="tutorial verticallyCenter">
              <button class="choice">Tutorial</button>
            </div>
            <div class="play verticallyCenter">
              <button class="choice primary">Play</button>
            </div>
          </div>
        </div>
        <div class="game">
          <div class="name">Trade</div>
          <div class="top-left-margin">How much you wanna play with?</div>
          <div class="center">
            <div>
              <input
                type="range"
                name="money"
                id="money"
                min="200"
                max={user.money}
                step="100"
                bind:value={tradeMoney}
              />
            </div>
            <div><output for="money" id="output">{tradeMoney}</output></div>
          </div>
          <div class="container">
            <div class="tutorial verticallyCenter">
              <button class="choice">Tutorial</button>
            </div>
            <div class="play verticallyCenter">
              <button class="choice primary">Play</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Router>
{/if}

<style>
  @media screen and (max-width: 660px) {
    :global(a) {
      text-decoration: none;
      color: #eeeeee;
    }
    .welcome {
      font-size: 18pt;
      text-align: center;
    }

    .verticalMargin {
      margin: 0.5rem 0 0.5rem 0;
    }

    .cardsImg {
      text-align: center;
      margin: 0.5rem 0 0.5rem 0;
    }

    .logo {
      height: 10rem;
      width: 10rem;
      border-radius: 50%;
    }

    .verticallyCenter {
      display: grid;
      place-items: center;
    }

    .insert {
      margin: 0 0 0.5rem 0;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 15rem;
      height: 1.25rem;
      background-color: #5a5867;
      border-color: transparent;
      border-radius: 0.5rem;
      color: #eeeeee;
      caret-color: #eeeeee;
    }
    button.submit {
      font-family: "Play";
      font-size: 12pt;
      width: 5rem;
      height: 1.75rem;
      background-color: #5a5867;
      border-color: transparent;
      color: #eeeeee;
      border-radius: 0.5rem;
      margin: 0 0 0.5rem 0;
    }

    input[type="range"] {
      accent-color: #ffae82;
      width: 90%;
    }

    .none {
      background: none;
      border: none;
      text-decoration: none;
      color: #eeeeee;
    }

    .option {
      font-family: "Play";
      font-size: 12pt;
      background: none;
      border: none;
      text-decoration: underline;
      color: #eeeeee;
    }
    .left {
      text-align: left;
    }
    .right {
      text-align: right;
    }
    .center {
      text-align: center;
    }

    .daily_prize {
      font-size: 12pt;
      width: 7.5rem;
      height: 1.75rem;
      background-color: #5a5867;
      border-color: transparent;
      color: #eeeeee;
      border-radius: 0.5rem;
    }
    .center-items {
      display: grid;
      place-items: center;
    }
    .space-between {
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12pt;
    }
    .games {
      display: grid;
      place-items: center;
    }
    .game {
      width: 90%;
      height: 9.5rem;
      background-color: #5a5867;
      border-radius: 0.5rem;
      margin: 1rem 0 0 0;
    }

    .name {
      font-size: 14pt;
      margin: 0.5rem 0 0 0;
      text-align: center;
    }

    .top-left-margin {
      margin: 0.5rem 0 0 0.5rem;
    }

    .choice {
      font-size: 12pt;
      width: 75%;
      height: 2rem;
      background-color: transparent;
      border: 0.2rem solid #484656;
      color: #eeeeee;
      border-radius: 0.5rem;
      text-decoration: none;
    }

    .primary {
      background-color: #484656;
    }
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-auto-columns: 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      margin: 0.5rem 0 0 0;
    }

    .tutorial {
      grid-area: 1 / 1 / 2 / 2;
    }

    .play {
      grid-area: 1 / 2 / 2 / 3;
    }
  }
</style>
