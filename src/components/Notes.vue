<template>
  <div>
    <v-app>
      <form>
        <v-row justify="center" style="padding-top: 40px">
          <v-dialog
              v-model="dialog"
              scrollable
              max-width="600px"
              height="auto"
          >


            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="dark"
                  dark
                  v-bind="attrs"
                  v-on="on"
              >
                <input type="text" placeholder="Заметки...">
              </v-btn>

            </template>
            <div @keyup.esc="addNewNotes()">
              <v-card>
                <div v-if="note.imageData !== null">
                  <img alt="" width="100%" :height="height" :src="note.img">
                </div>
                <v-card-title>
                  <span class="text-h5">Заметка</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <input class="input-append" type="text" placeholder="Введите Заголовок"
                               v-model="note.title">
                      </v-col>
                      <v-col cols="12" style="padding: 0">
                         <vue-editor v-model="note.description" ></vue-editor>
                      </v-col>
                      <v-col>
                        <v-chip close
                                small
                                close-icon="mdi-delete"
                                @click:close="note.label.splice(index, 1)"
                                v-for="(label, index) in note.label"
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
                    <v-btn @click="click1" icon rounded>
                      <v-icon>
                        photo
                      </v-icon>
                    </v-btn>
                    <input
                        @change="previewImage"
                        type="file"
                        ref="input1"
                        style="display: none"
                        accept="image/*"
                    >
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
                          <v-checkbox class="my-checkbox" v-for="(label, index) in labels" :key="label.id"
                                      id="label"
                                      :label="label.name"
                                      v-model="note.label"
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


                  </div>
                </v-card-actions>
              </v-card>
            </div>
          </v-dialog>
        </v-row>
      </form>
      <div v-if="loader" class="text-center" style="margin-top: 100px">
          <v-progress-circular
            indeterminate
            color="white"
          ></v-progress-circular>
        </div>
      <div v-else class="notes">
        <note :layouts="layouts" :notes="notes" :labels="labels" :colNum="colNum" :draggble="draggble" ></note>
      </div>
    </v-app>
  </div>
</template>

<script>
import Note from "@/components/NoteItem";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import Label from "@/components/Label";
import login from "@/components/Login.vue";
import Vue from "vue";

export default {
  name: "Notes",
  components: {
    Label,
    Note,
  },

  data() {
    return {
      dialog: false,
      note: {
        title: 'asd',
        description: '',
        label: [],
        img: '',
        imgName: '',
        sortOrder: 0
      },
      imageData: null,
      height: 0,
      search: '',
      modal_search: false,
      colNum: 6,
      draggble: true,
      loader: true,
      index: 0,
    }
  },
    computed: {
    notes() {
      return this.$store.getters["notes/items"]
    },
    labels() {
      return this.$store.getters["labels/items"]
    },
    order() {
      if(this.notes.length > 0){
        return this.notes[this.notes.length - 1].sortOrder + 1
      }else{
        return 0
      }
    },

    layouts() {
      return this.$store.getters["notes/layouts"].map(item => {
        const { i, x, y, w, h } = item
        return { i, x, y, w, h }
      })
    },
  },
  async mounted() {
    await this.$store.dispatch('notes/bindNotes').finally(_ => {
      this.loader = false
      this.$store.dispatch('auth/bindUsers', this.$store.getters["auth/getUserUid"])
      this.$store.commit("notes/addNewBlock")
    }).finally(_=>{
        this.index = this.notes[this.notes.length - 1].layout.i + 1
    })
    await this.$store.dispatch('labels/bindLabels')
    await this.$store.dispatch("main/addLabelsToLinks", this.$store.getters["labels/items"])
  },
  watch:{
    dialog(newVal){
      if(newVal === false){
          this.addNewNotes()
      }
    },
  },
  methods: {
    click1() {
      this.$refs.input1.click()
    },

    previewImage(event) {
      this.uploadValue = 0;
      this.note.img = null;
      this.imageData = event.target.files[0]
      this.onUnpload()
    },
    onUnpload() {
      this.note.img = null;
      const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
            this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, error => {
            this.$toasted.error(error.message)
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {
              this.note.img = url;
              this.height = 400 + 'px';
              this.note.imgName = this.imageData.name
            })
          })

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
      }).finally(_=>{
          this.$store.dispatch("main/addLabelToLinks", this.$store.getters["labels/items"][this.$store.getters["labels/items"].map(el => el.name).indexOf(this.search)])
          this.note.label.push(...this.labels.filter(e => e.name === this.search).map(label =>{{return {name: label.name, labelId: label.id}}}))
      })
      this.search = ''
    },
    getNextX() {
      const lastItem = this.$store.getters["notes/layouts"][this.$store.getters["notes/layouts"].length - 1]
      if (lastItem) {
          return Math.floor(this.$store.getters["notes/layouts"].length % this.colNum)
      } else {
        return 0
      }
    },
    async addNewNotes() {
      this.dialog = false
      if(this.note.title !== '' || this.note.description !== ''){
          this.note["layout"] = {
            x: this.getNextX(),
            y: (this.$store.getters["notes/layouts"].length === this.colNum ? this.$store.getters["notes/layouts"].length + this.colNum : 0),
            w: 1,
            h: 5,
            i: this.index,
          }
          this.index++
          this.note.sortOrder = this.order
            await this.$store.dispatch('notes/addNotes', {...this.note})
              .finally(_ => {
                this.$store.commit("notes/addLayout", this.note.layout)
              })
              .catch(e => this.$toasted.error(e, {duration: 3000}))
        }
      this.note =
          {
            title: 'asd' + this.index,
            description: '',
            label: [],
            img: '',
            imgName: ''
          }
      this.imageData = null
      this.height = 0
    },
    clearArea() {
      this.dialog = false
      this.note = {
        title: '',
        description: '',
        label: [],
        img: '',
        layout:{
          x:0,
          y:0,
          w:2,
          h:5,
        }
      }
      this.imageData = null
      this.height = 0
    },

  },
}
</script>

<style>
.ql-toolbar.ql-snow,.ql-container.ql-snow{
  border: none !important;
}
.textArea-auto {
  width: 100%;
  border: 0;
  outline: 0;
  color: white;
}

.normal-input {
  padding: 0;
  margin: 0;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: #555;
  color: #fff;
  font-size: 10px;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 9999;
  bottom: 150%;
  left: 53%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.modal_search {
  width: 210px;
  position: fixed;
  background-color: #2d2e30;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 60%), 0 2px 6px 2px rgb(0 0 0 / 30%);
  padding: 10px;
  border-radius: 5px;
  font-size: 13px;
}

.my-checkbox {
  margin: 0;
}

.my-checkbox .v-label {
  font-size: 13px;

}

.my-checkbox .v-messages.theme--dark {
  display: none;
}
.notes{
  margin: 50px 0 50px 0;
  padding-left: 15px;
  padding-right: 15px;
  width: 100%;
}
</style>
