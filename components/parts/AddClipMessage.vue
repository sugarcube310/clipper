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
  top: 64px;
  right: 20px;
  z-index: 5;
}
</style>