
module.exports = {
    buildTransaction: async(account, privateKey,encodedABI) => {
        const Web3 = require('web3');

        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));
        const Tx = require('ethereumjs-tx');

        const txParams = {
            from: account,
            to: process.env.CONTRACT_ADDRESS,
            nonce: await web3.eth.getTransactionCount(account),
            value: 0,
            gasLimit: web3.utils.toHex(10000000),
            gasPrice: web3.utils.toHex(0),
            data: encodedABI,
        };

        // Initialize a new Transaction
        const tx = new Tx(txParams);

        // Sign the Transaction with sender's private key
        tx.sign(Buffer.from( // convert string to Buffer
            privateKey.substring(2), // remove 0x
            'hex',
        ));

        // Returns the rlp (Recursive Length Prefix) encoding of the transaction, https://eth.wiki/en/fundamentals/rlp
        const serializedTx = tx.serialize();

        // Convert buffer (array of 8-bit unsigned integers) to string
        const rawTx = '0x' + serializedTx.toString('hex'); // 0x + 247970ea6031894B5Da5B32c6E7BdDca223f6735
        
        // Send signed transaction to the chain
        const transaction = await web3.eth.sendSignedTransaction(rawTx);
        
        return transaction.transactionHash;
    }
}