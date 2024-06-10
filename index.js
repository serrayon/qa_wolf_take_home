// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function saveHackerNewsArticles() {
  // Launch Chromium browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // Wait for the articles to load
    await page.waitForSelector('.athing');

    // Get all articles
    const articles = await page.$$eval('.athing', elements =>
      elements.map(element => {
        const titleElement = element.querySelector('.title a');
        return titleElement ? titleElement.textContent.trim() : null;
      }).filter(title => title !== null)
    );

    // Sort articles alphabetically
    articles.sort((a, b) => a.localeCompare(b));

    // Log the sorted articles
    console.log("Sorted Articles:");
    articles.forEach((title, index) => console.log(`${index + 1}. ${title}`));

    // Wait for a long timeout to keep the browser open until manually closed
    await page.waitForTimeout(1000 * 60 * 60 * 24); // 24 hours
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the browser
    // await browser.close();
  }
}

(async () => {
  await saveHackerNewsArticles();
})();
