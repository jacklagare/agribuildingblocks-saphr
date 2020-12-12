<template>
  <div class="laboratories">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading>    
    <br/>  
    <h1>Inspectors</h1>
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
    <div id ="registerAccountContainer">
    <h3>Register Account</h3>
    <br/>
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
    <br/><br/>
    <div id="accountResult">
        <br/><br/>
    <br/><br/>
        <p id="accountNotice">Please take note of the information below. This will not be saved by the application.</p>
        <br/>
        <p id="accountAddress"><b>Address:</b> {{accountAddress}}</p>
        <p id="accountKey"><b>Private Key:</b> {{accountKey}}</p>
    </div>
    </div>
    <br/><br/><br/><br/>

    <h3>Record Laboratory Analysis Result</h3>
    
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
                    v-model="laboratoryAnalysisResultFormInput"
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
    <br/><br/>
    <div id="recordLaboratoryStatusResult">
        <br/><br/>
    <br/><br/>
        {{uploadResultStatus}}
    </div>
    <br/><br/>
    <br/><br/>
</div>
</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

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
            laboratoryAnalysisResultFormInput: "",
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

            let data = {
                name: laboratoryName,
                businessAddress: businessAddress
            }
            this.isLoading = true;
            let response = await axios.post('http://localhost:8085/v1/laboratories',data, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            
            let self = this;

            if(response.status == 200){
                self.accountAddress = response.data.address;
                self.accountKey = response.data.privateKey;
                console.log('done');
            }
            else{
                console.log('failed')
            } 
            this.isLoading = false;
        },

        async recordAnalysisStatus() {
            
            let laboratoryAddress = this.laboratoryAnalysisAddress;
            let laboratoryKey = this.laboratoryAnalysisKey;
            let batchId = this.laboratoryAnalysisBatchId;
            let analysisInspectionResult = this.analysisInspectionResult == "passed" ?true:false;

            let data = {
                laboratoryAddress: laboratoryAddress,
                laboratoryKey: laboratoryKey,
                passed: analysisInspectionResult
            }

            this.isLoading = true;
            let response = await axios.post('http://localhost:8085/v1/meat-products/'+batchId+'/lab-analysis-results',data, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            
            let self = this;

            if(response.status == 200){
                self.uploadResultStatus = "Success"
                console.log('done')
            }
            else{
                self.uploadResultStatus = "Failed"
                console.log('failed')
            } 
            this.isLoading = false;
        },
    }
}
</script>