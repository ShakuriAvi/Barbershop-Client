import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import 'jquery';
import '@popperjs/core'; // Edit here
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/js/bootstrap.bundle';


const app = createApp(App)
app.use(BootstrapVue3)
app.use(VueAxios, axios)

app.mount('#app')