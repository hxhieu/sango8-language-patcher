<template>
  <Panel header="Debug">
    <div class="debug-panel">
      <Button @click="rebuildSource">Rebuild source</Button>
    </div>
  </Panel>
</template>

<script lang="ts">
import { DEBUG_PARSE_SOURCES } from '@/api/const';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DebugPanel',
  setup() {
    const { ipcRenderer } = window._api;
    const rebuildSource = () => {
      ipcRenderer.invoke(DEBUG_PARSE_SOURCES, 'zh-tw');
    };

    return {
      rebuildSource,
    };
  },
});
</script>

<style lang="scss" scoped>
.debug-panel {
  display: flex;
}
</style>