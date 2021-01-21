import { App } from 'vue';

import 'primevue/resources/themes/arya-orange/theme.css';
// import 'primevue/resources/themes/arya-blue/theme.css';
// import 'primevue/resources/themes/fluent-light/theme.css';
// import 'primevue/resources/themes/nova/theme.css';
// import 'primevue/resources/themes/luna-amber/theme.css';

import 'primeicons/primeicons.css';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Message from 'primevue/inlinemessage';

export default (app: App) => {
  app
    .use(ToastService)
    .use(ConfirmationService)
    .component('Panel', Panel)
    .component('Button', Button)
    .component('Dropdown', Dropdown)
    .component('InputText', InputText)
    .component('Message', Message)
    .component('Divider', Divider);
};
