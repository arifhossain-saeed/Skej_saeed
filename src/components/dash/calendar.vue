<template>
  <div class="skej-grey-background m-calendar-page">
    <!-- <v-toolbar flat class="calendar-header" height="65">
      <v-toolbar-title class="pl-8">Calendar</v-toolbar-title>
    </v-toolbar> -->
    <v-container fluid class="pt-0 skej-grey-background">
      <v-row>
        <v-col class="section-1 scroll-section pa-0">
          <v-sheet class="month pb-1 skej-grey-background">
            <v-row>
              <v-col cols="12" sm="1">
                <v-list class="mt-12 pt-5 skej-grey-background d-none d-sm-inline-block">
                  <v-list-item v-for="date in wkStartDates"
                    :to="{
                     name: 'week_calendar',
                     params: {...$route.params },
                     query: {...$route.query, startDate: date}}"
                    :key="`wk-btn-${date}`"
                    class="px-1 week-button"
                    style="width: 60px"
                    >
                    <v-btn color="default" class="ml-auto"
                      fab tile small text>
                      <v-icon>mdi-calendar-week</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="11" class="pt-0">
                <v-sheet id="calendar-wrap" class="pt-1 skej-grey-background">
                  <v-toolbar id="calendar-toolbar" flat dense class="skej-grey-background">
                    <v-spacer/>
                    <v-toolbar-title>
                      <h4 class="font-weight-medium">
                        <span
                          @click="showMonthPicker = !showMonthPicker"
                          class="clickable">{{displayMonth}}</span>&nbsp;
                        <span
                          @click="showYearPicker = !showYearPicker"
                          class="clickable">{{year}}</span>
                      </h4>
                    </v-toolbar-title>
                    <v-spacer/>
                    <div id="color-bar">
                      <div
                        :class="[
                        'event-color', event_colors['type1'],
                        active_types.includes('type1') ? '' : 'inactive'
                        ]"
                        @click="toggleEventTypeActive('type1')"
                      ></div>
                      <div
                        :class="[
                        'event-color', event_colors['type2'],
                        active_types.includes('type2') ? '' : 'inactive'
                        ]"
                      @click="toggleEventTypeActive('type2')"
                      ></div>
                      <div
                        :class="[
                        'event-color', event_colors['type3'],
                        active_types.includes('type3') ? '' : 'inactive'
                        ]"
                        @click="toggleEventTypeActive('type3')"
                      ></div>
                      <div
                        :class="[
                        'event-color', event_colors['type4'],
                        active_types.includes('type4') ? '' : 'inactive'
                        ]"
                        @click="toggleEventTypeActive('type4')"
                      ></div>
                    </div>

                    <v-btn text @click.stop="drawer_right = !drawer_right" color="rgba(0, 0, 0, 0.54)" class="ml-5">
                      List
                      <v-icon right style="vertical-align: middle">mdi-menu</v-icon>
                    </v-btn>

                  </v-toolbar>
                  <month-year-picker
                    :showMonthPicker="showMonthPicker"
                    :showYearPicker="showYearPicker"
                    :calendarFocus="focus"
                    @yearChanged="updateYear($event)"
                    @monthChanged="updateMonth($event)"
                  ></month-year-picker>
                  <v-calendar
                    ref="calendar"
                    :type="'month'"
                    v-model="focus"
                    :events="events"
                    :event-overlap-mode="'column'"
                    :event-color="getEventColour"
                    :event-more="false"
                    :locale="$i18n.locale + '-' + localStorage.country"
                    :show-month-on-first="false"
                    @change="updateRange"
                    @click:date="setFocus($event)"
                  >
                    <template v-slot:day="{ date, week }">
                      <div style="height: 70%;" class="d-flex" :data-week-start="setWeekStart(week)">
                        <div v-for="e in getAllDayEvent(date)"
                          :key="`${date}-${e.allDay}`"
                          class="d-flex all-day-event-frame align-self-start align-center"
                        >
                          <div :class="['vertical-dash', 'mx-1', event_colors[e.type]]"></div>
                          <div v-show="active_types.includes(`type${e.type}`)"
                            class="event-month-calendar-text">{{e.name}}
                          </div>
                        </div>
                        <div style="position: absolute; width: 100%; bottom: 2px;">
                          <v-row dense class="px-2"
                            v-for="(row, i) in eventColorsToDisplay(date)"
                            :key="`${date}-${i}`"
                          >
                            <v-col cols="6" v-for="color in row"
                              :key="`${date}-${i}-${color}`"
                              style="padding-top: 0px; padding-bottom: 1px;"
                            >
                              <div :class="[color, 'event-dash']"></div>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </template>
                    <template v-slot:interval> <p>interval</p> </template>
                </v-calendar>
                </v-sheet>
              </v-col>
            </v-row>
          </v-sheet>
          <div class="pt-1 pl-12">
            <h3 class="mb-6 text--disabled font-weight-medium">Upcoming Events</h3>
            <div v-for="(event, i) in upcomingEvents"
              class="d-flex pr-7 my-2"
              :key="`upcoming${i}`"
              style="height: 50px;"
            >
              <div :class="['vertical-dash', 'mx-1', event_colors[`type${event.type}`]]"></div>
              <v-card flat tile
                class="mr-4 d-inline skej-grey-background"
              >
                <v-card-text
                  class="font-weight-medium">
                  <span v-if="active_types.includes(`type${event.type}`)">{{event.eventName}}</span>
                </v-card-text>
              </v-card>
              <v-spacer></v-spacer>
              <v-card flat tile class="d-inline skej-grey-background my-2">
                <v-card-text class="text--disabled">{{event.start}} | {{event.end}}</v-card-text>
              </v-card>
            </div>
          </div>
        </v-col>
        <v-col v-show="drawer_right" cols="12" md="4" class="selected-day-section scroll-section">
          <h3 class="text-center font-weight-medium">{{focusDateLong}}</h3>
          <day-schedule
            :date="this.focus"
            :events="eventsCopyForDay"
            :active_types="active_types"
            :event_colors="event_colors"
            :type_colors="type_colors"
            :eventTypes="eventTypes"
            @event-updated="$refs.newItemsWidget.getEvents()"
          ></day-schedule>
        </v-col>
      </v-row>
    </v-container>
    <new-items-widget ref="newItemsWidget"
      @eventsRetrieved="refreshEvents"
    ></new-items-widget>
  </div>
