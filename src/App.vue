<template>
  <Toast position="top-right" class="toast" />
  <ConfirmDialog />
  <div id="loader" v-if="showLoading">
    <div class="spinner">
      <ProgressSpinner strokeWidth="4" animationDuration="1s" />
      <label v-if="loadingText">{{ loadingText }}</label>
    </div>
  </div>
  <BlockUI :blocked="showLoading" :fullScreen="true" />
  <router-view class="content" />
  <Footer @themeChanged="themeChanged" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { IpcRendererEvent } from 'electron';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';

import { LogMessage } from '@/interfaces';
import { EVENT_BLOCK_UI, EVENT_LOGGER, EVENT_UNBLOCK_UI } from './api/const';
import { RootStore } from './store';

import Footer from './components/Footer.vue';
import { Theme } from './store/modules/shell';
import { useShell, useBlockUi } from './composables';

export default defineComponent({
  name: 'App',
  components: {
    Toast,
    ConfirmDialog,
    BlockUI,
    ProgressSpinner,
    Footer,
  },
  setup() {
    const { ipcRenderer } = window._api;
    const toast = useToast();
    const { block, unblock } = useBlockUi();

    const {
      state: { shell },
    } = useStore<RootStore>();

    const { setTheme } = useShell();

    const showLoading = computed(() => shell.blockUI);
    const loadingText = computed(() => shell.blockText);
    const theme = computed(() => shell.theme);

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

    // Blocking from main process
    ipcRenderer.on(EVENT_BLOCK_UI, (_: IpcRendererEvent, message: string) => {
      block(message);
    });
    ipcRenderer.on(EVENT_UNBLOCK_UI, () => {
      unblock();
    });

    // Theme switching
    // watch(
    //   theme,
    //   value => {
    //     // TODO: Not working if swap back to 'dark'
    //     if (value === 'dark') {
    //       require('primevue/resources/themes/arya-blue/theme.css');
    //     } else if (value === 'light') {
    //       require('primevue/resources/themes/fluent-light/theme.css');
    //     }
    //   },
    //   { immediate: true },
    // );

    const themeChanged = (theme: Theme) => {
      setTheme(theme);
    };

    return {
      showLoading,
      loadingText,
      themeChanged,
    };
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap');

::-webkit-scrollbar {
  background-color: var(--surface-d);
  width: 0.75em;
}

::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
  background: var(--surface-b);
}

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  background: var(--surface-a);
  min-width: 800px;
  overflow: hidden;
}

.p-blockui {
  pointer-events: none;
}

// Not sure what's this but PrimeVue has it
// and it always show on Electron?
.p-hidden-accessible {
  display: none;
}

.p-button {
  cursor: pointer;
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

  .form-section {
    display: flex;
    align-items: center;
    .form-control {
      margin-right: 10px;
    }
  }
}
</style>
