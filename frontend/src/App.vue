<template>
  <v-app>
    <v-app-bar
      app
    >
      <div class="d-flex align-center">
          <a href="/">
            <v-img
                src="../assets/saphr-logo.png"
                max-height="500"
                max-width="250"
                contain
            ></v-img>
          </a>
      </div>

      <v-spacer></v-spacer>
       <v-btn text href="/"><v-icon>mdi-home</v-icon>&nbsp;&nbsp;Home</v-btn>
       <v-btn text href="/suppliers"><v-icon>mdi-truck</v-icon>&nbsp;&nbsp;Suppliers</v-btn>
       <v-btn text href="/inspectors"><v-icon>mdi-magnify</v-icon>&nbsp;&nbsp;Inspectors</v-btn>
       <v-btn text href="/laboratories"><v-icon>mdi-microscope</v-icon>&nbsp;&nbsp;Laboratories</v-btn>
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
