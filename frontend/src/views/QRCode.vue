<template>
    <v-layout>
    <v-container>
    <div class="qrcode">
        <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
        </loading>  
        <br/>  
        <h1><v-icon large>mdi-qrcode-edit</v-icon> Generate QR Code</h1>
        <br/><br/>
        <v-container>
            <v-row no-gutters>
                <v-col md="6">
                    <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
                </v-col>
                <v-col md="6">
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
                </v-col>
            </v-row>
        </v-container>
    </div>
    </v-container>
    </v-layout>
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

<style scoped>
    .qrcode{
        margin-top: -20%;
        text-align: center;
    }
</style>