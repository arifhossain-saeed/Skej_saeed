<template>
  <v-container>
    <v-row class="accounts-form" align="center" justify="center">
      <v-col>
        <v-alert type="error" v-show="form.errors.non_field_errors.length">{{form.errors.non_field_errors[0]}}</v-alert>
        <v-card class="px-2 pb-3 mx-auto" max-width="400">
         <v-card-title class="skej-blue text-center">{{$t("login.title")}}</v-card-title>
          <v-form lazy-validation @submit="login($event)" v-show="active">
            <v-card-text>
              <v-text-field
                  v-model="form.username"
                  :error-messages="form.errors.username"
                  type="username"
                  :disabled="!active"
                  :rules="[...required]"
                  :label="$t('Username')"
                  name="email"
                  required
              />

              <v-text-field
                  v-model="form.password"
                  :error-messages="form.errors.password"
                  type="password"
                  :disabled="!active"
                  :rules="required"
                  :label="$t('forms.password')"
                  name="password"
                  required
              />

              <!-- <v-checkbox
                  v-model="remember"
                  class="mt-0"
                  :disabled="!active"
                  hide-details
                  label="Remember me"
              /> -->
            </v-card-text>

            <router-link id="forgot"  :to="{name: 'forgotPassword', params: $route.params, query: {...$route.query, ref: 'login'}}"
              class="grey--text text--darken-3 pb-1">
              forgot password?
            </router-link>

            <v-card-actions>
              <v-btn
                  type="submit"
                  block
                  class="skej-yellow-background"
                  :disabled="!active"
              >
                {{$t("login.submitButton")}}
              </v-btn>
            </v-card-actions>
          </v-form>

          <div id="loader-wrap" v-show="!active">
            <v-progress-circular
                :size="70"
                :width="4"
                color="#e20052"
                indeterminate
            ></v-progress-circular>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
  #logged-out {
    padding: 0 16px;
    margin: 0;

    i {
      font-size: 22px;
      margin-top: -2px;
    }
  }

  .v-card__text {
    padding-top: 10px;
  }

  #forgot {
    position: absolute;
    right: 16px;
    bottom: 53px;
    font-size: 12px;
    text-decoration: none;

    &:hover, &:active {
      text-decoration: underline;
      color: black !important;
    }
  }
</style>

<style lang="scss">
</style>

<script>
import i18n from '@/i18n'
import { mapActions } from 'vuex'

export default {
  name: 'login',
  data: () => ({
    form: {
      username: '',
      password: '',
      errors: {
        non_field_errors: [],
        username: [],
        password: []
      }
    },
    required: [
      v => !!v || i18n.t('forms.rules.required'),
      v => v.length > 7 || i18n.t('forms.rules.tooShort')
    ],
    remember: false,
    active: true
  }),

  methods: {
    ...mapActions({
      signIn: 'auth/signIn'
    }),
    login (event) {
      event.preventDefault()
      event.stopPropagation()
      this.active = false
      // this.$router.push(!this.$route.query.dest ? { name: 'calendar', params: { lang: this.$route.params.lang } } : this.$route.query.dest)
      // Login logic
      for (var k in this.form.errors) { this.form.errors[k] = [] }
      this.signIn(this.form).then((response) => {
        // this.$router.replace({
        //   name: 'today'
        // })
        this.$router.push(!this.$route.query.dest ? { name: 'today', params: { lang: this.$route.params.lang } } : this.$route.query.dest)
      }).catch((error) => {
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
