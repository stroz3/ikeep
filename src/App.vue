<template>
  <v-app id="app">
    <v-main>
      <v-card v-if="isAuthenficated">
        <v-app-bar>
          <v-app-bar-nav-icon  @click="mini = !mini"></v-app-bar-nav-icon>
          <v-row style="justify-content: right; margin-right: 10px">
            <v-menu
                bottom
                min-width="200px"
                rounded
                offset-y

            >
              <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    x-large
                    v-on="on"
                >
                  <v-avatar
                      color="brown"
                      size="48"
                  >
                    <span class="white--text text-h5">{{ user.email[0] }}</span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-list-item-content class="justify-center">
                  <div class="mx-auto text-center">
                    <v-avatar
                        color="brown"
                    >
                      <span class="white--text text-h5">{{ user.email[0] }}</span>
                    </v-avatar>
                    <p class="text-caption mt-1">
                      {{ user.email }}
                    </p>
                    <v-divider class="my-3"></v-divider>
                    <router-link to="/login" tag="button">
                      <v-btn
                          depressed
                          rounded
                          text
                          @click="handleLogOut"
                      >
                        Exit
                      </v-btn>
                    </router-link>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </v-row>
          <v-toolbar-title></v-toolbar-title>
        </v-app-bar>
      </v-card>

      <div class="flex">
        <v-navigation-drawer
            v-if="isAuthenficated"
            class="none-back"
            v-model="drawer"
            :mini-variant.sync="mini"
            style="height: 100vh"
        >


          <v-list dense nav>
            <v-list-item-group v-model="group" active-class="orange--background text--accent-4">
              <v-list-item
                  v-for="item in items"
                  :key="item.label"
                  :to="item.link"

              >

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
        <router-view  style="width: 100%"/>
      </div>
    </v-main>
  </v-app>
</template>

<script>

import {indexOf} from "core-js/internals/array-includes";
import label from "@/components/Label.vue";
export default {
  name: 'App',
  data: () => ({
    drawer: true,
    labels:{},
    group: null,
    mini: JSON.parse(localStorage.getItem('mini')),
  }),
  watch: {
    mini(newVal){
      localStorage.setItem('mini', newVal)
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAuthenficated() {
      return this.$store.getters['auth/isAuthenficated']
    },

    items(){
      return this.$store.getters["main/items"]
    },
  },
  methods: {
    push(link) {
      this.$router.push(link).catch(() => {
        this.disable = true
      })
    },
    async handleLogOut() {
      await this.$store.dispatch('auth/singOut').then(async _ => {
        await this.$store.commit("labels/clearItems")
        await this.$store.commit("notes/clearInfo")
        await this.$store.commit("main/clearLinks")
        await this.$store.commit("auth/setAuthUser", null)
        this.$router.push('/login').catch(() => {
        })
      }).catch(e => {
        this.$toasted.error(e, {duration: 3000})
      })
    },

  }
};
</script>
<style>
.orange--background {
  background: #41331c;
}

.input-append {
  border: 0;
  outline: 0;
  color: white;
  width: 100%;
}

html {
  overflow-y: hidden;
}

body {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

.flex {
  display: flex;
}

</style>