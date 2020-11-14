<template>
  <div style="height: 100%">
    <v-container style="height: 100%">
      <div style="height: 100%" class="d-flex align-center justify-center">
        <div>
          <div class="d-flex justify-center flex-column flex-md-row">
            <v-card max-width="450" flat :to="{name: 'profile'}"
              class="settings-card grey--text text--darken-1 mx-auto ma-md-2">
              <v-row class="" wrap>
                <v-col sm="2" cols="12" class="text-center">
                  <v-avatar color="light-blue lighten-5" rounded width="70" height="70" class="mx-auto">
                    <v-icon x-large :class="'light-blue--text darken-2--text'">mdi-account</v-icon>
                  </v-avatar>
                </v-col>
                <v-col sm="10" cols="12" class="pl-4">
                  <v-card-title class="headline mb-3 pt-0">Profile</v-card-title>
                  <v-card-subtitle class="grey--text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
            <v-card max-width="450" flat :to="{name: 'account'}"
              class="settings-card grey--text text--darken-1 mx-auto ma-md-2 my-3 clickable">
              <v-row class="" wrap>
                <v-col sm="2" cols="12" class="text-center">
                  <v-avatar color="light-blue lighten-5" rounded width="70" height="70" class="mx-auto">
                    <v-icon x-large :class="'light-blue--text darken-2--text'">mdi-cog</v-icon>
                  </v-avatar>
                </v-col>
                <v-col sm="10" cols="12" class="pl-4">
                  <v-card-title class="headline mb-3 pt-0">Account</v-card-title>
                  <v-card-subtitle class="grey--text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <div class="d-flex justify-center flex-column flex-md-row">
            <v-card max-width="450" flat :to="{name: 'calendar_settings'}"
              class="settings-card grey--text text--darken-1 mx-auto ma-md-2">
              <v-row class="" wrap>
                <v-col sm="2" cols="12" class="text-center">
                  <v-avatar color="light-blue lighten-5" rounded width="70" height="70" class="mx-auto">
                    <v-icon x-large :class="'light-blue--text darken-2--text'">mdi-calendar-month-outline</v-icon>
                  </v-avatar>
                </v-col>
                <v-col sm="10" cols="12" class="pl-4">
                  <v-card-title class="headline mb-3 pt-0">Calendar</v-card-title>
                  <v-card-subtitle class="grey--text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
            <v-card max-width="450" flat :to="{name: 'integration_settings'}"
              class="settings-card grey--text text--darken-1 mx-auto ma-md-2 my-3">
              <v-row class="" wrap>
                <v-col sm="2" cols="12" class="text-center">
                  <v-avatar color="light-blue lighten-5" rounded width="70" height="70" class="mx-auto">
                    <v-icon x-large :class="'light-blue--text darken-2--text'">mdi-account</v-icon>
                  </v-avatar>
                </v-col>
                <v-col sm="10" cols="12" class="pl-4">
                  <v-card-title class="headline mb-3 pt-0">Integrations</v-card-title>
                  <v-card-subtitle class="grey--text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <div class="mt-md-2">
            <v-card max-width="450" flat :to="{name: 'company'}"
              class="settings-card grey--text text--darken-1 mx-auto">
              <v-row class="" wrap>
                <v-col sm="2" cols="12" class="text-center">
                  <v-avatar color="light-blue lighten-5" rounded width="70" height="70" class="mx-auto">
                    <v-icon x-large :class="'light-blue--text darken-2--text'">mdi-text-box-plus</v-icon>
                  </v-avatar>
                </v-col>
                <v-col sm="10" cols="12" class="pl-4">
                  <v-card-title class="headline mb-3 pt-0">Company</v-card-title>
                  <v-card-subtitle class="grey--text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>
      </div>
    </v-container>
    <new-items-widget></new-items-widget>
  </div>
</template>

<style lang="scss" scoped>
  .settings-card {
    border-radius: 15px !important;
    padding: 5px 0px 0px 20px;
  }
</style>

<script>
export default {
  name: 'settings'
}
</script>
