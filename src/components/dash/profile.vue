<template>
  <div>
    <v-btn text :to="{ name: 'settings' }" class="mt-2">
      <v-icon>mdi-chevron-left</v-icon> Settings
    </v-btn>
    <v-container class="text-center">
      <h1 class="mb-4">Profile</h1>
      <v-avatar width="200" height="200">
        <v-img
          src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
        ></v-img>
      </v-avatar>
      <v-sheet max-width="500" class="mx-auto mt-12 skej-grey-background">
        <v-form>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">First Name</v-col><v-col cols="8" class="py-0"><v-text-field></v-text-field></v-col></v-row>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">Last Name</v-col><v-col cols="8" class="py-0"><v-text-field></v-text-field></v-col></v-row>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">Time Zone</v-col><v-col cols="8" class="py-0"><v-text-field></v-text-field></v-col></v-row>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">Phone Number</v-col><v-col cols="8" class="py-0"><v-text-field></v-text-field></v-col></v-row>

          <v-row class="mt-5" justify="center"><v-btn dark color="#45C3F2">Confirm</v-btn></v-row>

        </v-form>
      </v-sheet>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
export default {
  name: 'profile'
}
</script>
