<template>
    <div>
        <div class="container">

            <div class="row g-0">
                <div class="col-sm-6 col-md-8">

                </div>
                <div class=" col-6 col-md-4"><button type="button" @click="homePage()" class="btn btn-primary"
                        style="float: right;  margin-top:2rem ;">Home</button>
                </div>
            </div>

            <div class="unit">
                <h1 style="text-align:center; color: white; margin-top: 1rem;">Admin Panel</h1>
                <form @submit="onSubmit" style="text-align:center;  margin: 3rem;">
                    <b-form-input style="  margin: 1rem;" type=" text" placeholder="Email" v-model="email" />
                    <b-form-input style=" margin: 1rem;" type="password" placeholder="Password" v-model="password" />
                    <button class="btn btn-primary" type="submit">Login</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"
export default {
    name: 'loginPage',
    data() {
        return {
            email: '',
            password: '',
        }
    },
    mounted() {
        const auth = firebase.auth();
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.$router.replace({ path: '/hairstyle/' });
            } else {
                this.$router.replace({ path: '/hairstyle/login' });

            }
        })
    },
    methods: {
        homePage() {
            this.$router.replace({ path: '/' });
        },
        onSubmit(e) {
            e.preventDefault()
            const auth = firebase.auth();
            auth.
                signInWithEmailAndPassword(this.email, this.password).then(data => {
                    this.$router.replace({ path: '/hairstyle/' });

                }).catch(err =>
                    console.log(err.message)
                )
        }
    },
}
</script>
<style scoped>
.unit {
    border-radius: 1rem;
    box-shadow: 0px 1rem 2rem;
    margin: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    min-width: 40%;
    background-color: #db3434;
}
</style>