<template>
  <footer>
    <label>Copyright &copy; {{ year }} hxhieu</label>
    <InputSwitch v-model="lightTheme" @change="themeChanged" />
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';

export default defineComponent({
  name: 'Footer',
  components: {
    InputSwitch,
  },
  props: {
    currentTheme: {
      type: String,
    },
  },
  emits: ['themeChanged'],
  setup(props, { emit }) {
    const lightTheme = ref(props.currentTheme === 'light');
    const year = ref(new Date().getFullYear());

    const themeChanged = () => {
      emit('themeChanged', lightTheme.value ? 'light' : 'dark');
    };

    return {
      year,
      lightTheme,
      themeChanged,
    };
  },
});
</script>

<style lang="scss" scoped>
footer {
  position: fixed;
  bottom: 0;
  background: var(--surface-a);
  left: 0;
  right: 0;
  border-top: 1px solid var(--surface-d);
  padding: 5px 20px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
