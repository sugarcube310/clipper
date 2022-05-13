<template>
  <v-row>
    <v-col></v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  setup () {
    const router = useRouter()

    onMounted(() => {
      router.push('/login/')
    })
  }
})
</script>