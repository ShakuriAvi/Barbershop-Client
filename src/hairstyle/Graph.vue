<template>
    <div>
        <div style="text-align:center; margin-bottom: 2rem;">
            <h1 style="color:red ;"> Best Hair Style</h1>
        </div>
        <div class="row g-0">
            <div class="col-sm-6 col-md-2">
                <h5 style="text-align:center ">Choose Date : </h5>
            </div>
            <div class="col-6 col-md-9">
                <Datepicker v-model="date" range :partialRange="false" />
            </div>
            <div class="col-6 col-md-1">
                <button class="btn btn-primary" v-on:click="datePickerChange()"> Send </button>
            </div>
        </div>
        <div>

            <Chart :size="{ width: 500, height: 400 }" :data="data" :margin="margin" :direction="direction">

                <template #layers>
                    <Grid strokeDasharray="2,2" />
                    <Line :dataKeys="['name', 'pl']" />
                </template>

            </Chart>
        </div>
    </div>
</template>

<script >
import { Chart, Grid, Line } from 'vue3-charts'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default ({
    name: 'graphData',
    components: { Chart, Grid, Line, Datepicker },
    data() {
        return {
            date: null,
            showGraph: false,
            data: "",
            direction: 'horizontal',
            margin: {
                left: 0,
                top: 20,
                right: 20,
                bottom: 0
            }
        }
    },
    methods: {
        async datePickerChange() {
            this.showGraph = false
            let items = []
            let start_date = this.date[0]
            let day = start_date.getDate() < 10 ? "0" + start_date.getDate().toString() : start_date.getDate();
            let month = start_date.getMonth() + 1 < 10 ? "0" + (start_date.getMonth() + 1).toString() : start_date.getMonth() + 1;
            let year = start_date.getFullYear();
            start_date = `${year}-${month}-${day}`;

            let end_date = this.date[1]
            day = end_date.getDate() < 10 ? "0" + end_date.getDate().toString() : end_date.getDate();
            month = end_date.getMonth() + 1 < 10 ? "0" + (end_date.getMonth() + 1).toString() : end_date.getMonth() + 1;
            year = end_date.getFullYear();
            end_date = `${year}-${month}-${day}`;

            const payload = {
                "start_date": start_date,
                "end_date": end_date
            }
            const response = await this.axios.post("http://localhost:3000/api/appointment/best_haircut", payload)
            items = response.data
            this.data = []
            const arr = []
            for (const item of items) {
                arr.push({ "name": item["hair_style_name"], "pl": item["num_appointments"] })
            }
            this.data = arr

            this.showGraph = true
        },
    },
})
</script>

<style scoped>
#app {
    color: #2ecc71
}
</style>