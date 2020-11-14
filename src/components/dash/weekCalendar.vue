<template>
  <div class="skej-grey-background w-calendar-page">
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card flat class="skej-grey-background" min-width="300">
          <div class="d-flex">
            <div class="d-inline-block" style="width: 4px">
              <div class="d-flex flex-column" style="height: 100%">
                <div :class="['vertical-dash mr-4 left-radius', event_colors[`type${eventEditForm.type}`]]"
                  style="flex: 1 0 auto"></div>
              </div>
            </div>
            <v-card-text class="skej-text py-2 pl-1 pr-2">
              <v-btn x-small fab text outlined class="float-right" @click="clearSelectedEvent">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <!-- <a class="float-right ma-2 text-decoration-underline"
                @click="updateEvent()"
              >Save</a> -->
              <div class="ml-4 mt-2">
                <div class="d-inline-block font-weight-normal text-h5 mb-2">
                  <event-type-color-picker @colorSelected="setEventEditTypeInput($event)"
                  :initialColorIndex="eventEditForm.type - 1"
                  ></event-type-color-picker>
                  <span v-show="!eventEditForm.showNameInput" class="clickable"
                    @click="eventEditForm.showNameInput = true"
                  >{{eventEditForm.eventName}}</span>
                  <v-text-field v-if="eventEditForm.showNameInput"
                    placeholder="Name" rounded filled dense
                    v-model="eventEditForm.eventName" class="d-inline-block"
                  ></v-text-field>
                </div>
                <p v-show="!eventEditForm.showDescInput" class="clickable"
                  @click="eventEditForm.showDescInput = true"
                >{{eventEditForm.eventDesc}}</p>
                <v-text-field v-show="eventEditForm.showDescInput"
                  placeholder="Description" rounded filled dense
                  v-model="eventEditForm.eventDesc"
                  ></v-text-field>
                <p>Members: {{selectedEvent?selectedEvent.user_list:''}}</p>
                <v-slide-group multiple show-arrows class="mb-2">
                  <v-slide-item
                    v-for="(button, key) in eventEditFieldButtons"
                    :key="`event-edit-button-${key}`"
                    v-slot:default="{}"
                  >
                    <v-slide-y-transition>
                      <button v-show="!button.showInput"
                        @click="button.showInput=!button.showInput"
                        class="mx-2 skej-option-btn"
                      >
                        {{button.text}}
                      </button>
                    </v-slide-y-transition>
                  </v-slide-item>
                </v-slide-group>
              </div>
            </v-card-text>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
    <v-container fluid class="px-0 pt-0">
      <v-row no-gutters>
        <v-col cols="12" md="8">
          <div class="section-1 scroll-section">
            <v-toolbar flat dense height="72" color="skej-grey-background">
              <v-btn text default :to="{ name: 'calendar' }"><v-icon>mdi-arrow-left</v-icon></v-btn>
              <v-spacer/>
              <v-btn text small color="grey" @click="prev">
                <v-icon large>mdi-menu-left</v-icon>
                <!-- <v-icon small>mdi-chevron-left</v-icon> -->
              </v-btn>
              <v-toolbar-title><h3 class="font-weight-medium">{{ title }}</h3></v-toolbar-title>
              <v-btn text small color="grey" @click="next">
                <v-icon large>mdi-menu-right</v-icon>
                <!-- <v-icon small>mdi-chevron-right</v-icon> -->
              </v-btn>
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
            </v-toolbar>
            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col cols="1">
                <v-list class="mt-12 pt-5"
                  flat
                  disabled
                  single-line
                  >
                  <div v-for="hour in hours" :key="`hour-${hour.hr}`">
                    <v-list-item v-if="hour.hr >= day_start" class="pt-0 px-0">
                      <v-card flat tile>
                        <v-card-text
                          class="font-weight-bold py-0 pr-0">
                          <div class="hrstart pr-4">
                            {{hour.hr}}:00
                          </div>
                          <div class="hr15 text--disabled">
                            15
                          </div>
                          <div class="hr30 text--disabled">
                            30
                          </div>
                          <div class="hr45 text--disabled">
                            45
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-list-item>
                  </div>
                </v-list>
              </v-col>
              <v-col cols="11">
                <v-calendar
                  ref="week_calendar"
                  :type="'week'"
                  v-model="focus"
                  :locale="$i18n.locale + '-' + localStorage.country"
                  :event-more="false"
                  :first-interval="28"
                  :interval-count="68"
                  :interval-minutes="15"
                  interval-height="20px"
                  :interval-format="hourFormat"
                  @change="updateRange"
                >
                <template v-slot:day-label-header="{day}">
                  <div class="text-left my-2 caption">{{day}}</div>
                </template>
                <template v-slot:interval="{ date, hour }">
                  <div v-if="(hour <= 24) && (hour >= day_start)" class="hour-interval">
                    <div
                      v-for="(interval, i) in getInterval(date, hour)"
                      :key="`interval-${i}-${date}-${hour}`"
                    >
                      <div :class="getQuarterClasses(interval, hour, 'start')"
                          @click="interval.event?setSelectedEvent(interval.event.id):{}"
                        >
                        <div :class="['vertical-dash', (interval.quarters.includes('start')? event_colors[`type${interval.event.type}`] : '')]"></div>
                        <span class="pl-1" v-if="active_types.includes(`type${interval.type}`)">{{interval.event.eventName}}</span>
                      </div>
                      <!-- <div :class="getQuarterClasses(interval, hour, 'quarter')"
                          @click="interval.event?setSelectedEvent(interval.event.id):{}"
                        >
                        <div :class="['vertical-dash', (interval.quarters.includes('quarter')? event_colors[`type${interval.event.type}`] : '')]"></div>
                        <span class="pl-1" v-if="active_types.includes(`type${interval.type}`)">{{interval.event.eventName}}</span>
                      </div> -->
                      <!-- <div :class="getQuarterClasses(interval, hour, 'half')"
                          @click="interval.event?setSelectedEvent(interval.event.id):{}"
                        >
                        <div :class="['vertical-dash', (interval.quarters.includes('half')? event_colors[`type${interval.event.type}`] : '')]"></div>
                        <span class="pl-1" v-if="active_types.includes(`type${interval.type}`)">{{interval.event.eventName}}</span>
                      </div> -->
                      <!-- <div :class="getQuarterClasses(interval, hour, 'quarter_til')"
                          @click="interval.event?setSelectedEvent(interval.event.id):{}"
                        >
                        <div :class="['vertical-dash', (interval.quarters.includes('quarter_til')? event_colors[`type${interval.event.type}`] : '')]"></div>
                        <span class="pl-1" v-if="active_types.includes(`type${interval.type}`)">{{interval.event.eventName}}</span>
                      </div> -->
                    </div>
                  </div>
                </template>
                </v-calendar>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="section-2 scroll-section">
            <v-toolbar
              flat
              class="group-toolbar skej-grey-background flex-none"
              height="72"
              >
              <v-toolbar-title class="ml-2">
                <h3 class="font-weight-medium">Upcoming Events</h3>
              </v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <div class="pt-2 pl-2">
              <div v-for="(event, i) in upcomingEvents"
                :key="`upcoming${i}`"
              >
                <h3 v-if="event.show_day_header"
                  class="font-weight-medium my-6">{{event.new_day_header}}
                </h3>
                <div class="d-flex pr-lg-4 my-2" style="height: 55px;">
                  <div :class="['vertical-dash', 'mx-1', event_colors[`type${event.type}`]]"></div>
                  <v-card flat tile
                    class="mr-4 my-2 skej-grey-background"
                  >
                    <v-card-text
                      class="font-weight-medium px-1 py-2">
                      <span v-if="active_types.includes(`type${event.type}`)">{{event.eventName}}</span>
                    </v-card-text>
                  </v-card>
                  <v-spacer></v-spacer>
                  <v-card flat tile class="d-inline skej-grey-background my-2">
                    <v-card-text class="px-1 py-2 text--disabled">{{event.eventStart.substr(11,5)}} - {{event.eventEnd.substr(11,5)}}</v-card-text>
                  </v-card>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <new-items-widget ref="newItemsWidget"
      @eventsRetrieved="refreshEvents"
    ></new-items-widget>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../styles/global-vars.scss";

  .w-calendar-page {
    background-color: $skej-background;
  }
    .w-calendar-page * {
      background-color: $skej-background;
    }

  // .v-toolbar {
  //   // border-bottom: 2px solid #EBEBF1;
  //   // border-top: 2px solid #EBEBF1;
  //   // margin-bottom: 10px;
  // }
  @media(min-width: 959px) {
    .section-1 {
      border-right: 2px solid #EBEBF1;
    }
    .section-1, .section-2 {
      height: 91vh;
      overflow-y: scroll;
    }
  }
  .quarter-hour {
    height: 16px;
  }
  .vertical-dash {
    height: 100%;
    width: 4px;
    display: inline-block;
  }
  .v-calendar .vertical-dash {
    height: 20px;
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
</style>

<style lang="scss">
  .v-calendar-daily__pane {
    height: 100% !important;
  }
  .v-calendar-daily__intervals-body,
  .v-calendar-daily__intervals-head {
    display: block;
  }
  .hr15, .hr30, .hr45, .event-name {
    line-height: 0.9rem
  }
  .v-calendar-daily__day-interval:empty {
    display: none;
  }
  .theme--light.v-calendar-daily,
  .theme--light.v-calendar-daily .v-calendar-daily__day-interval,
  .theme--light.v-calendar-daily .v-calendar-daily__day,
  .theme--light.v-calendar-daily .v-calendar-daily_head-day {
    border: none;
  }
  .v-calendar-daily_head-weekday {
    text-align: left;
    color: rgba(0,0,0,.54);
    margin-top: 1vh;
    font-weight: bold;
    font-size: .8em;
  }
  .v-calendar-daily__scroll-area {
    overflow-y: inherit;
  }
  .hour-interval {
    font-size: 14px;
    line-height: 1.14;
  }
  .transparent-text {
    color: rgba(0, 0, 0, 0.0);
  }
  .nowrap {
    white-space: nowrap;
  }
  .nowrap:hover {
    overflow-x: visible;
    z-index: 10;
  }
</style>

<script>
// import i18n from '@/i18n'
import axios from 'axios'

export default {
  name: 'weekCalendar',

  data: () => ({
    start: null,
    end: null,
    focus: new Date().toISOString().substring(0, 10),
    events: [],
    intervals: {},
    active_types: ['type1', 'type2', 'type3', 'type4'],
    event_colors: { type1: 'cyan', type2: 'green', type3: 'orange', type4: 'red' },
    eventTypes: ['type1', 'type2', 'type3', 'type4'],
    upcomingEvents: [],
    wkStartDates: [],
    hours: [],
    days: {},
    dialog: false,
    eventEditForm: {
      eventName: null,
      eventDesc: null,
      eventStart: null,
      eventEnd: null,
      endHour: null,
      endMinutes: null,
      type: 1,
      showNameInput: false,
      showDescInput: false
    },
    selectedEvent: null,
    editingSelectedEvent: false,
    eventEditFieldButtons: {
      // eventName: { name: 'eventName', showInput: false, text: 'Name' },
      // eventDesc: { name: 'eventDesc', showInput: false, text: 'Description' },
      // start: { name: 'eventStart', showInput: false, text: 'Start Time' },
      // end: { name: 'eventEnd', showInput: false, text: 'End Time' },
      // type: { name: 'type', showInput: false, text: 'Event Color/Type' }
    },
    day_start: 7
  }),

  computed: {
    title () {
      const { start, end } = this
      if (!start || !end) return ''

      const startMonth = this.getMonth(start.month)
      const endMonth = this.getMonth(end.month)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      if (suffixMonth.length) {
        return `${startMonth} ${start.day} - ${suffixMonth} ${end.day}`
      } else {
        return `${startMonth} ${start.day} - ${end.day}`
      }
    }
  },
  methods: {
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.week_calendar.prev()
    },
    next () {
      this.$refs.week_calendar.next()
    },
    nth (d) {
      return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    getMonth (num) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ]
      return months[num - 1]
    },
    updateRange ({ start, end }) {
      this.wkStartDates = []
      this.start = start
      this.end = end
      this.updateEvents()
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    formatDate (a, withTime) {
      return withTime
      // Leading 0 needed for months/dates when comparing with calendar dates
        ? `${a.getFullYear()}-${('0' + (a.getMonth() + 1)).slice(-2)}-${('0' + (a.getDate())).slice(-2)} ${a.getHours()}:${('0' + (a.getMinutes())).slice(-2)}`
        : `${a.getFullYear()}-${('0' + (a.getMonth() + 1)).slice(-2)}-${('0' + (a.getDate())).slice(-2)}`
    },
    buildHours () {
      const hours = []
      for (var i = 1; i < 25; i++) {
        hours.push({
          hr: i,
          start: false,
          quarter: false,
          half: false,
          quarter_til: false,
          event_name: '',
          event_color: '',
          label_quarter: false,
          label_hour: 0
        })
      }
      this.hours = hours
    },
    updateEvents () {
      this.buildIntervals()
      this.getUpcomingEvents()
    },
    setSelectedEvent (eventId) {
      if (eventId !== null) {
        this.selectedEvent = this.events.filter((e) => { return e.id === eventId })[0]
      }
      axios.get(`user/events/${this.selectedEvent.id}/user_list/`, this.todoReorderForm)
        .then((response) => {
          this.selectedEvent.user_list = response.data.join(', ')
          this.editEvent()
        })
        .catch((error) => {
          console.log(error)
        })
      this.dialog = true
    },
    editEvent () {
      this.eventEditForm.eventName = this.selectedEvent.eventName
      this.eventEditForm.eventDesc = this.selectedEvent.eventDesc
      this.eventEditForm.startTime = this.selectedEvent.startTime
      this.eventEditForm.endTime = this.selectedEvent.endTime
      this.eventEditForm.type = this.selectedEvent.type
    },
    clearSelectedEvent () {
      // const newStartTime = new Date(this.selectedEvent.eventStart)
      // const newEndTime = new Date(this.selectedEvent.eventEnd)
      // const startHr = parseInt(this.eventEditForm.startTime.split(':')[0])
      // const startMn = parseInt(this.eventEditForm.startTime.split(':')[1])
      // const endHr = parseInt(this.eventEditForm.endTime.split(':')[0])
      // const endMn = parseInt(this.eventEditForm.endTime.split(':')[1])
      // newStartTime.setHours(startHr)
      // newStartTime.setMinutes(startMn)
      // this.eventEditForm.eventStart = newStartTime.toISOString()
      // newEndTime.setHours(endHr)
      // newEndTime.setMinutes(endMn)
      // this.eventEditForm.eventEnd = newEndTime.toISOString()
      this.eventEditForm.eventStart = this.selectedEvent.eventStart
      this.eventEditForm.eventEnd = this.selectedEvent.eventEnd
      axios.patch(`user/events/${this.selectedEvent.id}/update/`, this.eventEditForm)
        .then((response) => {
          // handle success
          // this.$emit('eventUpdated')
        })
        .catch((error) => {
          console.log(error)
        })
      axios.patch(`user/events/${this.selectedEvent.id}/changetype/`, this.eventEditForm)
        .then((response) => {
          // handle success
          this.selectedEvent.type = this.eventEditForm.type
          for (var key in this.eventEditForm) {
            this.eventEditForm[key] = null
          }
          this.eventEditForm.type = 1
          // This is the original clearSelectedEvent function
          this.editingSelectedEvent = false
          this.selectedEvent = null
          for (var i in this.eventEditFieldButtons) {
            this.eventEditFieldButtons[i].showInput = false
          }
          for (var k in this.eventEditForm) {
            this.eventEditForm[k] = null
          }
          this.eventEditForm.showNameInput = false
          this.$refs.newItemsWidget.getEvents()
          this.dialog = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getUpcomingEvents () {
      this.upcomingEvents = []
      const today = new Date()
      this.events.sort((a, b) => (a.eventStart > b.eventStart) ? 1 : -1)
      for (var ev of this.events) {
        const eventStart = Date.parse(ev.eventStart)
        const dt = new Date(ev.eventStart)
        ev.new_day_header = dt.toLocaleString('en-US', { month: 'long', day: 'numeric' })
        if (eventStart >= today) {
          if (!this.upcomingEvents.includes(ev)) {
            this.upcomingEvents.push(ev)
          }
        }
      }
      for (var i in this.upcomingEvents) {
        const event = this.upcomingEvents[i]
        i = parseInt(i)
        if (this.upcomingEvents.length > 1 && i !== 0) {
          const len = this.upcomingEvents.length
          const previous = this.upcomingEvents[(i + len - 1) % len]
          event.show_day_header = (event.new_day_header !== previous.new_day_header)
        } else {
          event.show_day_header = true
        }
        // if (i === 0) {
        //   console.table('running')
        //   event.show_day_header = true
        // }
      }
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
    roundToQuarterHour (time) {
      const timeToReturn = new Date(time)
      timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15)
      return { hour: timeToReturn.getHours(), minutes: timeToReturn.getMinutes() }
    },
    getEventMidpoint (start, end) {
      const diff = end - start
      const diffMins = (diff / 1000) / 60
      const minsToMid = Math.floor(((diff / 1000) / 60) / 2)
      const midpoint = new Date(start)
      midpoint.setMinutes(start.getMinutes() + minsToMid)
      const roundedTime = this.roundToQuarterHour(midpoint)
      midpoint.setHours(roundedTime.hour)
      midpoint.setMinutes(roundedTime.minutes)
      const quarters = diffMins / 15
      if (quarters % 2 === 0) {
        midpoint.setMinutes(midpoint.getMinutes() - 15)
      }
      return midpoint.toISOString()
    },
    buildIntervals () {
      this.intervals = {}
      for (var e of this.events) {
        if (!e.allDay) {
          const startDate = e.eventStart.split('T')[0]
          const endDate = e.eventEnd.split('T')[0]
          const startHour = parseInt(e.eventStart.split('T')[1].split(':')[0])
          const startMinute = parseInt(e.eventStart.split('T')[1].split(':')[1])
          const endHour = parseInt(e.eventEnd.split('T')[1].split(':')[0])
          const endMinute = parseInt(e.eventEnd.split('T')[1].split(':')[1])

          var eventHours = []
          for (var i = 0; i < (endHour - startHour); i++) {
            eventHours.push(startHour + i)
          }
          if (endMinute > 0) { eventHours.push(endHour) }
          let labelQuarter = 'start'
          const startDT = new Date(e.eventStart)
          const endDT = new Date(e.eventEnd)
          const midpointISO = this.getEventMidpoint(startDT, endDT)
          const midpointdt = new Date(midpointISO)
          const min = midpointdt.getMinutes()
          if (min === 0) { labelQuarter = 'start' }
          if (min === 15) { labelQuarter = 'quarter' }
          if (min === 30) { labelQuarter = 'half' }
          if (min === 45) { labelQuarter = 'quarter_til' }
          for (var eh of eventHours) {
            const interval = {
              type: e.type,
              name: e.name,
              // not sure why I have to subtract, might need to revisit in the future
              label_hour: midpointdt.getHours() - 1,
              label_quarter: labelQuarter,
              event: e,
              quarters: []
            }
            if (eh === startHour) {
              if (startMinute === 0) {
                interval.quarters.push('start')
              }
              if (startMinute <= 15) {
                interval.quarters.push('quarter')
              }
              if (startMinute <= 30) {
                interval.quarters.push('half')
              }
              if (startMinute <= 45) {
                interval.quarters.push('quarter_til')
              }
              this.intervals[`${startDate}-${eh}`] = interval
            } else if (eh === endHour) {
              if (endMinute > 0) {
                interval.quarters.push('start')
              }
              if (endMinute > 15) {
                interval.quarters.push('quarter')
              }
              if (endMinute > 30) {
                interval.quarters.push('half')
              }
              if (endMinute > 45) {
                interval.quarters.push('quarter_til')
              }
              this.intervals[`${endDate}-${eh}`] = interval
            } else {
              interval.quarters = ['start', 'quarter', 'half', 'quarter_til']
              this.intervals[`${startDate}-${eh}`] = interval
            }
          }
        }
      }
    },
    getInterval (date, hour) {
      var key = `${date}-${hour}`
      if (!(key in this.intervals)) {
        return []
      } else {
        const returnArr = []
        returnArr.push(this.intervals[key])
        return returnArr
      }
    },
    getQuarterClasses (interval, hour, quarter) {
      const classes = ['quarter-hour', 'pl-1']
      if (interval.label_hour === hour && interval.label_quarter === quarter) {
        classes.push('clickable nowrap')
      } else {
        classes.push('transparent-text')
      }
      return classes
    },
    toggleEventTypeActive (type) {
      if (this.active_types.includes(type)) {
        var index = this.active_types.indexOf(type)
        this.active_types.splice(index, 1)
      } else {
        this.active_types.push(type)
      }
    },
    refreshEvents ($event) {
      this.events = $event
      this.updateEvents()
    },
    setEventEditTypeInput (index) {
      this.eventEditForm.type = index + 1
      // this.showColorSelection = false
    },
    hourFormat (t) {
      return t.minute !== 0 ? t.minute : t.hour + ':00'
    }
    // pollApi () {
    //   this.getEvents()
    //   if (this.$router.currentRoute.name === 'week_calendar') {
    //     setTimeout(this.pollApi, 10000)
    //   }
    // }
  },
  mounted () {
    this.focus = this.$route.query.startDate
    // this.getEvents()
    this.buildHours()
  }
}
</script>
