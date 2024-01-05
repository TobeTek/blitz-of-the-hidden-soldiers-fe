<template>
  <div class="tile is-mobile is-parent">
    <div class="tile is-mobile is-child">
      <div id="my-pieces">
        <h1 class="title">My Pieces</h1>

        <div id="container" class="table-container">
          <table class="table is-fullwidth is-dark" id="game-list">
            <thead class="table-header">
              <th>#</th>
              <th>Name</th>
              <th>Piece Class</th>
              <th class="has-text-centered">Description</th>
              <th></th>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Basileus</td>
                <td class="">
                  <span class="tag is-outline"><b>King</b></span>
                </td>
                <td class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto vero doloribus aliquid! Voluptate maxime pariatur, qui voluptatem facilis, illo quaerat temporibus officiis, ipsa hic alias repellendus sint nostrum. Vel, minus?</td>
                <td>
                  <button class="button is-small is-text view-more">>>></button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Augusta</td>
                <td class="">
                  <span class="tag is-outline"><b>Queen</b></span>
                </td>
                <td class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto vero doloribus aliquid! Voluptate maxime pariatur, qui voluptatem facilis, illo quaerat temporibus officiis, ipsa hic alias repellendus sint nostrum. Vel, minus?</td>
                <td>
                  <button class="button is-small is-text view-more">>>></button>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Alexander The Great</td>
                <td class="">
                  <span class="tag is-legendary"><b>King</b></span>
                </td>
                <td class="description">Iusto vero doloribus aliquid! Voluptate maxime pariatur, qui voluptatem facilis, illo quaerat temporibus officiis, ipsa hic alias repellendus?</td>
                <td>
                  <button class="button is-small is-text view-more">>>></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.is-legendary{
    color: $white-ui;
    background-color: $deep-plum-ui;
}

.title{
    color: $white-ui;
    text-align: center;
}

#my-pieces{
    padding: 0 1rem;
    // background-color: $dark-charcoal-ui;
}

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
