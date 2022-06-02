<script lang="ts"></script>

<div class="container">
  <div class="center">
    <form action="" method="post">
      <div class="enter">
        <div><label for="oldPasswd">Old Password</label></div>
        <div><input type="password" name="oldPasswd" id="oldPasswd" /></div>
      </div>
      <div class="enter">
        <div><label for="newPasswd">New Password</label></div>
        <div><input type="password" name="newPasswd" id="newPasswd" /></div>
      </div>
      <div class="enter">
        <div><label for="newPasswdConfirm">New Password Confirm</label></div>
        <div>
          <input
            type="password"
            name="newPasswdConfirm"
            id="newPasswdConfirm"
          />
        </div>
      </div>
      <div class="enter"><input type="submit" value="Change password" /></div>
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
  input[type="submit"] {
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
