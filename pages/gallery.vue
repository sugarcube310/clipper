<template>
  <div class="page-container -gallery">
    <p
      v-if="user.login"
      class="text"
    >
    {{ user }}
    </p>

    <v-btn @click="onLogout()">
      logout
    </v-btn>

    <PostButton />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  computed: {
    user () {
      return this.$store.getters['user']
    }
  },
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
    })

    /** Methods **/
    const methods = {
      onLogout () {
        (this as any).$store.dispatch('logout')
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss" scoped>
</style>