<template>
    <v-app>
      <div style="width: 400px; border-radius: 50px">
        <div v-for="(note, index) in notes">
          <img :src="note.img" width="400px" height="auto" alt="">
          <div style="display: flex">
            <label style="margin-right: 10px">Title:</label>
            <input class="textArea-auto" type="text" :value="note.title" @input="e => updateTitle(e, index, note.id)">
          </div>
          <div style="display: flex">
            <label style="margin-right: 10px; ">Description:</label>
            <input class="textArea-auto" type="text" :value="note.description"
                   @input="e => updateDescription(e, index, note.id)">
          </div>
          <div style="display: flex">
            <label style="margin-right: 10px; ">Labels:</label>
            <ul>
              <li v-for="(index, label) in note.label" v-bind:key="label.label">{{label.name}}</li>
            </ul>
          </div>
          <div>
            <v-btn @click="click1" icon rounded>
              <v-icon>
                photo
              </v-icon>
            </v-btn>
            <input
                @change="previewImage($event, index, note.id)"
                type="file"
                id="fileUpload"
                ref="input2"
                style="display: none"
                accept="image/*"
            >
          </div>
          <!--        <button @click="updateNotes(note.id)">Update</button>-->
          <button @click="deleteNote(note.id, note.img)">Delete</button>
        </div>
      </div>
    </v-app>
</template>

<script>
import "firebase/compat/storage";
import firebase from "firebase/compat/app";

export default {
  name: "Label",
  data:()=>({
    notes:[],
    newTitle: '',
    newDescription: '',
    newImg: '',
    imgName:'',
    imageData: null,
    height: 0,
    search: '',
    modal_search: false,
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
  methods:{
    async getNotes(){
      this.notes = []

      let notes = await this.$store.getters["notes/items"]
      let labels = await this.$store.getters["labels/items"]
      for(const el of notes){
        for(const elLabel of el.label){
          if(this.$route.params.id === elLabel.labelId){
            this.notes.push(el)
          }
        }
      }
    },
    click1() {
      let fileUpload = document.getElementById('fileUpload')

      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    previewImage(event, index, noteId) {
      this.uploadValue = 0;
      this.newImg = null;
      this.imageData = event.target.files[0]
      this.onUpload(index, noteId)
    },
    async onUpload(index, noteId) {
      this.newImg = null;
      const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
      await storageRef.on(`state_changed`, snapshot => {
            this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, error => {
            console.log(error.message)
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {
              this.newImg = url;
              this.height = 400 + 'px';
              this.imgName = this.imageData.name
              // this.addNewNotes()
              let newImg = this.newImg
              let imgName = this.imageData.name
              this.$store.commit("notes/updateImg", {newImg, imgName, noteId})
            })
          })
    },
    updateTitle(e, index, noteId) {
      const updateTitle = e.target.value;

      this.$store.commit('notes/updateTitle', {updateTitle, index})
      // // При написании большого кол-ва буковок. Путем обновления интервала
      setTimeout(() => {
        this.updateItem(index, noteId)
      }, 300)
    },
    async updateDescription(e, index, noteId) {
      const updateDescription = e.target.value;

      // console.log(this.notes[index].title)
      await this.$store.commit('notes/updateDescription', {updateDescription, index})
      // При написании большого кол-ва буковок. Путем обновления интервала
      await this.updateItem(index, noteId)
    },
    updateItem(index, noteId) {
      this.$store.dispatch('notes/updateNote', {index, noteId})
    },
    async deleteNote(noteId) {
        for (const el of this.notes){
          if(el.id === noteId && el.imgName){
            await this.$store.dispatch("notes/deleteImg", noteId)
          }
        }
        await this.$store.dispatch("notes/deleteNote", noteId)
      }
    }
}
</script>

<style scoped>

</style>
