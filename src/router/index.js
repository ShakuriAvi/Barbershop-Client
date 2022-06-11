import { createWebHistory, createRouter } from "vue-router";


import HomePage from './client/HomePage.vue'
import HomePageHairStyles from './hairstyle/HomePage.vue'
import RegisterPage from './hairstyle/RegisterPage.vue'
import LoginPage from './hairstyle/LoginPage.vue'
import FinishPage from './client/FinishPage.vue'


const routes = [
    { name: "HomePage", path: '/', component: HomePage },
    { name: "HomePageHairStyles", path: '/hairstyle/', component: HomePageHairStyles },
    { name: "loginPage", path: '/hairstyle/login', component: LoginPage },
    { name: "registerPage", path: '/hairstyle/register', component: RegisterPage },
    { name: "finishPage", path: '/finish', component: FinishPage },


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
export default router