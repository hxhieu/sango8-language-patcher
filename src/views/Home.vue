<template>
  <div class="home">
    <Button @click="test">AAA</Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import { useInitialise } from '@/composables';
import { EVENT_FETCH_RECORDS } from '@/api/const';

export default defineComponent({
  name: 'Home',
  components: {
    Button,
  },
  setup() {
    const { checkAndFetchPacks } = useInitialise();
    const { ipcRenderer } = window._api;
    const test = () => {
      ipcRenderer.invoke(EVENT_FETCH_RECORDS, ['zh-tw', 'full', null, 2000, 4]);
    };

    checkAndFetchPacks();

    return {
      test,
    };
  },
});
</script>
