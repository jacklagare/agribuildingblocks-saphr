//SPDX-License-Identifier: UNLICENSED;

pragma solidity 0.7.0;

contract MeatProductContract {
    
    // Mapping of suppliers and inspectors
    mapping (address => bool) suppliers;
    mapping (address => bool) inspectors;
    
    // Mapping of batchId to array index
    mapping (string => uint256) meatProductIndices;
    
    // Data structure for storing information about a particular meat product
    struct MeatProduct { 
       string batchId;
       address supplier;
       string healthCertificateFileHash;
       string sanitaryCertificateFileHash;
       bool passedHealthInspection;
       bool passedLabInspection;
    }
    
    
    MeatProduct[] public meatProducts;
    
    constructor () {

    }
    
    function registerMeatProduct(string memory batchId, address supplier) public returns (bool){
        
        MeatProduct memory meatProduct;
        
        meatProduct.batchId = batchId;
        meatProduct.supplier = supplier;
        meatProduct.healthCertificateFileHash = '';
        meatProduct.sanitaryCertificateFileHash = '';
        meatProduct.passedHealthInspection = false;
        meatProduct.passedLabInspection = false;
        
        meatProducts.push(meatProduct);
        meatProductIndices[batchId] = meatProducts.length - 1;
        
        return true;
    }
    
    function getHealthInspectionStatus(string memory batchId) public view returns (bool){
        return meatProducts[meatProductIndices[batchId]].passedHealthInspection;
    }
    
    function getLabResultStatus(string memory batchId) public view returns (bool){
        return meatProducts[meatProductIndices[batchId]].passedLabInspection;
    }
    
    function uploadHealthCertificate(string memory batchId) public returns (bool){
        
    }
    
    function setHealthInspectionStatus(string memory batchId, bool value) public returns (bool){
        
        meatProducts[meatProductIndices[batchId]].passedHealthInspection = value;
        
        emit HealthInspectionStatusChanged(batchId, meatProductIndices[batchId], value);
        
        return true;
        
    }
    
    
    // Events
    event HealthInspectionStatusChanged(string batchId, uint256 index, bool value); // when the health inspection status changes
    event MeatProductRegistered(address supplier, string batchId, uint256 index); // when a new meat produt is registered
    
}