const puppeteer = require('puppeteer');
const fs = require('fs');

const categoryList = {
    "お城": "https://www.jalan.net/kankou/pro_007/g2_35/?screenId=OUW3801",
    "神社,寺": "https://www.jalan.net/kankou/pro_007/g1_20/?screenId=OUW3801",
    "遺跡,史跡": "https://www.jalan.net/kankou/pro_007/g2_30/?screenId=OUW3801",
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
    // "海,川": ",https://www.jalan.net/kankou/pro_007/g1_A2/?screenId=OUW3801",
    // "施設": "https://www.jalan.net/kankou/pro_007/g1_04/page_8/?screenId=OUW1701&influxKbn=0",
    // "テーマパーク": "https://www.jalan.net/kankou/pro_007/g2_14/?screenId=OUW3801",
    // "体験": "https://www.jalan.net/kankou/pro_007/g1_06/?screenId=OUW3801",
    // "文芸": "https://www.jalan.net/kankou/pro_007/g2_d9/?screenId=OUW3801",
    // "ショッピング": "https://www.jalan.net/kankou/pro_007/g1_B1/?screenId=OUW3801"
}


async function jaran_category(url_path) {
    const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox']/*headless: false, slowMo: 500*/ })
    const page = await brower.newPage()
    await page.goto(url_path)

    const scrapingData = await page.evaluate(() => {
        const dataList = [];
        const nodeList = document.querySelectorAll("p.item-name a");
        const imgList = document.querySelectorAll(".item-mainImg img");
        for (let i = 0, l = nodeList.length; i < l; i++) {
            placeCard = { "title": nodeList[i].innerText, "url": "https:" + nodeList[i].getAttribute("href") }
            let img_path = imgList[i].getAttribute("src")
            if (~img_path.indexOf("png") || ~img_path.indexOf("jpg") || ~img_path.indexOf("JPG")) {
                placeCard["img"] = "https:" + img_path
            }
            dataList.push(placeCard)
        }
        return dataList;
    });
    fs.appendFile('result.txt', JSON.stringify(scrapingData, null, "\t"), "utf8", (err) => {
        if (err) throw err
        console.log('done')
    });

    await brower.close()
};

// (async () => {
Object.keys(categoryList).forEach(key => {
    jaran_category(categoryList[key])
})
// })();
