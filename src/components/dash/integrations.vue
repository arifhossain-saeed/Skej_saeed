<template>
  <div>
    <v-btn text :to="{name: 'settings'}" class="mt-2">
      <v-icon>mdi-chevron-left</v-icon> Settings
    </v-btn>
    <v-container class="text-center">
      <h1>Integrations</h1>
      <v-sheet max-width="500" class="mx-auto mt-12 skej-grey-background">
        <h3 class="mb-3">Personal</h3>
        <v-form>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center"><v-icon left slot="prepend" color="red">mdi-google</v-icon>Google</v-col><v-col cols="8" class="text-right">user@mycompany.com</v-col></v-row>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center"><v-icon left slot="prepend" color="blue">mdi-facebook</v-icon>Facebook</v-col><v-col cols="8" class="text-right">user@facebook.com</v-col></v-row>
          <v-row class="mt-5" justify="center"><v-btn dark color="#45C3F2">Confirm</v-btn></v-row>
        </v-form>
        <h3 class="mt-12 mb-3">Business</h3>
        <v-form>
          <v-row><v-col cols="4" class="py-0 text-left" align-self="center"><v-icon left slot="prepend" color="red">mdi-google</v-icon>Google</v-col><v-col cols="8" class="text-right">user@mycompany.com</v-col></v-row>

          <v-row class="mt-5" justify="center"><v-btn dark color="#45C3F2">Add Integration</v-btn></v-row>
        </v-form>
      </v-sheet>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
export default {
  name: 'integrations'
}
</script>
