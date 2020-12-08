//SPDX-License-Identifier: UNLICENSED;

pragma solidity 0.7.0;

contract MeatProductContract {
    
    // Mapping of suppliers, inspectors, and laboratories
    mapping (address => bool) suppliers;
    mapping (address => bool) inspectors;
    mapping (address => bool) laboratories;
    
    // Data structure for storing information about a particular meat product
    struct MeatProduct { 
       string batchId;
       address supplier;
       string healthInspectionResults;
       string labAnalysisResults;
       bool passedHealthInspection;
       bool passedLabInspection;
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
        
        MeatProduct memory meatProduct;
        
        meatProduct.batchId = batchId;
        meatProduct.supplier = supplier;
        meatProduct.healthInspectionResults = '';
        meatProduct.labAnalysisResults = '';
        meatProduct.passedHealthInspection = false;
        meatProduct.passedLabInspection = false;
        
        meatProducts[batchId] = meatProduct;
        
        emit MeatProductRegistered(supplier, batchId);

        return true;
    }
    
    function getHealthInspectionStatus(string memory batchId) public view returns (bool){        
        return meatProducts[batchId].passedHealthInspection;
    }
    
    function getLabResultStatus(string memory batchId) public view returns (bool){
        return meatProducts[batchId].passedLabInspection;
    }
        
    function setHealthInspectionStatus(string memory batchId, bool value) public returns (bool){
        
        meatProducts[batchId].passedHealthInspection = value;
        
        emit HealthInspectionStatusChanged(batchId, value);
        
        return true;
        
    }

    function setLabResultStatus(string memory batchId, bool value) public returns (bool){
        meatProducts[batchId].passedLabInspection = value;

        return true;
    }
    
    
    // Events
    event HealthInspectionStatusChanged(string batchId, bool value); // when the health inspection status changes
    event LabAnalysisStatusChanged(string batchId, bool value); // when the lab analysis status changes
    event MeatProductRegistered(address supplier, string batchId); // when a new meat produt is registered
    
}