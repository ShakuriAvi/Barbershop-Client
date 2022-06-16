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
                        <div class="row g-0">
                            <div class="col-sm-6 col-md-2">
                                <h5 style="text-align:center ">Choose Date : </h5>
                            </div>
                            <div class="col-6 col-md-10">
                                <Datepicker v-model="date" v-on:click="datePickerChange()" />
                            </div>
                        </div>

                        <HairStyleAppointments :disabled_bool="(date)" :date=date :appointments="appointments"
                            :hairStyles="hairStyles" />
                    </div>
                </div>
            </div>
            <div v-else-if="pageClick == 'Graph'">
                <div class="container" style="text-align:center">
                    <div style="text-align:center">
                        <Graph :date="graphDate" />
                    </div>
                </div>
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
import HairStyleAppointments from '../components/HairStyleAppointments.vue'
import Graph from './Graph.vue'

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    components: {
        RegisterPage, Datepicker, HairStyleAppointments, Graph
    },
    name: 'HomePageHairStyles',
    data() {
        return {
            name: "",
            pageClick: "Home",
            date: null,
            appointments: {},
            hairStyles: []

        }
    },
    async mounted() {
        const auth = firebase.auth();
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.name = user.email.split("@")[0]
            } else {
                this.$router.replace({ path: '/hairstyle/login' });

            }
        })
        await this.getHairStyle()
        await this.getAppointments()
    },
    methods: {
        merge: function (left, right) {
            let arr = []
            // Break out of loop if any one of the array gets empty
            while (left.length && right.length) {
                // Pick the smaller among the smallest element of left and right sub arrays 
                if (parseInt(left[0].start_time.split(":")[0]) < parseInt(right[0].start_time.split(":")[0])) {
                    arr.push(left.shift())
                } else if (parseInt(left[0].start_time.split(":")[0]) === parseInt(right[0].start_time.split(":")[0])) {
                    if (parseInt(left[0].start_time.split(":")[1]) < parseInt(right[0].start_time.split(":")[1])) {
                        arr.push(left.shift())
                    } else {
                        arr.push(right.shift())
                    }
                } else {
                    arr.push(right.shift())

                }
            }

            // Concatenating the leftover elements
            // (in case we didn't go through the entire left or right array)
            return [...arr, ...left, ...right]
        },
        mergeSort(array) {
            const half = array.length / 2

            // Base case or terminating case
            if (array.length < 2) {
                return array
            }

            const left = array.splice(0, half)
            return this.merge(this.mergeSort(left), this.mergeSort(array))
        },
        async getAppointments() {
            const appointmentResponse = await this.axios.get("http://localhost:3000/api/appointment")


            const appointmentData = appointmentResponse.data.getAll
            for (const appointment of appointmentData) {
                const _date = appointment["date"].split("T")[0]
                if (!(_date in this.appointments[appointment["hair_style_name"]])) {
                    this.appointments[appointment["hair_style_name"]][_date] = []
                }
                this.appointments[appointment["hair_style_name"]][_date].push(appointment)
            }
            for (const hairStyle in this.appointments) {
                for (const date in this.appointments[hairStyle]) {
                    const arr = this.mergeSort(Object.values(this.appointments[hairStyle][date]));
                    this.appointments[hairStyle][date] = arr
                }
            }
        },
        async getHairStyle() {
            const hairStylesResponse = await this.axios.get("http://localhost:3000/api/hair_style")
            const hairStylesData = hairStylesResponse.data
            for (const hairStyle of hairStylesData) {
                this.appointments[hairStyle["hair_style_name"]] = {}
                this.hairStyles.push(hairStyle["hair_style_name"])
            }
        },
        datePickerChange() {
            const format = (date) => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
            return {
                format,
            }

        },
        changePage(val) {
            this.pageClick = val
        },
        logout() {
            const auth = firebase.auth();
            auth.signOut().then(() => {
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