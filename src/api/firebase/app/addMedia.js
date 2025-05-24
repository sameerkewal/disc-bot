const { Firestore } = require('@google-cloud/firestore');
const getConfig = require('../utils/buildConfig');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const config = getConfig();
const firestore = new Firestore({ projectId: config.project_id, credentials: config });

async function uploadMedia(objectToUpload) {
    try {
        return await firestore.collection('gifs').add(objectToUpload)
    } catch (e) {
        console.log('Error uploading media', e);
        throw e;
    }
}

module.exports = {
    uploadMedia
};

