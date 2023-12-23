<template>
  <h1 class="title has-text-centered">Collections</h1>
  <div id="container" class="tile is-ancestor p-6">
    <div class="tile is-4">
      <div class="collection-preview">
        <CollectionPreviewItem>
          <template #collection-image>
            <img
              src="@/assets/images/collections/standardCollection.png"
              alt=""
            />
          </template>
        </CollectionPreviewItem>
      </div>
    </div>

    <div class="tile is-4">
      <div class="collection-preview">
        <CollectionPreviewItem>
          <template #collection-image>
            <img src="@/assets/images/collections/blackCollection.png" alt="" />
          </template>
        </CollectionPreviewItem>
      </div>
    </div>
  </div>
  <h2 class="has-text-centered">More coming soon...</h2>
</template>

<script setup>
import CollectionPreviewItem from "@/components/gameOverview/CollectionPreviewItem.vue";
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.title {
  font-size: xx-large;
  font-family: Garnett, sans-serif;
  text-transform: uppercase;
  color: $white-ui;
}
</style>
