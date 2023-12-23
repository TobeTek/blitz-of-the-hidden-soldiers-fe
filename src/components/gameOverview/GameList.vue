<template>
  <div id="container" class="table-container">
    <table class="table is-fullwidth is-dark" id="game-list">
      <thead class="table-header">
        <th>#</th>
        <th>Game Address</th>
        <th>Opponent</th>
        <th class="has-text-centered">Status</th>
        <th></th>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>0x....</td>
          <td>0x10..102</td>
          <td class="has-text-centered">
            <span class="tag is-dark">In Progress</span>
          </td>
          <td>
            <button class="button is-small is-text view-more">>>></button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>0x....</td>
          <td>0x20..102</td>
          <td class="has-text-centered">
            <span class="tag is-danger">Lost</span>
          </td>
          <td>
            <button class="button is-small is-text view-more">>>></button>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>0x.ca..</td>
          <td>0x10..102</td>
          <td class="has-text-centered">
            <span class="tag is-primary">Won</span>
          </td>
          <td>
            <button class="button is-small is-text view-more">>>></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <h4 class="has-text-centered">
    <a href="" class="underlined-link" id="more-info">
      Find out more on the wiki
    </a>
  </h4>
</template>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.view-more {
  color: $white-ui;

  &:hover {
    text-decoration: none;
  }
}

#container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#game-list {
  background-color: inherit;
  color: $white-ui;
  transition: color 0.2s ease-in;

  th {
    color: $white-ui;
  }

  tr:hover {
    color: $bright-gray-ui;
  }
}

#more-info {
  display: inline-block;
  padding-top: 20px;
}
</style>
