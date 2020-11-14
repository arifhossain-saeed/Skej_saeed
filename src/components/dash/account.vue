<template>
  <div>
    <v-btn text :to="{name: 'settings'}" class="mt-2">
      <v-icon>mdi-chevron-left</v-icon> Settings
    </v-btn>
    <v-container class="text-center">
      <h1>Account</h1>
      <v-sheet max-width="500" class="mx-auto mt-12 skej-grey-background">
        <v-form>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">Email</v-col><v-col cols="8" class="py-0"><v-text-field></v-text-field></v-col></v-row>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">Password</v-col><v-col cols="8" class="py-0"><v-text-field type="password"></v-text-field></v-col></v-row>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center">Account Type</v-col><v-col cols="8" class="py-0"><v-select placeholder=""></v-select></v-col></v-row>
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
  name: 'account'
}
</script>
