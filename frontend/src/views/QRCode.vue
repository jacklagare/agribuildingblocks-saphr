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
                    <br/>
                    <p>To check information about the meat product, you may scan the QR code or 
                    click the link below:</p>
                    <v-btn color="primary" :href="generatedUrl" target="_blank"><v-icon>mdi-magnify</v-icon> Check</v-btn>
                    <br/><br/>
                    <p>Another option is to use SMS. Click below for the instructions.</p>
                    <v-dialog
                        v-model="dialog"
                        width="500"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-message-processing</v-icon> SMS
                        </v-btn>
                        </template>
                
                        <v-card>
                        <v-card-title class="headline grey lighten-2">
                            SMS Meat Product Inquiry
                        </v-card-title>
                            <v-card-text>
                                <br/>
                                <p><v-icon>mdi-dialpad</v-icon> Globe/TM: <code>21582903</code> / Other Networks: <code>225652903</code></p>
                                
                                <ol>
                                    <li>Register by sending <code>INFO</code> to any of the indicated numbers above.</li>
                                    <li>Reply with <code>YES</code>.</li>
                                    <li>Once registered, you may now use the SMS service. Send <b>ABB {space} {batchId}</b> to any of the indicated numbers above. For example, <code>ABB 2e039ebf-b6eb-44c7-bb52-e4d3b1c69721</code>.</li>
                                </ol>
                            </v-card-text>
                
                        <v-divider></v-divider>
                
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                            color="primary"
                            text
                            @click="dialog = false"
                            >
                            OK
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    
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
            dialog: false,
            value: "",
            size: 300,
            batchId: "",
            generatedUrl: "https://track.saphr.com/check-meat-product?batchId=xxxxxx",
        }
    },

    methods: {
        generateQrCode(){
            this.isLoading = true;
            this.value = '';
            this.value = 'http://localhost:3000/check-meat-product?batchId='+this.batchId
            this.generatedUrl = this.value;
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
        margin-top: -10%;
        text-align: center;
    }
</style>