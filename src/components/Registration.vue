<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12" style="margin: 0 auto; width: 80%;">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Registration form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                    prepend-icon="person"
                    name="name"
                    label="Name"
                    type="text"
                    aria-required="true"
                    v-model="form.name"
                ></v-text-field>
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
              <v-btn color="primary" to="/login">Already have account</v-btn>
              <v-btn
                  @click.native="handleRegister"
                  color="primary"
              >registration
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Registration",
  data: () => ({
    form: {
      email: '',
      name: '',
      password: ''
    },
  }),
  methods: {
    handleRegister() {
      this.$store.dispatch('auth/singUp', this.form)
          .then(async user => {
            await this.$store
                .dispatch('auth/createUserProfile',
                    {
                      uid: user.user.uid,
                      userProfile: {
                        name: this.form.name,
                        email: this.form.email,
                        user: user.user.uid
                      }
                    })
            this.$router.push('/')
          })
          .catch(errorMessage => {
            this.$toasted.error(errorMessage, {duration: 3000})
          })

    }
  }
}
</script>

<style scoped>

</style>