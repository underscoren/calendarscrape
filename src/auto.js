const pupeteer = require("puppeteer");
const fs = require("fs");
const { scrapeEvents, createCalendar } = require("./scrape");

const { username, password } = require("./secrets.json");

if(!username || !password) {
    console.error("Credentials not supplied, exiting...");
    return;
}


const autoScrape = (async (outFilePath) => {
const browser = await pupeteer.launch({devtools: true});
const page = await browser.newPage();

await page.goto("https://skills-cityportal.com/course/view.php?id=36");

await page.type("#username", username);
await page.type("#password", password);
await page.click("#loginbtn");

await page.waitForNavigation();

if(page.url() == "https://skills-cityportal.com/login/index.php") {
    if(page.$(".loginerrors .alert")) {
        console.log("Error logging in, check credentials");
        //page.close();
        return;
    }

    // handle redirect
    await page.waitForNavigation();
}

// handle second redirect
if(page.url().startsWith("https://skills-cityportal.com/login/index.php?testsession="))
    await page.waitForNavigation();

// finally should be on the correct page
if(page.url() == "https://skills-cityportal.com/course/view.php?id=36") {
    console.log("logged in, performing scrape");

    // run scrape script in page context
    const events = await page.evaluate(scrapeEvents);
    
    page.close()
    .then(() => {
        browser.close();
    });

    console.log("Got scraped events:",events.length);

    const calendarFileData = await createCalendar(events);
    
    fs.writeFileSync(outFilePath, calendarFileData, {encoding: "utf-8"});
    console.log("Wrote file to",outFilePath);

} else {
    console.log("navigated to unknown page after login, exiting...");
    //page.close();
    return;
}

});

// debug
autoScrape();

/*
module.exports = {
    autoScrape
}
*/