</template>

<style lang="scss" scoped>

  #calendar-wrap {
    // max-width: 600px;
    max-height: 560px;
    // display: inline-block;
  }

  // .month #calendar-wrap {
  //   display: inline-block;
  //   width: 94%;
  // }

  #day-controls {
    width: 0 !important;
    overflow-x: hidden;
    transition: width 0.18s;
    float: left;
    border: none;
  }

  .day #day-controls {
    width: 38.2% !important;
    border-right: 1px solid #EEeEeE;
  }

  .v-toolbar .v-btn--fab:focus::before {
    opacity: 0;
  }

  .v-calendar-daily, .v-calendar-weekly {
    border-left: none;
  }

  .event-dash {
    height: 4px;
    border-radius: 5px;
  }
  .vertical-dash {
    height: 100%;
    width: 4px;
    display: inline-block;
    border-radius: 5px;
  }
  .quarter-hour .vertical-dash {
    border-radius: 0px;
  }
  .all-day-event-frame {
    height: 60%;
  }
  .section-1 {
    border-right: 3px solid #EAEAF0;
    overflow-x: hidden;
  }
  #color-bar {
    height: 15px;
    width: 160px;
    display: inline-block;
    display: flex;
    align-items: start;
  }
  #color-bar .event-color {
    display: inline-block;
    width: 40px;
    height: 15px;
    cursor: pointer;
  }
  #color-bar .event-color.inactive {
    height: 7px;
  }
  #color-bar .event-color:first-of-type {
    border-top-left-radius: 5px;
  }
  #color-bar .event-color:last-of-type {
    border-top-right-radius: 5px;
  }
  .v-picker.v-card {
    position: absolute;
    z-index: 100;
  }
