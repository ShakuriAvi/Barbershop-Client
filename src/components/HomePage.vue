<template>
  <div>
    <div class="container">
      <div class="row align-items-start">>
        <div class="col-6">
          1 of 2
        </div>
        <div class="col align-self-end">
        </div>
      </div>
      <img src="../assets/barbershop_icon.png" style="max-width:12.5rem" />
      <div class="unit">
        <div class="row row-cols-2 row-cols-lg-6 g-2 g-lg-3" style="margin: 10rem;">
          <div class="col">
            <button type="submit" class="btn btn-primary"
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
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import DropDownTimes from './DropDownTimes.vue';
import DropDownHairStyle from './DropDownHairStyle.vue';

export default {
  name: 'HomePage',
  components: { Datepicker, DropDownHairStyle, DropDownTimes },
  data() {
    return {
      date: null,
      selected_hairStyle: null,
      selected_time: null,

      appointments: {},
      user_watch: 0,
      phone_number: null,
      customer_name: null,
      hairStyles: [],
      hair_style_choose: null,
      time_choose: null,
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
      this.user_watch = appointmentResponse.data.cache
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
