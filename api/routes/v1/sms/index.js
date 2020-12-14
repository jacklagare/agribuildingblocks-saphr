module.exports = {

    get: async (req, res, next) => {
        let subscriberNumber = req.params.subscriber_number.trim();
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

        let doc = await db.collection('subscibers').add({
            subscriber_number: subscriberNumber,
            subscriber_access_token: subscriberAccessToken,
        });

        res.send(200, {
            message: 'Subscriber added.',
        });

    },

    post: async (req,res,next) => {
        const request = require('request');
        
        // Receive SMS from consumer
        //let smsObject = req;
        
        let jsonObject = {
            "inboundSMSMessageList":{
                "inboundSMSMessage":[
                   {
                      "dateTime":"Fri Nov 22 2013 12:12:13 GMT+0000 (UTC)",
                      "destinationAddress":"tel:21581234",
                      "messageId":null,
                      "message":"ABB 12345",
                      "resourceURL":null,
                      "senderAddress":"tel:+639171234567"
                   }
                 ],
                 "numberOfMessagesInThisBatch":1,
                 "resourceURL":null,
                 "totalNumberOfPendingMessages":null
             }
          };
        
        let messagesList = jsonObject.inboundSMSMessageList.inboundSMSMessage;

        let batchId = '';
        let customerMobile = '';
        let message = '';
        let getLabAnalysisResults = '';
        let sanitaryInspectionResultMessage = '';
        let labAnalysisResultMessage = '';

        messagesList.forEach( message => {
            
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
        
                    let status = smartContract
                        .methods
                        .getLabAnalysisResultStatus(batchIdHash)
                        .call({from: process.env.CONTRACT_ADDRESS})
                    
                        sanitaryInspectionResultMessage = 'Sanitary Inspection => ' + status ? 'PASSED' : 'FAILED';
                }
                catch (err){
                    sanitaryInspectionResultMessage = 'Sanitary Inspection => Failed to retrieve data.';
                }

                // Retrieve laboratory analysis results
                try{
                    let batchId = req.params.id;
                    let batchIdHash = '0x' + keccak('keccak256').update(batchId).digest('hex');
        
                    let status = smartContract
                        .methods
                        .getSanitaryInspectionStatus(batchIdHash)
                        .call({from: process.env.CONTRACT_ADDRESS})
                    
                    labAnalysisResultMessage = 'Laboratory Analysis => ' + status ? 'PASSED' : 'FAILED';
        
                }
                catch (err){
                    labAnalysisResultMessage = 'Laboratory Analysis => Failed to retrieve data.';
                }

            }

            message = `Batch ID =>  ${batchId} || ${sanitaryInspectionResultMessage} ||  ${labAnalysisResultMessage}`; 
            
            // Send response to consumer
            
            let shortCode = process.env.SMS_API_SHORTCODE;
            let accessToken = process.env.SMS_API_ACCESS_TOKEN;
            let clientCorrelator = '264801';
            
            let options = { method: 'POST',
                url: 'https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/' + shortcode + '/requests',
                qs: { 'access_token': accessToken },
                headers: 
                { 'Content-Type': 'application/json' },
                body: 
                { 'outboundSMSMessageRequest': 
                    { 'clientCorrelator': clientCorrelator,
                        'senderAddress': shortCode,
                        'outboundSMSTextMessage': { 'message': message },
                        'address': address } },
                json: true 
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
            });
            

        });

        res.send(200);
        return;
    }
}