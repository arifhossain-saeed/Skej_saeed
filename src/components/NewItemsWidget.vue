<template>
  <div class="fixed-bottom pr-3"
    style="right: 0px; z-index: 100; background-color: rgba(0, 0, 0, 0.0);"
  >
    <v-row class="pa-4 pb-0 pr-0 d-flex justify-end">
      <template
        v-if="this.active_nib === 'groupEvent' || this.active_nib === 'event' && showNewItemForms">
        <!-- Events Form -->
        <v-card width="290" height="420" class="ma-1">
          <v-date-picker @change="getEvents"
            v-model="eventForm.startDate" light color="cyan">
          </v-date-picker>
        </v-card>
        <v-card width="290" height="420" class="ma-1 scroll-section just-date" style="overflow-y: scroll">
          <h6>
            {{printSelectedMonthAndDay}}<sup>th</sup>
          </h6>
          <v-divider class="mb-2"></v-divider>
          <div  v-for="hour in hours" :key="`hour-${hour.hr}`">
            <v-list-item single-line
              v-if="hour.hr >= day_start"
              class="px-0"
            >
              <v-card flat tile width="40"
                color="ml-4">
                <v-card-text
                  class="font-weight-bold pa-0">
                  <div :class="['hrstart', quarterHourClasses(hour, 0)]" @click="setEventFormTime(hour, 0)">
                    <span>{{hour.hr}}:00</span>
                  </div>
                  <div
                  :class="['hr15', quarterHourClasses(hour, 15)]" @click="setEventFormTime(hour, 15)">
                    <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:15`">{{hour.hr}}:</span>
                    <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:15`">{{hour.hr}}:</span>
                    <span>15</span>
                  </div>
                  <div
                  :class="['hr30', quarterHourClasses(hour, 30)]" @click="setEventFormTime(hour, 30)">
                  <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:30`">{{hour.hr}}:</span>
                  <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:30`">{{hour.hr}}:</span>
                    <span>30</span>
                  </div>
                  <div :class="['hr45', quarterHourClasses(hour, 45)]" @click="setEventFormTime(hour, 45)">
                    <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:45`">{{hour.hr}}:</span>
                    <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:45`">{{hour.hr}}:</span>
                    <span>45</span>
                  </div>
                </v-card-text>
              </v-card>
              <v-card flat tile>
                <v-card-text class="pa-0 pl-1 event-name">
                  <div :class="['quarter-hour']">
                    <div :class="['vertical-dash mr-1', getColorForDash(hour, 0)]"></div>
                    <span :class="[printEventName(hour, 0)]">
                      {{hour.event.eventName}}
                    </span>
                    <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:00`"
                      class="cyan--text">
                      Start
                    </span>
                    <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:00`"
                      class="cyan--text">
                      End
                    </span>
                  </div>
                  <div :class="['quarter-hour']">
                    <div :class="['vertical-dash mr-1', getColorForDash(hour, 15)]"></div>
                    <span :class="[printEventName(hour, 15)]">
                      {{hour.event.eventName}}
                    </span>
                    <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:15`"
                      class="cyan--text">
                      Start
                    </span>
                    <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:15`"
                      class="cyan--text">
                      End
                    </span>
                  </div>
                  <div :class="['quarter-hour']">
                    <div :class="['vertical-dash mr-1', getColorForDash(hour, 30)]"></div>
                    <span :class="[printEventName(hour, 30)]">
                      {{hour.event.eventName}}
                    </span>
                    <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:30`"
                      class="cyan--text">
                      Start
                    </span>
                    <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:30`"
                      class="cyan--text">
                      End
                    </span>
                  </div>
                  <div :class="['quarter-hour']">
                    <div :class="['vertical-dash mr-1', getColorForDash(hour, 45)]"></div>
                    <span :class="[printEventName(hour, 45)]">
                      {{hour.event.eventName}}
                    </span>
                    <span v-show="eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:45`"
                      class="cyan--text">
                      Start
                    </span>
                    <span v-show="eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:45`"
                      class="cyan--text">
                      End
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-list-item>
          </div>
        </v-card>
        <v-card width="290" height="420" class="ma-1 pa-2">
          <h3 class="event-detail-text">New Event</h3>
          <v-text-field dense light filled rounded v-model="eventForm.name"
            placeholder="Event name" type="text"></v-text-field>
          <v-textarea dense light filled no-resize rounded v-model="eventForm.description"
            placeholder="Event description"></v-textarea>
