<template>
    <div class="notes">
        <note-item :notes="notes" :labels="labels"></note-item>
    </div>
</template>

<script>
import "firebase/compat/storage";
import NoteItem from "@/components/NoteItem.vue";

export default {
  name: "Label",
  components:{
    NoteItem
  },
  data:()=>({
    notes:[]
  }),
  async created() {
    await this.$store.dispatch('notes/bindNotes')
    await this.$store.dispatch('labels/bindLabels')
    await this.$store.dispatch('main/addLabelsToLinks', this.$store.getters["labels/items"])
    await this.getNotes()
  },
  watch: {
    // при изменениях маршрута запрашиваем данные снова
    $route: 'getNotes',
  },
  methods: {
    async getNotes() {
      this.notes = []
      let notes = await this.$store.getters["notes/items"]
      for (const el of notes) {
        for (const elLabel of el.label) {
          if (this.$route.params.id === elLabel.labelId) {
            this.notes.push(el)
          }
        }
      }
    },
  },
  computed: {
    labels() {
      return this.$store.getters["labels/items"]
    }
  }
}
</script>

<style scoped>

</style>
