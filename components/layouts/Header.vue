<template>
  <v-app-bar
    app
    fixed
    color="white"
    flat
  >
    <v-spacer></v-spacer>

    <v-menu
      rounded="lg"
      bottom
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="menu in menus"
          :key="menu.id"
          link
          @click="onClickMenu(menu)"
        >
          <v-list-item-title v-text="menu.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
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
          id: 'setting',
          title: 'アカウント設定',
          link: 'setting'
        },
        {
          id: 'logout',
          title: 'ログアウト',
          link: ''
        }
      ]
    })

    /** Methods **/
    const methods = {
      onClickMenu (menu: any) {
        if (menu.id === 'logout') {
          (this as any).$store.dispatch('logout')
        }
        if (menu.link !== '') {
          router.push(`/${ menu.link }`)
        }
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss">
</style>