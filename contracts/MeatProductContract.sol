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
       bool sanitaryInspectionResultUploaded;
       bool labAnalysisResultUploaded;
       bool passedSanitaryInspection;
       bool passedLabAnalysis;
    }
    
    
    mapping (bytes32 => MeatProduct) meatProducts;
    
    constructor () {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }
   
    modifier onlySupplier{
        require(suppliers[msg.sender]);
        _;
    }

    modifier onlyInspector{
        require(inspectors[msg.sender]);
        _;
    }

    modifier onlyLaboratory{
        require(laboratories[msg.sender]);
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
    

    function registerMeatProduct(bytes32 batchId) onlySupplier public returns (bool){
        
        require(meatProducts[batchId].initialized == false, 'Meat product already registered.');
        
        // Initialize values and save to the mapping
        MeatProduct memory meatProduct;
        
        meatProduct.initialized = true;
        meatProduct.batchId = batchId;
        meatProduct.supplier = msg.sender;

        meatProducts[batchId] = meatProduct;
        
        emit MeatProductRegistered(msg.sender, batchId, true);

        return true;
    }
    
    function getSanitaryInspectionStatus(bytes32 batchId) public view returns (bool){        
        return meatProducts[batchId].passedSanitaryInspection;
    }

    function getLabAnalysisResultStatus(bytes32 batchId) public view returns (bool){
        return meatProducts[batchId].passedLabAnalysis;
    }
            
    
    // Events
    event UserRegistered(uint256 userType, address, bool isSupplier);
    event MeatProductRegistered(address supplier, bytes32 batchId, bool success); // when a new meat produt is registered
    
}