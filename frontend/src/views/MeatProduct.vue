<template>
    <div>
        <br/><br/><br/><br/>
        <p>{{errorMessage}}</p>
        
        <h2>Batch ID: {{batchId}}</h2>
        <h2>Inspection Result: <v-icon large color="red darken-2">{{iconValueInspection}}</v-icon> {{inspectionResult}}</h2>
        <h2>Lab Analysis Result: <v-icon large :color="iconColorLab">{{iconValueLab}}</v-icon> {{labAnalysisResult}}</h2>
        
    </div>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            errorMessage: "",
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
            let batchIdParam = this.$route.query.batchId.trim();
            
            let self = this;

            if(batchIdParam == "" || batchIdParam == undefined){
                self.errorMessage = "Invalid or undefined Batch ID. Please check your URL.";
            }
            else{
                self.batchId = batchIdParam;

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