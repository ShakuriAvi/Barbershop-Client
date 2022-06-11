<template>
    <div class="unit">
        <h1 style="text-align:center; color: white; margin-top: 1rem;">Register</h1>
        <form @submit="onSubmit" style="text-align:center;  margin: 3rem;">
            <b-form-input style="  margin: 1rem;" type=" text" placeholder="Email" v-model="email" />
            <b-form-input style="  margin: 1rem;" type=" text" placeholder="Please Enter Full Name"
                v-model="full_name" />
            <b-form-input style="  margin: 1rem;" type="number" placeholder="Please Enter Your Phone"
                v-model="phone_number" />
            <b-form-input style=" margin: 1rem;" type="password" placeholder="Password" v-model="password" />
            <button class="btn btn-primary" type="submit">Register</button>
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
            phone_number: '',
            full_name: '',
        }
    },
    methods: {

        async onSubmit(e) {
            e.preventDefault()
            const auth = firebase.auth();
            auth.createUserWithEmailAndPassword(this.email, this.password).then(user => {
                console.log(user);
            }).catch(err =>
                console.log(err.message)

            )
            const payload = {
                "hair_style_name": this.full_name,
                "email": this.email,
                "phone": this.phone_number
            }
            const response = await this.axios.post("http://localhost:3000/api/hair_style/insert_new_one", payload)
            console.log(response);
            if (response.data == "success") {
                this.$router.replace({ path: '/finish' });

            }
            else {
                this.error = response.data
            }

        }
    }
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