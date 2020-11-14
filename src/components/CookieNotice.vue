<template>
  <v-bottom-sheet v-model="show" v-once v-on-click-outside="close" hide-overlay no-click-animation style="background: #FEFEFE">
    <v-container class="py-2">
      <v-row>
        <v-col cols="11" id="message" class="pa-0">
          <p class="ma-0">
            This website or its third-party tools process personal data (e.g. browsing data or IP addresses) and use cookies or other identifiers, which are necessary for its functioning and required to achieve the purposes illustrated in the cookie policy.
            In case of sale of your personal information, you may opt out by using the link "Do Not Sell My Personal Information".
            To find out more about the categories of personal information collected and the purposes for which such information will be used, please refer to our privacy policy.
            You accept the use of cookies or other identifiers by closing or dismissing this notice, by scrolling this page, by clicking a link or button or by continuing to browse otherwise.
          </p>
        </v-col>
        <v-col id="button" cols="1">
          <v-btn @click="close">
            {{$t('cookieNotice.accept')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-bottom-sheet>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import i18n from '@/i18n'
import { mixin as onClickOutside } from 'vue-on-click-outside'

export default {
  name: 'CookieNotice',

  mixins: [onClickOutside],

  data: () => {
    return ({
      show: true
    })
  },

  methods: {
    close: function () {
      this.localStorage.agreed = true
      this.show = false
      axios.get('http://ip-api.com/json/?fields=status,message,countryCode').then(response => {
        if (response.data.status === 'success') {
          this.localStorage.country = response.data.countryCode
          moment.locale(i18n.locale + '-' + response.data.countryCode)
        } else {
          this.localStorage.country = 'US'
          console.warn('Request to find country failed. Defaulted to US:\nstatus = ' + response.status + ',\nstatusText = ' + response.statusText)
          moment.locale(i18n.locale + '-US')
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .v-bottom-sheet {
    background: #EEE;

    #message {
      max-height: 75px;
      font-size: 12px;
      overflow: auto;
    }

    #button {
      display: flex;

      button {
        margin: auto;
      }
    }
  }
</style>
