const { Firestore } = require('@google-cloud/firestore');
const getConfig = require('../utils/buildConfig');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const config = getConfig();
const firestore = new Firestore({ projectId: config.project_id, credentials: config });

async function getAllDocs() {
    const docs = [];
    const snapshot = await firestore.collection('gifs').get();

    snapshot.forEach(doc => {
        docs.push(doc.data());
    });
    return docs;
}

module.exports = {
    getAllDocs
};
