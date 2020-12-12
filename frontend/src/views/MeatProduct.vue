<template>
    <div>
        <br/><br/><br/><br/>
        <p>{{errorMessage}}</p>

        <h2>Batch ID: {{batchId}}</h2>
        <h2>Inspection Result: {{inspectionResult}}</h2>
        <h2>Lab Analysis Result: {{labAnalysisResult}}</h2>
        
    </div>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            errorMessage: "",
            batchId: "",
            "inspectionResult": "",
            "labAnalysisResult": "",
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
                    }
                    else{
                        self.inspectionResult = "FAILED";
                    }

                    response = await axios.get(`http://localhost:8085/v1/meat-products/${batchIdParam}/lab-analysis-results`, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }});

                    if(response.status == 200){
                        if(response.data.result){
                            self.labAnalysisResult = "PASSED";
                        }
                        else{
                            self.labAnalysisResult = "FAILED";
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