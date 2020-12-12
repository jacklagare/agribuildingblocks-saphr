
<template>
    <div class="suppliers">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading>    
    <br/>
    <h1>Suppliers</h1>
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
    <br/><br/><br/><br/>
    <!-- Form for registering supplier to the blockchain --> 
    <div id ="registerAccountContainer">
    <h3>Register Account</h3>
    <br/>
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

    <h3>Register Meat Product</h3>
    <p>Please include <code><b>0x</b></code> in the address and key.</p>
    <v-form>
            <v-container>
                <v-text-field
                v-model="businessAddress"
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
    <br/><br/>
    <div id="registerMeatProductResult">
        <br/><br/>
    <br/><br/>
        <p>Please take note of the information below. This will not be saved by the application.</p>
        <br/>
        <p><b>Status:</b>{{registerMeatProductStatus}}</p>
        <p><b>Batch ID:</b> <code>{{batchId}}</code></p>
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

            let data = {
                name: businessName,
                businessAddress: businessAddress
            }
            this.isLoading = true;
            let response = await axios.post('http://localhost:8085/v1/suppliers',data, {
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

        async registerMeatProduct() {
            
            let supplierAddress = this.supplierAddress;
            let supplierKey = this.supplierKey;

            let data = {
                supplierAddress: supplierAddress,
                supplierKey: supplierKey
            }
            this.isLoading = true;
            let response = await axios.post('http://localhost:8085/v1/meat-products',data, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            
            let self = this;

            if(response.status == 200){
                self.registerMeatProductStatus = 'Success';
                self.batchId = response.data.batchId; 
                console.log('done')
            }
            else{
                self.registerMeatProductStatus = 'Failed';
                console.log('failed')
            } 
            this.isLoading = false;
        },
    }
}
</script>