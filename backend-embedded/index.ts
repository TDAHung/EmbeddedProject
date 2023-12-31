
const mqtt = require('mqtt');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!firebasePrivateKey) {
    throw new Error('Firebase private key is not defined in the environment variables.');
}

const serviceAccount = require(firebasePrivateKey);

// Adafruit configuration
const FEED_NAME = 'button';

// Firestore Init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://embedded-67be3-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const db = getFirestore();

const client = mqtt.connect({
    host: 'io.adafruit.com',
    port: 1883,
    username: process.env.AIO_USERNAME,
    password: process.env.AIO_PASSWORD,
});


client.on('connect', () => {
    console.log('Connected to io.adafruit.com successfully');
    client.subscribe(`${process.env.AIO_USERNAME}/feeds/button`);
    client.subscribe(`${process.env.AIO_USERNAME}/feeds/moisturev1`);
    client.subscribe(`${process.env.AIO_USERNAME}/feeds/moisturev2`);
});

client.on('message', (topic: String, message: String) => {
    console.log(`received message ${topic}: ${message.toString()}`);

    const subscribeTopic = topic.split('/');

    const mqttData = message.toString();
    let collection = '';
    let moistureState = '';

    switch (subscribeTopic[subscribeTopic.length - 1]) {
        case 'button':
            collection = "state";
            break;
        case 'moisturev1':
            collection = "moisturev1";
            break;
        case 'moisturev2':
            collection = "moisturev2";
            break;

    }

    const docRef = db.collection(`${collection.toString()}`);

    if (collection == 'state') {
        docRef.doc('ZH3otdrT6DPONuT90cpH').set({
            value: mqttData,
            created_at: Date.now(),
        });
    } else {
        switch (collection) {
            case 'moisturev1':
                moistureState = 'moistureV1state';
                break;
            case 'moisturev2':
                moistureState = 'moistureV2state';
                break;
        }
        const docRef2 = db.collection(`${moistureState.toString()}`);
        docRef2.doc('Gcb9KWzfG1IHFIfEbflJ').set({
            value: mqttData,
            created_ad: Date.now(),
        });
        docRef.add({
            value: mqttData,
            created_at: Date.now(),
        });
    }
});

client.on('close', () => {
    console.log('Connect closed');
});
