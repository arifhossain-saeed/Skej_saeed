<template>
  <v-app class="skej-grey-background" :class="$vuetify.rtl && 'rtl'">
    <v-app-bar
        app
        class="skej-grey-background"
        elevate-on-scroll
        short
        style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);"
    >
      <router-link
          class="d-flex align-center"
          :to="{name: 'dash', params: {lang: this.$route.params.lang}}"
      >
        <v-img
            alt="Skej Logo"
            src='./assets/full-logo.png'
            class="mr-2"
            contain
            transition="scale-transition"
            width="75"
        />
      </router-link>

      <v-spacer/>

      <template v-if="!authenticated">
        <v-btn
            :to="{name: 'login', params: this.$route.params, query: this.$route.query}"
            text
            class="mr-1"
        >
          <span class="">{{$t("nav.logIn")}}</span>
        </v-btn>

        <v-btn
            :to="{name: 'signUp', params: this.$route.params, query: this.$route.query}"
            text
            class="mr-2"
        >
          <span class="">{{$t("nav.signUp")}}</span>
        </v-btn>
      </template>
      <template v-else>
        <div style="position: relative">
          <v-btn absolute right fab x-small dark color="red"
            style="right: 20px; width: 20px; height: 20px;"
          >2</v-btn>
          <v-btn
              text
              class="mr-2"
          >
            <v-icon disabled large>mdi-bell</v-icon>
          </v-btn>
        </div>
      </template>
     </v-app-bar>

    <router-view name="sidenav" />

    <v-main :class="localStorage.sideNavMini && 'mini'">
      <!--<transition name="fade">-->
      <router-view/>
      <!--</transition>-->
    </v-main>

    <CookieNotice v-if="!this.localStorage.agreed" v-once />
  </v-app>
</template>

<style lang="scss">

  html {
    @media (min-width: 960px) {
      overflow-y: hidden !important;
    }
  }

  /* Hide page loading spinner */
  #nprogress .spinner {
    display: none;
  }

  @import "styles/global-vars.scss";

  /* Helper Classes */
  .skej-grey-background {
    background: $skej-background !important;
  }

  .skej-pink-background {
    background: $skej-pink !important;
  }

  .skej-yellow-background {
    background: $skej-yellow !important;
  }

  .skej-green-background {
    background: $skej-green !important;
  }

  .skej-blue-background {
    background: $skej-blue !important;
  }

  .skej-pink {
    color: $skej-pink !important;
  }

  .skej-yellow {
    color: $skej-yellow !important;
  }

  .skej-green {
    color: $skej-green !important;
  }

  .skej-blue {
    color: $skej-blue !important;
  }
  .skej-option-btn {
    color: #45C3F2;
    background-color: #D4F3FD;
    border-radius: 50px;
    padding: 5px 20px;
    height: 35px;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 5px;
  }
  .full-width {
    width: 100%
  }
  .clickable {
    cursor: pointer;
  }
  // Styles for the sidenav which require application level access
  .v-navigation-drawer__border {
    /*background-color: rgba(0, 0, 0, 0.5) !important;*/
  }
  .skej-text {
    color: $skej-text-color;
  }
  .vertical-dash {
    height: 100%;
    width: 4px;
    display: inline-block;
  }
  main {
    /*padding: 0 !important;*/
    margin-left: 256px !important;

    &.mini {
      margin-left: 56px !important;
    }
  }

  .rtl main {
    /*padding-left: 0 !important;*/
    /*padding-right: 7px !important;*/
    margin-left: 0 !important;
    margin-right: 256px !important;

    &.mini {
      margin-right: 56px !important;
      margin-left: 0 !important;
    }
  }
  @media (min-width: 960px) {
    .scroll-section {
      overflow-y: scroll;
    }
  }
  .text-decoration-underline {
    text-decoration: underline;
  }
  /* Customize website's scrollbar like Mac OS
  Not supports in Firefox and IE */

  /* total width */
  body::-webkit-scrollbar, .scroll-section::-webkit-scrollbar,  {
      background-color:#f3f3ff;
      width:16px
  }

  /* background of the scrollbar except button or resizer */
  body::-webkit-scrollbar-track, .scroll-section::-webkit-scrollbar-track {
        background-color:#f3f3ff;
  }

  /* scrollbar itself */
  body::-webkit-scrollbar-thumb, .scroll-section::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:4px solid #f3f3ff;
  }

  /* set button(top and bottom of the scrollbar) */
  body::-webkit-scrollbar-button {display:none}
  .clickable {
    cursor: pointer;
  }
  .v-input--dense > .v-input__control > .v-input__slot {
    margin-bottom: 1px !important;
  }
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 2px !important;
}
</style>

<script>
import CookieNotice from './components/CookieNotice'
import { mapGetters } from 'vuex'

export default {
  name: 'App',

  components: {
    CookieNotice
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated'
    }),
    rtl: function () {
      return this.$route.params.lang
    }

  },
  data: () => {
    return ({
      langSwitcher: false,
      fullNav: true
    })
  },

  methods: {
    logout () {
      this.$cookies.remove('authToken')
      this.$router.push({ name: 'login', params: this.$route.params, query: { ...this.$route.query, ref: 'logout' } })
    }
  },

  watch: {
    rtl: function (language) {
      this.$vuetify.rtl = language === 'he' || language === 'ar' || language === 'ku' || language === 'ur' || language === 'fa'
    }
  }
}
</script>
