<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <!--
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      -->
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome!
        </h1>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
    <v-btn
            color="primary"
            depressed
            elevation="7"
            outlined
            text
            href="/suppliers"
        >
        Suppliers
    </v-btn>
    <br/><br/>
        <v-btn
            color="primary"
            depressed
            elevation="7"
            outlined
            text
            href=/inspectors
        >
        Sanitary Inspectors
    </v-btn>

       <br/><br/>
        <v-btn
            color="primary"
            depressed
            elevation="7"
            outlined
            text
            href="/laboratories"
        >
        Laboratories
    </v-btn>
    <br/><br/>
        <v-btn
            color="primary"
            depressed
            elevation="7"
            outlined
            text
            href="/generate-qr-code"
        >
        Generate QR Code
    </v-btn>    
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      
    }),
  }
</script>
