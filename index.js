const fs = require("fs");
const puppeteer = require("puppeteer");

const start = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1080 });
    await page.setDefaultNavigationTimeout(0);
    const cookiesFile = await fs.readFileSync('session/cookies.txt', 'utf-8');
    const userAgentFile = await fs.readFileSync('session/user-agent.txt', 'utf-8');
    const cookiesList = await JSON.parse(cookiesFile);
    await page.setCookie.apply(page, cookiesList);
    await page.setUserAgent(userAgentFile);

    await page.goto("https://10fastfingers.com/typing-test/indonesian", {
        waitUntil: "domcontentloaded",
    });

    await page.waitForTimeout(1000*5)

    const paragraphElement = await page.$('div[id="words"]');
    const textEvaluate = await page.evaluate(el => el.textContent, paragraphElement);
    console.log(textEvaluate);

    await page.waitForSelector('input[id="inputfield"]');

    const textInput = await page.$('input[id="inputfield"]');
    textInput.type(textEvaluate);

    await page.waitForTimeout(1000*50)

    await page.waitForSelector('div[class="col-md-6"] > h2');
    const resultElement = await page.$$('div[class="col-md-6"] > h2');
    const resultEvaluate = await page.evaluate(el => el.textContent, resultElement);
    console.log(resultEvaluate[0]);

    // await browser.close();
    return true;
}

start();