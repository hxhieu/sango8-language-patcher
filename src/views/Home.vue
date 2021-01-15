<template>
  <div class="home">
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
import { useInitialise, useTranslations } from '@/composables';
import { RootStore } from '@/store';

export default defineComponent({
  name: 'Home',
  components: {
    Button,
  },
  setup() {
    const { checkAndFetchSources } = useInitialise();
    const { fetchRecords } = useTranslations();
    const { state } = useStore<RootStore>();
    const records = computed(() => state.translations.records);
    const test = () => {
      fetchRecords('zh-tw', 'full');
    };
    checkAndFetchSources();
    return {
      test,
      records,
    };
  },
});
</script>
