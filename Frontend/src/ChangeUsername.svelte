<script lang="ts">
  // import { useNavigate } from "svelte-navigator";
  export let socket: any;

  socket.emit("leaveRoom");
  // const navigate = useNavigate();
  let username = "";
  const changeUsername = async () => {
    let response = await fetch("/api/user/changeUsername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    let data = await response.json();
    if (data.success) {
      alert("Username changed successfully");
    } else {
      alert(data.message);
    }
  };
  console.log("salve");
</script>

<div class="container">
  <div class="center">
    <div>
      <div><label for="username">Enter a new username</label></div>
      <div><input type="text" name="username" id="username" /></div>
      <!-- <div><button on:click={() => navigate(-1)}>Cancel</button></div> -->
      <div><button>Cancel</button></div>
      <div>
        <button on:click={() => changeUsername()}>Change username</button>
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
  input[type="text"] {
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
    margin: 1rem 0 0 0;
    font-size: 12pt;
  }
</style>
