const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to the Hacker News website
        await page.goto('https://news.ycombinator.com/');

        // Find the search input field and enter a search query
        await page.type('input[name="q"]', 'Playwright');

        // Press Enter to submit the search form
        await page.press('input[name="q"]', 'Enter');

        console.log('Submitting search query...');

        // Wait for the search results to load
        await page.waitForTimeout(3000);  // Give some time for the page to load

        // Take a screenshot after waiting for the search results
        await page.screenshot({ path: 'search_results.png' });
        console.log('Screenshot taken.');

        // Save the page's HTML to a file
        const pageContent = await page.content();
        fs.writeFileSync('page_content.html', pageContent);
        console.log('Page content saved.');

        // Check if the search results are present
        const resultsExist = await page.$('span:has(em)');
        if (!resultsExist) {
            throw new Error('No search results found.');
        }
        console.log('Search results loaded.');

        // Get the search results
        const searchResults = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('span:has(em)'));

            return items.map(item => {
                let title = item.innerHTML;
                const emTags = item.querySelectorAll('em');

                // Replace <em> tags with their inner text
                emTags.forEach(em => {
                    title = title.replace(`<em>${em.innerHTML}</em>`, em.innerHTML);
                });

                const urlElement = item.querySelector('a');
                const url = urlElement ? urlElement.getAttribute('href') : '';
                return { title, url };
            });
        });

        console.log('Search results:', searchResults); // Now we log the search results here

        // Verify that the search results contain relevant information related to the search query
        const query = 'Playwright';
        const matchingResults = searchResults.filter(result => {
            const titleText = result.title.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
            const regex = new RegExp(query, 'i'); // Case-insensitive search
            return regex.test(titleText);
        });

        if (matchingResults.length > 0) {
            console.log(`Search test passed! Found ${matchingResults.length} matching results for query "${query}".`);
            console.log('Matching results:');
            matchingResults.forEach(result => console.log(`Title: ${result.title}, URL: ${result.url}`));
        } else {
            console.log(`Search test failed! No matching results found for query "${query}".`);
        }
    } catch (error) {
        console.error('Search test failed:', error);
    } finally {
        await browser.close();
    }
})();
