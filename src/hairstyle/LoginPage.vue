<template>
    <div>
        <h1>Login</h1>
        <form @submit="onSubmit">
            <input type="text" placeholder="Email" v-model="email" />
            <input type="password" placeholder="Password" v-model="password" />
            <input type="submit" value="login" />
        </form>
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
            console.log(user);
            if (user) {
                this.$router.replace({ path: '/hairstyle/' });
            } else {
                this.$router.replace({ path: '/hairstyle/login' });

            }
        })
    },
    methods: {
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
<style>
</style>