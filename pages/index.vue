<template>
  <v-row>
    <v-col></v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { auth } from '@/plugins/firebase'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  setup () {
    const router = useRouter()
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login')
      } else {
        router.push('/gallery')
      }
    })
  }
})
</script>