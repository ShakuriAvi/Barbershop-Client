<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/hairstyle/">Welcome {{ name.toUpperCase() }}</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link active" aria-current="page" v-on:click="changePage('Home')">Home</a>
                        <a class="nav-link" style="" v-on:click="changePage('Graph')">Graph</a>
                        <a class=" nav-link" v-on:click="changePage('Register')">Register</a>
                        <a class=" nav-link" v-on:click="logout()">Logout</a>
                    </div>
                </div>
            </div>
        </nav>

        <div style="margin-top: 2rem;">
            <div v-if="pageClick == 'Home'">
                <div>
                    <div class="container" style="text-align:center">

                        <img src="../assets/barbershop_icon.png" style="max-width:12.5rem; " />
                        <Datepicker v-model="date" v-on:click="datePickerChange()" />
                    </div>
                </div>
            </div>
            <div v-else-if="pageClick == 'Graph'">
                <div>Graph</div>

            </div>
            <div v-else-if="pageClick == 'Register'">
                <RegisterPage />
            </div>
            <div v-else-if="pageClick == 'Logout'">

            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"
import RegisterPage from './RegisterPage.vue'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    components: {
        RegisterPage, Datepicker
    },
    name: 'HomePageHairStyles',
    data() {
        return {
            name: "",
            pageClick: "Home",
            date: null,

        }
    },
    mounted() {
        const auth = firebase.auth();
        auth.onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                this.name = user.email.split("@")[0]
            } else {
                this.$router.replace({ path: '/hairstyle/login' });

            }
        })

    },
    methods: {
        datePickerChange() {
            const format = (date) => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
            return format

        },
        changePage(val) {
            console.log(val);
            this.pageClick = val
        },
        logout() {
            const auth = firebase.auth();
            auth.signOut().then(() => {
                console.log("sign out");
                this.$router.replace({ path: '/hairstyle/login' });

            }).catch(err => {
                console.log(err)
            })


        }
    }
}</script>
<style type="text/css" scoped>
a:hover {
    cursor: pointer;
}
</style>