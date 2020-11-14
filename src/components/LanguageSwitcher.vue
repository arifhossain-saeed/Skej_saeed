<template>
  <v-card>
    <v-card-title>{{$t('languageSelector.title')}}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="6" class="py-0 px-2 my-2">
          <v-list dense>
            <v-list-item-group v-model="selectedCountry" mandatory>
              <v-list-item v-for="(country, i) in countries" :key="i" :title="country">
                <v-list-item-avatar size="25">
                  <v-img :src="require('@/assets/flags/' + i + '.png')"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title> {{country}} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>

        <v-col cols="6" class="py-0 px-2 my-2">
          <v-list dense>
            <v-list-item-group v-model="langIndex" mandatory>
              <v-list-item v-for="(language, i) in languages" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-once>{{fullNames[language]}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="pt-1">
      <v-btn
          @click="$emit('close')"
          :to="destination"
          class="skej-green-background grey--text text--darken-4"
          style="width: 100%"
      >
        {{$t('languageSelector.select')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
  .v-card, .row, .col, .v-list {
    height: 100%;
  }

  .v-card__text {
    height: calc(100% - 111px);
    overflow-y: hidden;
  }

  .v-list {
    overflow-y: auto;
  }
</style>

<script>
import moment from 'moment'
import i18n from '@/i18n'

export default {
  name: 'LanguageSwitcher',

  data: () => ({
    languages: i18n.availableLocales,
    dialog: false,
    selectedLanguage: i18n.locale,
    fullNames: {
      en: 'English',
      he: 'עברית',
      it: 'Italiano',
      de: 'Deutsch',
      ar: 'العربية',
      fa: 'فارسی',
      th: 'ภาษาไทย',
      zh: '汉语',
      tr: 'Türkçe',
      ja: '日本語',
      hi: 'हिन्दी',
      af: 'Afrikaans',
      nl: 'Nederlands',
      el: 'Ελληνικά',
      hy: 'հայերէն',
      cy: 'Cymraeg',
      ro: 'Română',
      uk: 'українська',
      pt: 'Português',
      es: 'Español',
      tl: 'Tagalog',
      ko: '한국어',
      da: 'Dansk',
      no: 'Norsk',
      sv: 'Svenska',
      fi: 'Suomi',
      cs: 'Čeština'
    }
  }),

  computed: {
    destination: function () {
      return '/' + this.selectedLanguage + this.$route.fullPath.substr(3)
    },
    langIndex: {
      get: function () {
        return this.languages.indexOf(this.selectedLanguage)
      },
      set: function (val) {
        this.selectedLanguage = this.languages[val]
      }
    },
    countries: function () {
      return i18n.t('languageSelector.countries')
    },
    selectedCountry: {
      get: function () {
        return Object.keys(this.countries).indexOf(this.localStorage.country)
      },
      set: function (index) {
        const country = Object.keys(this.countries)[index]
        this.localStorage.country = country
        moment.locale(this.selectedLanguage + '-' + country)
      }
    }
  }
}
</script>
