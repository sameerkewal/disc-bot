const { firestore } = require('./initFb');
const getConfig = require('../utils/buildConfig');
const dotenv = require('dotenv');
const path = require('path');
const {FieldValue} = require("@google-cloud/firestore/build/src");
const {getAllDocs} = require("./loadMediaFromFb");

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const config = getConfig();


async function setTokens(objectToUpload) {
    try {

        if(!validateObject(objectToUpload)) {
            throw new Error("Invalid object to upload");
        }

        const doc =  await firestore.collection('spotifyTokens').
            doc('1').update({...objectToUpload, timestamp: FieldValue.serverTimestamp()});

        console.log("updated doc");

    } catch (e) {
        console.log('Error updating tokens', e);
        throw e;
    }
}

async function getTokens() {
    try {
        const doc =  await firestore.collection('spotifyTokens').doc("1").get()

        if (doc.exists) {
            return doc.data();
        } else {
            console.log('No such document!');
        }

    } catch (e) {
        console.log('Error getting tokens', e);
        throw e;
    }
}


function validateObject(obj) {
    // Check it has only these two keys
    const keys = Object.keys(obj);
    if (keys.length !== 2 || !keys.includes('bearerToken') || !keys.includes('clientToken')) {
        return false;
    }

    // Check both are strings and non-empty (optional)
    if (typeof obj.bearerToken !== 'string' || obj.bearerToken.trim() === '') {
        return false;
    }
    if (typeof obj.clientToken !== 'string' || obj.clientToken.trim() === '') {
        return false;
    }

    return true;
}

module.exports = {
    setTokens,
    getTokens,
}





// Document data: {
//     bearerToken: 'BQD7HDqL8XKj-gSGURgHLXC5jGwUCY26UBXOL1x6PDSiHplsAsrSKeJnoU0nBZR1ONNPIVP0n-mdQPps2My0Ca7vuccQ7El6txNNZd7CcBm8mTGSdY77CmTxbymBdtiramZabXSc1iAYQJ3EoaGQdD6S7uCbVNbc-jMzEZ07iC_k0M8cbn25ldzOq0IKfUbYae8c1NBF64PNzIV1pVeRtWvZspmBwJr5gKEZd6xyh2oS3W_9nv9vQ791PfYuqxyEXI3kxkr_ksP7UuaOlE3rUGBAM03gZ_4n5HEm3BdS1OB4eQqisr3CvpCBNMYeMrA7xVQF9SiOCMhI_JZqeQcJxBEng2hgOeSTj7TUmzIXjXQ',
//         clientToken: 'AACax/StGYu3xjNtyHfZnCOLsAxfd4d5YXQFofRVcTfH5cXuxGrtF04Ouc6RvbdAULv5yuoaaCOuvpYvUnKBmQSMHIVIe1c4p+RKhZBbcnnW0IWc78USIf3UXEUcMdkF5GmYL22wO0zTXNCFi5MueLbnEDTZWAZXfDmt6eMspQICZGyAJaINN2OfeVgtNoIZ0h2tG1IIEyNJ3/XO49RiKvGPunggVayo/nTebh5b0SrPZwHoErTBmScNjY8ODs2w4XSz4Z7Aq/wWBqFzbl4D5WJIx/1toS2JsRLv8GqvK5d1/X4AXg==\n'
// }
