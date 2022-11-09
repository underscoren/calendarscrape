const ics = require("ics");

const scrapeAndDownload = async () => {
const wait = (millis) => new Promise((res) => setTimeout(res, millis));

const anyWeek = /Week \d+/;
const aTime = /\(\s*\d+\s*:\s*\d+\s*-\s*\d+\s*:\s*\d+\s*\)/;
const findTimes = /\(\s*((\d+\s*:\s*\d+)\s*-\s*(\d+\s*:\s*\d+))\s*\)/;
const findTime = /(\d+\s*):(\s*\d+)/;
const findTitle = /^\(\s*\d+\s*:\s*\d+\s*-\s*\d+\s*:\s*\d+\s*\)\s*(?:-\s*)?\s*(.+)$|(.+)\(\s*\d+\s*:\s*\d+\s*-\s*\d+\s*:\s*\d+\s*\)$/;
const week1 = new Date("2022-10-31");

// click each tile to force content to load
const weekTiles = $("li.tile")
    .filter(
        (i,element) => $(element)
            .find("h3")
            .text()
            .match(anyWeek)
    )

for (const tile of weekTiles) {
    $(tile).click();
    await wait(250); // give it a little while to load
}

await wait(500); // pretty sure everything will have loaded by now

console.log("Loaded all week sections (probably)");

const weekSections = $("li.section.main")
    .filter(
        (i,element) => $(element)
            .find(".hidden.sectionname")
            .text()
            .match(anyWeek)
    );

const getLink = element => $(element).find(".activitytitle");

const meetings = [];

// find all the activity links for each week
for(const section of weekSections) {
    const week = $(section).find(".hidden.sectionname").text()
    
    const meetingLinks = $(section)
    .find("li.activity")
    .filter(
        (i,element) => getLink(element).text().match(aTime)
    );

    // map link elements (url + time) to day of week by getting the first previous sibling element
    const links = [...meetingLinks]
        .map(
            e => ({
                link: getLink(e),
                day: $(e).prevAll(".modtype_label").first().find("strong").text()
            })
        );
    
    // construct list of meetings from link and date/time data
    for (const {link, day} of links) {
        const [_, __, start, end] = link.text().match(findTimes);
        const [___, weekNum] = week.match(/Week (\d+)/);
        
        const dayNumMap = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            .reduce((arr,day,i) => {
                arr[day] = i; 
                return arr;
            }, {});

        const weekOffset = (parseInt(weekNum) - 1) * 7 + dayNumMap[day];
        const linkDate = new Date(week1);
        linkDate.setUTCDate(week1.getUTCDate() + weekOffset);

        const titleRegexResults = link.text().match(findTitle);
        const title = titleRegexResults[1] ?? titleRegexResults[2] ?? "ERROR"; // i hope i never see this error, but i know deep down i will

        meetings.push({
            date: linkDate,
            title,
            url: link.parent().attr("href"),
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
        description: `<a href="${meeting.url}">${meeting.url}</a>`,
        alarms: [{
            action: "display",
            description: "Reminder",
            trigger: {
                minutes: 10,
                before: true 
            }
        }],
        created: formatDate(new Date())
    });
}

console.log(events);

// Function to download data to a file (straight from stackoverflow lol)
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// create ics file from events
ics.createEvents(events, (err, data) => {
    if(err) {
        console.error(err);
        return;
    }

    download(data, "calendar.ics", "text/plain;charset=utf-8"); 
});

}

// debug
//scrapeAndDownload();

// inject button into page
const div = document.querySelector(".course-content");

const button = document.createElement("button");
button.textContent = "Download Calendar";
button.addEventListener("click", () => {
    scrapeAndDownload();
});

div.appendChild(button);
