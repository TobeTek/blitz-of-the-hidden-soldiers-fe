<template>
  <div id="container">
    <div class="level pt-3">
      <!-- Left side -->
      <div class="level-left ml-3">
        <div class="level-item">
          <a href="/">
            <img src="@/assets/bothsLogo.svg?inline" alt="BoTHS Logo" />
          </a>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <a href="">
          <img
            class="icon--top"
            src="@/assets/icons/gear.svg?inline"
            alt="Settings"
          />
        </a>
        <a href="">
          <img
            class="icon--top"
            src="@/assets/icons/bell.svg?inline"
            alt="Notifications"
          />
        </a>
      </div>
    </div>
    <PlayerProfileOverview></PlayerProfileOverview>

    <div id="sidebar-actions">
      <a class="sidebar-action">
        <div class="level">
          <div class="level-left">
            <div class="level-item pl-6">
              <img
                src="@/assets/icons/house.svg?inline"
                class="action-icon pr-4"
              />

              <span class="action-text">Home</span>
            </div>
          </div>
        </div>
      </a>

      <a class="sidebar-action">
        <div class="level">
          <div class="level-left">
            <div class="level-item pl-6">
              <img
                src="@/assets/icons/tournament.svg?inline"
                class="action-icon pr-4"
              />

              <span class="action-text">Play</span>
            </div>
          </div>
        </div>
      </a>

      <a class="sidebar-action">
        <div class="level">
          <div class="level-left">
            <div class="level-item pl-6">
              <img
                src="@/assets/icons/collections.svg?inline"
                class="action-icon pr-4"
              />

              <span class="action-text">Collections</span>
            </div>
          </div>
        </div>
      </a>
    </div>

    <div id="sidebar-footer-actions">
      <a class="sidebar-action">
        <div class="level">
          <div class="level-left">
            <div class="level-item pl-6">
              <img
                src="@/assets/icons/help.svg?inline"
                class="action-icon pr-4"
              />

              <span class="action-text">Help</span>
            </div>
          </div>
        </div>
      </a>

      <a class="sidebar-action">
        <div class="level">
          <div class="level-left">
            <div class="level-item pl-6">
              <img
                src="@/assets/icons/about.svg?inline"
                class="action-icon pr-4"
              />

              <span class="action-text">About</span>
            </div>
          </div>
        </div>
      </a>

      <a class="sidebar-action">
        <div class="level">
          <div class="level-left">
            <div class="level-item pl-6">
              <a
                href="https://boths.gitbook.io/blitz-of-the-hidden-soldiers-wiki/"
              >
                <img
                  src="@/assets/icons/faq.svg?inline"
                  class="action-icon pr-4"
                />

                <span class="action-text">Wiki</span>
              </a>
            </div>
          </div>
        </div>
      </a>
    </div>

    <div id="sidebar-bottom-actions">
      <div class="level is-justify-content-center">
        <a class="sidebar-action" href="https://twitter.com/onambatech">
          <img src="@/assets/icons/twitterX.svg?inline" class="action-icon" />
        </a>

        <a class="sidebar-action" href="https://discord.gg/umajFF99">
          <img src="@/assets/icons/discord.svg?inline" class="action-icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayerProfileOverview from "@/components/common/PlayerProfileOverview.vue";
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
a {
  padding: 0;
  margin: 0;
}

#sidebar-actions {
  margin-top: 3em;
}

#sidebar-footer-actions {
  position: absolute;
  bottom: 10%;

  .action-icon {
    vertical-align: middle;
    height: 0.8em;
  }

  .action-text {
    font-size: smaller;
  }
}

#sidebar-bottom-actions {
  border-top: 2px inset $bright-gray-ui;
  padding-top: 10px;
  padding-bottom: 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
  .action-icon {
    vertical-align: middle;
    height: 1em;
    padding: 0 1em;
  }

  .sidebar-action {
    margin: 0;
  }
}
.sidebar-action {
  display: block;
  margin: 20px auto;
}

.action-icon {
  vertical-align: middle;
  height: 1em;
}
.action-text {
  display: inline-block;
  margin-bottom: -5px;
}

.icon--top {
  padding: 0 20px;
}

#container {
  position: fixed;
  background-color: $midnight-black-ui;
  width: inherit;
  height: 100vh;
  border-right: 1.5px inset $charcoal-gray-ui;
  overflow-y: hidden;
  z-index: 10;
}

#container:after {
  content: "";
  height: 10%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transition: top, opacity;
  transition-duration: 2s;
  transition-timing-function: ease-in;
  background: linear-gradient(transparent, $charcoal-gray-ui, transparent);
  opacity: 0;
}

#container:after {
  top: 65%;
  opacity: 0;
}

#container:hover:after {
  top: -100%;
  opacity: 1;
}
</style>
