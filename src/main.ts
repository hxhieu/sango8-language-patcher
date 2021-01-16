import { createApp } from 'vue';
import ToastService from 'primevue/toastservice';

import App from './App.vue';
import router from './router';
import store from './store';

import 'primevue/resources/themes/arya-orange/theme.css';
// import 'primevue/resources/themes/nova/theme.css';
import 'primeicons/primeicons.css';

createApp(App)
  .use(ToastService)
  .use(store)
  .use(router)
  .mount('#app');
