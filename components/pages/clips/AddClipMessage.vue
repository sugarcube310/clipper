<template>
  <div class="addClipMessage">
    <v-alert
      color="accent"
      class="mb-0"
      type="success"
    >
      新しいクリップを追加しました！
    </v-alert>
  </div>
</template>

<style lang="postcss" scoped>
.addClipMessage {
  position: fixed;
  z-index: 5;

  @media (--not-sp) {
    top: 64px;
    right: 40px;
  }

  @media (--sp) {
    top: 60px;
    right: 0;
    left: 0;
    margin: auto;
    max-width: 90%;
  }
}
</style>