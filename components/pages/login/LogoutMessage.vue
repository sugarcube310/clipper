<template>
  <div class="logoutMessage">
    <v-alert
      color="primary"
      dark
      border="left"
      class="mb-0 pl-6"
    >
      ログアウトしました。
    </v-alert>
  </div>
</template>

<style lang="postcss" scoped>
.logoutMessage {
  position: fixed;
  z-index: 5;

  @media (--not-sp) {
    top: 40px;
    right: 40px;
  }

  @media (--sp) {
    top: 60px;
    right: 0;
    left: 0;
    margin: auto;
    max-width: 80%;
  }
}
</style>