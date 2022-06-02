<script lang="ts">
  export let friends: string[] = [];
</script>

<div class="content friends">
  {#each friends as friend}
    <div class="center">
      <div class="user">
        <div class="name-box"><div class="name">{friend}</div></div>
        <div class="delete">
          <img
            src="./icons/friend_remove.svg"
            alt="Remove Friend"
            class="icon"
          />
        </div>
      </div>
    </div>
  {/each}
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
  .friends.content > .center > .user {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: 1fr;
    grid-auto-columns: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    width: 95%;
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
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
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
</style>
