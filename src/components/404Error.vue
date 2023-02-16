<template>
  <div>
    <v-app>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card height="400" color="transparent" flat>
              <div class="display-3 mt-5">Page not found.</div>
              <div class="grey--text lighten-5">
                The page you are trying to get to never existed in this reality,
                or has migrated to a parallel universe.
              </div>
              <div class="paragraph-text mt-2">
                <br/>

                <v-btn
                    elevation="2"
                    plain
                >
                  <router-link to="/" tag="button">
                    BACK
                  </router-link>
                </v-btn>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "404Error"
}
</script>

<style scoped>

</style>