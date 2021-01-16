import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import bootstrapPrimeVue from './primevue';

const app = createApp(App)
  .use(store)
  .use(router);

bootstrapPrimeVue(app);

app.mount('#app');
