<template>
  <v-menu
    rounded="lg"
    offset-x
    top
    left
    origin="center center"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ma-4 help__button"
        fixed
        bottom
        right
        fab
        color="white"
        v-bind="attrs"
        v-on="on"
      >
        <span class="mdi mdi-help"></span>
      </v-btn>
    </template>

    <v-list class="help__menu">
      <v-list-item
        v-for="(menu, i) in menus"
        :key="i"
        :to="menu.link"
      >
        <v-list-item-title v-text="menu.title"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      menus: [
        {
          title: '利用規約',
          link: '/terms/'
        },
        {
          title: 'プライバシーポリシー',
          link: '/privacy-policy/'
        }
      ]
    })

    return {
      ...toRefs(reactiveState)
    }
  }
})
</script>

<style lang="postcss" scoped>
.help__menu .v-list-item__title {
  color: var(--color-primary);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: .04em;

  @media (--sp) {
    font-size: 12px;
  }
}

.help__button {
  &::before {
    background-color: #fff !important;
  }

  & .mdi {
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px !important;
    height: 100%;
    width: 100%;
  }
}
</style>