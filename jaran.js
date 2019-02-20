const puppeteer = require('puppeteer');
const fs = require('fs');

async function jaran_category(url_path) {
    const brower = await puppeteer.launch({ headless: false, slowMo: 500 })
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

const categoryList = {
    "お城": "https://www.jalan.net/kankou/pro_007/g2_35/?screenId=OUW3801",
    "神社, 寺": "https://www.jalan.net/kankou/pro_007/g1_20/?screenId=OUW3801",
    "その他": "https://www.jalan.net/kankou/pro_007/g2_43/?screenId=OUW3801"
}

Object.keys(categoryList).forEach(key => {
    jaran_category(categoryList[key])
})
