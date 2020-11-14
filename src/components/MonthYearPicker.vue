<template>
  <div>
    <v-sheet v-if="showYearPicker"
      class="mx-auto mb-1"
      style="border-radius: 30px;"
    >
      <v-slide-group
        show-arrows
        center-active
        v-model="yearOptionsIndex"
        @change="selectYear"
      >
        <v-slide-item
          v-for="(year, i) in yearOptions"
          :key="`year-picker-${year}`"
          v-slot:default="{ active, toggle }"
        >
          <v-btn
            :text="!active"
            :class="['mx-2', yearOptionsIndex === i ? 'cyan white--text':'']"
            depressed
            rounded
            @click="toggle"
          >
            {{year}}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    <v-sheet v-if="showMonthPicker"
      class="mx-auto mb-1"
      style="border-radius: 30px;"
    >
      <v-slide-group
        show-arrows
        center-active
        v-model="monthListIndex"
        @change="selectMonth"
      >
        <v-slide-item
          v-for="(month, i) in months"
          :key="`month-picker-${month}`"
          v-slot:default="{ active, toggle }"
        >
          <v-btn
            :text="!active"
            :class="['mx-2', monthListIndex === i ? 'cyan white--text':'']"
            depressed
            rounded
            @click="toggle"
          >
            {{month}}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>

export default {
  name: 'month-year-picker',
  props: ['calendarFocus', 'showMonthPicker', 'showYearPicker'],
  data: () => {
    return ({
      currentYear: new Date().getFullYear(),
      selectedYear: new Date().getFullYear(),
      yearOptionsIndex: 0,
      monthListIndex: new Date().getMonth(),
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    })
  },
  computed: {
    yearOptions () {
      const start = this.currentYear - 10
      const end = this.currentYear + 10
      const years = []
      for (var y = start; y < end; y++) {
        years.push(y)
      }
      return years
    }
  },
  methods: {
    selectYear () {
      if (this.selectedYear === undefined || this.yearOptionsIndex === undefined) {
        const dt = new Date(this.calendarFocus)
        this.selectedYear = dt.getFullYear()
        this.yearOptionsIndex = this.yearOptions.indexOf(this.selectedYear)
      } else {
        this.selectedYear = this.yearOptions[this.yearOptionsIndex]
      }
      this.$emit('yearChanged', this.selectedYear)
    },
    selectMonth () {
      if (this.monthListIndex === undefined) {
        const dt = new Date(this.calendarFocus)
        this.monthListIndex = dt.getMonth()
      }
      this.$emit('monthChanged', this.monthListIndex)
    }
  },
  mounted () {
    const dt = new Date(this.calendarFocus)
    this.selectedYear = dt.getFullYear()
    this.monthListIndex = dt.getMonth()
    this.yearOptionsIndex = this.yearOptions.indexOf(this.selectedYear)
  }
}
</script>
