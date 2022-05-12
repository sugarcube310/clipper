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
        v-for="menu in menus"
        :key="menu.id"
        :to="menu.link"
      >
        <v-list-item-title v-text="menu.title"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  setup () {
    const router = useRouter()

    /** Reactive State **/
    const reactiveState = reactive({
      menus: [
        {
          id: 'terms',
          title: '利用規約',
          link: '/terms/'
        },
        {
          id: 'privacy-policy',
          title: 'プライバシーポリシー',
          link: '/privacy-policy/'
        }
      ]
    })

    /** Methods **/
    const methods = {
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss" scoped>
.help__menu .v-list-item__title {
  font-size: 14px;

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