<script lang="ts">
  export let friends;
</script>

<div class="content search">
  <div class="center">
    <div class="search-input">
      <div class="center">
        <div class="input">
          <form action="" method="post" class="fit">
            <input type="text" name="username" id="username" />
          </form>
        </div>
      </div>
      <div class="img">
        <img src="./icons/search.svg" alt="Search" class="icon" />
      </div>
    </div>
  </div>
  <div class="users">
    {#each friends as friend}
      <div class="center">
        <div class="user">
          <div class="name-box"><div class="name">{friend}</div></div>
          <div class="delete">
            <img src="./icons/friend_add.svg" alt="Add" class="icon" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .content {
    background-color: #5a5867;
    width: 90%;
    height: 95%;
    border-radius: 0.5rem;
  }
  .center {
    display: grid;
    place-items: center;
  }
  .search.content > .users > .center > .user {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: 1fr;
    grid-auto-columns: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    width: 90%;
  }
  .search-input {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: 1fr;
    grid-auto-columns: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: 1 / 1 / 2 / 2;
    border-radius: 0.5rem;
    background-color: #5a5867;
    width: 100%;
  }
  .input {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95%;
    grid-area: 1 / 1 / 2 / 2;
  }
  .img {
    grid-area: 1 / 2 / 2 / 3;
  }

  .users {
    grid-area: 2 / 1 / 3 / 2;
    background-color: #5a5867;
    border-radius: 0.5rem;
  }

  .name-box {
    grid-area: 1 / 1 / 2 / 2;
    background-color: #484656;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    align-self: center;
    height: 2rem;
    width: 98%;
  }
  .delete {
    grid-area: 1 / 2 / 2 / 3;
  }

  .name {
    font-size: 15pt;
    margin: 0 0 0 0.5rem;
  }

  .icon {
    width: 2.25rem;
    height: 2.25rem;
  }

  input[type="text"] {
    width: 98%;
    background-color: #484656;
    border-color: transparent;
    border-radius: 0.5rem;
    height: 100%;
    color: #eeeeee;
    caret-color: #eeeeee;
    font-size: 14pt;
  }
</style>
