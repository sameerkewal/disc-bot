const { Firestore } = require('@google-cloud/firestore');
const getConfig = require('../utils/buildConfig');
const dotenv = require('dotenv');
const path = require('path');

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Get custom config (assumed to return { project_id, client_email, private_key, etc. })
const config = getConfig();

// Initialize Firestore once
const firestore = new Firestore({
    projectId: config.project_id,
    credentials: config,
});

console.log('Firestore initialized:');

module.exports = {firestore};
