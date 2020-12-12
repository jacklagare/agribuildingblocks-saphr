<template>
    <div>
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
        </loading>    
        <br/><br/>
        <h1>Generate QR Code</h1>
        <br/>
        <v-btn
            color="primary"
            depressed
            elevation="7"
            icon
            outlined
            text
            href="/"
        >
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <br/><br/>
        <br/><br/>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
        <br/><br/>
        <v-form>
            <v-container>
                <v-text-field
                v-model="batchId"
                counter="25"
                label="Batch ID"
                >
                </v-text-field>
            </v-container>
        </v-form>
        <v-btn
            color="primary"
            depressed
            elevation="7"
            outlined
            text
            @click="generateQrCode"
        >
        Generate QR Code
    </v-btn>
    </div>
</template>
<script>

import QrcodeVue from 'qrcode.vue'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    data() {
        return {
            isLoading: false,
            fullPage: true,
            value: "",
            size: 300,
            batchId: "",
        }
    },

    methods: {
        generateQrCode(){
            this.isLoading = true;
            this.value = '';
            this.value = 'http://localhost:3000/check-meat-product?batchId='+this.batchId
            this.isLoading = false;
        }
    },

    components: {
        Loading,
        QrcodeVue,
    },
}
</script>