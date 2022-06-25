<script lang="ts">
  import { Router, Link, link, useResolvable } from "svelte-navigator";
  import {
    pokerGameMoney,
    blackjackGameMoney,
    isPlayingValue,
    userData,
  } from "./store";
  let isLoggingIn = true;
  export let isLogged: boolean;
  export let socket: any;
  let user: any;
  let isPlaying;
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

  let loginErrors = {
    email: "",
    password: "",
  };

  let signUpErrors = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const changeMode = () => {
    isLoggingIn = !isLoggingIn;
  };
  let pokerMoney = user
    ? Math.ceil(user.money / 10) - (Math.ceil(user.money / 10) % 100)
    : 0;
  let blackjackMoney = user
    ? Math.ceil(user.money / 10) - (Math.ceil(user.money / 10) % 100)
    : 0;

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
      if (data.errors) {
        data.errors.forEach((error) => {
          if (error.param == "email") {
            loginErrors.email = error.msg;
            document.getElementById("email-error").innerHTML = error.msg;
          }
          if (error.param == "password") {
            loginErrors.password = error.msg;
            document.getElementById("password-error").innerHTML = error.msg;
          }
        });
      }
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
      if (data.errors) {
        data.errors.forEach((error: any) => {
          if (error.param == "username") {
            signUpErrors.username = error.msg;
            document.getElementById("username-error").innerHTML = error.msg;
          }
          if (error.param == "email") {
            signUpErrors.email = error.msg;
            document.getElementById("email-error").innerHTML = error.msg;
          }
          if (error.param == "password") {
            signUpErrors.password = error.msg;
            document.getElementById("password-error").innerHTML = error.msg;
          }
          if (error.param == "passwordConfirm") {
            signUpErrors.passwordConfirm = error.msg;
            document.getElementById("passwordConfirm-error").innerHTML =
              error.msg;
          }
        });
      }
    }
  };

  const blackjackLink = useResolvable("blackjack");

  const deleteError = (error: string) => {
    error = "";
  };
  userData.subscribe((data) => {
    user = data;
  });
  pokerGameMoney.subscribe((value) => {
    pokerMoney = value;
  });
  blackjackGameMoney.subscribe((value) => {
    blackjackMoney = value;
  });
  isPlayingValue.subscribe((value) => {
    isPlaying = value;
  });
  isPlayingValue.set(false);
  if (user) {
    pokerGameMoney.set(
      Math.ceil(user.money / 10) - (Math.ceil(user.money / 10) % 100)
    );
    blackjackGameMoney.set(
      Math.ceil(user.money / 10) - (Math.ceil(user.money / 10) % 100)
    );
  }
  const updatePokerMoney = () => {
    pokerGameMoney.set(pokerMoney);
  };
  const updateBlackjackMoney = () => {
    blackjackGameMoney.set(blackjackMoney);
  };
  socket.emit("leaveRoom");
</script>

