<script lang="ts">
  export let user: any = {};
  const accept = async (friend: string) => {
    let response = await fetch("/acceptFriendship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ me: user.username, friend: friend }),
    });
    let data = await response.json();
    console.log(data);
  };
  const refuseFriendship = async (friend: string) => {
    const response = await fetch("/deleteFriendship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ me: user.username, friend: friend }),
    });
    const data = await response.json();
    console.log(data);
  };

  const blockFriendship = async (friend: string) => {
    const response = await fetch("/blockFriendship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ me: user.username, friend: friend }),
    });
    const data = await response.json();
    console.log(data);
  };
</script>

<div class="content requests">
  {#each user.responses as friend}
    <div class="center">
      <div class="user">
        <div class="name-box"><div class="name">{friend.username}</div></div>
        <div class="accept" on:click={() => accept(friend.username)}>
          <img src="./icons/accept.svg" alt="Accept" class="icon" />
        </div>
        <div class="refuse" on:click={() => refuseFriendship(friend.username)}>
          <img src="./icons/refuse.svg" alt="Refuse" class="icon" />
        </div>
        <div class="block" on:click={() => blockFriendship(friend.username)}>
          <img src="./icons/block.svg" alt="Block" class="icon" />
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
  .requests.content > .center > .user {
    display: grid;
    grid-template-columns: 1fr min-content min-content min-content;
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
  }

  .accept {
    grid-area: 1 / 2 / 2 / 3;
  }

  .refuse {
    grid-area: 1 / 3 / 2 / 4;
  }

  .block {
    grid-area: 1 / 4 / 2 / 5;
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
