[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

# Skills City Portal Calendar Scraper

I wrote this because I was tired of spending like 20 minutes manually inputting calendar events into outlook.

[![wakatime](https://wakatime.com/badge/user/11612492-942b-4434-89a1-5e31d943fa36/project/6128f755-2ddd-4ef4-b1ce-188971ead674.svg?style=for-the-badge)](https://wakatime.com/badge/user/11612492-942b-4434-89a1-5e31d943fa36/project/6128f755-2ddd-4ef4-b1ce-188971ead674.svg)

# Usage

## Option 1: Automatic

I run a server that auto-updates the calendar on the hour. Use this link: (see discord or ask me: _n#1111)

If you're using outlook:
 - Log into outlook web
 - Go to the calendars page (top left, below mail icon)
 - "Add Calendar" (middle left, below small month calendar)
 - "Subscribe from web"
 - Paste the link, give it a name, and click "Import"

If you're using gmail:
 - Log into calendar.google.com
 - Click the "+" next to "Other Calendars" (middle left, below "My Calendars")
 - From the dropdown, select "From URL"
 - Paste the link, and click "Add Calendar"

Typically, calendars are synced every few hours. From some basic investigation, there does not seem to be a way to manually force the calendar to sync.

If you know how, feel free to let me know.

## Option 2: Manual

### Browser

Get the Tampermonkey extension for your browser.

Download the userscript from this [gist](https://gist.github.com/underscoren/a1e4d0a4807224a840219b6d1cd2e74b) (Click the "Raw" button) (This is how you update it as well) or manually create your own userscript from the repo's `dist/bundle.min.js`.

Once on the Games development course page, scroll down and click the "Download Calendar" button. It will rapidly open all the week tabs to force the content to load, then it will download `calendar.ics`. 

Open the file with the Windows 10 Calendar app (or Outlook, Gmail, Thunderbird, whatever you use that supports ICS) and import the calendar.

### Server

Download nodejs / npm

Clone the git repo and install the package globally

```bash
git clone https://github.com/underscoren/calendarscrape.git
cd calendarscrape
npm install
npm install --global .
```

Create a file `src/secrets.json` containing your skills-city portal username and password like so:
```json
{
    "username": "your username",
    "password": "your password"
}
```

Run `scrapecalendar` with an output file path generate the calendar file

```bash
scrapecalendar calendar.ics
```

(In case you're wondering, the webcal:// protocol is just a HTTP GET. You can simply serve the file statically to make your own "webcal server")

# Development

Clone the repo, then install using your favorite package manager (npm, yarn, etc)

e.g.
```bash
git clone https://github.com/underscoren/calendarscrape.git
cd calendarscrape
yarn
```

To make a build, simply run the "build" script

```bash
yarn run build
```

To run the scraper browser, optionally set the `DEBUG` environment variable, then
```bash
yarn run scrape
```