<template>
  <v-row class="accounts-form" align="center" justify="center">
    <v-card>
      <v-card-title class="skej-pink text-center">{{$t("forgotPwd.title")}}</v-card-title>
      <v-form lazy-validation v-show="active">
        <v-card-text>
          <span>Please enter your account's email address to reset your password:</span>
          <v-text-field
              v-model="email.val"
              type="email"
              :disabled="!active"
              :rules="[...required, email.rules[0]]"
              :label="$t('forms.email')"
              name="email"
              required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
              type="submit"
              block
              class="skej-yellow-background"
              :disabled="!active"
          >
            {{$t('forgotPwd.submitButton')}}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-row>
</template>

<script>
import i18n from '@/i18n'

export default {
  name: 'forgotPassword',
  data: () => ({
    email: {
      val: '',
      rules: [
        v => /.+@.+\..+/.test(v) || i18n.t('forms.rules.validEmail')
      ]
    },
    required: [
      v => !!v || i18n.t('forms.rules.required'),
      v => v.length > 7 || i18n.t('forms.rules.tooShort')
    ],
    active: true
  })
}
</script>

<style scoped>

</style>
