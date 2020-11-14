<template>
  <span>
    <v-btn fab x-small elevation="4"
      :color="type_colors[selectedColorIndex]"
      @click="showColorSelection=true"
      v-show="!showColorSelection"
      class="mx-4 my-2"
    ></v-btn>
    <!-- @click="showColorSelection=true"
    v-show="!showColorSelection" -->
    <v-btn v-for="(color, i) in type_colors"
      v-show="showColorSelection"
      fab x-small
      :color="color"
      :key="i"
      class="mx-1 my-2"
      @click="selectColor(i)"
    >
    <!-- @click="setTodoTypeInput(i)" -->
    </v-btn>
  </span>
</template>

<script>

export default {
  name: 'event-type-color-picker',
  props: ['initialColorIndex'],
  watch: {
    initialColorIndex: {
      handler (val, oldVal) {
        console.log('WATCH color index: ', this.initialColorIndex)
        this.selectColor(this.initialColorIndex)
      }
    }
  },
  data: () => {
    return ({
      active_types: ['type1', 'type2', 'type3', 'type4'],
      event_colors: { type1: 'cyan', type2: 'green', type3: 'orange', type4: 'red' },
      type_colors: ['cyan', 'green', 'orange', 'red'],
      eventTypes: ['type1', 'type2', 'type3', 'type4'],
      showColorSelection: false,
      selectedColorIndex: 0
    })
  },

  methods: {
    selectColor (index) {
      this.selectedColorIndex = index
      this.$emit('colorSelected', this.selectedColorIndex)
      this.showColorSelection = false
    }
  },
  mounted () {
    this.selectedColorIndex = this.initialColorIndex
  }
}
</script>
