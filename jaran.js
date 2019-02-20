const puppeteer = require('puppeteer');
const fs = require('fs');
const admin = require('firebase-admin');
const env = require("./serviceAccountKey.json");
const paths = require("./paths.json");
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

const categoryList = {
    "スイーツ": "https://www.jalan.net/gourmet/pro_007/g1_3G014/?screenId=OUW3801",
    // "軽食": "https://www.jalan.net/gourmet/pro_007/g2_3g152/?screenId=OUW3801&rootCd=7743",
    // "粉もの,鉄板": "https://www.jalan.net/gourmet/pro_007/g2_3g150/?screenId=OUW3801",
    // "焼肉": "https://www.jalan.net/gourmet/pro_007/g2_3g080/?screenId=OUW3801&rootCd=7743",
    // "ハンバーグ,ステーキ": "https://www.jalan.net/gourmet/pro_007/g2_3g050/?screenId=OUW1701&rootCd=7743&influxKbn=0",
    // "しゃぶしゃぶ,すき焼き": "https://www.jalan.net/gourmet/pro_007/g2_3g043/?screenId=OUW3801&rootCd=7743",
    // "寿司": "https://www.jalan.net/gourmet/pro_007/g2_3g042/?screenId=OUW3801&rootCd=7743",
    // "魚-その他": "https://www.jalan.net/gourmet/pro_007/g2_3g012/?screenId=OUW3801&rootCd=7743",
    // "そば,うどん": "https://www.jalan.net/gourmet/pro_007/g2_3g044/?screenId=OUW3801",
    // "ラーメン": "https://www.jalan.net/gourmet/pro_007/g2_3g130/?screenId=OUW3801",
    // "和食": "https://www.jalan.net/gourmet/pro_007/g2_3g040/?screenId=OUW3801",
    // "中華": "https://www.jalan.net/gourmet/pro_007/g1_3G007/?screenId=OUW3801",
    // "インド": "https://www.jalan.net/gourmet/pro_007/g2_3g091/?screenId=OUW3801&rootCd=7743",
    // "タイ, ベトナム": "https://www.jalan.net/gourmet/pro_007/g2_3g090/?screenId=OUW3801&rootCd=7743",
    // "フレンチ": "https://www.jalan.net/gourmet/pro_007/g2_3g061/?screenId=OUW3801",
    // "イタリアン": "https://www.jalan.net/gourmet/pro_007/g2_3g060/?screenId=OUW3801",
    // "その他洋食": "https://www.jalan.net/gourmet/pro_007/g2_3g051/?screenId=OUW3801",
    // "その他": "https://www.jalan.net/gourmet/pro_007/g1_3G010/?screenId=OUW3801&rootCd=7743",
    // "お城": "https://www.jalan.net/kankou/pro_007/g2_35/?screenId=OUW3801",
    // "神社,寺": "https://www.jalan.net/kankou/pro_007/g1_20/?screenId=OUW3801",
    // "遺跡,史跡": "https://www.jalan.net/kankou/pro_007/g2_30/?screenId=OUW3801",
    // "歴史文化-その他": "https://www.jalan.net/kankou/pro_007/g2_43/?screenId=OUW3801",
    // "景観,絶景": "https://www.jalan.net/kankou/pro_007/g1_22/?screenId=OUW3801",
    // "展望台,施設": "https://www.jalan.net/kankou/pro_007/g2_36/?screenId=OUW3801",
    // "街並み": "https://www.jalan.net/kankou/pro_007/g2_54/?screenId=OUW38",
    // "建築物": "https://www.jalan.net/kankou/pro_007/g2_67/?screenId=OUW3801",
    // "名所-その他": "https://www.jalan.net/kankou/pro_007/g2_01/?screenId=OUW3801",
    // "お風呂,温泉": "https://www.jalan.net/kankou/pro_007/g1_18/?screenId=OUW3801",
    // "動植物園": "https://www.jalan.net/kankou/pro_007/g2_27/?screenId=OUW3801",
    // "水族館": "https://www.jalan.net/kankou/pro_007/g2_45/?screenId=OUW3801",
    // "博物館": "https://www.jalan.net/kankou/pro_007/g2_29/?screenId=OUW3801",
    // "美術館": "https://www.jalan.net/kankou/pro_007/g2_56/?screenId=OUW3801",
    // "登山": "https://www.jalan.net/kankou/pro_007/g2_M6/?screenId=OUW3801",
    // "キャンプ": "https://www.jalan.net/kankou/pro_007/g2_04/?screenId=OUW3801",
    // "スキー": "https://www.jalan.net/kankou/pro_007/g1_A3/?screenId=OUW3801",
    // "海,川": "https://www.jalan.net/kankou/pro_007/g1_A2/?screenId=OUW3801",
    // "施設": "https://www.jalan.net/kankou/pro_007/g1_04/page_8/?screenId=OUW1701&influxKbn=0",
    // "テーマパーク": "https://www.jalan.net/kankou/pro_007/g2_14/?screenId=OUW3801",
    // "体験": "https://www.jalan.net/kankou/pro_007/g1_06/?screenId=OUW3801",
    // "文芸": "https://www.jalan.net/kankou/pro_007/g2_d9/?screenId=OUW3801",
    // "ショッピング": "https://www.jalan.net/kankou/pro_007/g1_B1/?screenId=OUW3801"
}

