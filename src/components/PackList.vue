<template>
  <Panel header="Pack settings" :toggleable="true" class="pack-settings">
    <div class="form-section">
      <div class="form-section form-control">
        <div class="form-section form-control" v-if="localPacks.length > 0">
          <label class="form-control">Local pack</label>
          <Dropdown
            class="form-control"
            :options="localPacks"
            @change="change"
            v-model="model.local"
            placeholder="Select a local pack"
          />
          <Dropdown
            class="form-control"
            v-if="!!model.local"
            :options="fileTypes"
            @change="change"
            v-model="model.fileType"
            placeholder="Select a file type"
          />
        </div>
        <label v-else class="form-control"
          >You do not have a pack, create one first</label
        >
        <Button class="form-control">New pack</Button>
      </div>
      <div class="form-section form-control">
        <label class="form-control">Source pack</label>
        <Dropdown
          class="form-control"
          :options="sourcePacks"
          @change="change"
          v-model="model.source"
          :disabled="true"
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
.pack-settings {
  .p-panel-content {
    & > div {
      justify-content: space-between;
    }
  }
}
</style>
