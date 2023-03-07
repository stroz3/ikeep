<template >
  <div class="wrapper">
      <v-card
          class="note"
          max-width="400"
          min-width="344"
          v-for="(note, index) in notes"
          v-bind:key="index"
      >
        <div

               @click="triggerDialog(note)"
            >
              <v-img v-if="note.img" :src="note.img" style="max-height:350px" ></v-img>
              <v-card-text >

                    <h2 class="text-h6 text-primary" >
                      {{ note.title }}
                    </h2>
                    <p v-html="note.description"></p>
              </v-card-text>
            </div>
        <v-card-title>
          <div>
                <v-btn @click="click1(note.id)" icon rounded>
                  <v-icon>
                    photo
                  </v-icon>
                </v-btn>
                <input
                    @change="previewImage($event, noteId)"
                    type="file"
                    id="fileUpload"
                    ref="input2"
                    style="display: none"
                    accept="image/*"
                >

             </div>
          <v-btn v-if="note.img" icon rounded @click="deleteImg(note.id)">
            <v-icon>
              image_not_supported
            </v-icon>
          </v-btn>
          <v-btn icon rounded @click="deleteNote(note.id)">
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
     <v-dialog v-model="show" max-width="600px"
              height="auto" :retain-focus="false">
          <v-card>
                <v-img :src="item.content.img" :style="{'max-height': height}" ></v-img>
                <v-card-title>
                  <input class="input-append text-h5" type="text" placeholder="Введите Заголовок" v-model="item.content.title" @input="e => updateTitle(e, item.content.id)">
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" style="padding: 0">
                        <vue-editor
                          :value="item.content.description"
                          @input="e => updateDescription(e, item.content.id)"
                        />
                      </v-col>
                      <v-col>
                        <v-chip close
                                small
                                close-icon="mdi-delete"
                                @click:close="deleteLabel(index, item.content.id)"
                                v-for="(label, index) in item.content.label"
                                v-bind:key="index"
                                style="margin-right: 10px"
                        >
                          {{ label.name }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <div>
                    <v-btn @click="click1(item.content.id)" icon rounded>
                      <v-icon>
                        photo
                      </v-icon>
                    </v-btn>
                    <input
                        @change="previewImage($event)"
                        type="file"
                        id="fileUpload"
                        ref="input2"
                        style="display: none"
                        accept="image/*"
                    >
                    <v-btn v-if="item.content.img" icon rounded @click="deleteImg(item.content.id)">
                      <v-icon>
                        image_not_supported
                      </v-icon>
                    </v-btn>
                    <v-btn icon rounded @click="deleteNote(item.content.id)">
                      <v-icon>
                        delete
                      </v-icon>
                    </v-btn>
                  </div>
                  <div style="position:relative;">
                    <v-btn class="tooltip" icon rounded @click="modal_search = !modal_search">
                      <v-icon>
                        add_box
                      </v-icon>
                      <span class="tooltiptext">
                        Добавить ярлык
                      </span>
                    </v-btn>
                    <div class="modal_search" v-if="modal_search">
                      <div>
                        <h3>Добавить ярлык</h3>
                        <div style="display: flex; margin-top: 5px">
                          <input id="search" type="text" placeholder="Введите название ярлыка"
                                 style="font-size: 13px; width: 165px; outline: none; color: white" v-model="search">
                          <label for="search" style="width: 25px; height: 25px">
                            <v-icon style="font-size: 20px">search</v-icon>
                          </label>
                        </div>
                        <v-container class="px-0" style="max-height: 150px; overflow-y: auto; overflow-x:hidden" fluid>
                          <v-checkbox class="my-checkbox" v-for="label in filteredList" :key="label.id"
                                      id="label"
                                      :label="label.name"
                                      v-model="noteDialogs.label"
                                      :value="label"
                                      @change="updateLabel(item.content.id)"
                          ></v-checkbox>
                        </v-container>
                        <v-divider v-if="search"></v-divider>
                        <div v-if="search" @click="addNewLabel"
                             style="padding-top: 10px;font-size:13px; cursor: pointer">
                          <v-icon>add</v-icon>
                          Создать ярлык: {{ search }}
                        </div>
                      </div>
                    </div>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="show = false"
                    >
                      Close
                    </v-btn>
                  </div>
                </v-card-actions>
              </v-card>
        </v-dialog>
  </div>
</template>

<script>
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import { VueEditor } from "vue2-editor";


export default {
  name: "NoteItem",
  props: ['notes', 'labels'],
  components:{
    VueEditor
  },
  data() {
    return {
      show: false,
      newTitle: '',
      newImg: '',
      imgName:'',
      imageData: null,
      height: 0,
      search: '',
      modal_search: false,
      overlay:false,
      isActive: true,
      newDescription: "",
      noteDialogs:{},
      noteId: '',
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    }
  },
  watch: {
    show() {
      if (this.noteDialogs.img === '') {
        this.height = 0
      } else {
        this.height = 350 + 'px'
      }

    }
  },
  methods: {
    click1(noteId) {
      let fileUpload = document.getElementById('fileUpload')

      if (fileUpload != null) {
        this.noteId = noteId
        fileUpload.click()
      }
    },
    triggerDialog(note){
      this.noteDialogs = note
      this.show = true
    },
    async previewImage(event, noteId) {
      this.uploadValue = 0;
      this.newImg = null;
      this.imageData = event.target.files[0]
      await this.onUpload(noteId)
    },
    async onUpload(noteId) {
      this.newImg = null;
      const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
      await storageRef.on(`state_changed`, snapshot => {
            this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, error => {
            console.log(error.message)
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then(async (url) => {
              this.newImg = url;
              this.height = 400 + 'px';
              this.imgName = this.imageData.name
              let newImg = this.newImg
              let imgName = this.imageData.name
              if(this.notes[this.notes.map(e => e.id).indexOf(noteId)].img !== ""){
                await this.$store.dispatch("notes/deleteImg", noteId)
              }
              await this.$store.dispatch("notes/updateImg", {newImg, imgName, noteId}).then(()=>{
                this.noteDialogs = this.notes[this.notes.map(e => e.id).indexOf(noteId)]
              })
            })
          })
    },
    async updateTitle(e, noteId) {
      const updateTitle = e.target.value;

      await this.$store.commit('notes/updateTitle', {updateTitle, noteId})
      // // При написании большого кол-ва буковок. Путем обновления интервала
      await this.updateItem(noteId)
    },
    async updateDescription(e, noteId) {
      const updateDescription = e;
      await this.$store.commit('notes/updateDescription', {updateDescription, noteId})
      await this.updateItem(noteId)
    },
    async updateItem(noteId) {
      await this.$store.dispatch('notes/updateNote', {noteId})
    },
    async deleteNote(noteId) {
      for (const el of this.notes){
        if(el.id === noteId && el.imgName){
          await this.$store.dispatch("notes/deleteImg", noteId)
        }
      }
      await this.$store.dispatch("notes/deleteNote", noteId)
    },
    async deleteImg(noteId){
      await this.$store.dispatch('notes/deleteImg', noteId).catch(e=>{this.$toasted.error(e)})
    },
    async updateLabel(noteId){
        let labels = this.noteDialogs.label
        await this.$store.commit("notes/updateLabel", {labels, noteId})
        await this.updateItem(noteId)
    },
    async deleteLabel(index, noteId){
        this.noteDialogs.label.splice(index, 1)
        let labels = this.noteDialogs.label
        await this.$store.commit("notes/updateLabel", {labels, noteId})
        await this.updateItem(noteId)
    },
    async addNewLabel() {
      for(let el of this.labels){
        if(el && el.name === this.search){
          this.$toasted.info('this label is already exists', {duration: 1000})
          return
        }
      }
      await this.$store.dispatch('labels/addLabel', {
        name: this.search
      })
      await this.$store.dispatch("main/addLabelsToLinks", this.$store.getters["labels/items"])
      this.noteDialogs.label.push(this.labels[this.labels.map(e=>e.name).indexOf(this.search)])
      this.search = ''
    },
  },
  computed: {
    filteredList() {
      return this.labels.filter(label => {
        return label.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    dialogLabel:{
      get(){
        return this.noteDialogs.label
      },
      set(){

      }
    },
      item () {
        return {
          content: this.noteDialogs
        }
      },
  },
}

</script>

<style scoped>

.wrapper{
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.note{
  height:auto;
  min-height:30px;

  margin-left: 20px;
}
</style>