const labels = {
    "food/sweets": "https://www.jalan.net/gourmet/pro_007/g1_3G014/?screenId=OUW3801",
    // "food/lightFood": "https://www.jalan.net/gourmet/pro_007/g2_3g152/?screenId=OUW3801&rootCd=7743",
    // "food/flour": "https://www.jalan.net/gourmet/pro_007/g2_3g150/?screenId=OUW3801",
    // "food/otherFood/meat/grilledMeat": "https://www.jalan.net/gourmet/pro_007/g2_3g080/?screenId=OUW3801&rootCd=7743",
    // "food/otherFood/meat/steak": "https://www.jalan.net/gourmet/pro_007/g2_3g050/?screenId=OUW1701&rootCd=7743&influxKbn=0",
    // "food/otherFood/meat/sukiyaki": "https://www.jalan.net/gourmet/pro_007/g2_3g043/?screenId=OUW3801&rootCd=7743",
    // "food/otherFood/fish/sushi": "https://www.jalan.net/gourmet/pro_007/g2_3g042/?screenId=OUW3801&rootCd=7743",
    // "food/otherFood/fish/seafood": "https://www.jalan.net/gourmet/pro_007/g2_3g012/?screenId=OUW3801&rootCd=7743",
    // "food/otherFood/noodles/udon": "https://www.jalan.net/gourmet/pro_007/g2_3g044/?screenId=OUW3801",
    // "food/otherFood/noodles/ramen": "https://www.jalan.net/gourmet/pro_007/g2_3g130/?screenId=OUW3801",
    // "food/otherFood/otherFood2/japaneseFood": "https://www.jalan.net/gourmet/pro_007/g2_3g040/?screenId=OUW3801",
    // "food/otherFood/otherFood2/asia/chineseFood": "https://www.jalan.net/gourmet/pro_007/g1_3G007/?screenId=OUW3801",
    // "food/otherFood/otherFood2/asia/IndianFood": "https://www.jalan.net/gourmet/pro_007/g2_3g091/?screenId=OUW3801&rootCd=7743",
    // "food/otherFood/otherFood2/asia/thaiFood": "https://www.jalan.net/gourmet/pro_007/g2_3g090/?screenId=OUW3801&rootCd=7743",
    // "food/otherFood/otherFood2/europe/french": "https://www.jalan.net/gourmet/pro_007/g2_3g061/?screenId=OUW3801",
    // "food/otherFood/otherFood2/europe/italian": "https://www.jalan.net/gourmet/pro_007/g2_3g060/?screenId=OUW3801",
    // "food/otherFood/otherFood2/europe/westernFood": "https://www.jalan.net/gourmet/pro_007/g2_3g051/?screenId=OUW3801",
    // "food/otherFood/otherFood2/otherFood3": "https://www.jalan.net/gourmet/pro_007/g1_3G010/?screenId=OUW3801&rootCd=7743",
    // "spot/tourism/castles": "https://www.jalan.net/kankou/pro_007/g2_35/?screenId=OUW3801",
    // "spot/tourism/shrine": "https://www.jalan.net/kankou/pro_007/g1_20/?screenId=OUW3801",
    // "spot/tourism/ruins": "https://www.jalan.net/kankou/pro_007/g2_30/?screenId=OUW3801",
    // "spot/tourism/otherHistory": "https://www.jalan.net/kankou/pro_007/g2_43/?screenId=OUW3801",
    // "spot/stroll/scene/superb": "https://www.jalan.net/kankou/pro_007/g1_22/?screenId=OUW3801",
    // "spot/stroll/scene/sigthSeeingTower": "https://www.jalan.net/kankou/pro_007/g2_36/?screenId=OUW3801",
    // "spot/stroll/sights/street": "https://www.jalan.net/kankou/pro_007/g2_54/?screenId=OUW38",
    // "spot/stroll/sights/building": "https://www.jalan.net/kankou/pro_007/g2_67/?screenId=OUW3801",
    // "spot/stroll/sights/otherSights": "https://www.jalan.net/kankou/pro_007/g2_01/?screenId=OUW3801",
    // "spot/stroll/hotSpring": "https://www.jalan.net/kankou/pro_007/g1_18/?screenId=OUW3801",
    // "spot/leisure/display/creature/zoo": "https://www.jalan.net/kankou/pro_007/g2_27/?screenId=OUW3801",
    // "spot/leisure/display/creature/aquarium": "https://www.jalan.net/kankou/pro_007/g2_45/?screenId=OUW3801",
    // "spot/leisure/display/museum": "https://www.jalan.net/kankou/pro_007/g2_29/?screenId=OUW3801",
    // "spot/leisure/display/artGallery": "https://www.jalan.net/kankou/pro_007/g2_56/?screenId=OUW3801",
    // "spot/leisure/outdoor/mountain/climbing": "https://www.jalan.net/kankou/pro_007/g2_M6/?screenId=OUW3801",
    // "spot/leisure/outdoor/mountain/camp": "https://www.jalan.net/kankou/pro_007/g2_04/?screenId=OUW3801",
    // "spot/leisure/outdoor/mountain/ski": "https://www.jalan.net/kankou/pro_007/g1_A3/?screenId=OUW3801",
    // "spot/leisure/outdoor/sea": "https://www.jalan.net/kankou/pro_007/g1_A2/?screenId=OUW3801",
    // "spot/leisure/outdoor/facility": "https://www.jalan.net/kankou/pro_007/g1_04/page_8/?screenId=OUW1701&influxKbn=0",
    // "spot/leisure/amusement/themePark": "https://www.jalan.net/kankou/pro_007/g2_14/?screenId=OUW3801",
    // "spot/leisure/amusement/experience": "https://www.jalan.net/kankou/pro_007/g1_06/?screenId=OUW3801",
    // "spot/leisure/amusement/literayArt": "https://www.jalan.net/kankou/pro_007/g2_d9/?screenId=OUW3801",
    // "spot/shopping": "https://www.jalan.net/kankou/pro_007/g1_B1/?screenId=OUW3801"
}

async function jaranCategory(url_path) {
    const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], slowMo: 300 })
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
    // fs.appendFile('result.txt', JSON.stringify(scrapingData, null, "\t"), "utf8", (err) => {
    //     if (err) throw err
    //     console.log('done')
    // });

    await brower.close()
    return scrapingData
};


(async () => {
    for (key in labels) {
        let categoryData = await jaranCategory(labels[key]);
        let docList = []
        for (data of categoryData) {
            docList.push(await db.collection('tmpPages').add(data).then(ref => {
                return ref.id
            }))
        }
        db.collection("tmpPaths").add({ "path": key, "hits": docList })
        console.log(key + "  done!")
    }
})();

