<template>
  <v-navigation-drawer
      clipped
      :right="$vuetify.rtl"
      :class="localStorage.sideNavMini && 'mini'"
      permanent
      stateless
      :expand-on-hover="localStorage.sideNavMini"
      fixed
      :mini-variant="localStorage.sideNavMini"
      style="padding-top: 64px; background-color: #f3f3ff"
      height="100%"
      :overlay-color="'blue'"
  >
    <v-list dense nav class="pa-0">
      <v-list-item two-line id="first" link :to="{name: 'settings', params: $route.params, query: $route.query}" class="justify-center">
        <v-list-item-avatar>
          <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt="Placeholder">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> User McTesty </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mb-1"/>

<!--      <v-list-item link :to="{name: 'calendar', params: $route.params, query: $route.query}">-->
<!--        <v-list-item-icon>-->
<!--          <v-icon>mdi-calendar-month</v-icon>-->
<!--        </v-list-item-icon>-->
<!--        <v-list-item-content>-->
<!--          <v-list-item-title>{{$t('sidenav.calendar')}}</v-list-item-title>-->
<!--        </v-list-item-content>-->
<!--      </v-list-item>-->

      <!-- <v-list-group prepend-icon="mdi-calendar-account" value="true">
         <template v-slot:activator>
           <v-list-item-title>{{$t('sidenav.calendar')}}</v-list-item-title>
         </template>-->
       <v-list-item link :to="{name: 'today', params: $route.params, query: $route.query}" class="py-2 justify-center">
        <v-list-item-icon>
          <v-icon>mdi-calendar-check</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Your Day, Today</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

        <v-list-item link :to="{name: 'calendar', params: {...$route.params, view: 'month'}, query: $route.query}" class="py-2 justify-center">
          <v-list-item-icon>
            <v-icon class="sub">mdi-calendar-month-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'groups', params: $route.params, query: $route.query}" class="py-2 justify-center">
          <v-list-item-icon>
            <v-icon class="sub">mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Groups</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
<!--      </v-list-group>-->

      <v-divider/>

      <v-list-item @click.prevent="signOut" class="py-2 justify-center mt-4">
        <v-list-item-icon>
          <v-icon>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
          >Log Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
  aside {
    padding-top: 56px !important;

    #first {
      margin: 0;
    }
  }

  .mini #first {
    padding: 0;
    transition: padding 0.2s;

  }

  #footer {
    width: 256px;
    position: absolute;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.64);
    line-height: 17.5px;
    bottom: 0;

    * {
      color: inherit;
    }

    #big {
      display: block;
    }

    #small {
      display: none;
      padding: 9px 0;
      font-size: 26px;
      font-weight: 300;
      width: 56px;
      margin: 0;
      line-height: 26px;
      text-align: center;
    }
  }

  .mini {

    #footer {
      #big {
        display: none;
      }

      #small {
        display: block;
      }
    }
  }

  aside:hover {
    #footer {
      #big {
        display: block;
      }

      #small {
        display: none;
      }
    }

    #first {
      padding: 0 8px;
    }
  }

  .v-list-item--active {
    background-color: #e1f5fe;
    color: #28c3f2;
    border-right: 3px solid #28c3f2;
    border-radius: 0px;
  }
</style>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'sidenav',
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user'
    })
  },

  data: () => ({

  }),
  methods: {
    ...mapActions({
      signOutAction: 'auth/signOut'
    }),
    signOut () {
      this.signOutAction().then(() => {
        this.$router.replace({
          name: 'login'
        })
      })
    }
  }
}
</script>
