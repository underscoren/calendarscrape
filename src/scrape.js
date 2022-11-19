const ics = require("ics");

/**
 * Scrapes the website, returns array of event
 * objects to pass to 
 * @returns calendar file contents
 */
const scrapeEvents = async () => {
const wait = (millis) => new Promise((res) => setTimeout(res, millis));

// unreadable regex
const anyWeek = /Week \d+/;
const findWeek = /Week (\d+)/;
const aTime = /\(\s*\d+\s*:\s*\d+\s*-\s*\d+\s*:\s*\d+\s*\)/; // finds (HH:MM-HH:MM) with any whitespace (the rest also accept any whitespace)
const findTimes = /\(\s*((\d+\s*:\s*\d+)\s*-\s*(\d+\s*:\s*\d+))\s*\)/; // finds (HH:MM-HH:MM) and returns the two HH:MM 
const findTime = /(\d+\s*):(\s*\d+)/; // finds HH:MM and returns HH and MM
const findTitle = /\(\s*\d+\s*:\s*\d+\s*-\s*\d+\s*:\s*\d+\s*\)\s*(?:-\s*)?\s*(.+)$|(.+)\(\s*\d+\s*:\s*\d+\s*-\s*\d+\s*:\s*\d+\s*\)$/; // finds and returns a title, either "(HH:MM-HH:MM) title" or "title (HH:MM-HH:MM)"
const week1 = new Date("2022-10-31");

// click each tile to force content to load
const weekTiles = [...document.querySelectorAll("li.tile")]
    .filter(
        element => element.querySelector("h3")
            ?.innerText
            ?.match(anyWeek)
    );

for (const tile of weekTiles) {
    tile.click();
    await wait(250); // give it a little while to load
}

await wait(1000); // pretty sure everything will have loaded by now

console.log("Loaded all week sections (probably)");

const weekSections = [...document.querySelectorAll("li.section.main")]
    .filter(
        (element) => element
            .querySelector(".hidden.sectionname")
            ?.innerText
            ?.match(anyWeek)
    );

const getLink = element => element.querySelector(".activitytitle");

const meetings = [];

console.log(weekSections);

// find all the activity links for each week
for(const section of weekSections) {
    const week = section.querySelector(".hidden.sectionname")?.innerText;
    
    console.log(week);

    const meetingLinks = [...section.querySelectorAll("li.activity")]
    .filter(
        element => getLink(element)
            ?.innerText
            .match(aTime)
    );
    
    // iterate through siblings up the tree until selector matches or no more siblings exist
    const getPrevSibling = (element, selector) => {
        let sibling = element.previousElementSibling;
        while(sibling) {
            if(sibling.matches(selector))
                return sibling;
            sibling = sibling.previousElementSibling;
        }
    };
    
    // map link elements (url + time) to day of week
    const links = meetingLinks
        .map(
            e => ({
                link: getLink(e),
                day: getPrevSibling(e, ".modtype_label")
                    .querySelector("strong")
                    ?.innerText
            })
        );
    
    // construct list of meetings from link and week/day/time data
    for (const {link, day} of links) {
        const [_, __, start, end] = link.innerText.match(findTimes);
        const [___, weekNum] = week.match(findWeek);
        
        // construct an map between day and weekday number (starting from 0)
        const dayNumMap = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            .reduce((arr,day,i) => {
                arr[day] = i; 
                return arr;
            }, {});

        const weekOffset = (parseInt(weekNum) - 1) * 7 + dayNumMap[day];
        const linkDate = new Date(week1);
        linkDate.setUTCDate(week1.getUTCDate() + weekOffset);

        const titleRegexResults = link.innerText.match(findTitle);
        const title = titleRegexResults[1] ?? titleRegexResults[2] ?? "ERROR"; // i hope i never see this error, but i know deep down i will

        meetings.push({
            date: linkDate,
            title,
            url: link.parentElement.getAttribute("href"),
            start,
            end
        });
    }
}

// sort meetings by date (ascending)
meetings.sort((a,b) => a.date.getTime() - b.date.getTime());
console.log(meetings);

let events = [];

const formatDate = date => [date.getUTCFullYear(), date.getUTCMonth()+1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()];

// create calendar events for each meeting
for(const meeting of meetings) {
    const startDate = new Date(meeting.date);
    const [_, startHH, startMM] = meeting.start.match(findTime);
    startDate.setUTCHours(parseInt(startHH), parseInt(startMM));
    
    const endDate = new Date(meeting.date);
    const [__, endHH, endMM] = meeting.end.match(findTime);
    endDate.setUTCHours(parseInt(endHH), parseInt(endMM));
    
    events.push({
        start: formatDate(startDate),
        startInputType: "utc",
        startOutputType: "utc",
        end: formatDate(endDate),
        endInputType: "utc",
        endOutputType: "utc",
        title: meeting.title,
        description: `<a href="${meeting.url}"> ${meeting.url} </a>`,
        htmlContent: `<a href="${meeting.url}"> ${meeting.url} </a>`,
        alarms: [{
            action: "display",
            description: "Reminder",
            trigger: {
                minutes: 10,
                before: true
            }
        }],
        created: formatDate(startDate),
        lastModified: formatDate(new Date()) 
    });
}

console.log(events);

return events;
}

/**
 * Returns a string with ics file data from scraped events
 * @param events scraped events 
 * @returns { Promise<string> } file contents
 */
const createCalendar = events => new Promise((resolve, reject) => {
    ics.createEvents(events, (err, data) => {
        if(err)
            reject(err);
        else
            resolve(data);
    });
});

module.exports = {
    scrapeEvents,
    createCalendar
}
