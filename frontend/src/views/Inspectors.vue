<template>
  <div class="inspectors">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading>    
    <br/>  
    <h1><v-icon large>mdi-magnify</v-icon> Inspectors</h1>
    <br/>
    <div id ="registerAccountContainer">
    <h2>Register Account</h2>
    <v-container>
            <v-row no-gutters>
                <v-col md="6">
                    <v-form>
                        <v-text-field
                        v-model="inspectorName"
                        counter="25"
                        label="Inspector Name"
                        >
                        </v-text-field>

                        <v-text-field
                            v-model="businessAddress"
                            counter="25"
                            label="Business Address"
                            >
                        </v-text-field>
                    </v-form>
                    <v-btn
                        color="primary"
                        depressed
                        elevation="7"
                        outlined
                        text
                        @click="registerInspector"
                    >
                    Submit
                    </v-btn>
                </v-col>
                <v-col md="6">
                    <div id="accountResult">
                        <br/>
                        <p id="accountNotice">Please take note of the information below. This will not be saved by the application.</p>
                        <br/>
                        <p id="accountAddress"><b>Address:</b> {{accountAddress}}</p>
                        <p id="accountKey"><b>Private Key:</b> {{accountKey}}</p>
                    </div>
                </v-col>
            </v-row>
    </v-container>
    <v-container>

    <h2>Record Inspection Result</h2>
    <p>Please include <code><b>0x</b></code> in the address and key.</p>
        
                <v-form>
                    <v-container>
                        <v-text-field
                        v-model="sanitaryInspectionInspectorAddress"
                        counter="25"
                        label="Inspector Address"
                        >
                        </v-text-field>

                        <v-text-field
                            v-model="sanitaryInspectionInspectorKey"
                            counter="25"
                            label="Inspector Private Key"
                            >
                        </v-text-field>

                        <v-text-field
                        v-model="sanitaryInspectionBatchId"
                        counter="25"
                        label="Batch ID"
                        >
                        </v-text-field>
                        <v-radio-group
                            v-model="sanitaryInspectionResultFormInput"
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
                    @click="recordInspectionStatus"
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
            inspectorName: "",
            businessAddress: "",
            sanitaryInspectionInspectorAddress: "",
            sanitaryInspectionInspectorKey: "",
            sanitaryInspectionBatchId: "",
            batchId: "",
            inspectionResultBatchId: "",
            inspectionResult: "",
            sanitaryInspectionResultFormInput: "",
        };
    },
    components: {
        Loading
    },

    computed: {},
    
    methods: {
        async registerInspector() {
            
            let inspectorName = this.inspectorName;
            let businessAddress = this.businessAddress;

            if(inspectorName == '' || businessAddress == ''){
                Vue.$toast.open({
                    message: 'Please provide the neccessary details.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }

            let data = {
                name: inspectorName,
                businessAddress: businessAddress
            }
            this.isLoading = true;

            try{
                let response = await axios.post('http://localhost:8085/v1/inspectors',data, {
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

        async recordInspectionStatus() {
            
            let inspectorAddress = this.sanitaryInspectionInspectorAddress;
            let inspectorKey = this.sanitaryInspectionInspectorKey;
            let batchId = this.sanitaryInspectionBatchId;
            let sanitaryInspectionResult = this.sanitaryInspectionResultFormInput == "passed" ?true:false;

            if(inspectorAddress == '' || inspectorKey == '' || batchId == ''){

                Vue.$toast.open({
                    message: 'Please provide the neccessary details.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }

            let data = {
                inspectorAddress: inspectorAddress,
                inspectorKey: inspectorKey,
                passed: sanitaryInspectionResult
            }

            this.isLoading = true;

            try{
                let response = await axios.post('http://localhost:8085/v1/meat-products/'+batchId+'/sanitary-inspection-results',data, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
   
                if(response.status == 200){
                        Vue.$toast.open({
                            message: 'Sanitary inspection uploaded successfully.',
                            type: 'success',
                            duration: 5000
                        });
                        this.isLoading = false;
                }
                else{
                    Vue.$toast.open({
                        message: 'Sanitary inspection upload failed.',
                        type: 'error',
                        duration: 5000
                    });
                    this.isLoading = false;
                } 
                
            }
            catch(err){
                Vue.$toast.open({
                    message: 'Sanitary inspection upload failed.',
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
    .inspectors{
        text-align: center;
    }
</style>