<!--          <v-btn fab x-small elevation="4"-->
<!--            :color="eventForm.type ? type_colors[eventForm.type-1]:'white'"-->
<!--            @click="showColorSelection=true"-->
<!--            v-show="!showColorSelection"-->
<!--            class="mx-1 my-2"-->
<!--          ></v-btn>-->
<!--          <v-btn v-for="(color, i) in type_colors"-->
<!--            v-show="showColorSelection"-->
<!--            fab x-small-->
<!--            :color="color"-->
<!--            :key="i"-->
<!--            class="mx-1 my-2"-->
<!--            @click="selectEventTypeColor(i)"-->
<!--          >-->
<!--          </v-btn>-->
<!--          <span v-show="!showColorSelection"> Event Type/Color</span>-->
<!--          <br>-->
<!--          <v-btn color="cyan" @click="createNewEvent">Submit</v-btn>-->

          <div class="buttons-holder">
            <v-btn color="#D4F3FD" rounded elevation="0" class="bluish--text">User</v-btn>
            <v-btn color="#D4F3FD" rounded elevation="0" class="bluish--text">Phone Call</v-btn>
            <v-btn color="#D4F3FD" rounded elevation="0" class="bluish--text">Link</v-btn>
            <v-btn color="#D4F3FD" rounded elevation="0" class="bluish--text">Autotom</v-btn>
          </div>
        </v-card>
      </template>
      <v-card width="290" height="420" v-if="active_nib === 'group' && showNewItemForms" class="ma-2 pa-2">
        <v-form ref="groupForm" @submit.prevent="createGroup">
          <h3 class="pa-2 text-center">Name</h3>
          <v-text-field light filled rounded placeholder="Group name" type="text"
            v-model="groupForm.groupName"
          ></v-text-field>
          <v-textarea light filled no-resize rounded placeholder="Group description"
            v-model="groupForm.groupDesc"
          ></v-textarea>
          <v-btn color="cyan" type="submit">Submit</v-btn>
        </v-form>
      </v-card>
      <v-card width="290" height="420" class="pa-2 ma-2 pr-6" v-show="showNewItemForms">
        <v-btn block depressed height="45"
        :class="['new-item-btn', 'ma-2', active_nib==='event'? 'active' : '']"
        :color="active_nib==='event'? '#28C3F2' : '#e1f5fe'"
        @click="active_nib = 'event'"
        >New Event</v-btn>
        <v-btn block depressed height="45"
        :class="['new-item-btn', 'ma-2', active_nib==='group'? 'active' : '']"
        :color="active_nib==='group'? '#28C3F2' : '#e1f5fe'"
        @click="active_nib = 'group'"
        >New Group</v-btn>
        <v-btn block depressed height="45"
        :class="['new-item-btn', 'ma-2', active_nib==='groupEvent'? 'active' : '']"
        :color="active_nib==='groupEvent'? '#28C3F2' : '#e1f5fe'"
        @click="active_nib = 'groupEvent'"
        :disabled="selectedGroup ? false:true"
        >New Group Event</v-btn>
        <v-btn block depressed height="45"
        :class="['new-item-btn', 'ma-2', active_nib==='invite'? 'active' : '']"
        :color="active_nib==='invite'? '#28C3F2' : '#e1f5fe'"
        @click="active_nib = 'invite'"
        >Invite Friends</v-btn>
      </v-card>
    </v-row>
    <div class="">
      <v-btn fab dark @click="toggleWidgetForms"
        class="float-right" color="#45C3F2">
        <v-icon v-if="showNewItemForms" large>mdi-minus</v-icon>
        <v-icon v-else large>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .new-item-btn {
    color: #8C9092;
    font-weight: thin;
  }
  .new-item-btn.active {
    color: white;
  }
  .quarter-hour {
    height: 16px;
  }
  .vertical-dash {
    height: 100%;
    width: 4px;
    display: inline-block;
  }
  // .vertical-dash.temporary {
  //   height: 4px;
  //   border-radius: 5px;
  // }
  .left-radius {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
</style>

<style lang="scss">
.v-window__container > .v-window__next,
.v-window__container > .v-window__prev {
  top: 0px;
}

.v-picker--time > .v-picker__title {
  padding-bottom: 0px;
}

.transparent-text {
  color: rgba(0, 0, 0, 0.0) !important;
}

/*select > option:hover {*/
/*  background-color: !important;*/
/*}*/
.hr15, .hr30, .hr45, .event-name {
  line-height: 1rem;
}
.hrstart {
  line-height: 0.7rem;
  height: 16px;
}
.buttons-holder {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .bluish--text {
    width: 45%;
    color: #46CBF4;
    text-transform: none;
    margin-bottom: 10px;
    font-size: smaller;

    padding-top: 23px !important;
    padding-bottom: 25px !important;
  }
}

.v-picker {
  .v-picker__title.cyan{
    background: white !important;
    color: grey;
    margin-bottom: 5px;
  }
}

.just-date {
  h6 {
    font-size: 1rem !important;
    padding: 1.4rem 1rem !important;
    color: grey;
    font-weight: 400;
  }
}

.event-detail-text {
  color: grey;
  font-weight: 400;
  font-size: 1rem !important;
  padding: 1.2rem 1rem !important;
}

.v-date-picker-title__year {
  display: none;
}

.v-date-picker-title__date {
  font-size: 1rem;
  padding: .8rem 0;
  font-weight: 400;
}

.v-date-picker-header {
  display: none;
}

.v-date-picker-table {
  padding: 0;
  table {
    border-collapse: collapse;
    margin-left: 0;
    width: 99.9%;
    thead {
      th {
        display: none;
      }
    }

    tbody {
      td {
        padding: 0;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  }

  .v-btn {
    padding: 20px;
    text-align: left;
    color: rgba(0, 0, 0, 0.5);
  }

  .v-btn--rounded {
    border-radius: 0;
  }
}
</style>

<script>
import axios from 'axios'

export default {
  name: 'new-items-widget',
  props: ['selectedGroup'],
  data: () => ({
    active_nib: null,
    showNewItemForms: false,
    showColorSelection: false,
    active_types: ['type1', 'type2', 'type3', 'type4'],
    event_colors: { type1: 'cyan', type2: 'green', type3: 'orange', type4: 'red' },
    type_colors: ['cyan', 'green', 'orange', 'red'],
    eventTypes: ['type1', 'type2', 'type3', 'type4'],
    events: [],
    hours: [],
    eventForm: {
      startDate: new Date().toISOString().split('T')[0],
      startTime: null,
      endDate: null,
      endTime: null,
      name: null,
      description: null,
      groupEvent: null,
      type: 1
    },
    groupForm: {
      groupName: null,
      groupDesc: null
    },
    day_start: 7
  }),
  computed: {
    printSelectedMonthAndDay () {
      const dt = new Date(this.eventForm.startDate)
      const localeString = dt.toLocaleString('en-US',
        { month: 'long', timeZone: 'America/New_York' }
      )
      const day = dt.getDate() + 1
      return `${localeString} ${day}`
    }
  },
  methods: {
    toggleWidgetForms () {
      this.showNewItemForms = !this.showNewItemForms
      if (!this.showNewItemForms) {
        this.active_nib = null
        for (var key in this.eventForm) {
          this.eventForm[key] = null
        }
        this.eventForm.type = 1
        for (var k in this.groupForm) {
          this.groupForm[k] = null
        }
      }
    },
    createNewEvent () {
      this.eventForm.endDate = this.eventForm.startDate
      const startDTstring = `${this.eventForm.startDate}T${this.eventForm.startTime}`
      const endDTstring = `${this.eventForm.endDate}T${this.eventForm.endTime}`
      const createForm = {
        eventName: this.eventForm.name,
        eventStart: startDTstring,
        eventEnd: endDTstring,
        eventDesc: this.eventForm.description,
        type: this.eventForm.type
      }
      if (this.active_nib === 'groupEvent') {
        createForm.groupEvent = this.$props.selectedGroup
      }
      axios.post('user/events/add/', createForm)
        .then((response) => {
          // handle success
          this.showNewItemForms = false
          this.active_nib = null
          for (var key in this.eventForm) {
            this.eventForm[key] = null
          }
          this.eventForm.startDate = new Date().toISOString().split('T')[0]
          this.eventForm.type = 1
          this.type = 1
          if (this.$props.selectedGroup) {
            this.$emit('groupEventCreated')
          }
          this.getEvents()
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    createGroup () {
      axios.post('group/create/', this.groupForm)
        .then((response) => {
          // handle success
          this.showNewItemForms = false
          this.active_nib = null
          for (var key in this.groupForm) {
            this.groupForm[key] = null
          }
          this.$emit('groupCreated')
          this.getEvents()
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    selectEventTypeColor (index) {
      this.eventForm.type = index + 1
      this.showColorSelection = false
    },
    nth (d) {
      return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    getEvents () {
      axios.get('user/events/pending/')
        .then((response) => {
          this.events = response.data.filter((event) => { return !event.allDay })
          this.$emit('eventsRetrieved', this.events)
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
          this.getEventsForDay()
          // for (var ev of this.events) {
          //   this.processEvent(ev)
          // }
          // this.integrateEventsAndHours()
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
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
    processEvent (event) {
      const startDT = new Date(event.eventStart)
      const endDT = new Date(event.eventEnd)
      event.hours_list = []
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
        for (var event of this.events) {
          if (event.hours_list.includes(hour.hr)) {
            hour.event = event
          }
        }
      }
    },
    getEventsForDay () {
      const dayEvents = []
      for (var ev of this.events) {
        if (ev.eventStart.substring(0, 10) === this.eventForm.startDate) {
          if (!ev.allDay) {
            this.processEvent(ev)
            dayEvents.push(ev)
          }
        }
      }
      this.events = dayEvents
      this.integrateEventsAndHours()
    },
    getColorForDash (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      if (this.timeIsDuringEvent(timeString, hour.event, true)) {
        return this.event_colors[`type${hour.event.type}`]
      }
      if (this.timeIsDuringEvent(timeString, this.eventForm, true)) {
        return 'grey'
      }
      return ''
    },
    printEventName (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      const classes = []
      if (hour.event.eventName !== 'loading...') {
        if (timeString !== hour.event.labelTime) {
          classes.push('d-none')
        }
      } else {
        classes.push('d-none')
      }
      return classes
    },
    timeIsDuringEvent (timeString, event, gettingColor = false) {
      if (event.eventName !== 'loading...') {
        if (gettingColor) {
          return (timeString >= event.startTime && timeString < event.endTime)
        } else {
          return (timeString > event.startTime && timeString < event.endTime)
        }
      } else {
        return false
      }
    },
    quarterHourClasses (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      const classes = []
      if (!this.timeIsDuringEvent(timeString, hour.event)) {
        classes.push('clickable')
      }
      if (timeString === this.eventForm.startTime || timeString === this.eventForm.endTime) {
        classes.push('cyan--text')
      } else if (minutes !== 0) {
        classes.push('text--disabled')
      }
      return classes
    },
    setEventFormTime (hour, minutes) {
      const hr = `0${hour.hr}`.slice(-2)
      const mins = `0${minutes}`.slice(-2)
      const timeString = `${hr}:${mins}`
      for (var ev of this.events) {
        if (this.timeIsDuringEvent(timeString, ev)) {
          return
        }
      }
      if (this.eventForm.endTime === null && this.eventForm.startTime === null) {
        this.eventForm.startTime = timeString
        return
      }
      if (this.eventForm.endTime !== null && this.eventForm.startTime !== null) {
        this.eventForm.startTime = null
        this.eventForm.endTime = null
        return
      }
      if (timeString === this.eventForm.endTime || timeString === this.eventForm.startTime) {
        this.eventForm.startTime = null
        this.eventForm.endTime = null
        return
      }
      if (this.eventForm.endTime === null) {
        if (timeString > this.eventForm.startTime) {
          this.eventForm.endTime = timeString
        } else {
          this.eventForm.endTime = this.eventForm.startTime
          this.eventForm.startTime = timeString
        }
      }
      for (var event of this.events) {
        if (this.eventForm.startTime <= event.startTime && this.eventForm.endTime >= event.endTime) {
          this.eventForm.startTime = null
          this.eventForm.endTime = null
          return
        }
      }
    },
    getDayListStyles (hour, mins) {
      if (this.eventForm.startTime === `${`0${hour.hr}`.slice(-2)}:${`0${mins}`.slice(-2)}`) {
        return 'border-top: 1px solid cyan'
      } else if (this.eventForm.endTime === `${`0${hour.hr}`.slice(-2)}:${`0${mins}`.slice(-2)}`) {
        return 'border-bottom: 1px solid cyan'
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.getEvents()
  }
}
</script>
