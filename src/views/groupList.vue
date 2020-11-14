<template>
  <v-container fluid class="pa-0 group-list-page" style="height: calc(100vh - 56px); overflow-y: hidden">
    <v-row no-gutters>
      <v-col cols="12" sm="5" md="4">
        <div class="group-list-section scroll-section">
          <v-toolbar flat class="group-toolbar" height="60">
            <v-toolbar-title>Groups</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn text color="grey lighten-1" top>Edit |
              <v-icon right>mdi-pencil-box-outline</v-icon>
            </v-btn> -->
          </v-toolbar>
          <div class="search-frame mx-2">
            <v-text-field placeholder="Search groups"
              prepend-icon="mdi-magnify"
              class="search-bar pt-0 pl-2"
              rounded
            >
            </v-text-field>
          </div>
          <v-list
            class="scroll-section"
            color="#f3f3ff"
            flat
            avatar
            two-line
            >
            <v-list-item-group>
              <v-list-item
              v-for="(group, i) in groups"
             :key="`group${i}`"
             @click="selectGroup(group)"
             active-class="active"
             :class="[group === selectedGroup ? 'active v-list-item--active':'']"
              >
                <v-list-item-avatar>
                  <v-img :src="group.pic_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{group.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{group.description}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>
      <v-col cols="12" sm="7" md="8">
        <div v-if="selectedGroup"
          class="group-events-section scroll-section">
          <v-toolbar flat
            class="group-toolbar" height="60">
            <v-avatar class="mr-2">
              <v-img :src="selectedGroup.pic_url"></v-img>
            </v-avatar>
            <v-toolbar-title>{{selectedGroup.name}}</v-toolbar-title>
          </v-toolbar>
          <div class="text-h6 skej-text font-weight-medium pa-4 pt-2 d-flex align-center">
            <span>Events</span>
          </div>
          <v-divider></v-divider>
          <v-list
            color="#f3f3ff"
            flat
            disabled
            class=""
            >
            <v-list-item
            v-for="(event, i) in selectedGroup.events"
           :key="`event${i}`"
           class="px-0"
            >

              <v-list-item-content v-show="selectedEvent === event" class="px-2" style="min-height: 80px;">
                <v-slide-x-transition hide-on-leave>
                  <v-list-item-subtitle>
                    <div class="d-flex flex-sm-row mb-4 align-center pl-4">
                      <v-text-field
                        class="pt-0 mx-1 d-inline-block"
                        v-model="eventEditForm.eventName"
                      >
                      </v-text-field>
                      <v-spacer></v-spacer>
                      <select v-model="eventEditForm.startHour"
                        class="mx-2 px-1" style="width: 25px; display: inline-block; border: 1px solid darkgrey; border-radius: 5px; height: 30px;">
                        <option value="">- -</option>
                        <template v-for="h in 24">
                          <option v-if="h > day_start && h !== 0" :value="h" :key="`sh-${h}`">{{h}}</option>
                        </template>
                      </select>
                      <span class="black--text"> : </span>
                      <select v-model="eventEditForm.startMinutes"
                        class="mx-2 px-1" style="width: 25px; display: inline-block; border: 1px solid darkgrey; border-radius: 5px; height: 30px;">
                        <option value="">- -</option>
                        <option value="0">00</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                      </select>
                      <span class="darkgrey mx-4"> | </span>
                      <select v-model="eventEditForm.endHour"
                        class="mx-2 px-1" style="width: 25px; display: inline-block; border: 1px solid darkgrey; border-radius: 5px; height: 30px;">
                        <option value="">- -</option>
                        <template v-for="h in 24">
                          <option v-if="h > day_start && h !== 0" :value="h" :key="`sh-${h}`">{{h}}</option>
                        </template>
                      </select>
                      <span class="black--text"> : </span>
                      <select v-model="eventEditForm.endMinutes"
                        class="mx-2 px-1" style="width: 25px; display: inline-block; border: 1px solid darkgrey; border-radius: 5px; height: 30px;">
                        <option value="">- -</option>
                        <option value="0">00</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                      </select>
                      <v-btn text x-small fab outlined class="ma-2" @click="clearSelectedEvent">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-textarea dense light filled no-resize rounded
                      v-model="eventEditForm.eventDesc" rows="3"
                      placeholder="Event description"></v-textarea>
                  </v-list-item-subtitle>
                </v-slide-x-transition>
                <v-divider></v-divider>
              </v-list-item-content>
              <v-list-item-content v-show="selectedEvent !== event"
                class="pb-1 clickable"
                @click="editEvent(event)">
                <v-list-item-subtitle>
                  <div class="d-flex flex-column flex-sm-row mb-4">
                    <span class="mx-4">{{event.eventName}}</span>
                    <v-spacer></v-spacer>
                    <span class="mx-4">{{event.time}}</span>
                  </div>
                </v-list-item-subtitle>
                <v-divider></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div v-if="selectedGroup"
          class="todo-list-section scroll-section"
        >
          <div class="text-h6 skej-text font-weight-medium pa-4 pt-2">
            List
          </div>
          <v-divider></v-divider>
          <div v-for="group in groups"
            :key="`list-${group.pk}`"
          >
            <v-list
              v-show="group === selectedGroup"
              color="#f3f3ff"
              flat
              disabled
            >
              <draggable :list="group.todos" :group="`todolist-${group.pk}`">
                <v-list-item
                  v-for="(todo, i) in group.todos"
                  :key="`${group.pk}-item-${i}`"
                  class="px-0"
                >
                  <v-list-item-content class="pb-1">
                    <v-list-item-subtitle class="text-wrap">
                      <div class="mb-4 px-4">
                        {{todo.itemName}}
                      </div>
                    </v-list-item-subtitle>
                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
              </draggable>
            </v-list>
            <div style="position: fixed; bottom: 5px; width: 50%;">
              <draggable :list="group.todos" :group="`todolist-${group.pk}`" @end="createTodoItem">
                <div class="d-flex align-center justify-center draggable" key="new-item-add">
                  <v-icon class="grab">mdi-drag-horizontal-variant</v-icon>
                </div>
              </draggable>
              <div class="px-2" style="width: 90%">
                <v-text-field style="border: 1px solid lightgrey; background-color: #f3f3ff;"
                  v-model="todoForm.itemName" placeholder="New list item" type="text"
                  full-width rounded dense
                ></v-text-field>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <new-items-widget ref="newItemsWidget"
      :selectedGroup="selectedGroupId"
      @eventsRetrieved="refreshEvents"
    ></new-items-widget>
  </v-container>
