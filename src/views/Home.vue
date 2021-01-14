<template>
  <div class="home">
    <Button @click="() => console.log('aaa')">AAA</Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import { useInitialise } from '@/composables';

export default defineComponent({
  name: 'Home',
  components: {
    Button,
  },
  setup() {
    const { checkAndFetchPacks } = useInitialise();
    checkAndFetchPacks();
  },
});
</script>
