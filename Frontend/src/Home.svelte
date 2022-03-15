<script lang="ts">
  let login = true;
  export let loggedIn = false;
  console.log(loggedIn);
  const handleClick = () => {
    login = !login;
  };
</script>

{#if loggedIn}
  <form action="/logout" method="post">
    <input type="submit" value="Logout" />
  </form>
{/if}
{#if !login}
  <form action="/api/register" method="post">
    <label for="username">Username</label>
    <input type="text" name="username" id="username" />
    <label for="email">Email</label>
    <input type="text" name="email" id="email" />
    <label for="password">Password</label>
    <input type="password" name="password" id="password" />
    <label for="passwordConfirm">Confirm Password</label>
    <input type="password" name="passwordConfirm" id="passwordConfirm" />
    <input type="submit" value="Register" />
  </form>
  <button on:click={handleClick}>Log In</button>
{:else}
  <form action="/api/login" method="post">
    <label for="email">Email</label>
    <input type="email" name="email" id="email" />
    <label for="password">Password</label>
    <input type="password" name="password" id="password" />
    <input type="submit" value="Log In" />
  </form>
  <button on:click={handleClick}>Create an account</button>
{/if}

<style></style>
