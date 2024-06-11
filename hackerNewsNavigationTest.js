//Navigation test verifies that the link takes you to the correct page
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://news.ycombinator.com/newest');

    // Select the first link and get its text content
    const firstLink = await page.$('.athing .title a');
    const firstLinkText = await firstLink.textContent();
    const firstLinkHref = await firstLink.getAttribute('href');
    console.log(`First link text: ${firstLinkText}`);
    console.log(`First link href: ${firstLinkHref}`);

    // Ensure navigation is triggered and wait for it to complete
    await Promise.all([
        page.waitForNavigation({ timeout: 60000 }), // Adjust the timeout as needed
        firstLink.click()
    ]);

    // Verify the URL
    const url = await page.url();
    console.log(`Navigated to: ${url}`);
    console.assert(url.includes(firstLinkHref), 'Navigation failed or incorrect page loaded.');

    console.log('Test passed! Navigation successful.');

    await browser.close();
})();
