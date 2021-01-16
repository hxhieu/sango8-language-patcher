<template>
  <Panel header="Pack settings">
    <div class="pack-settings">
      <div class="pack">
        <label>Local pack</label>
        <Dropdown
          :options="localPacks"
          @change="localChanged"
          v-model="selectedLocal"
          placeholder="Select a local pack"
        />
        <Button>New pack</Button>
      </div>
      <div class="pack">
        <label>Source pack</label>
        <Dropdown
          :options="sourcePacks"
          @change="sourceChanged"
          v-model="selectedSource"
        />
      </div>
    </div>
  </Panel>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Panel from 'primevue/panel';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

export default defineComponent({
  name: 'PackList',
  components: {
    Panel,
    Dropdown,
    Button,
  },
  props: {
    sources: {
      type: Array,
    },
    locals: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const sourcePacks = computed(() => props.sources || []);
    const localPacks = computed(() => props.locals || []);
    const selectedSource = ref('zh-tw');
    const selectedLocal = ref();

    const sourceChanged = (val: string) => {
      emit('sourceChanged', val);
    };

    const localChanged = (val: string) => {
      emit('localChanged', val);
    };

    return {
      sourcePacks,
      localPacks,
      sourceChanged,
      localChanged,
      selectedSource,
      selectedLocal,
    };
  },
});
</script>

<style lang="scss" scoped>
.pack-settings,
.pack {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    margin-right: 10px;
  }
}
</style>
