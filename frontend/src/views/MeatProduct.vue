<template>
    <v-layout>
    <v-container>
    <div class="container">
        <h1><v-icon large>mdi-food-steak</v-icon> Meat Product </h1>
        <br/>
        <v-card
            class="mx-auto"
            max-width="344"
        >
            <v-card-text>
                <p class="display-1 text--primary">Batch ID</p>
                <p>{{batchId}}</p>
                <p class="display-1 text--primary">Inspection Result</p>
                <p><v-icon large :color="iconColorInspection">{{iconValueInspection}}</v-icon> {{inspectionResult}}</p>
                <p class="display-1 text--primary">Analysis Result</p>
                <p><v-icon large :color="iconColorLab">{{iconValueLab}}</v-icon> {{labAnalysisResult}}</p>
            </v-card-text>
        </v-card>

        
    </div>
    </v-container>
    </v-layout>
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

<style scoped>
    .container{
        text-align: center;
        margin-top: -10%;
    }
</style>