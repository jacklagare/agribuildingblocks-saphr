<template>
<v-layout>
<v-container>
  <div class="home">
       <br/>
      <h1>Welcome!</h1>
      <p>This is a blockchain-based application developed by <b>AgriBuildingBlocks</b> that provides 
          meat suppliers, inspectors, laboratories, and consumers an easy way 
          to provide and retrieve information whether a particular meat product has 
          sanitary inspection and other health standards...</p>
    <br/>
    <h2>Process</h2>
    <p>The timeline below summarizes what features and processes this application supports.</p>
    <v-timeline>
      <v-timeline-item>Supplier creates an account</v-timeline-item>
      <v-timeline-item class="text-right">
        Supplier registers meat product
      </v-timeline-item>
      <v-timeline-item>Sanitary inspector creates an account</v-timeline-item>
      <v-timeline-item class="text-right">Sanitary inspector inputs results of inspection</v-timeline-item>
      <v-timeline-item>Laboratory creates an account</v-timeline-item>
      <v-timeline-item class="text-right">
        Laboratory inputs results of analysis
      </v-timeline-item>
      <v-timeline-item>Consumer scans QR code to see information previously added</v-timeline-item>
    </v-timeline> 
  </div>
</v-container>
</v-layout>
</template>

<script>

export default {
  name: 'Home',
}
</script>

<style scoped>
    .home{
        margin-top: -10%;
    }
</style>