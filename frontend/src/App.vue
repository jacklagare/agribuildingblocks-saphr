<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
       <v-btn text href="/"><v-icon>mdi-home</v-icon>&nbsp;&nbsp;Home</v-btn>
       <v-btn text href="/suppliers"><v-icon>mdi-truck</v-icon>&nbsp;&nbsp;Suppliers</v-btn>
       <v-btn text href="/inspectors"><v-icon>mdi-magnify</v-icon>&nbsp;&nbsp;Inspectors</v-btn>
       <v-btn text href="/laboratories"><v-icon>mdi-miscroscope</v-icon>&nbsp;&nbsp;Laboratories</v-btn>
       <v-btn text href="/generate-qr-code"><v-icon>mdi-qrcode-edit</v-icon>&nbsp;&nbsp;QR Code</v-btn>
    </v-app-bar>

    <v-main>
      <Main/>
    </v-main>
    <router-view/>
  </v-app>
</template>

<script>
import Main from './components/Main';

export default {
  name: 'App',

  components: {
    Main,
  },

  data: () => ({
    //
  }),
};
</script>
