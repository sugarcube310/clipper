<template>
  <div class="logoutMessage">
    <v-alert
      color="secondary lighten-1"
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
    top: 60px;
    right: 60px;
  }

  @media (--sp) {
    top: 40px;
    right: 0;
    left: 0;
    margin: auto;
    max-width: 85%;
  }
}
</style>