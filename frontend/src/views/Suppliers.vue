<template>
    <div class="suppliers">
        <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :is-full-page="fullPage">
        </loading>    
        <br/>
        <h1><v-icon large>mdi-truck</v-icon> Suppliers</h1>
        <br/>
        
        <!-- Form for registering supplier to the blockchain --> 
        <h2>Register Account</h2>
        <v-container>
            <v-row no-gutters>
                <v-col md="6">
                    <v-form>
                            <v-container>
                                <v-text-field
                                v-model="businessName"
                                counter="25"
                                label="Business Name"
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
                        @click="registerSupplier"
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
        <h2>Register Meat Product</h2> 
        <p>Please include <code><b>0x</b></code> in the address and key.</p>
        <br/>
        <v-container>
    <v-row no-gutters>
        <v-col md="6">
            <v-form>
                    <v-container>
                        <v-text-field
                        v-model="supplierAddress"
                        counter="25"
                        label="Supplier Address"
                        >
                        </v-text-field>

                        <v-text-field
                            v-model="supplierKey"
                            counter="25"
                            label="Supplier Private Key"
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
                @click="registerMeatProduct"
            >
            Submit
            </v-btn>
        </v-col>
        <v-col md="6">
            <v-card class="accountDetailsCard">
                <v-card-text>
                    <div id="registerMeatProductResult">
                        <br/>
                        <p id="accountNotice">Please take note of the information below. This will not be saved by the application.</p>
                        <br/>
                        <p><b>Status:</b>{{registerMeatProductStatus}}</p>
                        <p><b>Batch ID:</b>{{batchId}}</p>
                    </div>
                </v-card-text>
                <br/>
            </v-card>

            <br/><br/><br/><br/>
        </v-col>
    </v-row> 
    </v-container>
    <br/><br/>
        
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
            businessName: "",
            businessAddress: "",
            supplierAddress: "",
            supplierKey: "",
            batchId: "",
            registerMeatProductStatus: "",
        };
    },
    components: {
        Loading
    },

    computed: {},
    
    methods: {
        async registerSupplier() {
            
            let businessName = this.businessName;
            let businessAddress = this.businessAddress;

            if(businessName == '' || businessAddress == ''){

                Vue.$toast.open({
                    message: 'Please provide the neccessary details.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }

            let data = {
                name: businessName,
                businessAddress: businessAddress
            }
            this.isLoading = true;
            let response;

            try{
                response = await axios.post('http://localhost:8085/v1/suppliers',data, {
                    timeout: 15000,
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });

                this.accountAddress = response.data.address;
                this.accountKey = response.data.privateKey;

                Vue.$toast.open({
                    message: 'Account has been created successfully.',
                    type: 'success',
                    duration: 5000
                });
                this.isLoading = false;
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

        async registerMeatProduct() {
            
            let supplierAddress = this.supplierAddress;
            let supplierKey = this.supplierKey;

            if(supplierAddress == '' || supplierKey == ''){

                Vue.$toast.open({
                    message: 'Please provide the neccessary details.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }


            let data = {
                supplierAddress: supplierAddress,
                supplierKey: supplierKey
            }
            this.isLoading = true;

            try{
                let response = await axios.post('http://localhost:8085/v1/meat-products',data, {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                
                let self = this;

                if(response.status == 200){
                    self.registerMeatProductStatus = 'Success';
                    self.batchId = response.data.batchId; 
                    Vue.$toast.open({
                        message: 'Meat product has been registered successfully.',
                        type: 'success',
                        duration: 5000
                    });
                    this.isLoading = false;
                }
                else{
                    self.registerMeatProductStatus = 'Failed';
                    Vue.$toast.open({
                        message: 'Meat product registration failed.',
                        type: 'error',
                        duration: 5000
                    });
                    this.isLoading = false;
                } 
                
            }
            catch(err){
                Vue.$toast.open({
                    message: 'Meat product registration failed.',
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
    .suppliers{
        text-align: center;
    }

    .accountDetailsCard{
        margin-left: 10%;
    }

    .meatProductDetailsCard{
        margin-left: 10%;
    }
</style>