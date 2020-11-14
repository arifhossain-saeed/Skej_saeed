<template>
  <v-container>
    <v-row class="accounts-form" align="center" justify="center">
      <v-col>
        <v-alert type="error" v-show="form.errors.non_field_errors.length">{{form.errors.non_field_errors[0]}}</v-alert>
        <v-card class="px-2 pb-3 mx-auto" max-width="400">
          <v-card-title class="skej-pink text-center">{{$t("Sign Up")}}</v-card-title>
          <v-form lazy-validation @submit="register($event)" v-show="active">
            <v-card-text>
              <v-text-field
                  v-model="form.first_name"
                  :error-messages="form.errors.first_name"
                  type="text"
                  :disabled="!active"
                  :label="$t('First Name')"
                  :rules="[required]"
                  name="first_name"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="form.last_name"
                  :error-messages="form.errors.last_name"
                  type="text"
                  :disabled="!active"
                  :label="$t('Last Name')"
                  :rules="[nameRules.common, required]"
                  name="last_name"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="form.username"
                  :error-messages="form.errors.username"
                  type="email"
                  :disabled="!active"
                  :rules="[required, emailRules[0]]"
                  :label="$t('Email')"
                  name="email"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="form.password"
                  :error-messages="form.errors.password"
                  type="password"
                  :disabled="!active"
                  :rules="[required, rules[0]]"
                  :label="$t('Password')"
                  name="password"
                  required
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn
                  type="submit"
                  block
                  class="skej-yellow-background"
                  :disabled="!active"
              >
                {{$t("Register")}}
              </v-btn>
            </v-card-actions>

            <div id="loader-wrap" v-show="!active">
              <v-progress-circular
                  :size="70"
                  :width="4"
                  color="#e20052"
                  indeterminate
              ></v-progress-circular>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- Styles shared with login and forgot password views are found in app.vue -->
<style lang="scss" scoped>
</style>

<script>
import i18n from '@/i18n'
import axios from 'axios'
// import qs from 'qs'
import { mapActions } from 'vuex'

export default {
  name: 'signUp',
  data: () => {
    return ({
      form: {
        password: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        errors: {
          non_field_errors: [],
          username: [],
          password: [],
          first_name: [],
          last_name: []
        }
      },
      form2: {
        username: '',
        password: ''
      },
      emailRules: [
        v => /.+@.+\..+/.test(v) || i18n.t('forms.rules.validEmail')
      ],
      rules: [
        v => v.length < 100 || i18n.t('forms.rules.tooLong')
      ],
      nameRules: {
        common: v => v.length < 50 || i18n.t('forms.rules.tooLong')
      },
      required: v => !!v || i18n.t('forms.rules.required'),
      active: true
    })
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn'
    }),
    register (event) {
      event.preventDefault()
      event.stopPropagation()
      this.active = false
      this.form.email = this.form.username
      this.form.is_personal = true
      this.form2.username = this.form.username
      this.form2.password = this.form.password
      axios.post('register/', this.form)
        .then((response) => {
          this.signIn(this.form2).then(() => {
            this.$router.replace({
              name: 'today'
            })
            this.form.password = ''
            this.form2.password = ''
            this.active = true
          })
        })
        .catch((error) => {
          console.log(error.response.data)
          const errors = error.response.data
          this.active = true
          for (var key in errors) {
            this.form.errors[key] = errors[key]
          }
        })
    }
  }
}
</script>