</template>
<!-- @groupEventCreated="refreshEvents"
@groupCreated="refreshEvents" -->
<style scoped>
  @import "../styles/global-vars.scss";

  .group-list-page {
    background-color: $skej-background;
  }
  .group-toolbar {
    border-bottom: 1px solid lightgrey;
    background-color: #f3f3ff !important;
    margin-bottom: 10px;
  }
  .todo-list-section {
    /* pointer-events: none; */
  }
  /* .group-events-section {
    pointer-events: none;
  } */
  .group-list-section {
    /* pointer-events: none; */
    border-right: 2px solid lightgrey;
  }
  @media(min-width: 600px) {
    .group-list-section {
      height: calc(100vh - 100px);
    }
    .todo-list-section {
      height: calc(100vh - 500px);
    }
    .group-events-section {
      height: 350px;
    }
  }
  .search-frame {
    border: 1px solid lightgrey;
    border-radius: 30px;
    height: 40px;
  }

  .v-list-item--active {
    background-color: #e1f5fe;
    color: #28c3f2;
    border-right: 3px solid #28c3f2;
    border-radius: 0px;
  }
  .v-list-item {
    pointer-events: auto;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 36px;
  }
  .grab {
    cursor: grab;
  }
</style>

<script>
import axios from 'axios'

