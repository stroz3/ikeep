<template>
  <v-app>
    <router-view/>
  </v-app>

</template>
<script>
// import {validationMixin} from 'vuelidate'
import {required, maxLength, email} from 'vuelidate/lib/validators'

export default {
  name: 'Auth',

  data() {
    return {}
  },
  computed: {},

  methods: {},
}
</script>
<style scoped>
.hasError {
  color: red;
}

.block-row {
}

.hasError-bordered {
  border: 1px solid red;

}
</style>
