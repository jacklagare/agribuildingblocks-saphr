<template>
    <div>
        <br/><br/><br/><br/>
        <h1> Meat Product </h1>
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
        
        <p>Batch ID: {{batchId}}</p>
        <p>Inspection Result: <v-icon large color="red darken-2">{{iconValueInspection}}</v-icon> {{inspectionResult}}</p>
        <p>Lab Analysis Result: <v-icon large :color="iconColorLab">{{iconValueLab}}</v-icon> {{labAnalysisResult}}</p>
        
    </div>
</template>

<script>

import axios from 'axios';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Vue from 'vue';
Vue.use(VueToast);

export default {
    data() {
        return {
            batchId: "",
            inspectionResult: "",
            labAnalysisResult: "",
            iconValueInspection: "",
            iconColorInspection: "",
            iconValueLab: "",
            iconColorLab: "",
        }
    },

    created(){
        this.checkMeatProduct()
    },
    methods: {
        async checkMeatProduct(){
            let batchIdParam = this.$route.query.batchId;
            let self = this;

            if(batchIdParam == "" || batchIdParam == undefined){
                Vue.$toast.open({
                    message: 'Please provide a valid batch ID.',
                    type: 'error',
                    duration: 5000
                });
            }
            else{
                self.batchId = batchIdParam.trim();

                let response = await axios.get(`http://localhost:8085/v1/meat-products/${batchIdParam}/sanitary-inspection-results`, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });

                if(response.status == 200){
                    if(response.data.result){
                        self.inspectionResult = "PASSED";
                        self.iconValueInspection = "mdi-check-circle";
                        self.iconColorInspection = "green darken-2";
                    }
                    else{
                        self.inspectionResult = "FAILED";
                        self.iconValueInspection = "mdi-close-circle";
                        self.iconColorInspection = "red darken-2";
                    }

                    response = await axios.get(`http://localhost:8085/v1/meat-products/${batchIdParam}/lab-analysis-results`, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }});

                    if(response.status == 200){
                        if(response.data.result){
                            self.labAnalysisResult = "PASSED";
                            self.iconValueLab = "mdi-check-circle";
                            self.iconColorLab = "green darken-2";
                        }
                        else{
                            self.labAnalysisResult = "FAILED";
                            self.iconValueLab = "mdi-close-circle";
                            self.iconColorLab = "red darken-2";
                        }
                    }
                    else{
                        self.errorMessage = "Failed to retrieve information. Please check Batch ID";
                    } 
                }
                else{
                    self.errorMessage = "Failed to retrieve information. Please check Batch ID";
                } 
            }

        }
    },
    
}

</script>