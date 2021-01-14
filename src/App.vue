<template>
  <Toast position="top-right" class="toast" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { IpcRendererEvent } from 'electron';

import { LogMessage } from './interfaces/logMessage';
import { EVENT_LOGGER } from './api/const';

export default defineComponent({
  name: 'App',
  components: {
    Toast,
  },
  setup() {
    const { ipcRenderer } = window._api;
    const toast = useToast();
    // Global main process logger
    ipcRenderer.on(EVENT_LOGGER, (_: IpcRendererEvent, log: LogMessage) => {
      const { message: detail, type: severity } = log;
      // Show the toasts
      toast.add({
        severity,
        detail,
        summary: severity.toLocaleUpperCase(),
      });
    });
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap');
#app {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  .p-toast-icon-close {
    border: 0;
  }
}
</style>
