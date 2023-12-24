<template>
  <div id="container">
    <div class="tile is-ancestor p-5">
      <div class="tile is-mobile is-4 is-vertical is-parent">
        <div class="tile is-child">
          <Panel
            :leadText="'Create New Game'"
            :isPrimary="true"
            :clickEvent="'start-create-game'"
            @start-create-game="$emit('start-create-game')"
          ></Panel>
        </div>
        <div class="tile is-child">
          <Panel
            :leadText="'Tournaments'"
            :clickEvent="'view-tournaments'"
            @view-tournaments="$emit('view-tournaments')"
          ></Panel>
        </div>

        <div class="tile is-child">
          <Panel
            :leadText="'View Active Games'"
            :clickEvent="'view-active-games'"
            @view-active-games="$emit('view-active-games')"
          ></Panel>
        </div>
      </div>
      <div class="tile is-mobile is-parent">
        <div class="tile is-mobile is-child">
          <div id="list-of-games">
            <h1 class="title">Your Games</h1>
            <GameList></GameList>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Panel from "@/components/gameOverview/Panel.vue";
import GameList from "@/components/gameOverview/GameList.vue";
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
#list-of-games {
  color: $white-ui;
  background-color: $midnight-gray-ui;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  .title {
    color: $white-ui;
    font-weight: bolder;
    text-align: center;
    padding: 10px;
  }
}

#container {
  height: 90vh;
}
</style>
