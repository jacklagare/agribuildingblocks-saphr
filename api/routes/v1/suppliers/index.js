module.exports = {

    post: async (req,res,next) => {
        const Accounts = require('web3-eth-accounts');
        const accounts = new Accounts(process.env.WEB3_PROVIDER_URL);
        const Web3 = require('web3');
        const Tx = require('ethereumjs-tx');
        const bcrypt = require('bcrypt');
        const TransactionHelper = require('../../../helpers/TransactionHelper');

        try{
           
            // Connect to chain
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));
            const smartContract = new web3.eth.Contract(contractABI,process.env.ETH_ADDRESS);

            const db = firebase.firestore()
            
            let newAccount = accounts.create();
            let address = newAccount.address;
            
            let privateKey = newAccount.privateKey.substring(2);
            
            let encodedPrivateKey = bcrypt.hashSync(privateKey,10);

            // Check if address already exists
            /*const suppliersCollection = db.collection('suppliers');
            const addressQuery = await suppliersCollection.where('address', '==', address).get();
            
            if(addressQuery == null){
                console.log('Not found');
            }
            */

            let registerSupplierEncodedABI = smartContract
                .methods
                .registerUser(address,1)
                .encodeABI();

            let transactionHash = await TransactionHelper.buildTransaction(
                registerSupplierEncodedABI
            )    

            let doc = await db.collection('suppliers').add({
                name: req.body.name,
                businessAddress: req.body.businessAddress,
                address: address,
                private_key: encodedPrivateKey
            });

            res.send(200,{
                message: 'Eth account successfully created for supplier.',
                address: address
            });
            return
        }
        catch(err){
            console.log(err)
            res.send(500,{
                message: 'Account creation failed',
                error: err
            });
            return
        }
    },
}