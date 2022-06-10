<template>
    <div>
        <h1>Register</h1>
        <form @submit="onSubmit">
            <input type="text" placeholder="Register" v-model="email" />
            <input type="password" placeholder="Password" v-model="password" />
            <input type="submit" value="register" />
        </form>
    </div>
</template>
<script>
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"

export default {
    name: "registerPage",
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {

        onSubmit(e) {
            e.preventDefault()
            const auth = firebase.auth();
            auth.createUserWithEmailAndPassword(this.email, this.password).then(user => {
                console.log(user);
            }).catch(err =>
                console.log(err.message)
            )
        }
    }
}

</script>
<style>
</style>