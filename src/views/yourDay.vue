<template>
  <v-container fluid class="pa-0 skej-text" style="height: calc(100vh - 56px)">
    <v-row no-gutters>
      <v-col cols="12" md="6" lg="8" class="scroll-section">
        <div class="section-1">
          <v-toolbar
            flat
            class="group-toolbar skej-grey-background"
            height="80"
            >
            <v-toolbar-title class="ml-4">
              {{today}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <div id="color-bar" style="pointer-events: auto;">
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
          <day-schedule
            :date="new Date().toISOString().substring(0, 10)"
            :events="events"
            :active_types="active_types"
            :event_colors="event_colors"
            :type_colors="type_colors"
            :eventTypes="eventTypes"
            @event-updated="$refs.newItemsWidget.getEvents()"
          ></day-schedule>
        </div>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <div class="">
          <v-toolbar
            flat
            class="group-toolbar skej-grey-background flex-none"
            height="80"
            >
            <v-toolbar-title class="ml-2">
              To Do List
            </v-toolbar-title>
          </v-toolbar>
          <div class="todolist scroll-section" style="padding-bottom: 150px">
            <draggable v-bind="dragOptions" :list="tasks" group="todolist" @change="reorderTodoItem" ghost-class="drag-ghost">
              <div
                v-for="task in tasks"
                :key="`task-${task.priority}-${task.name}-${task.is_temp}`"
                class="pa-0 pt-1 grey-divider"
                :ref="`task-${task.pk}-text`"
                @mouseover="showTaskEditButtons = true; hoveredTask = task"
                @mouseleave="showTaskEditButtons = false; hoveredTask = null"
              >
                <!-- @click="setSelectedTask(task)" -->
                <v-slide-x-reverse-transition>
                  <span class="float-right" style=""
                    v-show="showTaskEditButtons && hoveredTask === task"
                  >
                    <a class="ma-2 text-decoration-underline" v-show="selectedTask === task"
                      @click="updateTask"
                    >Save</a>
                    <a class="ma-2 text-decoration-underline grey--text" v-show="selectedTask === task"
                      @click="clearSelectedTask"
                    >Cancel</a>
                    <v-btn x-small text class="float-right px-0 error--text" @click="deleteTask(task)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn x-small text class="float-right px-0 success--text" @click="taskDone(task)">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn x-small text class="float-right px-0 grey--text text--darken-1" @click="setSelectedTask(task)">
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </span>
                </v-slide-x-reverse-transition>
                <br v-show="selectedTask === task">
                <div class="d-flex align-center reorder my-1" v-if="selectedTask !== task">
                  <div :style="`height: 60px; display: inline-block;`"  >
                    <div :class="['vertical-dash', event_colors[`type${task.type}`]]"></div>
                    <!-- <v-icon class="mb-12">mdi-drag-vertical</v-icon> -->
                  </div>
                  <div class="mx-4" v-show="active_types.includes(`type${task.type}`) && selectedTask !== task"
                  >{{task.name}}</div>
                </div>
                <!-- <v-slide-group multiple show-arrows class="mb-2" v-show="selectedTask === task">
                  <v-slide-item
                    v-for="(button, key) in taskEditFieldButtons"
                    :key="`task-edit-button-${key}`"
                    v-slot:default="{ active, toggle }"
                  >
                    <button @click="button.showInput=!button.showInput"
                      class="mx-2 skej-option-btn"
                    >
                      {{button.text}}
                    </button>
                  </v-slide-item>
                </v-slide-group> -->
                <v-slide-x-transition hide-on-leave>
                  <div v-show="selectedTask === task" class="px-2" style="min-height: 80px;">
                    <event-type-color-picker
                      @colorSelected="setTodoEditTypeInput($event)"
                      :initialColorIndex="todoEditForm.type - 1"
                    ></event-type-color-picker>
                    <span class="mx-1 clickable" @click="taskEditFieldButtons.name.showInput = true"
                      v-show="!taskEditFieldButtons.name.showInput"
                    >{{task.name}}</span>
                    <v-slide-x-transition>
                      <v-text-field v-if="taskEditFieldButtons.name.showInput" class="pt-0 mx-1 d-inline-block"
                        v-model="todoEditForm.name" placeholder="Task name">
                      </v-text-field>
                    </v-slide-x-transition>
                  </div>
                </v-slide-x-transition>
              </div>
            </draggable>
            <div style="position: fixed; bottom: 5px; width: 450px; background-color: #f3f3ff">
              <draggable :list="tasks" draggable=".draggable" group="todolist" :move="handleMove" @end="createTodoItem">
                <div class="d-flex align-center justify-center draggable" key="new-item-add">
                  <v-icon class="grab">mdi-drag-horizontal-variant</v-icon>
                </div>
              </draggable>
              <event-type-color-picker
                @colorSelected="setTodoTypeInput($event)"
                :initialColorIndex="todoForm.type - 1"
              ></event-type-color-picker>
              <input
                placeholder="New list item" type="text"
                full-width rounded dense
                class="new-todo-input"
                v-model="todoForm.name"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <new-items-widget ref="newItemsWidget"
      @todoItemCreated="getTasks"
      @eventsRetrieved="refreshEvents"
    ></new-items-widget>
  </v-container>
</template>

<style lang="scss" scoped>

  @import "../styles/global-vars.scss";

  .group-toolbar {
    border-bottom: 2px solid #EBEBF1;
    margin-bottom: 10px;
  }

  .section-1 {
    border-right: 2px solid #EBEBF1;
    pointer-events: none;
  }
  .grey-divider {
    border-bottom: 1px solid #EBEBF1;
  }
  @media(min-width: 960px) {
    .section-1, .todolist {
      height: calc(100vh - 150px);
    }
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
  .grab {
    cursor: grab;
  }
  .reorder {
    cursor: row-resize;
  }
  .new-todo-input {
    border: 1px solid lightgrey;
    width: 375px;
    padding: 20px;
    border-radius: 50px;
  }
  .v-list-item {
    min-height: 0px !important;
  }
  .drag-ghost {
    opacity: 1 !important;
    border: 1px #BDF solid;
  }
  .grabbing {
    display: none;
  }
</style>

<script>
import axios from 'axios'

export default {
  name: 'yourDay',
  data: () => ({
    active_types: ['type1', 'type2', 'type3', 'type4'],
    event_colors: { type1: 'cyan', type2: 'green', type3: 'orange', type4: 'red' },
    type_colors: ['cyan', 'green', 'orange', 'red'],
    eventTypes: ['type1', 'type2', 'type3', 'type4'],
    hours: [],
    tasks: [],
    events: [],
    newTaskPriority: 0,
    newTodoInput: '',
    todoForm: {
      name: null,
      type: 1
    },
    todoReorderForm: {
      name: null,
      priority: null,
      pk: null
    },
    polling: null,
    taskEditFieldButtons: {
      name: { name: 'name', showInput: false, text: 'Name' },
      type: { name: 'type', showInput: false, text: 'Event Color/Type' }
    },
    todoEditForm: {
      name: null,
      type: null
    },
    selectedTask: null,
    tempAddModeTask: null,
    showTaskEditButtons: false,
    hoveredTask: null,
    today: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }),
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'drag-ghost'
      }
    }
  },
  methods: {
    refreshEvents ($event) {
      this.events = $event
    },
    getTasks () {
      axios.get('user/todolist/')
        .then((response) => {
          // handle success
          this.tasks = response.data
          for (var task of this.tasks) {
            task.selectedHeight = 60
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    toggleEventTypeActive (type) {
      if (this.active_types.includes(type)) {
        var index = this.active_types.indexOf(type)
        this.active_types.splice(index, 1)
      } else {
        this.active_types.push(type)
      }
    },
    createTodoItem () {
      if (this.todoForm.name) {
        this.todoForm.priority = this.newTaskPriority
        axios.post('user/todolist/add/', this.todoForm)
          .then((response) => {
            // handle success
            for (var key in this.todoForm) {
              this.todoForm[key] = null
            }
            this.todoForm.type = 1
            this.getTasks()
            // this.$emit('todoItemCreated')
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    updateTask () {
      axios.patch(`user/todolist/${this.selectedTask.pk}/update/`, this.todoEditForm)
        .then((response) => {
          // handle success
          this.getTasks()
          this.clearSelectedTask()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    taskDone (task) {
      axios.patch(`user/todolist/${task.pk}/updatestatus/`, { done: true })
        .then((response) => {
          // handle success
          this.getTasks()
          this.clearSelectedTask()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deleteTask (task) {
      axios.delete(`user/todolist/${task.pk}/delete/`)
        .then((response) => {
          // handle success
          this.getTasks()
          this.clearSelectedTask()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleMove (evt, originalEvent) {
      if (this.todoForm.name === null) {
        return false
      }
      const futureIndex = evt.draggedContext.futureIndex
      this.newTaskPriority = futureIndex + 1
      // this.tempAddModeTask = {
      //   name: this.todoForm.name,
      //   type: this.todoForm.type,
      //   is_temp: 'temporary'
      // }
      // this.tasks = this.tasks.filter(e => e.is_temp === undefined)
      // this.tasks.splice(futureIndex, 0, this.tempAddModeTask)
      // return false
    },
    handleReorderMove (evt, originalEvent) {
      // const index = evt.draggedContext.index
      const futureIndex = evt.draggedContext.futureIndex
      const task = evt.draggedContext.element
      // this.tempAddModeTask = {
      //   name: this.todoForm.name,
      //   type: this.todoForm.type,
      //   is_temp: 'temporary'
      // }
      this.tasks = this.tasks.filter(e => e.pk !== task.pk)
      this.tasks.splice(futureIndex, 0, task)
      this.newTaskPriority = futureIndex
    },
    reorderTodoItem (moved, removed, added) {
      if (added !== undefined) {
      }
      if (moved !== undefined) {
        const item = moved.moved
        if (item) {
          if (item.newIndex < item.oldIndex) {
            item.element.priority = item.newIndex + 1
          } else {
            item.element.priority = item.newIndex + 2
          }
          this.todoReorderForm.name = item.element.name
          this.todoReorderForm.priority = item.element.priority
          this.todoReorderForm.pk = item.element.pk
          axios.patch(`user/todolist/${item.element.pk}/update/`, this.todoReorderForm)
            .then((response) => {
              // handle success
              for (var key in this.todoReorderForm) {
                this.todoForm[key] = null
              }
              this.getTasks()
              // this.$emit('todoItemCreated')
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    },
    setTodoTypeInput (index) {
      this.todoForm.type = index + 1
      // this.showColorSelection = false
    },
    setTodoEditTypeInput (index) {
      this.todoEditForm.type = index + 1
      // this.showColorSelection = false
    },
    setSelectedTask (task) {
      this.selectedTask = task
      this.todoEditForm.name = task.name
      this.todoEditForm.type = task.type
      this.todoEditForm.done = false
      this.taskEditFieldButtons.type.showInput = true
      setTimeout(() => {
        const newHeight = this.$refs[`task-${task.pk}-text`][0].clientHeight
        this.selectedTask.displayHeight = newHeight
        task.selectedHeight = this.selectedTask.displayHeight
        this.$forceUpdate()
      }, 10)
    },
    clearSelectedTask () {
      if (this.selectedTask !== null) {
        this.selectedTask.selectedHeight = 60
        this.selectedTask = null
        this.taskEditFieldButtons.name.showInput = false
        this.taskEditFieldButtons.type.showInput = false
        for (var i in this.todoEditForm) {
          this.todoEditForm[i] = null
        }
      }
    }
    // pollApi () {
    //   this.$refs.newItemsWidget.getEvents()
    //   this.getTasks()
    //   if (this.$router.currentRoute.name === 'today') {
    //     setTimeout(this.pollApi, 10000)
    //   }
    // }
  },
  mounted () {
    // this.polling = this.pollApi()
    // this.$refs.newItemsWidget.getEvents()
    this.getTasks()
  }
}
</script>
