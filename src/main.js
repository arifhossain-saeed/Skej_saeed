import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import vueStripe from 'vue-stripe'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import router from './router'
import i18n from './i18n'
import reactiveStorage from 'vue-reactive-storage'
import store from './store'
import axios from 'axios'
import NewItemsWidget from './components/NewItemsWidget.vue'
import draggable from 'vuedraggable'
import EventTypeColorPicker from './components/EventTypeColorPicker.vue'
import DaySchedule from './components/DaySchedule.vue'
import MonthYearPicker from './components/MonthYearPicker.vue'

require('@/store/subscriber')

axios.defaults.baseURL = 'https://skejapi.herokuapp.com/'
// axios.defaults.baseURL = 'http://localhost:7000'
Vue.config.productionTip = false
Vue.component('new-items-widget', NewItemsWidget)
Vue.component('draggable', draggable)
Vue.component('event-type-color-picker', EventTypeColorPicker)
Vue.component('day-schedule', DaySchedule)
Vue.component('month-year-picker', MonthYearPicker)
// All reactive localStorage keys must be listed here with a default value to ensure reactivity.

Vue.use(reactiveStorage, {
  agreed: false,
  country: 'US',
  sideNavMini: true
})

// eslint-disable-next-line no-undef
NProgress.configure({ showSpinner: false })

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
  new Vue({
    components: {
      'stripe-checkout': vueStripe
    },
    vuetify,
    store,
    i18n,
    router,
    render: h => h(App)
  }).$mount('#app')
})

// Calendar component has a bug that gives an erroneous warning
// Ignoring this particuar warning until the issue is fixed
// https://github.com/vuetifyjs/vuetify/issues/9999

const ignoredMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.'

Vue.config.warnHandler = (message, vm, componentTrace) => {
  if (message !== ignoredMessage) {
    console.error(message + componentTrace)
  }
}
