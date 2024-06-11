// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1

const { chromium } = require("playwright");

async function saveHackerNewsArticles() {
    // launch browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // go to Hacker News
        console.log("Navigating to Hacker News");
        await page.goto("https://news.ycombinator.com/newest");

        // Wait for the articles to load
        console.log("Waiting for articles to load");
        await page.waitForSelector('tr.athing', { timeout: 30000 });

        // Extract the titles and timestamps of the first 100 articles
        console.log("Extracting article data...");
        const articles = await page.$$eval('tr.athing', elements => {
            return elements.slice(0, 100).map(element => {
                const titleElement = element.querySelector('.titleline a');
                const subtextElement = element.nextElementSibling;
                const timeElement = subtextElement ? subtextElement.querySelector('span.age a') : null;

                const title = titleElement ? titleElement.textContent : 'No title';
                const timestamp = timeElement ? timeElement.textContent : 'No timestamp';

                return { title, timestamp };
            });
        });

        // Print articles data
        articles.forEach(article => {
            console.log(`Title: ${article.title}`);
            console.log(`Timestamp: ${article.timestamp}`);
            console.log('--------------------------');
        });

        // Validate that the articles are sorted from newest to oldest
        console.log("Validating article order...");
        let isSorted = true;
        let prevTimestamp = articles[0].timestamp;

        for (let i = 1; i < articles.length; i++) {
            const currentTimestamp = articles[i].timestamp;
            if (new Date(currentTimestamp) > new Date(prevTimestamp)) {
                isSorted = false;
                break;
            }
            prevTimestamp = currentTimestamp;
        }

        if (isSorted) {
            console.log("Articles are sorted from newest to oldest.");
        } else {
            console.log("Articles are not sorted from newest to oldest.");
        }
    } catch (error) {
        console.error(error);
    } finally {
        //await browser.close();
    }
}

saveHackerNewsArticles();
