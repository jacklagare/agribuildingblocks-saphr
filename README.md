# AgriBuildingBlocks Meat Tracker
This is a blockchain-based application developed by <b>AgriBuildingBlocks</b> that provides meat suppliers, inspectors, laboratories, and consumers an easy way to provide and retrieve information whether a particular meat product has sanitary inspection and other health standards.

## Technologies

1. Solidity (smart contract)
2. Vue.js (frontend)
3. Node.js (backend)
4. Firebase Firestore (cloud storage)

## Prerequisites 
This guide does not provide detailed information on how to make sure that all dependencies of the application is present.

1. Smart contract must be deployed already to your platform of choice.
2. You have created a Firestore database with a service account included. Take note that you will be needing the `serviceAccountKey.json`.
3. `node` and `npm` must be installed in the system where you will be depoying the application.

## Running the Application

1. Create a `api/config/serviceAccountkey.json` file containing the details of your Firestore service account.
2. Create an `api/config/.env` file with the information indicated in `api/config/envtemplate` file.
3. Open `api/index.js` and update the variable `global.contractABI` in line 14 with your own ABI.
4. Go to the root of the `api` directory and execute `npm install`. Once this is completed, execute `node index.js` to start the API.
5. Open another console window and go to the `frontend` directory and execute `npm install`. Once completed, execute `npm run serve` to start the frontend application.
6. You may now access the application at `http://localhost:3000`.

**Note**: Default ports are used. For the API, the port is `8085`. For the frontend application, the port is `3000`.

## Team

1. Jack Elendil B. Lagare (smart contract, frontend, API)
2. Japhet Kariuki (business analysis, marketing)
