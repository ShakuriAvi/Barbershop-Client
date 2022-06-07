<template>
    <div>
        <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
        <select class="form-select" id="inlineFormSelectPref" :disabled="disabled_bool" v-model="selected_item"
            :change="selectTime()">
            <option selected :value="null">Choose Hour</option>
            <option v-for="time in _times" :key="time.hour" :value="time.hour" :disabled="time.bool">{{ time.hour }}
            </option>
        </select>
    </div>
</template>
<script>

export default {
    data() {
        return {
            selected_item: null,
            times: []
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
        hair_style: {
            default() {
                null
            },
            type: String
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
            this.$emit("selectTime", this.selected_item)
        }
    },
    mounted() {
        for (let i = 0; i < 24; i++) {
            const element = i;
            let str_time = element.toString()
            if (element < 10) {
                str_time = "0" + element.toString()
            }
            this.times.push({ hour: str_time + ":00", bool: false })
            this.times.push({ hour: str_time + ":30", bool: false })

        }
    },
    computed: {
        _times() {
            const items = this.times
            if (!this.date)
                return []
            console.log(this.appointments, this.hair_style, this.date.getDate());

            const day = this.date.getDate() < 10 ? "0" + this.date.getDate().toString() : this.date.getDate();
            const month = this.date.getMonth() + 1 < 10 ? "0" + (this.date.getMonth() + 1).toString() : this.date.getMonth() + 1;
            const year = this.date.getFullYear();
            const _date = `${year}-${month}-${day}`;
            const current_appointments = this.appointments[this.hair_style][_date]
            console.log(current_appointments);
            if (!current_appointments)
                return this.times
            const arr = Object.values(current_appointments)

            arr.forEach(item => {
                console.log(item.start_time);
                const current_item_time = item.start_time.toString().split(":")
                console.log(parseInt(current_item_time[0]) * 2 + 1);
                if (current_item_time[1] == "30")
                    this.times[parseInt((current_item_time[0]) * 2) + 1].bool = true
                else {
                    this.times[parseInt((current_item_time[0]) * 2)].bool = true
                }

            })
            return items
        }
    }
}
</script>
<style scoped>
</style>