</style>

<style lang="scss">
  @import "../../styles/global-vars.scss";

  .v-calendar-daily, .v-calendar-daily * {
    border: none !important;
    background-color: #f3f3ff;
  }
  .v-calendar-daily__intervals-head::after {
    display: none;
  }
  .v-calendar-daily__scroll-area {
    overflow-y: visible;
  }
  .border-pink {
    border-right: 4px solid #e20052;
  }
  .upcoming-section * {
    background-color: #f3f3ff;
  }
  // .v-sheet.month {
  //   // height: calc(100vh - 300px);
  // }
  @media(min-width: 960px) {
    .selected-day-section, .section-1 {
      height: calc(100vh - 60px);
    }
  }
  .v-calendar-weekly__day-label,
  .v-calendar-weekly__head-weekday,
  .v-calendar-weekly__day,
  .theme--light.v-calendar-weekly .v-calendar-weekly__head-weekday,
  .theme--light.v-calendar-weekly .v-calendar-weekly__head-weekday.v-outside,
  .theme--light.v-calendar-weekly .v-calendar-weekly__day.v-outside {
    background-color: #f3f3ff;
  }
  .theme--light.v-calendar-weekly .v-calendar-weekly__day.v-outside,
  .theme--light.v-calendar-weekly .v-calendar-weekly__day.v-outside .v-calendar-weekly__day-label {
    background-color: #EEEEEE !important;
  }
  .v-calendar-weekly__day-label {
    margin-top: 0px;
    max-height: 20px;
  }
  @media(min-width: 1350px) {
    .v-calendar-weekly__day-label {
      margin-top: 0px;
      max-height: 30px;
    }
  }
  .calendar-header {
    border-bottom: 3px solid #EAEAF0 !important;
    border-top: 1px solid #EAEAF0 !important;
    background-color: #f3f3ff !important;
  }
  // This isn't great, but I have no other way to identify these divs
  // that are throwing off the layout
  div[style*='height: 21px']:empty {
    height: 0px !important;
  }

  @media (max-width: 850px) {
    .v-calendar-weekly__day-label {
      margin-top: 0px;
      height: 25px;
    }
    .event-month-calendar-text {
      font-size: 0.8em;
    }
    .all-day-event-frame {
      height: 40%;
    }
  }

  @media only screen and (min-width: 959px) and (max-width: 1100px) {
    .v-calendar-weekly__day-label {
      margin-top: 0px;
      height: 25px;
    }
    .event-month-calendar-text {
      font-size: 0.8em;
    }
    .all-day-event-frame {
      height: 40%;
    }
  }

  @media (max-width: 600px) {
    .event-month-calendar-text {
      font-size: 0px;
    }
    .v-calendar-weekly__day-label .v-btn__content {
      align-self: start !important;
    }
  }

  .week-button {
    height: 5vw;
    // width: 5vw;
  }

  .v-sheet.month .v-calendar-weekly__day {
    // width: 2vw;
    height: 4vw;
    border-left: 1px solid #EEEEEE;
    border-right: 1px solid #EEEEEE;
    font-size: 12px;
  }

  @media(max-width: 959px) {
    .v-sheet.month .v-calendar-weekly__day, .week-button{
      height: 8vw;
    }
  }
  // @media(min-width: 1350px) {
    .v-sheet.month .v-calendar-weekly__day, .week-button{
      height: 80px;
      width: 90px
    }
  // }
  .theme--light.v-calendar-weekly .v-calendar-weekly__head-weekday {
    border-left: 1px solid #EEEEEE;
    border-right: 1px solid #EEEEEE;
  }

  .v-calendar-monthly {
    .v-calendar-weekly__day {
      padding-bottom: 2px;
    }

    .v-calendar-weekly__week:last-child .v-calendar-weekly__day {
      padding-bottom: 4px;
    }
  }

  .v-application.rtl #calendar-toolbar .v-icon {
    transform: rotate(180deg);
  }

  //Fixing bugs in the calendar when in RTL mode
  .v-application.rtl {
    .v-calendar-weekly {
      border-left: #EEeEeE 1px solid !important;
    }

    #day-controls {
      float: right;
      border-right: none;
      border-left: 1px solid #EEeEeE;
    }

    .day .v-calendar-daily__intervals-body {
      border-right: none;
    }

    .v-calendar-daily__head {
      margin-right: 0 !important;
      margin-left: 17px !important;

      .v-calendar-daily__intervals-head::after {
        background: linear-gradient(-90deg, transparent, #EEeEeE);
      }
    }

    .v-calendar-daily__interval {
      padding-left: 8px !important;
      padding-right: 0 !important;

      .v-calendar-daily__interval-text {
        text-align: left !important;
        padding-left: 4px !important;
        padding-right: 0 !important;
      }

      &::after {
        left: 0 !important;
        right: unset !important;
      }
    }

    .v-calendar .pl-1 {
      padding: 0 4px 0 0 !important;
    }
  }

  .v-calendar-monthly .v-calendar-weekly__head-weekday {
    padding-top: 4px;
    line-height: 11px;
  }
  .v-event, .v-event * {
    // font-size: 0 !important;
    // height: 4px !important;
    display: none;
  }
  .hr15, .hr30, .hr45 {
    line-height: 0.9rem
  }
  .v-event-timed {
    display: none;
  }
  .border-green {
    border-right: 4px solid $skej-green;
  }
  .border-cyan {
    border-right: 4px solid cyan;
  }
  .border-orange {
    border-right: 4px solid orange;
  }
  .border-red{
    border-right: 4px solid red;
  }
  .quarter-hour {
    height: 16px;
  }
  .hour-interval {
    font-size: 14px;
    line-height: 1.14;
  }
  .transparent-text {
    color: rgba(0, 0, 0, 0.0);
  }
