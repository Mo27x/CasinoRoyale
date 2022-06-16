<script lang="ts">
  // import { useNavigate } from "svelte-navigator";
  export let socket: any;

  socket.emit("leaveRoom");
  // const navigate = useNavigate();
  let oldPassword = "";
  let newPassword = "";
  let newPasswdConfirm = "";
  const changePassword = async () => {
    let response = await fetch("/api/user/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
        newPasswdConfirm: newPasswdConfirm,
      }),
    });
    let data = await response.json();
    if (data.success) {
      alert("Password changed successfully");
    } else {
      alert(data.message);
    }
  };
</script>

<div class="container">
  <div class="center">
    <div>
      <div class="enter">
        <div><label for="oldPasswd">Old Password</label></div>
        <div>
          <input
            type="password"
            name="oldPasswd"
            id="oldPasswd"
            bind:value={oldPassword}
            required
          />
        </div>
      </div>
      <div class="enter">
        <div><label for="newPasswd">New Password</label></div>
        <div>
          <input
            type="password"
            name="newPasswd"
            id="newPasswd"
            bind:value={newPassword}
            required
          />
        </div>
      </div>
      <div class="enter">
        <div><label for="newPasswdConfirm">New Password Confirm</label></div>
        <div>
          <input
            type="password"
            name="newPasswdConfirm"
            id="newPasswdConfirm"
            bind:value={newPasswdConfirm}
            required
          />
        </div>
      </div>
      <div class="enter">
        <!-- <button on:click={() => navigate(-1)}>Cancel</button> -->
        <div><button>Cancel</button></div>
      </div>
      <div class="enter">
        <button on:click={() => changePassword()}>Change password</button>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
  .center {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }
  .enter {
    margin: 0.5rem 0 0 0;
  }
  input[type="password"] {
    background: none;
    border: none;
    background-color: #5a5867;
    height: 1.5rem;
    border-radius: 0.5rem;
    margin: 0.5rem 0 0 0;
  }
  button {
    background: none;
    border: none;
    background-color: #5a5867;
    color: #eeeeee;
    width: 100%;
    height: 1.5rem;
    border-radius: 0.5rem;
    margin: 0.5rem 0 0 0;
    font-size: 12pt;
  }
</style>
