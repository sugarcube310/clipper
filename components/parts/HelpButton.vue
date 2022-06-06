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
        outlined
        fixed
        bottom
        right
        fab
        color="primary"
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
      <v-list-item class="copyRight">
        <p>&copy; 2022 sato</p>
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
          title: 'このアプリについて',
          link: '/how-to-use/'
        },
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
.help__button {
  background-color: #fff;
}

.help__menu {
  & .v-list-item__title {
    color: var(--color-text-light);
    font-size: 14px;
    font-weight: bold;
    letter-spacing: .04em;

    @media (--sp) {
      font-size: 12px;
    }
  }

  & .copyRight p {
    border-top: 1px solid rgba(153, 153, 153, .4);
    color: var(--color-secondary);
    font-size: 11px;
    padding-top: 12px;
    letter-spacing: .06em;
    width: 100%;

    @media (--sp) {
      font-size: 10px;
      letter-spacing: .08em;
    }
  }
}

.help__button {
  &::before {
    background-color: #fff !important;
  }

  & .mdi {
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px !important;
    height: 100%;
    width: 100%;
  }
}
</style>