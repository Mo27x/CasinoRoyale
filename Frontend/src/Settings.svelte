<script lang="ts">
  import { userData } from "./store";
  let user: any;

  userData.subscribe((data) => {
    user = data;
  });
  export let socket: any;
  socket.emit("leaveRoom");
</script>

<div>
  <div class="box">
    <div class="section">
      <div class="title">Change username</div>
      <hr />
      <div class="content">
        <button>Change username</button>
      </div>
    </div>
  </div>
  <div class="box">
    <div class="section">
      <div class="title">Change password</div>
      <hr />
      <div class="content">
        <button>Change password</button>
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
        <button class="red">Delete your account</button>
      </div>
    </div>
  </div>
</div>

<style>
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
