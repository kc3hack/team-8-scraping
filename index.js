const puppeteer = require('puppeteer');
const admin = require('firebase-admin');
const env = require("./serviceAccountKey.json");
const urls = require("./urls.json");

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


// じゃらんのカテゴリーページから要素を取得
async function jaranCategory(url_path) {
    const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], slowMo: 1000 })
    const page = await brower.newPage()
    await page.goto(url_path)

    const scrapingData = await page.evaluate(() => {
        const dataList = [];
        const nodeList = document.querySelectorAll("p.item-name a");
        const imgList = document.querySelectorAll(".item-mainImg img");
        for (let i = 0, l = nodeList.length; i < l; i++) {
            placeCard = { "title": nodeList[i].innerText, "url": "https:" + nodeList[i].getAttribute("href") }
            let img_path = imgList[i].getAttribute("src")
            if (~img_path.indexOf("png") || ~img_path.indexOf("PNG") || ~img_path.indexOf("jpg") || ~img_path.indexOf("jpeg") || ~img_path.indexOf("JPG")) {
                placeCard["img"] = "https:" + img_path
            }
            dataList.push(placeCard)
        }
        return dataList;
    });

    await brower.close()
    return scrapingData
};


(async () => {
    for (key in urls) {
        let categoryData = await jaranCategory(urls[key]);
        let docList = []
        for (data of categoryData) {
            docList.push(await db.collection('finalTmpPages').add(data).then(ref => {
                return db.collection("finalTmpPages").doc(ref.id);
            }))
        }
        db.collection("finalTmpPaths").add({ "path": key, "hits": docList })
        console.log(key + "  done!")
    }
})();

