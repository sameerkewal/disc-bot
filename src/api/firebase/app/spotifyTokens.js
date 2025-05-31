const { firestore } = require('./initFb');
const {FieldPath} = require('@google-cloud/firestore');
const getConfig = require('../utils/buildConfig');
const dotenv = require('dotenv');
const path = require('path');
const {FieldValue} = require("@google-cloud/firestore/build/src");
const {getAllDocs} = require("./loadMediaFromFb");

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const config = getConfig();


async function setLyricsTokens(objectToUpload) {
    try {

        if(!validateLyricsObject(objectToUpload)) {
            throw new Error("Invalid object to upload");
        }

        const doc =  await firestore.collection('spotifyTokens').
            doc('lyricsTokens').update({...objectToUpload, timestamp: FieldValue.serverTimestamp()});

        console.log("updated doc");

    } catch (e) {
        console.log('Error updating tokens', e);
        throw e;
    }
}

async function getLyricsTokens() {
    try {
        const doc =  await firestore.collection('spotifyTokens').doc("lyricsTokens").get()
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


async function setUserAccessTokens(objectToUpload) {


    const docRef = await firestore.collection('spotifyTokens').doc(objectToUpload.userInfo.userId);
    const docSnap = await docRef.get()

    if(!docSnap.exists){

        await docRef.set({
            ...objectToUpload,
            timestamp: FieldValue.serverTimestamp()
        })
    }else{
        // prevent overwriting refresh tokens if no new one
        // This is because new refresh tokens aren't always provided when refreshing token
        // and in that case old refresh token should be used
        const existingRefreshToken = docSnap.data()?.tokenInfo.refresh_token;

        if(!objectToUpload.tokenInfo?.refresh_token && existingRefreshToken){
            objectToUpload.tokenInfo = {
                ...objectToUpload.tokenInfo
            ,   refresh_token: existingRefreshToken
            }
        }
        await docRef.update({
            ...objectToUpload,
            timestamp: FieldValue.serverTimestamp()
        });

    }
}

async function getAllUserAccessTokens() {
    try {
        const userAccessTokens = [];

        const tokensRef =  await firestore.collection('spotifyTokens');
        const tokensSnapshot = await tokensRef.where("__name__", "!=", "lyricsTokens")
            .get();

        tokensSnapshot.forEach(doc => {
            const data  = doc.data();
            userAccessTokens.push({
                userInfo: data.userInfo,
                tokenInfo: {
                    access_token: data.tokenInfo.access_token,
                    token_type: data.tokenInfo.token_type
                }
            });
        });

        return userAccessTokens

    } catch (e) {
        console.log('Error getting tokens', e);
        throw e;
    }
}


async function getRefreshToken(userId){

        const doc = await firestore.collection('spotifyTokens').doc(userId).get()
        if (doc.exists) {
            return doc.data().tokenInfo.refresh_token;
        } else {
            throw Error(`No tokens found for user ${userId}`);
        }

}


function validateLyricsObject(obj) {
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
    setLyricsTokens: setLyricsTokens,
    getLyricsTokens: getLyricsTokens,
    setUserAccessTokens: setUserAccessTokens,
    getAllUserAccessTokens : getAllUserAccessTokens,
    getRefreshToken : getRefreshToken
}







