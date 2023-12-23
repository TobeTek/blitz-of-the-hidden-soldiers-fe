<template>
  <div class="card">
    <div class="card-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <img
              src="https://api.dicebear.com/7.x/big-ears/jpg?flip=false&seed=chameleon.eth"
              alt=""
              class="player-avatar"
            />
          </div>
        </div>
        <div class="level-item">
          <span class="player-name"> 0x34C...789 </span>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <div class="level">
        <div class="level-left">
          <div class="level-item pl-4">200 wins</div>
        </div>
        <div class="level-right">
          <div class="level-item">500 loss</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.card {
  background-color: $graphite-gray-ui;
  width: 90%;
  margin: 0 auto;
  color: $white-ui;
  border-radius: 20px;

  border: 1.5px solid $charcoal-gray-ui;
  // border-left: 2px outset $charcoal-gray-ui;
  // border-right: 2px outset $charcoal-gray-ui;
  // border-top: 2px outset $charcoal-gray-ui;
  .level {
    width: 100%;
  }
}

.card-footer {
  font-size: small;
  height: 3em;

  .level{
    padding: 0 5px;
  }
}

.player-name {
  display: inline-block;
  margin: 0 10px;
}
.player-avatar {
  height: 2em;
  border-radius: 200000px;
}
</style>
