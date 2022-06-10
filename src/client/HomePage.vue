<template>
  <div>
    <h5 style="float: left; margin-left: 2rem;"> views :
      {{ user_watch }}</h5>
    <div class="container">
      <div class="row g-0">
        <div class="col-sm-6 col-md-8"></div>
        <div class="col-6 col-md-4"><button type="button" @click="login()" class="btn btn-info"
            style="float: right;">Login</button>
        </div>
      </div>
      <div style="text-align:center">
        <img src="../assets/barbershop_icon.png" style="max-width:12.5rem ;text-align:center" />
      </div>
      <div class="unit">
        <div class="row row-cols-2 row-cols-lg-6 g-2 g-lg-3" style="margin: 10rem;">
          <div class="col">
            <button v-on:click="saveAppointment()" class="btn btn-primary"
              :disabled="!(date && selected_hairStyle && selected_time && customer_name && phone_number)">Save</button>
          </div>
          <div class="col-2">
            <b-form-input v-model="phone_number" type="number" placeholder="Phone Number"
              :disabled="!(date && selected_hairStyle && selected_time && customer_name)">
            </b-form-input>
          </div>
          <div class="col-2">
            <b-form-input v-model="customer_name" placeholder="Full Name"
              :disabled="!(date && selected_hairStyle && selected_time)"></b-form-input>
          </div>
          <div class="col">
            <DropDownTimes :disabled_bool="!(date && selected_hairStyle)" :appointments="appointments" :date="this.date"
              :hair_style="selected_hairStyle" @selectTime="selectTime($event)" />
          </div>
          <div class="col">
            <Datepicker v-model="date" :format="format" />
          </div>
          <div class="col">
            <DropDownHairStyle :names="hairStyles" @selectHairStyles="selectHairStyles($event)" />
          </div>
        </div>
        <div>
          <h4>
            {{ error }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import DropDownTimes from '../components/DropDownTimes.vue';
import DropDownHairStyle from '../components/DropDownHairStyle.vue';
import login from '../hairstyle/LoginPage.vue';
import { useRouter } from "vue-router"

export default {
  name: 'HomePage',
  components: { Datepicker, DropDownHairStyle, DropDownTimes },
  data() {
    return {
      date: null,
      selected_hairStyle: null,
      selected_time: null,
      error: null,
      appointments: {},
      user_watch: 0,
      phone_number: null,
      customer_name: null,
      hairStyles: [],
      hair_style_choose: null,
    }
  },
  setup() {
    // In case of a range picker, you'll receive [Date, Date]
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
  methods: {
    async saveAppointment() {
      if (this.customer_name.length < 2) {
        this.error = "Please enter correct name"
        return
      } else {
        this.error = null
      }
      if (this.phone_number.match(/^[0-9]+$/) != null && this.phone_number.length == 10) {
        this.error = null
      } else {
        this.error = "Please enter correct phone_number"
        return
      }
      let end_time = ":00"
      if (this.selected_time.split(":")[1] == "30") {
        let hour = parseInt(this.selected_time.split(":")[0]) + 1
        if (hour < 10) {
          hour = "0" + hour.toString()
        }
        end_time = hour.toString() + end_time
      } else {
        end_time = ":30"
        end_time = this.selected_time.split(":")[0] + end_time
      }
      const payload = {
        "customer_name": this.customer_name,
        "hair_style_name": this.selected_hairStyle,
        "start_time": this.selected_time,
        "end_time": end_time,
        "date": this.date,
        "phone": this.phone_number
      }
      const response = await this.axios.post("http://localhost:3000/api/appointment/insert_new_one", payload)
      console.log(response);
      if (response.data == "success") {
        location.reload();

      }
      else {
        this.error = response.data

      }
    },
    selectHairStyles(item) {
      this.selected_hairStyle = item
    },
    selectTime(item) {
      this.selected_time = item
    },
    async getHairStyle() {
      const hairStylesResponse = await this.axios.get("http://localhost:3000/api/hair_style")
      const hairStylesData = hairStylesResponse.data
      for (const hairStyle of hairStylesData) {
        this.appointments[hairStyle["hair_style_name"]] = {}
        this.hairStyles.push(hairStyle["hair_style_name"])
      }
    },
    async getAppointments() {
      const appointmentResponse = await this.axios.get("http://localhost:3000/api/appointment")

      this.user_watch = Object.entries(appointmentResponse.data.cache)[0][1]

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
          console.log(arr);
        }
      }
    },

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
    login() {
      console.log("/login");
      this.$router.replace({ path: '/hairstyle/login' });

    }
  },
  async mounted() {
    await this.getHairStyle()
    await this.getAppointments()
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.solid {
  border-style: solid;
  margin: 4rem;
}

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
