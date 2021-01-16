<template>
  <Toast position="top-right" class="toast" />
  <div id="loader" v-if="showLoading">
    <div class="spinner">
      <ProgressSpinner strokeWidth="4" animationDuration="1s" />
      <label v-if="loadingText">{{ loadingText }}</label>
    </div>
  </div>
  <BlockUI :blocked="showLoading" :fullScreen="true"> </BlockUI>
  <router-view class="content" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { IpcRendererEvent } from 'electron';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';

import { LogMessage } from '@/interfaces';
import { EVENT_LOGGER } from './api/const';
import { RootStore } from './store';

export default defineComponent({
  name: 'App',
  components: {
    Toast,
    BlockUI,
    ProgressSpinner,
  },
  setup() {
    const { ipcRenderer } = window._api;
    const toast = useToast();
    const {
      state: { shell },
    } = useStore<RootStore>();
    const showLoading = computed(() => shell.blockUI);
    const loadingText = computed(() => shell.blockText);

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

    return {
      showLoading,
      loadingText,
    };
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap');

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  background: var(--surface-a);
}

.p-blockui {
  pointer-events: none;
}

// Not sure what's this but PrimeVue has it
// and it always show on Electron?
.p-hidden-accessible {
  display: none;
}

#app {
  height: 100%;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;

  .content {
    height: 100%;
  }

  .p-toast {
    z-index: 9999 !important;
    .p-toast-icon-close {
      border: 0;
    }
  }

  $spinner-gap: 40px;

  #loader {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner {
      background: #fff;
      padding: $spinner-gap;
      border-radius: 10px;
      text-align: center;
      label {
        display: block;
        font-weight: 700;
        font-size: 1.5rem;
        margin-top: $spinner-gap;
      }
    }
  }
}
</style>
