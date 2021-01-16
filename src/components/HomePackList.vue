<template>
  <Panel header="Pack settings">
    <div class="pack-settings">
      <div class="pack">
        <label>Local pack</label>
        <Dropdown
          :options="localPacks"
          @change="change"
          v-model="model.local"
          placeholder="Select a local pack"
        />
        <Dropdown
          v-if="!!model.local"
          :options="fileTypes"
          @change="change"
          v-model="model.fileType"
          placeholder="Select a file type"
        />
        <Button>New pack</Button>
      </div>
      <div class="pack">
        <label>Source pack</label>
        <Dropdown
          :options="sourcePacks"
          @change="change"
          v-model="model.source"
        />
      </div>
    </div>
  </Panel>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { PackListModel } from '@/interfaces';

export default defineComponent({
  name: 'PackList',
  props: {
    sources: {
      type: Array,
    },
    locals: {
      type: Array,
    },
    files: {
      type: Array,
    },
    value: {
      type: Object,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const sourcePacks = computed(() => props.sources || []);
    const localPacks = computed(() => props.locals || []);
    const fileTypes = computed(() => props.files || []);
    const { source, local, fileType } = (props.value || {}) as PackListModel;
    const model = ref<PackListModel>({
      source: source || 'zh-tw',
      local,
      fileType: fileType || 'full',
    });

    const change = () => {
      emit('update:value', model.value);
    };

    return {
      sourcePacks,
      localPacks,
      fileTypes,
      model,
      change,
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

  .p-selectbutton {
    display: flex;
    cursor: pointer;
  }
}
</style>
