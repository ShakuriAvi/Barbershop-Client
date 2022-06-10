import { createApp, VueRouter } from 'vue'
import { createWebHistory, createRouter } from "vue-router";
import BootstrapVue3 from 'bootstrap-vue-3'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import firebase from 'firebase/compat/app'

import 'jquery';
import '@popperjs/core'; // Edit here
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/js/bootstrap.bundle';
import HomePage from './client/HomePage.vue'
import HomePageHairStyles from './hairstyle/HomePage.vue'
import RegisterPage from './hairstyle/RegisterPage.vue'
import loginPage from './hairstyle/LoginPage.vue'

const routes = [
    { name: "HomePage", path: '/', component: HomePage },
    { name: "HomePageHairStyles", path: '/hairstyle/', component: HomePageHairStyles },
    { name: "loginPage", path: '/hairstyle/login', component: loginPage },
    { name: "registerPage", path: '/hairstyle/register', component: RegisterPage },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

const firebaseConfig = {
    apiKey: "AIzaSyCW1UbL6kxQ0zZ53KWZMkNsnPFjIWGJmaE",
    authDomain: "barbershop-vue.firebaseapp.com",
    projectId: "barbershop-vue",
    storageBucket: "barbershop-vue.appspot.com",
    messagingSenderId: "1007613385705",
    appId: "1:1007613385705:web:f43784a2398fd12d674978"
};
firebase.initializeApp(firebaseConfig)

const app = createApp(App)
app.use(BootstrapVue3)
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')