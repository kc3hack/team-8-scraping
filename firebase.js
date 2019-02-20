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

let tmp = [{
    "first": 'tatsudai',
    "last": 'inagaki',
    "born": 1999,
},
{
    "first": 'kazuma',
    "last": 'fujioka',
    "born": 1999,
}]
// let tmp =
// {
//     "first": 'kazuma',
//     "last": 'fujioka',
//     "born": 1999,
// }
console.log(tmp)
for (tm of tmp) {
    let addDoc = db.collection('users').add(tm).then(ref => {
        console.log('Added document with ID: ', ref.id);
    });
    console.log(addDoc)
}

// let docRef = db.collection('users').add(tmp);
// console.log("done")

// let allCities = db.collection("users").get()
// // console.log(allCities)
// db.collection("users").add({
//     hit: [db.collection("pages").doc("KqCbx4md19j4zOD7bhlN"),
//     db.collection("pages").doc("n5TUs0i5NXXGNcjqYlB4")]
// });
    // .then(snapshot => {
    //     snapshot.forEach(doc => {
    //         console.log(doc.id, '=>', doc.data());
    //     });
    // })
    // .catch(err => {
    //     console.log('Error getting documents', err);
    // });