export default {
  name: 'groups',
  data: () => ({
    groups: [],
    selectedGroup: {
      pk: null,
      name: '',
      pic_url: '',
      events: [],
      todos: []
    },
    todoForm: {
      itemName: null,
      group: null
    },
    polling: null,
    selectedGroupId: null,
    events: [],
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
    day_start: 7
  }),
  methods: {
    getGroups () {
      axios.get('group/')
        .then((response) => {
          this.groups = []
          for (var i in response.data) {
            const g = response.data[i]
            var group = {
              pk: g.id,
              name: g.groupName,
              description: g.groupDesc,
              pic_url: `https://picsum.photos/80?random=${i + 1}`,
              events: [],
              todos: []
            }
            this.groups.push(group)
          }
          this.getEventsForGroups()
          for (var g of this.groups) {
            this.getListForGroup(g)
          }
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    createTodoItem () {
      if (!this.todoForm.itemName) {
        return
      }
      this.todoForm.group = this.selectedGroup.pk
      axios.post('group/sharedlist/newitem/', this.todoForm)
        .then((response) => {
          // handle success
          for (var key in this.todoForm) {
            this.todoForm[key] = null
          }
          this.getListForGroup(this.selectedGroup)
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    // handleMove (evt, originalEvent) {
    //   if (this.todoForm.name === null) {
    //     return false
    //   }
    //   const futureIndex = evt.draggedContext.futureIndex
    //   this.newTaskPriority = futureIndex + 1
    // },
    // reorderTodoItem () {
    //   if (added !== undefined) {
    //   }
    //   if (moved !== undefined) {
    //     const item = moved.moved
    //     if (item) {
    //       console.log(item)
    //       if (item.newIndex < item.oldIndex) {
    //         item.element.priority = item.newIndex + 1
    //       } else {
    //         item.element.priority = item.newIndex + 2
    //       }
    //       this.todoReorderForm.name = item.element.name
    //       this.todoReorderForm.priority = item.element.priority
    //       this.todoReorderForm.id = item.element.id
    //       axios.patch(`group/sharedlist/${item.element.id}/update/`, this.todoReorderForm)
    //         .then((response) => {
    //           // handle success
    //           for (var key in this.todoReorderForm) {
    //             this.todoForm[key] = null
    //           }
    //           this.getTasks()
    //           // this.$emit('todoItemCreated')
    //         })
    //         .catch((error) => {
    //           console.log(error)
    //         })
    //     }
    //   }
    // },
    refreshEvents ($event) {
      console.log('refreshing')
      this.events = $event
      this.getGroups()
    },
    editEvent (event) {
      this.editingSelectedEvent = true
      this.selectedEvent = event
      const startdt = new Date(this.selectedEvent.eventStart)
      const enddt = new Date(this.selectedEvent.eventEnd)
      const startHr = `0${startdt.getHours()}`.slice(-2)
      const startMins = `0${startdt.getMinutes()}`.slice(-2)
      const endHr = `0${enddt.getHours()}`.slice(-2)
      const endMins = `0${enddt.getMinutes()}`.slice(-2)
      this.eventEditForm.startHour = startdt.getHours()
      this.eventEditForm.startMinutes = startdt.getMinutes()
      this.eventEditForm.endHour = enddt.getHours()
      this.eventEditForm.endMinutes = enddt.getMinutes()
      this.eventEditForm.eventName = this.selectedEvent.eventName
      this.eventEditForm.eventDesc = this.selectedEvent.eventDesc
      this.eventEditForm.startTime = `${startHr}:${startMins}`
      this.eventEditForm.endTime = `${endHr}:${endMins}`
      this.eventEditForm.type = this.selectedEvent.type
    },
    clearSelectedEvent () {
      const newStartTime = new Date(this.selectedEvent.eventStart)
      const newEndTime = new Date(this.selectedEvent.eventEnd)
      const startHr = this.eventEditForm.startHour
      const startMn = this.eventEditForm.startMinutes
      const endHr = this.eventEditForm.endHour
      const endMn = this.eventEditForm.endMinutes
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
          this.$refs.newItemsWidget.getEvents()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getEventsForGroups () {
      const today = new Date().toISOString().substring(0, 10)
      for (var group of this.groups) {
        group.events = []
        if (this.selectedGroup) {
          if (group.pk === this.selectedGroup.pk) {
            this.selectedGroup = group
            this.selectedGroupId = this.selectedGroup.pk
          }
        }
      }
      for (var event of this.events) {
        const startDate = event.eventStart.substring(0, 10)
        // console.table('group event: ', event.groupEvent, 'startDate: ', startDate)
        if (event.groupEvent && (startDate >= today)) {
          // console.log('hello')
          for (var g of this.groups) {
            if (g.pk === event.groupEvent) {
              const eventDate = new Date(event.eventStart).toLocaleDateString(
                'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              let eventTime = ''
              if (!event.allDay) {
                const startdt = new Date(event.eventStart)
                const startTime = startdt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
                const enddt = new Date(event.eventEnd)
                const endTime = enddt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
                eventTime = `${startTime} - ${endTime}`
              }
              event.time = `${eventDate} | ${eventTime}`
              g.events.push(event)
            }
          }
        }
      }
    },
    getListForGroup (group) {
      axios.get(`group/${group.pk}/sharedlist/`)
        .then((response) => {
          // handle success
          group.todos = response.data
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    selectGroup (group) {
      this.getListForGroup(group)
      this.selectedGroup = group
      this.selectedGroupId = this.selectedGroup.pk
    }
    // pollApi () {
    //   this.getGroups()
    //   if (this.$router.currentRoute.name === 'groups') {
    //     setTimeout(this.pollApi, 10000)
    //   }
    // }
  },
  mounted () {
    // this.getGroups()
    // this.pollApi()
    setTimeout(() => {
      if (this.groups.length) {
        this.selectedGroup = this.groups[0]
        this.selectedGroupId = this.selectedGroup.pk
      }
    }, 2000)
  }
}
</script>
