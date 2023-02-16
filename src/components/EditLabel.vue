 <template>
  <div>
    <v-list>
      <v-subheader>LABELS</v-subheader>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-icon v-if="name">
            <v-icon @click="name = ''">close</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <input placeholder="Добавить новый ярлык" type="text" class="textArea-auto" v-model="name" @keyup.enter="addLabel">
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon @click="addLabel" v-if="name">add</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group
          color="primary"
      >
        <v-list-item
            v-for="(label, index) in labels"
            :key="label.label"
            class="no-active"
        >
          <div class="flex">
            <v-list-item-icon style="color: white !important;">
              <v-icon>label</v-icon>
            </v-list-item-icon>
            <v-list-item-content style="color: white !important;">
              <v-list-item-title v-if="!label.isShow" v-text="label.name"></v-list-item-title>
              <input v-else class="textArea-auto" type="text" :value="label.name" @keyup.enter="changeShow(label.id, index, true)"
                     @input="e => updateLabel(e, index, label.id)">
            </v-list-item-content>
            <v-list-item-icon v-if="!label.isShow" @click="changeShow(label.id, index, true)"
                              style="color: white !important;">
              <v-icon>edit</v-icon>
            </v-list-item-icon>
            <v-list-item-icon v-else style="color: white !important;">
              <button @click="deleteLabel(label.id)">
                <v-icon>delete</v-icon>
              </button>
              <v-icon @click="changeShow(label.id, index, false)">done</v-icon>
            </v-list-item-icon>
          </div>


        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {

  name: "EditLabel",
  data: () => ({
    newName: '',
    edit: true,
    name: ''
  }),
  methods: {
    async updateLabel(e, index, labelId) {
      // Задаем новое имя
      const updateName = e.target.value;
      this.newName = updateName
      // Отправляем на сервер
      await this.$store.commit('labels/updateLabel', {updateName, index})
      // При написании большого кол-ва буковок. Путем обновления интервала
      await this.updateItem(index, labelId)
      await this.$store.dispatch("main/updateLabelFromLinks", {updateName, labelId})
    },
    changeShow(labelId, index, bool) {
      this.$store.commit('labels/changeShow', {index, bool})
      this.updateItem(index, labelId)
    },
    updateItem(index, labelId) {
      this.$store.dispatch('labels/updateLabel', {index, labelId})

    },
    async deleteLabel(labelId) {
      await this.$store.dispatch('main/deleteLabelFromLinks', labelId)
      await this.$store.dispatch('labels/deleteLabel', labelId)
    },
    async addLabel() {
      for(let el of this.labels){
        if(el.name === this.name){
          alert('Такое имя уже есть, введите другое')
          return
        }
      }
      await this.$store.dispatch('labels/addLabel', {
        name: this.name
      })
      await this.addLabelToLinks
      this.name = ''
    }
  },
  computed: {
    addLabelToLinks(name){
      this.labels.forEach(el=>{
        if(el.name === this.name){
          this.$store.dispatch('main/addLabelToLinks', el)
        }
      })
    },
    labels() {
      return this.$store.getters['labels/items']
    }
  }
}
</script>

<style scoped>
.no-active::before {
  opacity: 0 !important;
  color: white;
}
</style>