<template>
  <div class="page-container -list">
    <p
      v-if="user.login"
      class="text"
    >
    list
    </p>
    {{ user }}

    <v-btn @click="onLogout()">
      logout
    </v-btn>

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
  setup (_) {
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

<style lang="postcss">
</style>