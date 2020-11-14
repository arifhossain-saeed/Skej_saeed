<template>
  <v-list
    color="skej-grey-background"
    flat
    avatar
    disabled
    single-line
    >
    <!-- <v-list-item class="pl-0">
      <v-card flat tile color="skej-grey-background">
        <v-card-text
          class="font-weight-medium">
          All Day
        </v-card-text>
      </v-card>
      <v-card flat tile color="skej-grey-background">
        <v-card-text>Birthday</v-card-text>
      </v-card>
    </v-list-item> -->
    <div  v-for="hour in hours" :key="`hour-${hour.hr}`">
      <v-list-item v-if="hour.hr >= day_start"
        :style="`align-items: ${getListItemAlignment(hour)}`"
      >
        <v-card flat tile width="40" style="pointer-events: auto"
          color="skej-grey-background ml-4">
          <v-card-text
            class="font-weight-bold pa-0">
            <div :class="['hrstart'].concat(quarterHourClasses (hour, 0))"
              @click="setEventEditFormTime(hour, 0)"
            >
              <span v-if="isSelectedEventStartTime(hour, 0)">
                <v-icon class="timeChangeChevronStart">mdi-chevron-down</v-icon>
                {{hour.hr}}:00
              </span>
              <span v-else-if="isSelectedEventEndTime(hour, 0)">
                <v-icon class="timeChangeChevronEnd" >mdi-chevron-up</v-icon>
                {{hour.hr}}:00
              </span>
              <span v-else>{{hour.hr}}:00</span>
            </div>
            <div
              :class="['hr15'].concat(quarterHourClasses (hour, 15))"
              @click="setEventEditFormTime(hour, 15)"
            >
              <span v-if="isSelectedEventStartTime(hour, 15)">
                <v-icon class="timeChangeChevronStart">mdi-chevron-down</v-icon>
                {{hour.hr}}:15
              </span>
              <span v-else-if="isSelectedEventEndTime(hour, 15)">
                <v-icon class="timeChangeChevronEnd">mdi-chevron-up</v-icon>
                {{hour.hr}}:15
              </span>
              <span v-else class="text--disabled">15</span>
            </div>
            <div
              :class="['hr30'].concat(quarterHourClasses (hour, 30))"
              @click="setEventEditFormTime(hour, 30)"
            >
              <span v-if="isSelectedEventStartTime(hour, 30)">
                <v-icon class="timeChangeChevronStart">mdi-chevron-down</v-icon>
                {{hour.hr}}:30
              </span>
              <span v-else-if="isSelectedEventEndTime(hour, 30)">
                <v-icon class="timeChangeChevronEnd">mdi-chevron-up</v-icon>
                {{hour.hr}}:30
              </span>
              <span v-else class="text--disabled">30</span>
            </div>
            <div
              :class="['hr45'].concat(quarterHourClasses (hour, 45))"
              @click="setEventEditFormTime(hour, 45)"
            >
              <span v-if="isSelectedEventStartTime(hour, 45)">
                <v-icon class="timeChangeChevronStart">mdi-chevron-down</v-icon>
                {{hour.hr}}:45
              </span>
              <span v-else-if="isSelectedEventEndTime(hour, 45)">
                <v-icon class="timeChangeChevronEnd">mdi-chevron-up</v-icon>
                {{hour.hr}}:45
              </span>
              <span v-else class="text--disabled">45</span>
            </div>
          </v-card-text>
        </v-card>
        <v-slide-x-transition leave-absolute>
          <v-card v-if="selectedEvent === hour.event && hour.hr === hour.event.hours_list[0]"
            flat class="ml-5 my-1 skej-grey-background" width="90%" min-width="300"
            :style="editCardStyles(hour.hr)"
          >
            <div class="d-flex">
              <div class="d-inline-block" style="width: 4px">
                <div class="d-flex flex-column" style="height: 100%">
                  <div :class="['vertical-dash mr-4 left-radius', event_colors[`type${hour.event.type}`]]"
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
                    :initialColorIndex="hour.event.type - 1"
                    ></event-type-color-picker>
                    <span v-show="!eventEditForm.showNameInput" class="clickable"
                      @click="eventEditForm.showNameInput = true"
                    >{{hour.event.eventName}}</span>
                    <v-text-field v-if="eventEditForm.showNameInput"
                      placeholder="Name" rounded filled dense
                      v-model="eventEditForm.eventName" class="d-inline-block"
                    ></v-text-field>
                  </div>
                  <p v-show="!eventEditForm.showDescInput" class="clickable"
                    @click="eventEditForm.showDescInput = true"
                  >{{hour.event.eventDesc}}</p>
                  <v-text-field v-show="eventEditForm.showDescInput"
                    placeholder="Description" rounded filled dense
                    v-model="eventEditForm.eventDesc"
                    ></v-text-field>
                  <p>Members: {{selectedEvent.user_list}}</p>
                  <v-slide-group multiple show-arrows class="mb-2">
                    <v-slide-item
                      v-for="(button, key) in eventEditFieldButtons"
                      :key="`event-edit-button-${key}`"
                      v-slot:default="{ active, toggle }"
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
        </v-slide-x-transition>
        <v-card flat tile
          color="skej-grey-background" width="100%" :style="`pointer-events: auto;`">
          <v-card-text class="py-0 event-name">
            <div :class="['quarter-hour'].concat(quarterHourTextClasses (hour, 0))"
              @click="setSelectedEvent(hour.event, hour, 0)"
            >
              <div :class="['vertical-dash mr-4', getColorForDash(hour, 0)]"></div>
              <span :class="['event-text', printEventName(hour, 0)]">
                {{hour.event.eventName}}
              </span>
            </div>
            <div :class="['quarter-hour'].concat(quarterHourTextClasses (hour, 15))"
              @click="setSelectedEvent(hour.event, hour, 15)"
            >
              <div :class="['vertical-dash mr-4', getColorForDash(hour, 15)]"></div>
              <span :class="['event-text', printEventName(hour, 15)]">
                {{hour.event.eventName}}
              </span>
            </div>
            <div :class="['quarter-hour'].concat(quarterHourTextClasses (hour, 30))"
              @click="setSelectedEvent(hour.event, hour, 30)"
            >
              <div :class="['vertical-dash mr-4', getColorForDash(hour, 30)]"></div>
              <span :class="['event-text', printEventName(hour, 30)]">
                {{hour.event.eventName}}
              </span>
            </div>
            <div :class="['quarter-hour'].concat(quarterHourTextClasses (hour, 45))"
              @click="setSelectedEvent(hour.event, hour, 45)"
            >
              <div :class="['vertical-dash mr-4', getColorForDash(hour, 45)]"></div>
              <span :class="['event-text', printEventName(hour, 45)]">
                {{hour.event.eventName}}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-list-item>
    </div>
  </v-list>
