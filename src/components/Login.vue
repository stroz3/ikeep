<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12" style="margin: 0 auto; width: 80%;">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                    prepend-icon="person"
                    name="email"
                    label="Email"
                    type="text"
                    aria-required="true"
                    v-model="form.email"
                ></v-text-field>
                <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    aria-required="true"
                    v-model="form.password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" to="/registration">create account</v-btn>
              <v-btn color="primary" @click="handleLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    form: {
      email: '',
      password: ''
    },
  }),
  methods: {
    handleLogin() {
      this.$store.dispatch('auth/singIn', this.form).then(_ => {
        this.$router.push('/')
      }).catch(e => {
        this.$toasted.error(e, {duration: 3000})
      })
    }
  }
}
</script>

<style scoped>

</style>