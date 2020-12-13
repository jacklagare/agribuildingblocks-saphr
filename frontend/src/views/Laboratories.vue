<template>
  <div class="laboratories">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading>    
    <br/>  
    <h1><v-icon large>mdi-microscope</v-icon> Laboratories</h1>
    <br/>
    <div id ="registerAccountContainer">
    <h2>Register Account</h2>
    <v-container>
        <v-row no-gutters>
            <v-col md="6">
                <v-form>
            <v-container>
                <v-text-field
                v-model="laboratoryName"
                counter="25"
                label="Laboratory Name"
                >
                </v-text-field>

                <v-text-field
                    v-model="businessAddress"
                    counter="25"
                    label="Business Address"
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
            @click="registerLaboratory"
        >
        Submit
    </v-btn>
            </v-col>
            <v-col md="6">
                <v-card class="accountDetailsCard">
                    <v-card-text>
                    <div id="accountResult">
                        <br/>
                        <p id="accountNotice">Please take note of the information below. This will not be saved by the application.</p>
                        <br/>
                        <p id="accountAddress"><b>Address:</b> {{accountAddress}}</p>
                        <p id="accountKey"><b>Private Key:</b> {{accountKey}}</p>
                    </div>
                    </v-card-text>
                    <br/>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <br/>
    <h2>Record Laboratory Analysis Result</h2>
    <p>Please include <code><b>0x</b></code> in the address and key.</p>
    <v-container>
                <v-form>
                    <v-container>
                        <v-text-field
                        v-model="laboratoryAnalysisAddress"
                        counter="25"
                        label="Laboratory Address"
                        >
                        </v-text-field>

                        <v-text-field
                            v-model="laboratoryAnalysisKey"
                            counter="25"
                            label="Laboratory Private Key"
                            >
                        </v-text-field>

                        <v-text-field
                        v-model="laboratoryAnalysisBatchId"
                        counter="25"
                        label="Batch ID"
                        >
                        </v-text-field>
                        <v-radio-group
                            v-model="analysisInspectionResult"
                            row
                        >
                            <v-radio
                            label="Passed"
                            value="passed"
                            ></v-radio>
                            <v-radio
                            label="Failed"
                            value="failed"
                            ></v-radio>
                        </v-radio-group>

                    </v-container>
                </v-form>
                <v-btn
                    color="primary"
                    depressed
                    elevation="7"
                    outlined
                    text
                    @click="recordAnalysisStatus"
                >
                Submit
            </v-btn>
    </v-container>
    <br/>
    </div>
</div>
</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Vue from 'vue';
Vue.use(VueToast);

export default { 
    
    data() {
        return {
            isLoading: false,
            fullPage: true,
            accountAddress: "",
            accountKey: "",
            laboratoryName: "",
            businessAddress: "",
            laboratoryAnalysisAddress: "",
            laboratoryAnalysisKey: "",
            sanitaryInspectionBatchId: "",
            laboratoryKey: "",
            laboratoryAnalysisBatchId: "",
            analysisResultBatchId: "",
            analysisResult: "",
            uploadResultStatus: "",
        };
    },
    components: {
        Loading
    },

    computed: {},
    
    methods: {
        async registerLaboratory() {
            
            let laboratoryName = this.laboratoryName;
            let businessAddress = this.businessAddress;

            if(laboratoryName == '' || businessAddress == '' ){
                Vue.$toast.open({
                    message: 'Please provide the neccessary details.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }

            let data = {
                name: laboratoryName,
                businessAddress: businessAddress
            }

            this.isLoading = true;

            try{
                let response = await axios.post('http://localhost:8085/v1/laboratories',data, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                
                let self = this;

                if(response.status == 200){
                    self.accountAddress = response.data.address;
                    self.accountKey = response.data.privateKey;
                    Vue.$toast.open({
                        message: 'Account has been created successfully.',
                        type: 'success',
                        duration: 5000
                    });
                    this.isLoading = false;
                }
                else{
                    Vue.$toast.open({
                        message: 'Account creation failed.',
                        type: 'error',
                        duration: 5000
                    });
                    this.isLoading = false;
                } 
            }
            catch(err){
                Vue.$toast.open({
                    message: 'Account creation failed.',
                    type: 'error',
                    duration: 5000
                });
                this.isLoading = false;
            }
        },

        async recordAnalysisStatus() {
            
            let laboratoryAddress = this.laboratoryAnalysisAddress;
            let laboratoryKey = this.laboratoryAnalysisKey;
            let batchId = this.laboratoryAnalysisBatchId;
            let analysisInspectionResult = this.analysisInspectionResult == "passed" ?true:false;

            if(laboratoryAddress == '' || laboratoryKey == '' || batchId == ''){
                Vue.$toast.open({
                    message: 'Please provide the neccessary details.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }

            let data = {
                laboratoryAddress: laboratoryAddress,
                laboratoryKey: laboratoryKey,
                passed: analysisInspectionResult
            }

            this.isLoading = true;

            try{
                let response = await axios.post('http://localhost:8085/v1/meat-products/'+batchId+'/lab-analysis-results',data, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });

                if(response.status == 200){
                    Vue.$toast.open({
                        message: 'Laboratory analysis uploaded successfully.',
                        type: 'success',
                        duration: 5000
                    });
                    this.isLoading = false;
                }
                else{
                    Vue.$toast.open({
                        message: 'Laboratory analysis upload failed.',
                        type: 'error',
                        duration: 5000
                    });
                    this.isLoading = false;
                } 
            }
            catch(err){
                Vue.$toast.open({
                    message: 'Laboratory analysis upload failed.',
                    type: 'error',
                    duration: 5000
                });
                this.isLoading = false;
            }
        },
    }
}
</script>

<style scoped>
    .laboratories{
        text-align: center;
    }

    .accountDetailsCard{
        margin-left: 10%;
    }
</style>