{#if !isLogged}
  <div class="sign">
    <div class="image">
      <img src="./icons/cards.svg" alt="Cards" class="logo" />
    </div>
    <div class="form">
      <div class="all-space">
        <div class="all-width">
          {#if !isLoggingIn}
            <div class="welcome">WELCOME!</div>
            <div class="verticalMargin">Create your account</div>
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
                  on:input={() => deleteError(signUpErrors.username)}
                />
              </div>
              <div class="error" id="username-error">
                {signUpErrors.username}
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
                  on:input={() => deleteError(signUpErrors.email)}
                />
              </div>
              <div class="error" id="email-error">{signUpErrors.email}</div>
            </div>
            <div class="insert">
              <label for="password">Password</label>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  bind:value={signUpData.password}
                  on:input={() => deleteError(signUpErrors.password)}
                />
              </div>
              <div class="error" id="password-error">
                {signUpErrors.password}
              </div>
            </div>
            <div class="insert">
              <label for="passwordConfirm">Confirm Password</label>
              <div>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  required
                  bind:value={signUpData.passwordConfirm}
                  on:input={() => deleteError(signUpErrors.passwordConfirm)}
                />
              </div>
              <div class="error" id="passwordConfirm-errors">
                {signUpErrors.passwordConfirm}
              </div>
            </div>
            <div class="right">
              <button class="submit" on:click={() => signUp()}>Create</button>
            </div>
            <div>
              Already have an account? <button
                class="option"
                on:click={changeMode}>Login</button
              >
            </div>
          {:else}
            <div class="welcome">WELCOME BACK!</div>
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
                    on:input={() => deleteError(loginErrors.email)}
                  />
                </div>
                <div class="error" id="email-error">{loginErrors.email}</div>
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
                    on:input={() => deleteError(loginErrors.password)}
                  />
                </div>
                <div class="error" id="password-error">
                  {loginErrors.password}
                </div>
              </div>
              <!-- <div><a href="#" class="none">Forgot password?</a></div> -->
              <div class="insert">
                <div class="send">
                  <div class="right">
                    <button class="submit" on:click={() => login()}
                      >Login</button
                    >
                  </div>
                </div>
              </div>
            </div>
            <div>
              New here? <button class="option" on:click={changeMode}
                >Sign Up</button
              > and start playing
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <Router>
    <div>
      <div class="center-items">
        <div class="space-between">
          <div class="sayHi">Hi {user.username}</div>
          <div class="streak">Your streak is: {user.streak}</div>
        </div>
      </div>
      <div class="games">
        <div class="game">
          <div class="name">Poker</div>
          <div class="center-items">
            <div class="space-between">How much you wanna play with?</div>
          </div>
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
                on:change={updatePokerMoney}
              />
            </div>
            <div><output for="money" id="output">{pokerMoney}</output></div>
          </div>
          <div class="container">
            <div class="tutorial verticallyCenter">
              <a
                href="https://www.youtube.com/watch?v=pSRGErzzIo4"
                target="_blank"
                rel="noopener noreferrer"
                class="choice verticallyCenter"
              >
                Tutorial
              </a>
            </div>
            <div class="play verticallyCenter">
              <Link to="poker" class="link">
                <button class="choice primary">Play</button>
              </Link>
              <!-- <button class="choice primary">
                <Link to="poker" class="link">Play</Link>
              </button> -->
            </div>
          </div>
        </div>
        <div class="game">
          <div class="name">Blackjack</div>
          <div class="center-items">
            <div class="space-between">How much you wanna play with?</div>
          </div>
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
                on:change={updateBlackjackMoney}
              />
            </div>
            <div><output for="money" id="output">{blackjackMoney}</output></div>
          </div>
          <div class="container">
            <div class="tutorial verticallyCenter">
              <a
                href="https://www.youtube.com/watch?v=PljDuynF-j0"
                target="_blank"
                rel="noopener noreferrer"
                class="choice verticallyCenter"
              >
                Tutorial
              </a>
            </div>
            <Router>
              <div class="play verticallyCenter">
                <button class="choice primary">
                  <Link to="blackjack" class="link">Play</Link>
                </button>
              </div>
            </Router>
          </div>
        </div>
      </div>
    </div>
  </Router>
{/if}

<style>
  .sign {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    width: 100%;
    height: 100%;
    place-items: center;
  }

  .form {
    display: grid;
    place-items: center;
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    height: 100%;
  }

  .image {
    display: grid;
    place-items: center;
    grid-area: 1 / 2 / 2 / 3;
    width: 100%;
    height: 100%;
  }

  .all-space {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .all-width {
    width: 100%;
  }

  :global(a) {
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: #eeeeee;
  }
  .welcome {
    font-size: 20pt;
    text-align: center;
  }

  .verticalMargin {
    margin: 0.5rem 0 0.5rem 0;
  }

  .logo {
    width: 90%;
    height: auto;
  }

  .verticallyCenter {
    display: grid;
    place-items: center;
  }

  .insert {
    width: 100%;
    margin: 0 0 0.5rem 0;
  }

  label {
    font-size: 16pt;
  }
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 70%;
    height: 1.75rem;
    background-color: #5a5867;
    border-color: transparent;
    border-radius: 0.5rem;
    color: #eeeeee;
    caret-color: #eeeeee;
    font-size: 16pt;
  }
  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="password"]:focus {
    background-color: #5a5867;
    border-color: transparent;
    color: #eeeeee;
    caret-color: #eeeeee;
  }

  .error {
    color: #ff0000;
    font-size: 0.8rem;
    margin: 0.5rem 0 0.5rem 0;
  }
  button.submit {
    font-family: "Play";
    font-size: 16pt;
    width: 30%;
    height: 2rem;
    background-color: #5a5867;
    border-color: transparent;
    color: #eeeeee;
    border-radius: 0.5rem;
  }

  .send {
    text-align: center;
    width: 70%;
  }

  input[type="range"] {
    accent-color: #ffae82;
    width: 90%;
  }

  .option {
    font-family: "Play";
    font-size: 14pt;
    background: none;
    border: none;
    text-decoration: underline;
    color: #eeeeee;
    padding: 0rem;
    margin: 0rem;
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

  .streak {
    font-size: 14pt;
    width: 8.5rem;
    height: 1.75rem;
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
    font-size: 14pt;
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
    font-size: 16pt;
    margin: 0.5rem 0 0 0;
    text-align: center;
  }

  .choice {
    font-size: 14pt;
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

  .play > :global(a) {
    display: grid;
    place-items: center;
  }
  .sayHi {
    font-size: 16pt;
  }
</style>
