module.exports = {

    get: async (req, res, next) => {
        let subscriberNumber = '+63' + req.params.subscriber_number.trim();
        let subscriberAccessToken = req.params.access_token.trim();

        const db = firebase.firestore();

        let docRef = await db.collection("subscribers").select("subscriber_number").where("subscriber_number", "==",  subscriberNumber);

        let uniqueSubscriber = true;

        await docRef.get().then(function(doc) {
            if (!doc.empty) {
                uniqueSubscriber = false;
            } 
        }).catch(function(error) {
            console.log(err)
            res.send(500,{
                message: 'Failed to add subscriber.',
                error: error
            });
            return
        });

        let doc = await db.collection('subscribers').add({
            subscriber_number: subscriberNumber,
            subscriber_access_token: subscriberAccessToken,
        });

        res.send(200, {
            message: 'Subscriber added.',
        });
        return;
    },

    post: async (req,res,next) => {
        const request = require('request');
        const { v4: uuidv4 } = require('uuid');
        const db = firebase.firestore();

        let clientCorrelator = uuidv4();

        let smsObject = req.body;
        
        let batchId = '';
        let customerMobile = '';
        let subscriberAccessToken = '';
        let message = '';
        let getLabAnalysisResults = '';
        let sanitaryInspectionResultMessage = '';
        let labAnalysisResultMessage = '';
        
        try{
        
            let messagesList = smsObject.inboundSMSMessageList.inboundSMSMessage;

            messagesList.forEach( async message => {
                
                batchId = message.message.split(' ')[1];
                customerMobile = message.senderAddress.split(':')[1];

                if(batchId == ''){
                    message = 'Invalid request. Format must be ABB <space> <BatchID>.';
                }
                else{
                    const Web3 = require('web3');
                    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));
                    
                    const smartContract = new web3.eth.Contract(contractABI,process.env.CONTRACT_ADDRESS);
                    const keccak = require('keccak')
                    
                    // Retrieve sanitary inspection results
                    try{
                        let batchIdHash = '0x' + keccak('keccak256').update(batchId).digest('hex');
            
                        let status = await smartContract
                            .methods
                            .getLabAnalysisResultStatus(batchIdHash)
                            .call({from: process.env.CONTRACT_ADDRESS})
                        
                        let statusMsg = status ? 'PASSED' : 'FAILED';
                        sanitaryInspectionResultMessage = 'Sanitary Inspection => ' + statusMsg;
                    }
                    catch (err){
                        sanitaryInspectionResultMessage = 'Sanitary Inspection => Failed to retrieve data.';
                    }

                    // Retrieve laboratory analysis results
                    try{
                        let batchIdHash = '0x' + keccak('keccak256').update(batchId).digest('hex');
            
                        let status = await smartContract
                            .methods
                            .getSanitaryInspectionStatus(batchIdHash)
                            .call({from: process.env.CONTRACT_ADDRESS})
                        
                        let statusMsg = status ? 'PASSED' : 'FAILED';
                        labAnalysisResultMessage = 'Laboratory Analysis => ' + statusMsg;
            
                    }
                    catch (err){
                        labAnalysisResultMessage = 'Laboratory Analysis => Failed to retrieve data.';
                    }

                    // Retrieve subscriber information for sending SMS
                    let docRef = await db.collection("subscribers").select("subscriber_access_token").where("subscriber_number", "==",  customerMobile);

                    await docRef.get().then(function(doc) {
                    
                        if (!doc.empty) {
                            subscriberAccessToken = doc.docs[0]._fieldsProto.subscriber_access_token.stringValue;
                        }
                    }).catch(function(error) {
                        res.send(401,{
                            message: 'You have provided invalid credentials',
                            error: 'Invalid credentials.'
                        });
                        return;
                    });
                }

                message = `Batch ID =>  ${batchId} || ${sanitaryInspectionResultMessage} ||  ${labAnalysisResultMessage}`; 
                
                // Send response to consumer
                
                let shortCode = process.env.SMS_API_SHORTCODE;
                
                let options = { method: 'POST',
                    url: 'https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/' + shortCode + '/requests',
                    qs: { 'access_token': subscriberAccessToken },
                    headers: 
                    { 'Content-Type': 'application/json' },
                    body: 
                    { 'outboundSMSMessageRequest': 
                        { 'clientCorrelator': clientCorrelator,
                            'senderAddress': shortCode,
                            'outboundSMSTextMessage': { 'message': message },
                            'address': customerMobile } },
                    json: true 
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                });
                

            });
        }
        catch(err){
            console.log(err);
            res.send(200);
            return;
        }

        res.send(200);
        return;
    }
}