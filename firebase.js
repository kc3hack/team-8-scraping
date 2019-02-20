const admin = require('firebase-admin');
const env = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert({
        type: env.type,
        project_id: env.project_id,
        project_key_id: env.project_key_id,
        private_key: env.private_key.replace(/\\n/g, '\n'),
        client_email: env.client_email,
        client_id: env.client_id,
        auth_url: env.auth_url,
        token_url: env.token_url,
        auth_provider_x509_cert_url: env.auth_provider_x509_cert_url,
        client_x509_cert_url: env.client_x509_cert_url
    })
});

const db = admin.firestore();

let docRef = db.collection('users').add({
    first: 'tukki',
    last: 'fafa',
    born: 1998
});
console.log("done")
