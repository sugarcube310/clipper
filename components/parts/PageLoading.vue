<template>
  <div class="page-loading">
    <div class="d-flex align-center justify-center spinner__wrap">
      <div class="spinner">
        <div class="spinner__inner"></div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-loading {
  overflow: hidden;
  position: relative;
  height: 100vh;
  width: 100%;

  & .spinner__wrap {
    position: absolute;
    top: calc(50% - 90px);
    right: 0;
    left: 0;
    margin: 0 auto;

    & .spinner,
    & .spinner * {
      box-sizing: border-box;
    }

    & .spinner {
      animation: spinner-animation 4s infinite ease;
      border: 4px solid var(--color-accent);
      border-radius: 12px;
      position: relative;
      height: 52px;
      width: 52px;

      & .spinner__inner {
        animation: spinner__inner-animation 4s infinite ease-in;
        background-color: var(--color-accent);
        display: inline-block;
        opacity: 1;
        vertical-align: top;
        width: 100%;
      }
    }
  }
}
</style>