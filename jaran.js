const puppeteer = require('puppeteer');
const fs = require('fs');

async function jaran_category(url_path) {
    const brower = await puppeteer.launch({ headless: false })
    const page = await brower.newPage()
    await page.goto(url_path)

    const scrapingData = await page.evaluate(() => {
        const dataList = [];
        const nodeList = document.querySelectorAll("p.item-name a");
        const imgList = document.querySelectorAll(".item-mainImg img");
        for (let i = 0, l = nodeList.length; i < l; i++) {
            listInList = [nodeList[i].innerText, "https:" + nodeList[i].getAttribute("href")]
            let img_path = imgList[i].getAttribute("src")
            if (~img_path.indexOf("png") || ~img_path.indexOf("jpg") || ~img_path.indexOf("JPG")) {
                listInList.push("https:" + img_path)
            }
            dataList.push(listInList)
        }
        // nodeList.forEach(_node => {
        //     dataList.push(_node.innerText);
        //     dataList.push(_node.getAttribute("href"))
        // })
        // imgList.forEach(_node => {
        //     let img_path = _node.getAttribute("src")
        //     if (~img_path.indexOf("png") || ~img_path.indexOf("jpg")) {
        //         dataList.push("https:" + _node.getAttribute("src"))
        //     }
        // })
        return dataList;
    });
    // console.log(scrapingData)
    fs.writeFile('result.txt', JSON.stringify(scrapingData, null, "\t"), (err) => {
        if (err) throw err
        console.log('done')
    });

    await brower.close()
};

jaran_category("https://www.jalan.net/kankou/pro_007/g2_35/?screenId=OUW380")