const { firestore } = require('./initFb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });


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
