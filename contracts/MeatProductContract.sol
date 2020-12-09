//SPDX-License-Identifier: UNLICENSED;

pragma solidity 0.7.0;

contract MeatProductContract {
    
    // Mapping of suppliers, inspectors, and laboratories
    mapping (address => bool) suppliers;
    mapping (address => bool) inspectors;
    mapping (address => bool) laboratories;
    
    // Data structure for storing information about a particular meat product
    struct MeatProduct { 
       bool initialized;
       string batchId;
       address supplier;
       string sanitaryInspectionResult;
       bool sanitaryInspectionResultUploaded;
       string labAnalysisResult;
       bool labAnalysisResultUploaded;
       bool passedSanitaryInspection;
       bool passedLabAnalysis;
    }
    
    //mapping (bytes32 => MeatProduct) meatProducts;
    mapping (string => MeatProduct) meatProducts;
    
    constructor () {

    }
    
    function registerMeatProduct(string memory batchId, address supplier) public returns (bool){
        
        require(meatProducts[batchId].initialized == false, 'Meat product already registered.');
        
        // Initialize values and save to the mapping
        MeatProduct memory meatProduct;
        
        meatProduct.initialized = true;
        meatProduct.batchId = batchId;
        meatProduct.supplier = supplier;
        meatProduct.sanitaryInspectionResult = '';
        meatProduct.labAnalysisResult = '';
        meatProduct.passedSanitaryInspection = false;
        meatProduct.passedLabAnalysis = false;
        
        meatProducts[batchId] = meatProduct;
        
        emit MeatProductRegistered(supplier, batchId, true);

        return true;
    }
    
    function getSanitaryInspectionResult(string memory batchId) public view returns (string memory){
        return meatProducts[batchId].sanitaryInspectionResult;
    }
    
    function getSanitaryInspectionStatus(string memory batchId) public view returns (bool){        
        return meatProducts[batchId].passedSanitaryInspection;
    }
    
    function getLabAnalysisResult(string memory batchId) public view returns (string memory){
        return meatProducts[batchId].labAnalysisResult;
    }
    
    function getLabAnalysisResultStatus(string memory batchId) public view returns (bool){
        return meatProducts[batchId].passedLabAnalysis;
    }
            
    function setSanitaryInspectionResult(string memory batchId, string memory result) public returns (bool){

        require(meatProducts[batchId].sanitaryInspectionResultUploaded == false, 'Sanitary inspection result already published.');

        meatProducts[batchId].sanitaryInspectionResult = result;
        meatProducts[batchId].sanitaryInspectionResultUploaded = true;

        emit SanitaryInspectionResultUploaded(batchId, result, true);

        return true;
    }
    
    function setLabAnalysisResult(string memory batchId, string memory result) public returns (bool){

        require(meatProducts[batchId].labAnalysisResultUploaded == false, 'Lab analysis result already published.');

        meatProducts[batchId].labAnalysisResult = result;
        meatProducts[batchId].labAnalysisResultUploaded = true;
        emit SanitaryInspectionResultUploaded(batchId, result, true);

        return true;
    }

    // Events
    event SanitaryInspectionResultUploaded(string batchId, string value, bool success); // when the sanitary inspection result is uploaded
    event LabAnalysisResultUploaded(string batchId, string value, bool success); // when the lab analysis result is uploaded
    event HealthInspectionStatusChanged(string batchId, bool value, bool success); // when the health inspection status changes
    event LabAnalysisStatusChanged(string batchId, bool value, bool success); // when the lab analysis status changes
    event MeatProductRegistered(address supplier, string batchId, bool success); // when a new meat produt is registered
    
}