</style>

<script>
// import i18n from '@/i18n'
// import axios from 'axios'

export default {
  name: 'calendar',
  data: () => ({
    start: null,
    end: null,
    focus: new Date().toISOString().substring(0, 10),
    year_month: new Date().toISOString().substring(0, 7),
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    events: [],
    eventsCopyForDay: [],
    days: {},
    active_types: ['type1', 'type2', 'type3', 'type4'],
    event_colors: { type1: 'cyan', type2: 'green', type3: 'orange', type4: 'red' },
    type_colors: ['cyan', 'green', 'orange', 'red'],
    eventTypes: ['type1', 'type2', 'type3', 'type4'],
    upcomingEvents: [],
    wkStartDates: [],
    intervals: [],
    showMonthPicker: false,
    showYearPicker: false,
    day_start: 7,
    polling: null,
    drawer_right: true
  }),

  computed: {
    title () {
      const { start, end } = this
      if (!start || !end) return ''
      const startMonth = this.monthFormatter(start)
      const startYear = start.year
      return `${startMonth} ${startYear}`
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long'
      })
    },
    displayMonth () {
      const { start, end } = this
      if (!start || !end) return ''
      const month = this.monthFormatter(start)
      return month
    },
    focusDateLong () {
      var today = new Date()
      var focusDate = new Date(`${this.focus}T${today.toISOString().split('T')[1]}`)
      return focusDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  },
  methods: {
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    nth (d) {
      return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    buildDaysArray () {
      const dateRange = this.getDatesInRange(new Date(this.start.date), new Date(this.end.date))
      for (var date of dateRange) {
        this.days[date] = []
      }
    },
    updateRange ({ start, end }) {
      this.wkStartDates = []
      this.start = start
      this.end = end
      this.updateEvents()
    },
    updateEvents () {
      this.buildDaysArray()
      for (var e of this.events) {
        const startDate = new Date(e.start.split(' ')[0])
        const endDate = new Date(e.start.split(' ')[0])
        // if (startDate !== endDate) {
        const eventDates = this.getDatesInRange(startDate, endDate)
        for (var edate of eventDates) {
          if (edate in this.days) {
            if (!this.days[edate].includes(e)) {
              this.days[edate].push(e)
            }
          }
        }
      }
      this.getUpcomingEvents()
    },
    getUpcomingEvents () {
      this.upcomingEvents = []
      const today = new Date()
      var maxUpcoming = 3
      this.events.sort((a, b) => (a.start > b.start) ? 1 : -1)
      for (var ev of this.events) {
        const eventStart = Date.parse(ev.start)
        if (eventStart >= today) {
          if (this.upcomingEvents.length < maxUpcoming) {
            if (!this.upcomingEvents.includes(ev)) {
              this.upcomingEvents.push(ev)
            }
          } else {
            return
          }
        }
      }
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    getEventColour (event) {
      return event.color
    },
    getDatesInRange (start, end) {
      var arr = []
      var rangeDone = false
      while (!rangeDone) {
        var dt = start
        dt.setDate(dt.getDate() + 1)
        arr.push(this.formatDate(new Date(dt), true).split(' ')[0])
        if (dt >= end) {
          rangeDone = true
        }
      }
      return arr
    },
    formatDate (a, withTime) {
      return withTime
        // Leading 0 needed for months/dates when comparing with calendar dates
        ? `${a.getFullYear()}-${('0' + (a.getMonth() + 1)).slice(-2)}-${('0' + (a.getDate())).slice(-2)} ${a.getHours()}:${('0' + (a.getMinutes())).slice(-2)}`
        : `${a.getFullYear()}-${('0' + (a.getMonth() + 1)).slice(-2)}-${('0' + (a.getDate())).slice(-2)}`
    },
    eventColorsToDisplay (date) {
      const colors = []
      if (!(date in this.days)) {
        return []
      }
      const dayEvents = this.days[date]
      for (var e of dayEvents) {
        if (!e.allDay) {
          if (!colors.includes(this.event_colors[`type${e.type}`]) && colors.length < 4) {
            colors.push(this.event_colors[`type${e.type}`])
          }
        }
      }
      const rows = []
      const row1 = []
      const row2 = []
      for (var i = 0; i < colors.length; i++) {
        var color = colors[i]
        if (i < 2) {
          row1.push(color)
        } else {
          row2.push(color)
        }
      }
      if (row2.length) { rows.push(row2) }
      if (row1.length) { rows.push(row1) }
      return rows
    },
    getAllDayEvent (date) {
      const allDayEvent = []
      if (!(date in this.days)) {
        return []
      }
      const dayEvents = this.days[date]
      for (var e of dayEvents) {
        if (e.allDay) {
          allDayEvent.push(e)
          return allDayEvent
        }
      }
      return []
    },
    setWeekStart (week) {
      const dt = week[0].date
      if (!this.wkStartDates.includes(dt)) {
        this.wkStartDates.push(dt)
      }
      return dt
    },
    toggleEventTypeActive (type) {
      if (this.active_types.includes(type)) {
        var index = this.active_types.indexOf(type)
        this.active_types.splice(index, 1)
      } else {
        this.active_types.push(type)
      }
    },
    setFocus ($event) {
      this.focus = $event.date
    },
    updateMonth (month) {
      this.month = month
      const dt = new Date(this.focus)
      dt.setMonth(this.month)
      this.focus = dt.toISOString().substring(0, 10)
      setTimeout(() => {
        this.showMonthPicker = false
      }, 500)
    },
    updateYear (year) {
      this.year = year
      const dt = new Date(this.focus)
      dt.setYear(this.year)
      this.focus = dt.toISOString().substring(0, 10)
      setTimeout(() => {
        this.showYearPicker = false
      }, 500)
    },
    refreshEvents ($event) {
      this.events = $event
      this.eventsCopyForDay = [...$event]
      this.processEvents()
      this.updateEvents()
    },
    processEvents () {
      for (var event of this.events) {
        const startDT = new Date(event.eventStart)
        const endDT = new Date(event.eventEnd)
        event.start = this.formatDate(startDT, true)
        event.end = this.formatDate(endDT, true)
        event.name = event.eventName
        // event.type = this.event_colors[event.type]
      }
    }
  },
  mounted () {
    // console.log(this.focus)
  }
}
</script>
