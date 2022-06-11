<template>
    <div v-if="disabled_bool">
        <table class="table" style="margin-top: 2rem; background-color: #EA7B83 ;">
            <thead>
                <tr style="color:white ;">
                    <th style=" color:white ; font-weight: bold;" scope=" col" v-for="hairstyle in hairStyles"
                        :key="hairstyle">
                        {{ hairstyle }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(appointments, index) in _appointments" :key="index">
                    <th style="color:white ;" v-for=" appointment of appointments" :key="appointment">
                        {{ appointment }}
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>

export default {
    data() {
        return {
            selected_time: null,
            temp: []
        }
    },
    props: {
        disabled_bool: {
            default() {
                false
            },
            type: Boolean
        },
        appointments: {
            default() {
                null
            },
            type: Object
        },
        hairStyles: {
            default() {
                []
            },
            type: [String]
        },
        date: {
            default() {
                null
            },
            type: String
        }
    },
    methods: {
        selectTime() {
            // this.$emit("selectTime", this.selected_item)
        }
    },
    mounted() {

    },
    computed: {
        _appointments() {
            if (!this.date)
                return []
            const day = this.date.getDate() < 10 ? "0" + this.date.getDate().toString() : this.date.getDate();
            const month = this.date.getMonth() + 1 < 10 ? "0" + (this.date.getMonth() + 1).toString() : this.date.getMonth() + 1;
            const year = this.date.getFullYear();
            const _date = `${year}-${month}-${day}`;
            let obj = JSON.parse(JSON.stringify(this.appointments)) // depp copy
            let sizeArr = 0
            for (const hairStyle of this.hairStyles) {
                if (obj[hairStyle][_date] && obj[hairStyle][_date].length > sizeArr) {
                    sizeArr = obj[hairStyle][_date].length
                }
            }
            let items = {}
            for (let index = 0; index < sizeArr; index++) {
                items[index] = []
                for (const hairStyle of this.hairStyles) {
                    if (obj[hairStyle][_date] && obj[hairStyle][_date][index]) {
                        const appointment = obj[hairStyle][_date][index]
                        const str = `${appointment.start_time} - ${appointment.end_time} : ${appointment.customer_name} - ${appointment.phone}`
                        items[index].push(str)
                    } else {
                        items[index].push("")
                    }
                }
            }
            console.log(items);
            return items
        }
    },
    watch: {
        _appointments: {
            deep: true,
            handler: function (newVal) {
                const day = this.date.getDate() < 10 ? "0" + this.date.getDate().toString() : this.date.getDate();
                const month = this.date.getMonth() + 1 < 10 ? "0" + (this.date.getMonth() + 1).toString() : this.date.getMonth() + 1;
                const year = this.date.getFullYear();
                const _date = `${year}-${month}-${day}`;
                this.selected_time = _date
            }
        }
    }
}
</script>
<style scoped>
</style>