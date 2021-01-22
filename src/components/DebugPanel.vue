<template>
  <Panel header="Debug" :toggleable="true" :collapsed="true">
    <div class="debug-panel">
      <Button @click="rebuildSource">Rebuild source</Button>
      <Button @click="createPatches">Create patches</Button>
    </div>
  </Panel>
</template>

<script lang="ts">
import { DEBUG_PARSE_SOURCES, EVENT_CREATE_PATCHES } from '@/api/const';
import { SourceVariant } from '@/interfaces';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DebugPanel',
  setup() {
    const { ipcRenderer } = window._api;
    const variant: SourceVariant = 'zh-tw';
    const rebuildSource = () => {
      ipcRenderer.invoke(DEBUG_PARSE_SOURCES, variant);
    };

    const createPatches = () => {
      ipcRenderer.invoke(EVENT_CREATE_PATCHES, 'en.dev', variant);
    };

    return {
      rebuildSource,
      createPatches,
    };
  },
});
</script>

<style lang="scss" scoped>
.debug-panel {
  display: flex;
  & > .p-button {
    margin-right: 20px;
  }
}
</style>
