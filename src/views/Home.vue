<template>
  <div class="home">
    <PackList :locals="localPacks" :sources="sourcePacks" />
    <Button @click="test">AAA</Button>
    <ul>
      <li v-for="record in records" :key="record.id">
        {{ record.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import { useHome, useInitialise, useTranslations } from '@/composables';
import { RootStore } from '@/store';
import PackList from '@/components/HomePackList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Button,
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

    const test = () => {
      fetchRecords('zh-tw', 'full');
    };

    checkAndFetchSources();
    fetchLocalPacks();

    return {
      test,
      records,
      localPacks,
      sourcePacks,
    };
  },
});
</script>
