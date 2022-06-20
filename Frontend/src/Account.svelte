<script lang="ts">
  import { userData } from "./store";
  export let socket: any;
  let user: any;
  userData.subscribe((data: any) => {
    user = data;
  });

  const resizeEmail = (email: string) => {
    let shortEmail = "";
    shortEmail += email[0];
    shortEmail += "***";
    shortEmail += email[email.indexOf("@") - 1];
    shortEmail += "@";
    shortEmail += email[email.indexOf("@") + 1];
    shortEmail += "***";
    shortEmail += email[email.lastIndexOf(".") - 1];
    shortEmail += ".";
    for (let i = email.lastIndexOf(".") + 1; i < email.length; i++) {
      shortEmail += email[i];
    }
    return shortEmail;
  };
  socket.emit("leaveRoom");
</script>

<div>
  <div class="center"><div class="history">{user.username}'s history</div></div>
  <div class="box">
    <div class="section">
      <div class="title">GENERAL</div>
      <div class="fit"><hr /></div>
      <div class="box">
        <div class="info">
          <div class="field">Username</div>
          <div class="value"><div class="center">{user.username}</div></div>
        </div>
      </div>
      <div class="box">
        <div class="info">
          <div class="field">email</div>
          <div class="value">
            <div class="center">{resizeEmail(user.email)}</div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="info">
          <div class="field">Money</div>
          <div class="value"><div class="center">{user.money}</div></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">POKER</div>
      <hr />
      <div class="box">
        <div class="info">
          <div class="field">WINS</div>
          <div class="value">10</div>
        </div>
      </div>
      <div class="box">
        <div class="info">
          <div class="field">GAMES</div>
          <div class="value">18</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">BLACKJACK</div>
      <hr />
      <div class="box">
        <div class="info">
          <div class="field">WINS</div>
          <div class="value">4</div>
        </div>
      </div>
      <div class="box">
        <div class="info">
          <div class="field">GAMES</div>
          <div class="value">20</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* @media only screen and (max-width: 600px) { */
    .history {
      font-size: 20pt;
    }
    .center {
      text-align: center;
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
    .title {
      font-size: 14pt;
      border-radius: 0.5rem;
    }
    .info {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      width: 90%;
      height: 1.6rem;
      margin: 0.5rem 0 0 0;
    }
    .value {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-area: 1 / 2 / 2 / 3;
      background-color: #5a5867;
      border-radius: 0.5rem;
    }
    .field {
      grid-area: 1 / 1 / 2 / 2;
    }
    .fit {
      height: min-content;
    }
    hr {
      margin: 0;
      padding: 0;
    }
  /* } */
</style>
