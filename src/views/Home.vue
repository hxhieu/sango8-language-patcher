<template>
  <div class="home">
    <PackList
      :locals="localPacks"
      :sources="sourcePacks"
      :files="fileTypes"
      v-model:value="packListModel"
    />
    <ul>
      <li v-for="record in records" :key="record.id">
        {{ record.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useHome, useInitialise, useTranslations } from '@/composables';
import { RootStore } from '@/store';
import PackList from '@/components/HomePackList.vue';
import { PackListModel } from '@/interfaces';

export default defineComponent({
  name: 'Home',
  components: {
    PackList,
  },
  setup() {
    const { checkAndFetchSources } = useInitialise();
    const { fetchRecords } = useTranslations();
    const { fetchLocalPacks } = useHome();
    const { state } = useStore<RootStore>();

    const records = computed(() => state.translations.records);
    const localPacks = computed(() => state.home.localPacks);
    const sourcePacks = computed(() => state.home.sourcePacks);
    const fileTypes = computed(() => state.home.fileTypes);

    const packListModel = ref<PackListModel>({
      source: 'zh-tw',
    });

    checkAndFetchSources();
    fetchLocalPacks();

    watch(
      packListModel,
      value => {
        fetchRecords(value?.local, value?.fileType);
        fetchRecords(value?.source, value?.fileType);
      },
      { deep: true },
    );

    return {
      records,
      localPacks,
      sourcePacks,
      fileTypes,
      packListModel,
    };
  },
});
</script>
