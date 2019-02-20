const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const brower = await puppeteer.launch({ headless: false })
    const page = await brower.newPage()
    // await page.goto("https://r.gnavi.co.jp/31h79rhm0000/")
    await page.goto("https://r.gnavi.co.jp/eki/0005419/noodle/rs/?fwp=%E5%8D%97%E8%8D%89%E6%B4%A5&fw=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3&red=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3&redf=1&resp=1")

    const scrapingData = await page.evaluate(() => {
        const dataList = [];
        const nodeList = document.querySelectorAll(".result-cassette__box-title");
        // nodeList.forEach(_node => {
        //     dataList.push(_node.innerText);
        //     dataList.push(_node.getAttribute("href"))
        // })
        const imgList = document.querySelectorAll("a.result-cassette__photo img");

        imgList.forEach(_node => {
            dataList.push(_node.getAttribute("src"))
        })
        return dataList;
    });
    console.log(scrapingData)
    // fs.writeFile('result.txt', JSON.stringify(scrapingData), (err) => {
    //     if (err) throw err
    //     console.log('done')
    // });

    await brower.close()
})()
