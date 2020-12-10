//SPDX-License-Identifier: UNLICENSED;

pragma solidity 0.7.0;

contract MeatProductContract {
    
    address public owner;
    
    // Mapping of suppliers, inspectors, and laboratories
    mapping (address => bool) suppliers;
    mapping (address => bool) inspectors;
    mapping (address => bool) laboratories;
    
    // Data structure for storing information about a particular meat product
    struct MeatProduct { 
       bool initialized;
       bytes32 batchId;
       address supplier;
       bytes32 sanitaryInspectionResult;
       bool sanitaryInspectionResultUploaded;
       bytes32 labAnalysisResult;
       bool labAnalysisResultUploaded;
       bool passedSanitaryInspection;
       bool passedLabAnalysis;
    }
    
    //mapping (bytes32 => MeatProduct) meatProducts;
    mapping (bytes32 => MeatProduct) meatProducts;
    
    constructor () {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }
   
    modifier onlySupplier{
        require(suppliers[msg.sender] == true);
        _;
    }

    modifier onlyInspector{
        require(inspectors[msg.sender] == true);
        _;
    }

    modifier onlyLaboratory{
        require(laboratories[msg.sender] == true);
        _;
    }

    function registerUser(address user, uint256 userType) onlyOwner public returns (bool){
        
        // Register supplier
        if(userType == 1){
            suppliers[user] = true;
            emit UserRegistered(1, user, suppliers[user]);
        }
        
        // Register inspector
        else if(userType == 2){
            inspectors[user] = true;
        }

        // Register laboratory
        else if (userType == 3) {
            laboratories[user] = true;
        }
        else{
            return false;
        }
        
        return true;
    }
    
    function checkIfSupplier(address supplier) public view returns (bool){
        return suppliers[supplier];
    }
    
    function registerMeatProduct(bytes32 batchId, address supplier) onlySupplier public returns (bool){
        
        require(meatProducts[batchId].initialized == false, 'Meat product already registered.');
        
        // Initialize values and save to the mapping
        MeatProduct memory meatProduct;
        
        meatProduct.initialized = true;
        meatProduct.batchId = batchId;
        meatProduct.supplier = supplier;
        meatProduct.passedSanitaryInspection = false;
        meatProduct.passedLabAnalysis = false;
        
        meatProducts[batchId] = meatProduct;
        
        emit MeatProductRegistered(supplier, batchId, true);

        return true;
    }
    
    function getSanitaryInspectionResult(bytes32 batchId) public view returns (bytes32){
        return meatProducts[batchId].sanitaryInspectionResult;
    }
    
    function getSanitaryInspectionStatus(bytes32 batchId) public view returns (bool){        
        return meatProducts[batchId].passedSanitaryInspection;
    }
    
    function getLabAnalysisResult(bytes32 batchId) public view returns (bytes32){
        return meatProducts[batchId].labAnalysisResult;
    }
    
    function getLabAnalysisResultStatus(bytes32 batchId) public view returns (bool){
        return meatProducts[batchId].passedLabAnalysis;
    }
            
    function setSanitaryInspectionResult(bytes32 batchId, bytes32 result) onlyInspector public returns (bool){

        require(meatProducts[batchId].sanitaryInspectionResultUploaded == false, 'Sanitary inspection result already published.');

        meatProducts[batchId].sanitaryInspectionResult = result;
        meatProducts[batchId].sanitaryInspectionResultUploaded = true;

        emit SanitaryInspectionResultUploaded(batchId, result, true);

        return true;
    }
    
    function setLabAnalysisResult(bytes32 batchId, bytes32 result) onlyLaboratory public returns (bool){

        require(meatProducts[batchId].labAnalysisResultUploaded == false, 'Lab analysis result already published.');

        meatProducts[batchId].labAnalysisResult = result;
        meatProducts[batchId].labAnalysisResultUploaded = true;
        emit SanitaryInspectionResultUploaded(batchId, result, true);

        return true;
    }

    // Events
    event UserRegistered(uint256 userType, address, bool isSupplier);
    event SanitaryInspectionResultUploaded(bytes32 batchId, bytes32 value, bool success); // when the sanitary inspection result is uploaded
    event LabAnalysisResultUploaded(bytes32 batchId, bytes32 value, bool success); // when the lab analysis result is uploaded
    event MeatProductRegistered(address supplier, bytes32 batchId, bool success); // when a new meat produt is registered
    
}