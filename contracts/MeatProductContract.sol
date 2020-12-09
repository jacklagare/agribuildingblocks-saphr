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
       bool passedHealthInspection;
       bool passedLabAnalysis;
    }
    
    // Data structure for storing information about a supplier
    struct Supplier {
        string name;
        string businessAddress;
    }

    mapping (string => MeatProduct) meatProducts;
    
    constructor () {

    }
    
    function registerMeatProduct(string memory batchId, address supplier) public returns (bool){
        
        // Ensure that an existing meat product cannot be overwritten
        if(meatProducts[batchId].initialized){
            emit MeatProductRegistered(supplier, batchId, false);
            return false;
        }
        
        // Initialize values and save to the mapping
        MeatProduct memory meatProduct;
        
        meatProduct.initialized = true;
        meatProduct.batchId = batchId;
        meatProduct.supplier = supplier;
        meatProduct.sanitaryInspectionResult = '';
        meatProduct.labAnalysisResult = '';
        meatProduct.passedHealthInspection = false;
        meatProduct.passedLabAnalysis = false;
        
        meatProducts[batchId] = meatProduct;
        
        emit MeatProductRegistered(supplier, batchId, true);

        return true;
    }
    
    function getHealthInspectionStatus(string memory batchId) public view returns (bool){        
        return meatProducts[batchId].passedHealthInspection;
    }
    
    function getLabResultStatus(string memory batchId) public view returns (bool){
        return meatProducts[batchId].passedLabAnalysis;
    }
        
    function setHealthInspectionStatus(string memory batchId, bool value) public returns (bool){
        
        meatProducts[batchId].passedHealthInspection = value;
        
        emit HealthInspectionStatusChanged(batchId, value, true);
        
        return true;
        
    }

    function setLabResultStatus(string memory batchId, bool value) public returns (bool){
        
        meatProducts[batchId].passedLabAnalysis= value;

        emit LabAnalysisStatusChanged(batchId, value, true);

        return true;
    }
    
    function setSanitaryInspectionResult(string memory batchId, string memory result) public returns (bool){

        if(meatProducts[batchId].sanitaryInspectionResultUploaded){
            emit SanitaryInspectionResultUploaded(batchId, result, false);
            return false;
        }

        meatProducts[batchId].sanitaryInspectionResult = result;
        meatProducts[batchId].sanitaryInspectionResultUploaded = true;

        emit SanitaryInspectionResultUploaded(batchId, result, true);

        return true;
    }
    
    function setLabAnalysisResult(string memory batchId, string memory result) public returns (bool){

        meatProducts[batchId].labAnalysisResult = result;

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