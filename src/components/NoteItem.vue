<!--<template>-->
<!--  <div style="width: 400px; border-radius: 50px">-->
<!--    <div v-for="(note, index) in notes">-->
<!--      <img :src="note.img" width="400px" height="auto" alt="">-->
<!--      <div style="display: flex">-->
<!--        <label style="margin-right: 10px">Title:</label>-->
<!--        <input class="textArea-auto" type="text" :value="note.title" @input="e => updateTitle(e, index, note.id)">-->
<!--      </div>-->
<!--      <div style="display: flex">-->
<!--        <label style="margin-right: 10px; ">Description:</label>-->
<!--        <input class="textArea-auto" type="text" :value="note.description"-->
<!--               @input="e => updateDescription(e, index, note.id)">-->
<!--      </div>-->
<!--      <div style="display: flex">-->

<!--      </div>-->
<!--      <div>-->
<!--        <v-btn @click="click1" icon rounded>-->
<!--          <v-icon>-->
<!--            photo-->
<!--          </v-icon>-->
<!--        </v-btn>-->
<!--        <input-->
<!--            @change="previewImage($event, index, note.id)"-->
<!--            type="file"-->
<!--            id="fileUpload"-->
<!--            ref="input2"-->
<!--            style="display: none"-->
<!--            accept="image/*"-->
<!--        >-->
<!--      </div>-->
<!--      &lt;!&ndash;        <button @click="updateNotes(note.id)">Update</button>&ndash;&gt;-->
<!--      <button @click="deleteNote(note.id, note.img)">Delete</button>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<template >
  <div class="wrapper">
      <v-card
          class="note"
          max-width="344"
          v-bind="props"
          v-for="(note, index) in notes"
          v-bind:key="index"
      >
        <v-img :src="note.img"></v-img>

        <v-card-text>
          <h2 class="text-h6 text-primary">
            {{ note.title }}
          </h2>
          {{ note.description }}
        </v-card-text>

        <v-card-title>
            <v-btn
             icon>
              <v-icon>
                image
              </v-icon>
            </v-btn>

          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>
                  more_vert
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  :value="index"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </v-card-title>

      </v-card>
  </div>
</template>

<script>
import "firebase/compat/storage";
import firebase from "firebase/compat/app";

export default {
  name: "NoteItem",
  props: ['notes'],
  data() {
    return {
      newTitle: '',
      newDescription: '',
      newImg: '',
      imgName:'',
      imageData: null,
      height: 0,
      search: '',
      modal_search: false,
      overlay:false,
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    }
  },

  methods: {
    click1() {
      let fileUpload = document.getElementById('fileUpload')

      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    async previewImage(event, index, noteId) {
      this.uploadValue = 0;
      this.newImg = null;
      this.imageData = event.target.files[0]
      await this.onUpload(index, noteId)
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
            storageRef.snapshot.ref.getDownloadURL().then(async (url) => {
              this.newImg = url;
              this.height = 400 + 'px';
              this.imgName = this.imageData.name
              // this.addNewNotes()
              let newImg = this.newImg
              let imgName = this.imageData.name
              await this.$store.dispatch("notes/deleteImg", noteId)
              await this.$store.dispatch("notes/updateImg", {newImg, imgName, noteId})
            })
          })
    },
    async updateTitle(e, index, noteId) {
      const updateTitle = e.target.value;

      await this.$store.commit('notes/updateTitle', {updateTitle, index})
      // // При написании большого кол-ва буковок. Путем обновления интервала
      await this.updateItem(index, noteId)
    },
    async updateDescription(e, index, noteId) {
      const updateDescription = e.target.value;

      // console.log(this.notes[index].title)
      await this.$store.commit('notes/updateDescription', {updateDescription, index})
      // При написании большого кол-ва буковок. Путем обновления интервала
      await this.updateItem(index, noteId)
    },
    async updateItem(index, noteId) {
      await this.$store.dispatch('notes/updateNote', {index, noteId})
    },
    async deleteNote(noteId) {
      for (const el of this.notes){
        if(el.id === noteId && el.imgName){
          await this.$store.dispatch("notes/deleteImg", noteId)
        }
      }
      await this.$store.dispatch("notes/deleteNote", noteId)
    }
  },
  computed: {},

}

</script>

<style scoped>
.wrapper{
  width: 100%;
  display: flex;
}
.note{
  height:auto;
  min-height:30px;

  margin-left: 20px;
}
</style>