</template>

<style lang="scss" scoped>
  .hr15, .hr30, .hr45, .event-name {
    line-height: 1rem;
  }
  .hrstart {
    line-height: 0.7rem;
    height: 16px;
  }
  .left-radius {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .quarter-hour {
    height: 16px;
  }
  .quarter-hour.selected,
  .event-text.selected,
  .hrstart.selected,
  .hr15.selected,
  .hr30.selected,
  .hr45.selected {
    display: none;
  }
  .hrstart .timeChangeChevronStart {
    position: absolute;
    left: -25px;
    top: -7px;
  }
  .hr15 .timeChangeChevronStart {
    position: absolute;
    left: -25px;
    top: 9px;
  }
  .hr30 .timeChangeChevronStart {
    position: absolute;
    left: -25px;
    top: 25px;
  }
  .hr45 .timeChangeChevronStart {
    position: absolute;
    left: -25px;
    top: 41px;
  }
  .timeChangeChevronEnd {
    position: absolute;
    left: -25px;
    top: -7px;
  }
  .v-list-item {
    min-height: 0px !important;
  }
</style>

<script>
import axios from 'axios'

export default {
  name: 'day-schedule',
  props: ['events', 'active_types', 'event_colors', 'type_colors', 'eventTypes', 'date'],
  watch: {
    events: {
      handler (val, oldVal) {
        this.refreshEvents()
      }
    },
    date: {
      handler (val, oldVal) {
        this.refreshEvents()
      }
    }
  },
  data: () => {
    return ({
      eventEditForm: {
        eventName: null,
        eventDesc: null,
        eventStart: null,
        eventEnd: null,
        startHour: null,
        startMinutes: null,
        endHour: null,
        endMinutes: null,
        type: 1,
        showNameInput: false,
        showDescInput: false
      },
      selectedEvent: null,
      editingSelectedEvent: false,
      day_start: 7,
      hours: [],
      dayEvents: [],
      eventEditFieldButtons: {
        // eventName: { name: 'eventName', showInput: false, text: 'Name' },
        // eventDesc: { name: 'eventDesc', showInput: false, text: 'Description' },
        // start: { name: 'eventStart', showInput: false, text: 'Start Time' },
        // end: { name: 'eventEnd', showInput: false, text: 'End Time' },
        // type: { name: 'type', showInput: false, text: 'Event Color/Type' }
      }
    })
  },
  methods: {
    buildHours () {
      const hours = []
      for (var i = 1; i < 25; i++) {
        hours.push({
          hr: i,
          event: {
            eventName: 'loading...'
          }
        })
      }
      this.hours = hours
    },
    refreshEvents () {
      this.buildHours()
      this.getEventsForSelectedDay()
      for (var ev of this.dayEvents) {
        this.processEvent(ev)
      }
      this.integrateEventsAndHours()
    },
    getEventsForSelectedDay () {
      this.dayEvents = this.events.filter((ev) => { return ev.eventStart.substring(0, 10) === this.date })
    },
    processEvent (event) {
      const startDT = new Date(event.eventStart)
      const endDT = new Date(event.eventEnd)
      event.hours_list = []
      event.hours = []
      for (var i = startDT.getHours(); i <= endDT.getHours(); i++) {
        event.hours_list.push(i)
      }
      event.startTime = `${('0' + startDT.getHours()).slice(-2)}:${('0' + startDT.getMinutes()).slice(-2)}`
      event.endTime = `${('0' + endDT.getHours()).slice(-2)}:${('0' + endDT.getMinutes()).slice(-2)}`
      const midpointdt = new Date(this.getEventMidpoint(startDT, endDT))
      event.labelTime = `${('0' + midpointdt.getHours()).slice(-2)}:${('0' + midpointdt.getMinutes()).slice(-2)}`
    },
    integrateEventsAndHours () {
      for (var hour of this.hours) {
        for (var event of this.dayEvents) {
          if (event.hours_list.includes(hour.hr)) {
            hour.event = event
          }
        }
      }
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
    // rnd (a, b) {
    //   return Math.floor((b - a + 1) * Math.random()) + a
    // },
    setEventEditTypeInput (index) {
      this.eventEditForm.type = index + 1
      // this.showColorSelection = false
    },
    quarterHourClasses (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      const classes = []
      if (!this.timeIsDuringEvent(timeString, hour.event) && this.selectedEvent !== null) {
        classes.push('clickable')
      } else {
        if (timeString === this.eventEditForm.endTime || timeString === this.eventEditForm.startTime) {
          classes.push('clickable')
        }
      }
      if (this.timeIsDuringEvent(timeString, this.eventEditForm) && this.selectedEvent !== null) {
        if (timeString !== this.eventEditForm.startTime && timeString !== this.eventEditForm.endTime) {
          classes.push('selected')
        }
      }
      return classes
    },
    quarterHourTextClasses (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      const classes = []
      if (this.timeIsDuringEvent(timeString, hour.event)) {
        if (hour.event.eventName !== 'loading...') {
          classes.push('clickable')
        }
        if (this.selectedEvent === hour.event && timeString !== hour.event.endTime) {
          classes.push('selected')
        }
      }
      if (this.timeIsDuringEvent(timeString, this.eventEditForm)) {
        if (timeString !== this.eventEditForm.startTime && timeString !== this.eventEditForm.endTime) {
          classes.push('selected')
        }
      }
      return classes
    },
    setEventEditFormTime (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      for (var ev of this.dayEvents) {
        if (ev !== this.selectedEvent) {
          if (this.timeIsDuringEvent(timeString, ev)) {
            return
          }
          if (this.eventEditForm.startTime > timeString) {
            if (timeString <= ev.startTime && this.eventEditForm.startTime >= ev.endTime) {
              return
            }
          }
          if (this.eventEditForm.endTime < timeString) {
            if (timeString >= ev.endTime && this.eventEditForm.endTime <= ev.startTime) {
              return
            }
          }
        }
      }
      const rolloverMinutes = {
        subtracting: -15,
        adding: 60
      }
      let newStartTime = null
      let newEndTime = null
      if (timeString === this.eventEditForm.startTime) {
        const newMinutes = minutes + 15
        if (newMinutes === rolloverMinutes.adding) {
          newStartTime = `0${hour.hr + 1}:00`.slice(-5)
        } else {
          newStartTime = `${hr}:${`0${newMinutes}`.slice(-2)}`
        }
        if (newStartTime === this.eventEditForm.endTime) {
          return
        }
        this.eventEditForm.startTime = newStartTime
      } else if (timeString === this.eventEditForm.endTime) {
        const newMinutes = minutes - 15
        if (newMinutes === rolloverMinutes.subtracting) {
          newEndTime = `0${hour.hr - 1}:45`.slice(-5)
        } else {
          newEndTime = `${hr}:${`0${newMinutes}`.slice(-2)}`
        }
        if (newEndTime === this.eventEditForm.startTime) {
          return
        }
        this.eventEditForm.endTime = newEndTime
      } else {
        if (timeString < this.eventEditForm.startTime) {
          this.eventEditForm.startTime = timeString
        }
        if (timeString > this.eventEditForm.endTime) {
          this.eventEditForm.endTime = timeString
        }
      }
      this.$forceUpdate()
    },
    getColorForDash (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      for (var event of this.dayEvents) {
        if (this.timeIsDuringEvent(timeString, event) || timeString === event.startTime) {
          if (this.selectedEvent !== event) {
            return this.type_colors[event.type - 1]
          }
        }
      }
      // if (this.timeIsDuringEvent(timeString, hour.event)) {
      //   if (this.selectedEvent !== hour.event) {
      //     return this.event_colors[`type${hour.event.type}`]
      //   }
      // }
      return ''
    },
    printEventName (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      const classes = []
      if (hour.event.eventName !== 'loading...') {
        if (hour.event.labelTime === timeString) {
          classes.push('clickable')
        }
        if (this.selectedEvent === hour.event && timeString !== hour.event.endTime) {
          if (this.timeIsDuringEvent(timeString, hour.event)) {
            classes.push('selected')
          }
        }
        // console.table(hour.event.type)
        if (!(timeString === hour.event.labelTime && this.active_types.includes(`type${hour.event.type}`))) {
          classes.push('d-none')
        }
      } else {
        classes.push('d-none')
      }
      return classes
    },
    getListItemAlignment (hour) {
      if (hour.event === this.selectedEvent) {
        if (hour.event.hours_list[0] === hour.hr) {
          return 'start'
        }
        if (hour.event.hours_list[-1] === hour.hr && hour.event.hours_list.length > 1) {
          return 'end'
        }
      }
    },
    timeIsDuringEvent (timeString, event) {
      if (event.eventName !== 'loading...') {
        if (timeString === event.startTime) {
          return false
        }
        const bool = (timeString >= event.startTime && timeString < event.endTime)
        return bool
      } else {
        return false
      }
    },
    isSelectedEventEndTime (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      if (this.selectedEvent !== null) {
        if (this.eventEditForm.endTime === timeString) {
          return true
        }
      }
      return false
    },
    isSelectedEventStartTime (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      if (this.selectedEvent !== null) {
        return (this.eventEditForm.startTime === timeString)
      }
      return false
    },
    calcEditModeTopMargin () {
      if (this.eventEditForm.startTime === undefined || this.eventEditForm.startTime === null) {
        this.eventEditForm.startTime = this.selectedEvent.startTime
      }
      const newStartDt = new Date()
      newStartDt.setHours(parseInt(this.eventEditForm.startTime.split(':')[0]))
      newStartDt.setMinutes(parseInt(this.eventEditForm.startTime.split(':')[1]))
      const oldStartDt = new Date()
      oldStartDt.setHours(parseInt(this.selectedEvent.startTime.split(':')[0]))
      oldStartDt.setMinutes(parseInt(this.selectedEvent.startTime.split(':')[1]))
      let quarters = 0
      if (newStartDt.getHours() < oldStartDt.getHours()) {
        quarters = 0
      // } else if (newStartDt <= oldStartDt && newStartDt.getMinutes() === 0) {
      //   quarters = 0
      } else if (newStartDt.getHours() === oldStartDt.getHours()) {
        if (newStartDt.getMinutes() === 15) { quarters = 1 }
        if (newStartDt.getMinutes() === 30) { quarters = 2 }
        if (newStartDt.getMinutes() === 45) { quarters = 3 }
      } else {
        if (newStartDt.getMinutes() === 15) { quarters = 1 }
        if (newStartDt.getMinutes() === 30) { quarters = 2 }
        if (newStartDt.getMinutes() === 45) { quarters = 3 }
        const diff = Math.abs(newStartDt - oldStartDt)
        quarters += Math.floor((diff / 1000) / 60) / 15
      }
      return quarters * 16
    },
    setSelectedEvent (event, hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      if (this.selectedEvent !== null && !this.timeIsDuringEvent(timeString, this.selectedEvent)) {
        return
      }
      if (event.eventName !== 'loading...' && this.timeIsDuringEvent(timeString, event)) {
        this.selectedEvent = event
      } else {
        return
      }
      axios.get(`user/events/${this.selectedEvent.id}/user_list/`, this.todoReorderForm)
        .then((response) => {
          this.selectedEvent.user_list = response.data.join(', ')
          this.editEvent()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editEvent () {
      this.editingSelectedEvent = true
      this.eventEditForm.eventName = this.selectedEvent.eventName
      this.eventEditForm.eventDesc = this.selectedEvent.eventDesc
      this.eventEditForm.startHour = this.selectedEvent.startTime.split(':')[0]
      this.eventEditForm.startMinutes = this.selectedEvent.startTime.split(':')[1]
      this.eventEditForm.startTime = this.selectedEvent.startTime
      this.eventEditForm.endHour = this.selectedEvent.endTime.split(':')[0]
      this.eventEditForm.endMinutes = this.selectedEvent.endTime.split(':')[1]
      this.eventEditForm.endTime = this.selectedEvent.endTime
      this.eventEditForm.type = this.selectedEvent.type
    },
    clearSelectedEvent () {
      const newStartTime = new Date(this.selectedEvent.eventStart)
      const newEndTime = new Date(this.selectedEvent.eventEnd)
      const startHr = parseInt(this.eventEditForm.startTime.split(':')[0])
      const startMn = parseInt(this.eventEditForm.startTime.split(':')[1])
      const endHr = parseInt(this.eventEditForm.endTime.split(':')[0])
      const endMn = parseInt(this.eventEditForm.endTime.split(':')[1])
      newStartTime.setHours(startHr)
      newStartTime.setMinutes(startMn)
      this.eventEditForm.eventStart = newStartTime.toISOString()
      newEndTime.setHours(endHr)
      newEndTime.setMinutes(endMn)
      this.eventEditForm.eventEnd = newEndTime.toISOString()
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
          this.$emit('event-updated')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editCardStyles (hour) {
      const marginTop = this.calcEditModeTopMargin()
      let marginLeft = ''
      if (hour < 10) {
        marginLeft = 'margin-left: 26px !important;'
      } else {
        marginLeft = 'margin-left: 17px !important;'
      }
      return `pointer-events: auto; margin-top: ${marginTop}px !important; ${marginLeft}`
    }
  },
  mounted () {
    this.refreshEvents()
  }
}
</script>
