module.exports = {

    post: async (req,res,next) => {
        const Accounts = require('web3-eth-accounts');
        const accounts = new Accounts(process.env.WEB3_PROVIDER_URL);
        const admin = require('firebase-admin');
        const bcrypt = require('bcrypt');

        const serviceAccount = require('../../../config/serviceAccountKey.json');

        try{
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            const db = admin.firestore()
            
            let newAccount = accounts.create();
            let address = newAccount.address;
            
            let privateKey = newAccount.privateKey.substring(2);
            
            let encodedPrivateKey = bcrypt.hashSync(privateKey,10);

            const docRef = db.collection('blockchain-capstone').doc('supplier-accounts');

            await docRef.set({
                address: address,
                private_key: encodedPrivateKey,
            });

            res.send(200,{
                message: 'Eth account successfully created for supplier.',
                address: address
            });
            return
        }
        catch(err){
            res.send(500,{
                message: 'Account creation failed',
                error: err
            });
            return
        }
    },
}