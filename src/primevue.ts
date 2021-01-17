import { App } from 'vue';

import 'primevue/resources/themes/arya-orange/theme.css';
// import 'primevue/resources/themes/nova/theme.css';
import 'primeicons/primeicons.css';

import ToastService from 'primevue/toastservice';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';

export default (app: App) => {
  app
    .use(ToastService)
    .component('Panel', Panel)
    .component('Button', Button)
    .component('Dropdown', Dropdown)
    .component('InputText', InputText)
    .component('Divider', Divider);
};
