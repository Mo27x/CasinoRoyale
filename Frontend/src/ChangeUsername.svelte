<script lang="ts"></script>

<div class="container">
  <div class="center">
    <form action="" method="post">
      <div><label for="username">Enter a new username</label></div>
      <div><input type="text" name="username" id="username" /></div>
      <div><input type="submit" value="Change username" /></div>
    </form>
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
  input[type="submit"] {
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
