module.exports = {

    post: async (req,res,next) => {
        const Accounts = require('web3-eth-accounts');
        const accounts = new Accounts(process.env.WEB3_PROVIDER_URL);
        const admin = require('firebase-admin');

        const serviceAccount = require('../../../config/serviceAccountKey.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore()
           
        
        let newAccount = accounts.create();
        let address = newAccount.address;
        //let privateKey = newAccount.
        console.log(newAccount);
        const docRef = db.collection('blockchain-capstone').doc('supplier-accounts');

        await docRef.set({
            address: 'Ada',
            private_key: 'Lovelace',
        });

        res.send(200,'Hello');
        return
    },
}