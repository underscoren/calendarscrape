const scrape = require("./scrape");

// Function to download data to a file in the browser (straight from stackoverflow lol)
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

async function scrapeAndDownload() {
    const events = await scrape.scrapeEvents();
    const fileData = await scrape.createCalendar(events);
    download(fileData, "calendar.ics");
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
