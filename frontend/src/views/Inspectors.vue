<template>
  <div class="inspectors">
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
    <br/>
    <br/><br/><br/><br/>
    <div id ="registerAccountContainer">
    <h3>Register Account</h3>
    <br/>
    <v-form>
            <v-container>
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
            </v-container>
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

    <h3>Record Inspection Result</h3>
    
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
    <br/><br/>
    <div id="recordInspectionStatusResult">
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
            inspectorName: "",
            businessAddress: "",
            sanitaryInspectionInspectorAddress: "",
            sanitaryInspectionInspectorKey: "",
            sanitaryInspectionBatchId: "",
            batchId: "",
            inspectionResultBatchId: "",
            inspectionResult: "",
            sanitaryInspectionResultFormInput: "",
            uploadResultStatus: "",
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

            let data = {
                name: inspectorName,
                businessAddress: businessAddress
            }
            this.isLoading = true;
            let response = await axios.post('http://localhost:8085/v1/inspectors',data, {
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

        async recordInspectionStatus() {
            
            let inspectorAddress = this.sanitaryInspectionInspectorAddress;
            let inspectorKey = this.sanitaryInspectionInspectorKey;
            let batchId = this.sanitaryInspectionBatchId;
            let sanitaryInspectionResult = this.sanitaryInspectionResultFormInput == "passed" ?true:false;

            let data = {
                inspectorAddress: inspectorAddress,
                inspectorKey: inspectorKey,
                passed: sanitaryInspectionResult
            }

            this.isLoading = true;
            let response = await axios.post('http://localhost:8085/v1/meat-products/'+batchId+'/sanitary-inspection-results',data, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            
            let self = this;

            if(response.status == 200){
                self.uploadResultStatus = "Result successfully uploaded."
                console.log('done')
            }
            else{
                self.uploadResultStatus = "Result was not uploaded."
                console.log('failed')
            } 
            this.isLoading = false;
        },
    }
}
</script>