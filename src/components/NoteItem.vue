<template >
  <div class="wrapper">
     <v-dialog v-model="show"  max-width="600px"
              height="auto" :retain-focus="false">
          <v-card>
                <v-img :src="item.content.img" :style="{'max-height': height}" style="object-fit: cover;"></v-img>
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
                                @click:close="deleteLabel(item.content.id, label.labelId)"
                                v-for="(label, index) in item.content.label"
                                v-bind:key="index"
                                style="margin-right: 10px"
                        >
                          <span style="max-width: 50px; overflow: hidden">{{ label.name }}</span>
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
                    <v-btn icon rounded @click="deleteNote(item.content.id, item.content.layout.i)">
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
                          <v-checkbox class="my-checkbox" v-for="(label, index) in filteredList" :key="label.id"
                                      id="label"
                                      :label="label.name"
                                      v-model="noteDialogs.label"
                                      :value="labels[index]"
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
     <grid-layout
            :layout="layouts"
            :col-num="colNum"
            :row-height="rowHeight"
            :is-draggable="draggble"
            :is-resizable="true"
            :vertical-compact="true"
            :use-css-transforms="true"
            @layout-updated="layoutUpdatedEvent"
            style="height: 100vh; margin-bottom: 200px"
            ref="gridLayout"
    >

        <grid-item v-for="item in unionArray"
                   :x="item.layout.x"
                   :y="item.layout.y"
                   :w="item.layout.w"
                   :h="item.layout.h"
                   :i="item.layout.i"
                   :key="item.note.id"
                   style="height:auto; background-color: #202124; border-color: #5f6368; word-wrap: break-word; display:flex; flex-direction: column"
        >
          <div ref="note">
            <div
               @click=""
               @mouseup="triggerDialog(item.note, $event)"
               @mousedown="handleDialogDragStart"
               style="flex: 1 0"

            >
              <v-img v-if="item.note.img" :src="item.note.img" style="max-height:180px;  object-fit: cover;" ></v-img>
              <v-card-text>
                    <h2 class="text-h6 text-primary" >
                      {{ item.note.title }}
                    </h2>
                    <p style="max-height: 300px; overflow: hidden" v-html="item.note.description"></p>
              </v-card-text>
            </div>
          <v-col v-if="item.note.label">
                        <v-chip close
                                small
                                close-icon="mdi-delete"
                                @click:close="deleteLabel(item.note.id, label.labelId)"
                                v-for="(label, index) in item.note.label"
                                v-bind:key="index"
                                style="margin-right: 10px"
                        >
                         <span style="max-width: 50px; overflow: hidden">{{ label.name }}</span>
                        </v-chip>
          </v-col>
          <v-card-title>
          <div>
                <v-btn @click="click1(item.note.id)" icon rounded>
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
          <v-btn v-if="item.note.img" icon rounded @click="deleteImg(item.note.id)">
            <v-icon>
              image_not_supported
            </v-icon>
          </v-btn>
          <v-btn icon rounded @click="deleteNote(item.note.id, item.note.layout.i)">
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </v-card-title>
          </div>
        </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import { VueEditor } from "vue2-editor";
import VueGridLayout from 'vue-grid-layout';
import index from "vuex";
import Integer from "vuelidate/lib/validators/integer";


export default {
  name: "NoteItem",
  props: {notes:{type:Array}, labels:{type:Array}, colNum: {type:Number}, draggble:{type:Boolean}, layouts:{type: Array}},
  components:{
    VueEditor,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
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
      timerId: null,
      rowHeight: 30,
      longItemIndexes:[],
      mouseX:0,
      mouseY:0,
      dragStartX:0,
      dragStartY:0,
      dialogDrag: false
    }
  },
  created() {

  },
  watch: {
    show() {
      if (this.noteDialogs.img === '') {
        this.height = 0
        this.modal_search = false
        let noteId = this.noteDialogs.id
        this.$store.dispatch('notes/updateNote', noteId)
      } else {
        this.height = 350 + 'px'
      }
    },

  },
  methods: {
    click1(noteId) {
      let fileUpload = document.getElementById('fileUpload')
      if (fileUpload != null) {
        this.noteId = noteId
        fileUpload.click()
      }
    },
    handleDialogDragStart(event){
      this.dialogDrag = true
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },

    triggerDialog(note, event){
      if(this.dragStartX === event.clientX && this.dragStartY === event.clientY){
        this.noteDialogs = note
        this.show = true
        this.dialogDrag = false
        // this.edititing = note
      }
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
          }, e => {
            this.$toasted.error(e)
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
                const index = this.notes.map(el => el.id).indexOf(noteId)
                const i = this.notes[this.notes.map(el => el.id).indexOf(noteId)].layout.i
                const h = Math.floor(this.$refs.note[index].clientHeight / this.rowHeight) + 1
                this.$store.commit("notes/updateItemSize", {i, h})
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
      const index = this.notes.map(el => el.id).indexOf(noteId)
      const i = this.notes[this.notes.map(el => el.id).indexOf(noteId)].layout.i
      if(this.$refs.note[index].clientHeight > 172){
        let h = Math.floor(this.$refs.note[index].clientHeight / this.rowHeight) - 1
        if(h > 11){
          h = h - 2
        }
        else if(h > 18){
          h = 18
        }
        await this.$store.commit("notes/updateItemSize", {i, h})
      }
    },
    deleteNote(noteId, i) {
      for (const el of this.notes){
        if(el.id === noteId && el.imgName){
          this.$store.dispatch("notes/deleteImg", noteId)
        }
      }
      this.$store.dispatch("notes/deleteNote", noteId).then(()=>{
          this.show = false
      })
      this.$store.commit("notes/deleteLayouts", i)
    },
    async deleteImg(noteId){
      await this.$store.dispatch('notes/deleteImg', noteId).then(()=>{
        const i = this.notes[this.notes.map(el => el.id).indexOf(noteId)].layout.i
        const h = this.notes[this.notes.map(el => el.id).indexOf(noteId)].layout.h
        this.$store.commit("notes/updateItemSize", {i, h})
        this.noteDialogs.img = "", this.noteDialogs.imgName = "", this.height = 0}).catch(e=>{this.$toasted.error(e)})
    },
    async deleteLabel(noteId, labelId){
        await this.$store.commit("labels/deleteLabel", labelId)
        await this.$store.commit("notes/deleteLabel", {noteId, labelId})
        await this.updateItem(noteId)
        this.$emit('getNotes')
        debugger
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

    layoutUpdatedEvent(layout){
      layout.forEach(el =>{
        const { i, x, y, w, h } = el
        this.$store.commit("notes/updateItemPosition", { i, x, y })
        let noteId = this.notes[this.notes.map(el => el.layout.i).indexOf(el.i)].id
        this.$store.dispatch("notes/updateLayout", {noteId})
      })
    },
    async updateItem(noteId) {
      await this.$store.dispatch('notes/updateNote', noteId)
    },
  },
  computed: {
    filteredList() {
      return this.labels.filter(label => {
        return label.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    unionArray() {
      this.layouts
      return this.layouts.map((el, i) => {
        return {
          layout: el,
          note: this.notes[i] || '',
        }
      });
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
  height: 100vh;

  overflow-y: auto;
}
.note{
  height:auto;
  min-height:30px;
  margin-top: 15px;
  margin-left: 15px;
}
.grid-container{
  display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: min-content;
  grid-gap: 15px;
  align-items: start;
  margin-bottom: 200px;
}
.grid-item{

}
</style>